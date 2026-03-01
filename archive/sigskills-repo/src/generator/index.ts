/**
 * Skill Generator Module
 * 
 * Exports skill generation, template management, and format conversion utilities
 */

export { SkillGenerator, createSkillGenerator } from './skill-generator.js';
export {
  claudeToCodex,
  codexToClaude,
  batchClaudeToCodex,
  batchCodexToClaude,
  skillToClaudeFormat,
  skillToCodexFormat,
  detectSkillFormat,
} from './converter.js';
export type { ConversionOptions } from './converter.js';
