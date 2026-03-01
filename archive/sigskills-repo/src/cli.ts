#!/usr/bin/env node

/**
 * SigSkills CLI - Index skills from various sources
 */

import { LocalSkillIndexer } from './indexer/local-indexer.js';
import { getCodexPaths, indexCodexSkills } from './indexer/codex-indexer.js';
import { createDatabase } from './db/index.js';
import { logger } from './utils/logger.js';
import { homedir } from 'os';

const log = logger.child('cli');

async function indexLocal() {
  log.info('Indexing local skills from ~/.claude/skills/');

  await createDatabase();
  const skillsPath = process.env.CLAUDE_SKILLS_PATH || `${homedir()}/.claude/skills`;
  const indexer = new LocalSkillIndexer(skillsPath);

  const results = await indexer.indexAll();

  console.log('\n✅ Local Skills Indexed:');
  console.log(`  - Added: ${results.added}`);
  console.log(`  - Updated: ${results.updated}`);
  if (results.errors.length > 0) {
    console.log(`  - Errors: ${results.errors.length}`);
  }

  return { indexed: results.added + results.updated, errors: results.errors.length };
}

async function indexCodex() {
  log.info('Indexing Codex CLI skills from ~/.codex/skills/');

  const db = await createDatabase();

  const results = await indexCodexSkills(async (skill) => {
    await db.upsertSkill(skill as any); // Type mismatch - skill from codex has all required fields
  });

  console.log('\n✅ Codex Skills Indexed:');
  console.log(`  - Total: ${results.indexed}`);
  if (results.errors > 0) {
    console.log(`  - Errors: ${results.errors}`);
  }

  return results;
}

async function indexAll() {
  console.log('🔍 Indexing all skill sources...\n');

  const localResults = await indexLocal();
  const codexResults = await indexCodex();

  const total = {
    indexed: localResults.indexed + codexResults.indexed,
    errors: localResults.errors + codexResults.errors,
  };

  console.log('\n📊 Total Results:');
  console.log(`  - Total Skills: ${total.indexed}`);
  if (total.errors > 0) {
    console.log(`  - Errors: ${total.errors}`);
  }

  console.log('\n🎉 All skills indexed successfully!');
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const source = args.find(arg => arg.startsWith('--source='))?.split('=')[1] ||
                 (args.includes('--source') ? args[args.indexOf('--source') + 1] : 'all');

  try {
    if (command === 'index') {
      switch (source) {
        case 'local':
          await indexLocal();
          break;
        case 'codex':
          await indexCodex();
          break;
        case 'all':
          await indexAll();
          break;
        default:
          console.error(`Unknown source: ${source}`);
          console.log('Usage: sigskills index --source [local|codex|all]');
          process.exit(1);
      }
    } else {
      console.log('SigSkills CLI\n');
      console.log('Usage:');
      console.log('  sigskills index --source local    # Index ~/.claude/skills/');
      console.log('  sigskills index --source codex    # Index ~/.codex/skills/');
      console.log('  sigskills index --source all      # Index all sources');
    }
  } catch (error) {
    log.error('CLI error:', error);
    console.error('\n❌ Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
