/**
 * GitHub Repository Skill Indexer
 *
 * Crawls GitHub repositories to discover and index skills from various locations:
 * - /skills/ directory
 * - /commands/ directory
 * - Root level skill files
 *
 * Supports:
 * - Public and private repos (with GITHUB_TOKEN)
 * - Branch/tag/commit pinning
 * - Rate limiting handling
 * - Incremental sync with change detection
 */

import { Octokit } from '@octokit/rest';
import { createHash } from 'crypto';
import { Logger } from '../utils/logger.js';
import type { Skill, SkillSource } from '../mcp/types.js';

export interface GitHubRepoConfig {
  owner: string;
  repo: string;
  branch?: string;
  tag?: string;
  commit?: string;
  auth?: string; // GitHub token
  skillPaths?: string[]; // Custom paths to search (default: ['skills', 'commands', ''])
}

export interface GitHubSkillFile {
  path: string;
  content: string;
  sha: string;
  url: string;
  lastModified?: string;
}

export interface GitHubIndexResult {
  skills: Skill[];
  errors: Array<{ path: string; error: string }>;
  stats: {
    scanned: number;
    indexed: number;
    skipped: number;
    errors: number;
  };
}

export interface GitHubRepoMetadata {
  owner: string;
  repo: string;
  branch: string;
  lastCommit: string;
  lastCommitDate: string;
  url: string;
}

/**
 * GitHub skill repository indexer
 */
export class GitHubIndexer {
  private octokit: Octokit;
  private logger: Logger;
  private defaultBranch = 'main';

  // Common skill file patterns
  private static readonly SKILL_EXTENSIONS = ['.md', '.json', '.yaml', '.yml', '.txt'];
  private static readonly SKILL_DIRECTORIES = ['skills', 'commands'];
  private static readonly MAX_FILE_SIZE = 1024 * 1024; // 1MB max for skill files

  constructor(auth?: string, logger?: Logger) {
    this.octokit = new Octokit({
      auth,
      userAgent: 'sigskills-mcp-server',
      request: {
        timeout: 30000, // 30s timeout
      },
    });
    this.logger = logger || new Logger({ prefix: 'github-indexer' });
  }

  /**
   * Index skills from a GitHub repository
   */
  async indexRepository(config: GitHubRepoConfig): Promise<GitHubIndexResult> {
    this.logger.info(`Indexing repository: ${config.owner}/${config.repo}`);

    const result: GitHubIndexResult = {
      skills: [],
      errors: [],
      stats: {
        scanned: 0,
        indexed: 0,
        skipped: 0,
        errors: 0,
      },
    };

    try {
      // Get repository metadata
      const repoMeta = await this.getRepositoryMetadata(config);
      this.logger.debug('Repository metadata:', repoMeta);

      // Determine reference to use (commit > tag > branch)
      const ref = config.commit || config.tag || config.branch || repoMeta.branch;

      // Get skill directories to search
      const searchPaths = config.skillPaths || [
        ...GitHubIndexer.SKILL_DIRECTORIES,
        '', // Root directory
      ];

      // Scan each directory for skills
      for (const searchPath of searchPaths) {
        try {
          const files = await this.getSkillFilesFromPath(
            config.owner,
            config.repo,
            searchPath,
            ref
          );

          this.logger.debug(`Found ${files.length} potential skill files in ${searchPath || 'root'}`);
          result.stats.scanned += files.length;

          // Parse each file as a skill
          for (const file of files) {
            try {
              const skill = await this.parseSkillFile(file, config, repoMeta);
              if (skill) {
                result.skills.push(skill);
                result.stats.indexed++;
              } else {
                result.stats.skipped++;
              }
            } catch (error) {
              const errorMsg = error instanceof Error ? error.message : String(error);
              this.logger.warn(`Failed to parse skill file ${file.path}: ${errorMsg}`);
              result.errors.push({ path: file.path, error: errorMsg });
              result.stats.errors++;
            }
          }
        } catch (error) {
          if (this.isNotFoundError(error)) {
            this.logger.debug(`Path not found: ${searchPath}`);
          } else {
            const errorMsg = error instanceof Error ? error.message : String(error);
            this.logger.warn(`Failed to scan path ${searchPath}: ${errorMsg}`);
            result.errors.push({ path: searchPath, error: errorMsg });
            result.stats.errors++;
          }
        }
      }

      this.logger.info(
        `Indexing complete: ${result.stats.indexed} skills indexed, ${result.stats.skipped} skipped, ${result.stats.errors} errors`
      );
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      this.logger.error(`Repository indexing failed: ${errorMsg}`);
      throw new Error(`Failed to index repository ${config.owner}/${config.repo}: ${errorMsg}`);
    }

    return result;
  }

  /**
   * Get repository metadata (branch, latest commit, etc.)
   */
  async getRepositoryMetadata(config: GitHubRepoConfig): Promise<GitHubRepoMetadata> {
    try {
      // Get repository info
      const { data: repo } = await this.octokit.repos.get({
        owner: config.owner,
        repo: config.repo,
      });

      const branch = config.branch || repo.default_branch || this.defaultBranch;

      // Get latest commit on branch
      const { data: branchData } = await this.octokit.repos.getBranch({
        owner: config.owner,
        repo: config.repo,
        branch,
      });

      return {
        owner: config.owner,
        repo: config.repo,
        branch,
        lastCommit: branchData.commit.sha,
        lastCommitDate: branchData.commit.commit.committer?.date || new Date().toISOString(),
        url: repo.html_url,
      };
    } catch (error) {
      if (this.isRateLimitError(error)) {
        throw new Error('GitHub API rate limit exceeded. Please wait or provide a GitHub token.');
      }
      throw error;
    }
  }

  /**
   * Get all skill files from a specific path in the repository
   */
  private async getSkillFilesFromPath(
    owner: string,
    repo: string,
    path: string,
    ref: string
  ): Promise<GitHubSkillFile[]> {
    const skillFiles: GitHubSkillFile[] = [];

    try {
      const { data: contents } = await this.octokit.repos.getContent({
        owner,
        repo,
        path,
        ref,
      });

      // Handle both single file and directory responses
      const items = Array.isArray(contents) ? contents : [contents];

      for (const item of items) {
        // Skip non-files and directories (we'll handle recursion separately)
        if (item.type !== 'file') {
          continue;
        }

        // Check if file has a skill extension
        const hasSkillExtension = GitHubIndexer.SKILL_EXTENSIONS.some((ext) =>
          item.name.toLowerCase().endsWith(ext)
        );

        if (!hasSkillExtension) {
          continue;
        }

        // Check file size (skip files that are too large)
        if (item.size && item.size > GitHubIndexer.MAX_FILE_SIZE) {
          this.logger.warn(`Skipping large file: ${item.path} (${item.size} bytes)`);
          continue;
        }

        // Fetch file content
        try {
          const content = await this.getFileContent(owner, repo, item.path, ref);
          skillFiles.push({
            path: item.path,
            content,
            sha: item.sha,
            url: item.html_url || '',
          });
        } catch (error) {
          this.logger.warn(`Failed to fetch content for ${item.path}:`, error);
        }
      }
    } catch (error) {
      if (this.isRateLimitError(error)) {
        await this.handleRateLimit();
        // Retry once after rate limit wait
        return this.getSkillFilesFromPath(owner, repo, path, ref);
      }
      throw error;
    }

    return skillFiles;
  }

  /**
   * Get file content from GitHub
   */
  private async getFileContent(
    owner: string,
    repo: string,
    path: string,
    ref: string
  ): Promise<string> {
    try {
      const { data } = await this.octokit.repos.getContent({
        owner,
        repo,
        path,
        ref,
      });

      if (Array.isArray(data) || data.type !== 'file') {
        throw new Error('Expected file, got directory');
      }

      // Decode base64 content
      if (!data.content) {
        throw new Error('File has no content');
      }

      return Buffer.from(data.content, 'base64').toString('utf-8');
    } catch (error) {
      if (this.isRateLimitError(error)) {
        await this.handleRateLimit();
        return this.getFileContent(owner, repo, path, ref);
      }
      throw error;
    }
  }

  /**
   * Parse a skill file into a Skill object
   */
  private async parseSkillFile(
    file: GitHubSkillFile,
    config: GitHubRepoConfig,
    repoMeta: GitHubRepoMetadata
  ): Promise<Skill | null> {
    try {
      // Extract skill name from filename
      const fileName = file.path.split('/').pop() || 'unknown';
      const skillName = fileName.replace(/\.(md|json|ya?ml|txt)$/i, '');

      // Detect skill format from content
      const format = this.detectSkillFormat(file.content);

      // Extract description (first non-empty line or JSON description field)
      const description = this.extractDescription(file.content, format);

      // Calculate checksum for change detection
      const checksum = this.calculateChecksum(file.content);

      // Build source information
      const source: SkillSource = {
        type: 'github',
        repo: `${config.owner}/${config.repo}`,
        branch: repoMeta.branch,
        commit: repoMeta.lastCommit,
        path: file.path,
      };

      // Generate skill ID (hash of source info)
      const id = createHash('sha256')
        .update(`${source.repo}:${source.branch}:${file.path}`)
        .digest('hex')
        .substring(0, 16);

      // Build skill object
      const skill: Skill = {
        id,
        name: skillName,
        description,
        content: file.content,
        source,
        format,
        metadata: {
          author: config.owner,
          version: repoMeta.lastCommit.substring(0, 7),
          tags: this.extractTags(file.path),
          created_at: new Date(),
          updated_at: new Date(repoMeta.lastCommitDate),
        },
        checksum,
      };

      this.logger.debug(`Parsed skill: ${skillName} (${format})`);
      return skill;
    } catch (error) {
      this.logger.error(`Failed to parse skill file ${file.path}:`, error);
      return null;
    }
  }

  /**
   * Detect skill format from content
   */
  private detectSkillFormat(content: string): 'claude' | 'codex' | 'universal' {
    // Simple heuristics - can be improved
    if (content.includes('Claude') || content.includes('@claude')) {
      return 'claude';
    }
    if (content.includes('Codex') || content.includes('@codex')) {
      return 'codex';
    }
    return 'universal';
  }

  /**
   * Extract description from skill content
   */
  private extractDescription(content: string, format: string): string {
    // Try to parse as JSON first
    if (format === 'codex') {
      try {
        const json = JSON.parse(content);
        if (json.description) {
          return json.description;
        }
      } catch {
        // Not JSON, continue
      }
    }

    // For markdown, get first non-empty line (skip frontmatter)
    const lines = content.split('\n');
    let inFrontmatter = false;

    for (const line of lines) {
      const trimmed = line.trim();

      // Skip frontmatter
      if (trimmed === '---') {
        inFrontmatter = !inFrontmatter;
        continue;
      }
      if (inFrontmatter) {
        continue;
      }

      // Skip markdown headers
      if (trimmed.startsWith('#')) {
        continue;
      }

      // Return first non-empty line
      if (trimmed.length > 0) {
        return trimmed.substring(0, 200); // Limit description length
      }
    }

    return 'No description available';
  }

  /**
   * Extract tags from file path
   */
  private extractTags(path: string): string[] {
    const tags: string[] = [];
    const parts = path.split('/');

    // Add directory names as tags
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (part && !GitHubIndexer.SKILL_DIRECTORIES.includes(part)) {
        tags.push(part);
      }
    }

    return tags;
  }

  /**
   * Calculate checksum for change detection
   */
  private calculateChecksum(content: string): string {
    return createHash('sha256').update(content).digest('hex');
  }

  /**
   * Check if error is a rate limit error
   */
  private isRateLimitError(error: unknown): boolean {
    return (
      error instanceof Error &&
      ('status' in error && (error as any).status === 403) &&
      ('message' in error && error.message.includes('rate limit'))
    );
  }

  /**
   * Check if error is a 404 not found error
   */
  private isNotFoundError(error: unknown): boolean {
    return error instanceof Error && ('status' in error && (error as any).status === 404);
  }

  /**
   * Handle GitHub API rate limiting
   */
  private async handleRateLimit(): Promise<void> {
    try {
      const { data: rateLimit } = await this.octokit.rateLimit.get();
      const resetTime = new Date(rateLimit.rate.reset * 1000);
      const waitTime = resetTime.getTime() - Date.now();

      if (waitTime > 0) {
        this.logger.warn(
          `Rate limit exceeded. Waiting ${Math.ceil(waitTime / 1000)}s until ${resetTime.toISOString()}`
        );
        await this.sleep(waitTime);
      }
    } catch (error) {
      // If we can't get rate limit info, wait a default time
      this.logger.warn('Rate limit exceeded. Waiting 60s...');
      await this.sleep(60000);
    }
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Check for upstream changes in a repository
   * Returns true if repository has new commits since last sync
   */
  async hasUpstreamChanges(
    config: GitHubRepoConfig,
    lastKnownCommit: string
  ): Promise<boolean> {
    try {
      const repoMeta = await this.getRepositoryMetadata(config);
      return repoMeta.lastCommit !== lastKnownCommit;
    } catch (error) {
      this.logger.error('Failed to check upstream changes:', error);
      return false;
    }
  }

  /**
   * List all repositories for an authenticated user or organization
   */
  async listRepositories(owner?: string): Promise<Array<{ owner: string; repo: string; description: string }>> {
    try {
      const repos = owner
        ? await this.octokit.repos.listForUser({ username: owner, per_page: 100 })
        : await this.octokit.repos.listForAuthenticatedUser({ per_page: 100 });

      return repos.data.map((repo) => ({
        owner: repo.owner.login,
        repo: repo.name,
        description: repo.description || '',
      }));
    } catch (error) {
      this.logger.error('Failed to list repositories:', error);
      throw error;
    }
  }
}
