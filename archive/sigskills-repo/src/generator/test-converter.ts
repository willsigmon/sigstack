/**
 * Test script for format converter
 *
 * Run with: tsx src/generator/test-converter.ts
 */

import * as path from 'path';
import * as os from 'os';
import {
  claudeToCodex,
  codexToClaude,
  detectSkillFormat,
  skillToClaudeFormat,
  skillToCodexFormat,
} from './converter.js';
import { codexToSkill, parseCodexSkill } from '../indexer/codex-indexer.js';

async function main() {
  console.log('=== Format Converter Test ===\n');

  // Test Codex to Claude conversion
  console.log('1. Testing Codex → Claude conversion...');
  const codexSkillPath = path.join(
    os.homedir(),
    '.codex/skills/homey-self-hosted/SKILL.md'
  );

  try {
    const format = await detectSkillFormat(codexSkillPath);
    console.log(`   Detected format: ${format}`);

    const claudeResult = await codexToClaude(codexSkillPath, {
      includeMetadata: true,
    });

    console.log(`   Output filename: ${claudeResult.filename}`);
    console.log(`   Content preview:\n`);
    console.log(
      claudeResult.content
        .split('\n')
        .slice(0, 20)
        .join('\n')
    );
    console.log('\n   ...\n');
  } catch (error) {
    console.error('   ERROR:', error);
  }

  // Test universal format conversion
  console.log('2. Testing universal Skill → formats...');
  try {
    const skillsDir = path.join(os.homedir(), '.codex/skills');
    const codexSkill = await parseCodexSkill(codexSkillPath, skillsDir);
    const universalSkill = codexToSkill(codexSkill);

    console.log(`   Universal skill: ${universalSkill.name}`);
    console.log(`   ID: ${universalSkill.id}`);
    console.log(`   Format: ${universalSkill.format}`);

    // Convert to Claude format
    const claudeContent = skillToClaudeFormat(universalSkill);
    console.log('\n   Claude format preview:');
    console.log(
      claudeContent
        .split('\n')
        .slice(0, 15)
        .join('\n')
    );

    console.log('\n   ...\n');

    // Convert to Codex format
    const codexContent = skillToCodexFormat(universalSkill);
    console.log('\n   Codex format preview:');
    console.log(
      codexContent
        .split('\n')
        .slice(0, 15)
        .join('\n')
    );

    console.log('\n   ...\n');
  } catch (error) {
    console.error('   ERROR:', error);
  }

  // Test format detection
  console.log('3. Testing format detection...');
  const testPaths = [
    codexSkillPath,
    path.join(os.homedir(), '.claude/skills/commit.md'), // Example
  ];

  for (const testPath of testPaths) {
    try {
      const format = await detectSkillFormat(testPath);
      console.log(`   ${path.basename(testPath)}: ${format}`);
    } catch (error) {
      console.log(`   ${path.basename(testPath)}: not found`);
    }
  }

  console.log('\n=== Test Complete ===');
}

main().catch(console.error);
