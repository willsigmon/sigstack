/**
 * Configuration management for SigSkills
 * Loads config from ~/.sigskills/config.json and environment variables
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { z } from 'zod';
import { logger } from './utils/logger.js';

const SourceConfigSchema = z.object({
  type: z.enum(['local', 'github', 'codex', 'custom']),
  path: z.string().optional(),
  repo: z.string().optional(),
  branch: z.string().optional().default('main'),
  url: z.string().optional(),
  enabled: z.boolean().default(true),
  watch: z.boolean().default(false),
  sync_interval: z.string().optional(), // e.g., "1h", "30m"
});

export type SourceConfig = z.infer<typeof SourceConfigSchema>;

const EmbeddingsConfigSchema = z.object({
  provider: z.enum(['openai', 'local']).default('openai'),
  model: z.string().default('text-embedding-3-small'),
  batch_size: z.number().default(100),
});

const GeneratorConfigSchema = z.object({
  provider: z.enum(['anthropic']).default('anthropic'),
  model: z.string().default('claude-sonnet-4-5-20250929'),
  max_tokens: z.number().default(4000),
});

const SearchConfigSchema = z.object({
  default_limit: z.number().default(10),
  include_snippets: z.boolean().default(true),
  snippet_length: z.number().default(200),
  enable_semantic: z.boolean().default(true),
});

const SyncConfigSchema = z.object({
  cloud_enabled: z.boolean().default(false),
  cloud_api_url: z.string().optional(),
  cloud_api_key: z.string().optional(),
  conflict_strategy: z.enum(['overwrite', 'merge', 'skip']).default('merge'),
  auto_sync_interval: z.string().optional(),
});

const ConfigSchema = z.object({
  sources: z.array(SourceConfigSchema).default([]),
  embeddings: EmbeddingsConfigSchema.default({}),
  generator: GeneratorConfigSchema.default({}),
  search: SearchConfigSchema.default({}),
  sync: SyncConfigSchema.default({}),
  db_path: z.string().optional(),
});

export type Config = z.infer<typeof ConfigSchema>;

const DEFAULT_CONFIG: Config = {
  sources: [
    {
      type: 'local',
      path: '~/.claude/skills/',
      enabled: true,
      watch: true,
      branch: 'main',
    },
  ],
  embeddings: {
    provider: 'openai',
    model: 'text-embedding-3-small',
    batch_size: 100,
  },
  generator: {
    provider: 'anthropic',
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4000,
  },
  search: {
    default_limit: 10,
    include_snippets: true,
    snippet_length: 200,
    enable_semantic: true,
  },
  sync: {
    cloud_enabled: false,
    conflict_strategy: 'merge',
  },
};

export class ConfigManager {
  private static instance: ConfigManager;
  private config: Config;
  private configPath: string;
  private configDir: string;

  private constructor() {
    this.configDir = join(homedir(), '.sigskills');
    this.configPath = join(this.configDir, 'config.json');
    this.config = this.loadConfig();
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private loadConfig(): Config {
    // Ensure config directory exists
    if (!existsSync(this.configDir)) {
      mkdirSync(this.configDir, { recursive: true });
    }

    // Load config file or create default
    if (existsSync(this.configPath)) {
      try {
        const fileContent = readFileSync(this.configPath, 'utf-8');
        const parsed = JSON.parse(fileContent);
        const validated = ConfigSchema.parse(parsed);
        logger.info('Loaded config from', this.configPath);
        return validated;
      } catch (error) {
        logger.warn('Failed to parse config file, using defaults:', error);
        return DEFAULT_CONFIG;
      }
    } else {
      // Create default config
      this.saveConfig(DEFAULT_CONFIG);
      logger.info('Created default config at', this.configPath);
      return DEFAULT_CONFIG;
    }
  }

  private saveConfig(config: Config): void {
    try {
      writeFileSync(this.configPath, JSON.stringify(config, null, 2), 'utf-8');
      logger.info('Saved config to', this.configPath);
    } catch (error) {
      logger.error('Failed to save config:', error);
      throw error;
    }
  }

  getConfig(): Config {
    return this.config;
  }

  updateConfig(updates: Partial<Config>): void {
    this.config = ConfigSchema.parse({ ...this.config, ...updates });
    this.saveConfig(this.config);
  }

  addSource(source: SourceConfig): void {
    const validated = SourceConfigSchema.parse(source);
    this.config.sources.push(validated);
    this.saveConfig(this.config);
    logger.info('Added source:', validated);
  }

  removeSource(index: number): void {
    if (index >= 0 && index < this.config.sources.length) {
      const removed = this.config.sources.splice(index, 1);
      this.saveConfig(this.config);
      logger.info('Removed source:', removed[0]);
    } else {
      throw new Error(`Invalid source index: ${index}`);
    }
  }

  updateSource(index: number, updates: Partial<SourceConfig>): void {
    if (index >= 0 && index < this.config.sources.length) {
      this.config.sources[index] = SourceConfigSchema.parse({
        ...this.config.sources[index],
        ...updates,
      });
      this.saveConfig(this.config);
      logger.info('Updated source:', this.config.sources[index]);
    } else {
      throw new Error(`Invalid source index: ${index}`);
    }
  }

  getDbPath(): string {
    // Priority: config.db_path > env var > default
    return (
      this.config.db_path ||
      process.env.DB_PATH ||
      join(this.configDir, 'sigskills.db')
    ).replace('~', homedir());
  }

  getApiKeys(): {
    openai?: string;
    anthropic?: string;
    github?: string;
  } {
    return {
      openai: process.env.OPENAI_API_KEY,
      anthropic: process.env.ANTHROPIC_API_KEY,
      github: process.env.GITHUB_TOKEN,
    };
  }

  expandPath(path: string): string {
    return path.replace('~', homedir());
  }
}

// Export singleton instance
export const config = ConfigManager.getInstance();
