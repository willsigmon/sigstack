/**
 * AI-powered skill generator using Claude API
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { createHash, randomUUID } from 'crypto';
import matter from 'gray-matter';
import type {
  GenerateSkillRequest,
  GenerateSkillResult,
  Skill,
  SkillTemplate,
  ClaudeSkillFrontmatter,
} from '../types/skill.js';
import { validateGenerateRequest, validateSkillContent } from '../utils/validator.js';

export class SkillGenerator {
  private client: Anthropic;
  private model: string;

  constructor(apiKey?: string, model?: string) {
    this.client = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
    });
    this.model = model || 'claude-sonnet-4-5-20250929';
  }

  /**
   * Generate a skill from natural language prompt
   */
  async generateSkill(request: GenerateSkillRequest): Promise<GenerateSkillResult> {
    // Validate request
    const validation = validateGenerateRequest(request);
    if (!validation.success) {
      throw new Error(`Invalid request: ${validation.error.message}`);
    }

    const validatedRequest = validation.data;

    // Load template if specified
    const templateContent = validatedRequest.template
      ? this.loadTemplate(validatedRequest.template)
      : this.loadTemplate('base');

    // Generate skill content using Claude
    const skillContent = await this.generateWithClaude(
      validatedRequest.prompt,
      templateContent,
      validatedRequest.format || 'claude'
    );

    // Parse frontmatter and content
    const { data: frontmatter, content } = matter(skillContent);

    // Validate generated content
    const contentValidation = validateSkillContent(content);
    if (!contentValidation.valid) {
      throw new Error(`Generated skill failed validation: ${contentValidation.errors.join(', ')}`);
    }

    // Extract name from frontmatter or request
    const skillName = frontmatter.name || validatedRequest.name || this.extractNameFromPrompt(validatedRequest.prompt);

    // Create skill object
    const skill: Skill = {
      id: randomUUID(),
      name: skillName,
      description: frontmatter.description || validatedRequest.prompt.substring(0, 150),
      content: skillContent,
      source: {
        type: 'generated',
      },
      format: validatedRequest.format || 'claude',
      metadata: {
        author: frontmatter.author || validatedRequest.metadata?.author,
        version: frontmatter.version || validatedRequest.metadata?.version || '1.0.0',
        tags: frontmatter.tags || validatedRequest.metadata?.tags || [],
        category: frontmatter.category || validatedRequest.metadata?.category,
        allowed_tools: frontmatter['allowed-tools']
          ? frontmatter['allowed-tools'].split(',').map((t: string) => t.trim())
          : validatedRequest.metadata?.allowed_tools,
        created_at: new Date(),
        updated_at: new Date(),
      },
      checksum: this.calculateChecksum(skillContent),
    };

    // Save if requested
    let savedPath: string | undefined;
    if (validatedRequest.save) {
      savedPath = this.saveSkill(skill, validatedRequest.savePath);
    }

    return {
      skill,
      saved_path: savedPath,
      template_used: validatedRequest.template || 'base',
    };
  }

  /**
   * Generate skill content using Claude API
   */
  private async generateWithClaude(
    prompt: string,
    templateContent: string,
    format: 'claude' | 'codex' | 'universal'
  ): Promise<string> {
    const systemPrompt = this.buildSystemPrompt(format, templateContent);

    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Expected text response from Claude');
    }

    return content.text;
  }

  /**
   * Build system prompt for skill generation
   */
  private buildSystemPrompt(format: 'claude' | 'codex' | 'universal', templateContent: string): string {
    const formatInstructions = {
      claude: `
You are generating a Claude Code skill file. Follow this format:

1. **Frontmatter**: YAML frontmatter with these fields:
   - name: Skill name (required)
   - description: Brief description (required)
   - allowed-tools: Comma-separated list (optional): Read, Write, Edit, Bash, Grep, Glob, etc.
   - author: Author name (optional)
   - version: Version string (optional)
   - category: Category (optional)

2. **Content**: Markdown content with:
   - Clear headings and structure
   - Actionable instructions
   - Code examples where applicable
   - Best practices
   - When to use the skill
   - Common pitfalls to avoid

Example structure:
\`\`\`markdown
---
name: Example Skill
description: This skill does something useful
allowed-tools: Read, Edit, Bash
---

# Example Skill

Description of what this skill does and when to use it.

## Your Job

What the AI should do when this skill is invoked.

## Guidelines

1. Step-by-step instructions
2. Best practices
3. Things to avoid

## Examples

Concrete examples of usage.
\`\`\`
`,
      codex: `
You are generating a Codex CLI skill. This should be a JSON file with:
- name: Skill name
- description: Brief description
- prompt: The full skill instructions in plain text
`,
      universal: `
You are generating a universal skill that works in both Claude Code and Codex CLI.
Use Claude Code format (markdown with frontmatter) as it's more flexible.
`,
    };

    return `You are an expert at creating AI coding assistant skills. Your job is to generate high-quality, actionable skills based on user prompts.

${formatInstructions[format]}

Here's a template to reference (adapt as needed, don't just copy):

${templateContent}

**Key Principles:**
1. Be specific and actionable
2. Include concrete examples
3. Focus on the "how" and "why"
4. Anticipate edge cases
5. Make it reusable and modular
6. Keep it concise but comprehensive
7. Use clear markdown formatting
8. Include relevant code snippets

**Quality Checklist:**
- [ ] Clear, descriptive name
- [ ] Concise description
- [ ] Well-structured content with headings
- [ ] Actionable instructions
- [ ] Code examples (if applicable)
- [ ] Best practices section
- [ ] "When to use" guidance
- [ ] Proper markdown formatting

Generate a complete, production-ready skill based on the user's request.`;
  }

  /**
   * Load skill template from file
   */
  private loadTemplate(template: SkillTemplate): string {
    const templatePath = join(__dirname, 'templates', `${template}.md`);
    try {
      return readFileSync(templatePath, 'utf-8');
    } catch (error) {
      // Fallback to base template if specific template not found
      if (template !== 'base') {
        return this.loadTemplate('base');
      }
      throw new Error(`Template not found: ${template}`);
    }
  }

  /**
   * Extract skill name from prompt
   */
  private extractNameFromPrompt(prompt: string): string {
    // Try to extract a reasonable name from the first sentence
    const firstSentence = prompt.split(/[.!?]/)[0];
    const words = firstSentence
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !['create', 'build', 'make', 'generate', 'skill', 'that', 'will', 'should', 'help'].includes(w));

    return words.slice(0, 3).join('-') || 'custom-skill';
  }

  /**
   * Calculate checksum for skill content
   */
  private calculateChecksum(content: string): string {
    return createHash('sha256').update(content).digest('hex');
  }

  /**
   * Save skill to file
   */
  private saveSkill(skill: Skill, customPath?: string): string {
    const defaultPath = join(process.env.HOME || '~', '.claude', 'skills');
    const savePath = customPath || defaultPath;
    const filename = `${skill.name.toLowerCase().replace(/\s+/g, '-')}.md`;
    const fullPath = join(savePath, filename);

    writeFileSync(fullPath, skill.content, 'utf-8');

    return fullPath;
  }

  /**
   * Apply template with variable substitution
   */
  applyTemplate(template: SkillTemplate, data: Record<string, any>): string {
    const templateContent = this.loadTemplate(template);

    // Simple handlebars-style variable substitution
    let result = templateContent;

    // Replace {{variable}} with data values
    result = result.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? String(data[key]) : match;
    });

    // Handle {{#if condition}}...{{/if}}
    result = result.replace(/\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, key, content) => {
      return data[key] ? content : '';
    });

    // Handle {{#each array}}...{{/each}}
    result = result.replace(/\{\{#each (\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, key, content) => {
      const array = data[key];
      if (!Array.isArray(array)) return '';

      return array
        .map((item, index) => {
          let itemContent = content;
          // Replace {{this}} with item value
          itemContent = itemContent.replace(/\{\{this\}\}/g, String(item));
          // Replace {{@index}} with index
          itemContent = itemContent.replace(/\{\{@index\}\}/g, String(index + 1));
          return itemContent;
        })
        .join('\n');
    });

    return result;
  }

  /**
   * Batch generate multiple skills
   */
  async generateBatch(requests: GenerateSkillRequest[]): Promise<GenerateSkillResult[]> {
    const results: GenerateSkillResult[] = [];

    for (const request of requests) {
      try {
        const result = await this.generateSkill(request);
        results.push(result);
      } catch (error) {
        console.error(`Failed to generate skill for prompt: ${request.prompt}`, error);
        // Continue with other requests
      }
    }

    return results;
  }

  /**
   * Refine existing skill with AI suggestions
   */
  async refineSkill(skillContent: string, improvements: string): Promise<string> {
    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      temperature: 0.5,
      system: `You are an expert at refining AI coding assistant skills.
Your job is to improve the given skill based on specific feedback while maintaining its core purpose and structure.
Return the complete, improved skill content.`,
      messages: [
        {
          role: 'user',
          content: `Here's a skill that needs improvement:

${skillContent}

Requested improvements:
${improvements}

Please refine this skill while:
1. Maintaining the frontmatter format
2. Keeping the core purpose
3. Improving clarity and actionability
4. Adding missing elements if needed
5. Fixing any issues`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Expected text response from Claude');
    }

    return content.text;
  }
}

/**
 * Create a skill generator instance
 */
export function createSkillGenerator(apiKey?: string, model?: string): SkillGenerator {
  return new SkillGenerator(apiKey, model);
}
