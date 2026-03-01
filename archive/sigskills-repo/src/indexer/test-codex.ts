/**
 * Test script for Codex indexer
 *
 * Run with: tsx src/indexer/test-codex.ts
 */

import {
  getCodexPaths,
  isCodexInstalled,
  findCodexSkills,
  parseCodexSkill,
  analyzeSkillDirectory,
  codexToSkill,
  getCodexSkillStats,
  indexCodexSkills,
} from './codex-indexer.js';

async function main() {
  console.log('=== Codex Skills Indexer Test ===\n');

  // Check installation
  console.log('1. Checking Codex installation...');
  const installed = await isCodexInstalled();
  console.log(`   Codex installed: ${installed}\n`);

  if (!installed) {
    console.log('Codex not found. Exiting.');
    return;
  }

  // Get paths
  console.log('2. Codex paths:');
  const paths = getCodexPaths();
  console.log(`   Home: ${paths.home}`);
  console.log(`   Skills: ${paths.skills}`);
  console.log(`   Config: ${paths.config}\n`);

  // Find skills
  console.log('3. Finding SKILL.md files...');
  const skillPaths = await findCodexSkills(paths.skills);
  console.log(`   Found ${skillPaths.length} skills\n`);

  // Parse and analyze each skill
  console.log('4. Parsing skills:\n');
  for (const skillPath of skillPaths) {
    try {
      const skill = await parseCodexSkill(skillPath, paths.skills);
      const dirInfo = await analyzeSkillDirectory(skillPath);
      const universalSkill = codexToSkill(skill);

      console.log(`   ${skill.name}`);
      console.log(`   - Description: ${skill.description.slice(0, 80)}...`);
      console.log(`   - Path: ${skill.relativePath}`);
      console.log(`   - Body length: ${skill.body.length} chars`);
      console.log(`   - Has scripts: ${dirInfo.hasScripts}`);
      console.log(`   - Has references: ${dirInfo.hasReferences}`);
      console.log(`   - Universal ID: ${universalSkill.id}`);
      console.log(`   - Checksum: ${universalSkill.checksum.slice(0, 12)}...`);

      if (skill.metadata) {
        console.log(`   - Metadata:`, skill.metadata);
      }

      if (dirInfo.additionalFiles.length > 0) {
        console.log(`   - Additional files:`, dirInfo.additionalFiles);
      }

      console.log('');
    } catch (error) {
      console.error(`   ERROR parsing ${skillPath}:`, error);
      console.log('');
    }
  }

  // Get stats
  console.log('5. Skill statistics:');
  const stats = await getCodexSkillStats();
  console.log(`   Total skills: ${stats.total}`);
  console.log(`   With scripts: ${stats.withScripts}`);
  console.log(`   With references: ${stats.withReferences}`);
  console.log(`   By category:`, stats.byCategory);
  console.log('');

  // Test indexing (dry run)
  console.log('6. Test indexing (dry run):');
  const result = await indexCodexSkills(
    async (skill) => {
      // Mock database insert
      console.log(`   Would index: ${skill.name} (${skill.source.type})`);
    },
    (current, total, name) => {
      console.log(`   Progress: ${current}/${total} - ${name}`);
    }
  );

  console.log(`\n   Indexed: ${result.indexed}`);
  console.log(`   Errors: ${result.errors}`);

  console.log('\n=== Test Complete ===');
}

main().catch(console.error);
