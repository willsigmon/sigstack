/**
 * Generate Skill Tool Handler
 * Generates new skills using Claude API from natural language prompts
 */

import Anthropic from '@anthropic-ai/sdk';
import { randomUUID } from 'crypto';
import { createHash } from 'crypto';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { getDatabase } from '../../db/index.js';
import {
  GenerateSkillParams,
  GenerateSkillParamsSchema,
  GenerateSkillResult,
  GenerationError,
} from '../types.js';
import type { Skill, SkillMetadata } from '../../types.js';
import { logger } from '../../utils/logger.js';

const log = logger.child('generate-skill');

const SKILL_GENERATION_PROMPT = `You are a skill generation expert. Generate a high-quality skill based on the user's request.

A skill is a reusable prompt template that helps users accomplish specific tasks. Skills should be:
- Clear and actionable
- Well-structured with sections
- Include examples when helpful
- Handle edge cases
- Be self-contained

Output format: Return ONLY the skill content as markdown. Do not include meta-commentary.`;

const CLAUDE_TEMPLATE = `# {name}

## Purpose
{description}

## Instructions
{instructions}

## Examples
{examples}

## Notes
{notes}`;

const CODEX_TEMPLATE = `{
  "name": "{name}",
  "description": "{description}",
  "prompt": "{prompt}"
}`;

/**
 * Generate a skill from a natural language prompt
 */
export async function handleGenerateSkill(
  params: unknown
): Promise<GenerateSkillResult> {
  const validated = GenerateSkillParamsSchema.parse(params);
  const db = getDatabase();

  log.info(`Generating skill from prompt: "${validated.prompt.substring(0, 50)}..."`);

  // Check for API key
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new GenerationError(
      'ANTHROPIC_API_KEY environment variable not set. Cannot generate skills.'
    );
  }

  const anthropic = new Anthropic({ apiKey });

  try {
    // Generate skill content using Claude
    const skillContent = await generateSkillContent(
      anthropic,
      validated.prompt,
      validated.template,
      validated.format || 'claude'
    );

    // Extract name from content or use provided name
    const skillName = validated.name || extractSkillName(skillContent);

    // Build skill object
    const skill = buildSkillObject(
      skillName,
      validated.prompt,
      skillContent,
      validated.format || 'claude'
    );

    // Save to local skills if requested
    let savedPath: string | undefined;
    if (validated.save) {
      savedPath = await saveSkillLocally(skill);
      // Also save to database
      await saveSkillToDatabase(db, skill, savedPath);
      log.info(`Skill saved to: ${savedPath}`);
    }

    // Generate suggestions for improvement
    const suggestions = generateSuggestions(skill);

    return {
      skill,
      saved_path: savedPath,
      suggestions,
    };
  } catch (error) {
    log.error('Skill generation failed:', error);
    throw new GenerationError(
      `Skill generation failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Generate skill content using Claude API
 */
async function generateSkillContent(
  anthropic: Anthropic,
  prompt: string,
  template: string | undefined,
  format: 'claude' | 'codex'
): Promise<string> {
  const systemPrompt = SKILL_GENERATION_PROMPT;
  const userPrompt = template
    ? `Generate a skill based on this request: "${prompt}"\n\nUse this template structure:\n${template}`
    : `Generate a ${format} format skill based on this request: "${prompt}"`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new GenerationError('Unexpected response format from Claude API');
  }

  return content.text.trim();
}

/**
 * Extract skill name from generated content
 */
function extractSkillName(content: string): string {
  // Try to extract from markdown heading
  const headingMatch = content.match(/^#\s+(.+)$/m);
  if (headingMatch) {
    return headingMatch[1].trim();
  }

  // Try to extract from JSON
  try {
    const json = JSON.parse(content);
    if (json.name) {
      return json.name;
    }
  } catch {
    // Not JSON, continue
  }

  // Fallback to generic name with timestamp
  return `generated-skill-${Date.now()}`;
}

/**
 * Build skill object from generated content
 */
function buildSkillObject(
  name: string,
  description: string,
  content: string,
  format: 'claude' | 'codex'
): Skill {
  const id = randomUUID();
  const checksum = createHash('sha256').update(content).digest('hex');
  const now = new Date();

  const metadata: SkillMetadata = {
    author: 'sigskills-generator',
    version: '1.0.0',
    tags: ['generated'],
    category: 'custom',
    created_at: now,
    updated_at: now,
  };

  return {
    id,
    name,
    description: description.substring(0, 200), // Limit description length
    content,
    source: {
      type: 'generated',
    },
    format,
    metadata,
    checksum,
  };
}

/**
 * Save skill to local skills directory
 */
async function saveSkillLocally(skill: Skill): Promise<string> {
  const skillsDir = join(process.env.HOME || '~', '.claude', 'skills');
  const fileName = `${skill.name.toLowerCase().replace(/\s+/g, '-')}.md`;
  const filePath = join(skillsDir, fileName);

  // Format content with frontmatter
  const frontmatter = `---
id: ${skill.id}
name: ${skill.name}
description: ${skill.description}
format: ${skill.format}
author: ${skill.metadata.author || 'unknown'}
version: ${skill.metadata.version || '1.0.0'}
tags: ${JSON.stringify(skill.metadata.tags || [])}
category: ${skill.metadata.category || 'custom'}
---

`;

  const fullContent = frontmatter + skill.content;

  try {
    writeFileSync(filePath, fullContent, 'utf-8');
    return filePath;
  } catch (error) {
    log.error('Failed to save skill to file:', error);
    throw new GenerationError(
      `Failed to save skill: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Save skill to database
 */
async function saveSkillToDatabase(
  db: ReturnType<typeof getDatabase>,
  skill: Skill,
  filePath: string
): Promise<void> {
  const sql = `
    INSERT INTO skills (
      id, name, description, content, format,
      source_type, source_path,
      metadata, checksum,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, unixepoch(), unixepoch())
  `;

  try {
    db.execute(sql, [
      skill.id,
      skill.name,
      skill.description,
      skill.content,
      skill.format,
      'generated',
      filePath,
      JSON.stringify(skill.metadata),
      skill.checksum,
    ]);
  } catch (error) {
    log.error('Failed to save skill to database:', error);
    throw new GenerationError(
      `Failed to save skill to database: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Generate suggestions for skill improvement
 */
function generateSuggestions(skill: Skill): string[] {
  const suggestions: string[] = [];

  // Check for examples
  if (!skill.content.toLowerCase().includes('example')) {
    suggestions.push('Consider adding usage examples to the skill');
  }

  // Check for edge cases
  if (!skill.content.toLowerCase().includes('edge case') &&
      !skill.content.toLowerCase().includes('limitation')) {
    suggestions.push('Consider documenting edge cases or limitations');
  }

  // Check length
  if (skill.content.length < 200) {
    suggestions.push('Skill content seems short - consider adding more detail');
  }

  // Check for structure
  if (!skill.content.includes('#') && skill.format === 'claude') {
    suggestions.push('Consider adding markdown headings for better structure');
  }

  return suggestions;
}
