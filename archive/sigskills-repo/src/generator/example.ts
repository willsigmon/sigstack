/**
 * Example usage of the skill generator
 * 
 * Run with: tsx src/generator/example.ts
 */

import { createSkillGenerator } from './skill-generator.js';
import type { GenerateSkillRequest } from '../types/skill.js';

async function main() {
  // Create generator instance
  const generator = createSkillGenerator();

  // Example 1: Generate a simple skill
  console.log('Generating iOS SwiftUI debugging skill...\n');
  
  const request1: GenerateSkillRequest = {
    prompt: 'Create a skill that helps debug SwiftUI view lifecycle issues. Include common problems like views not updating, state not persisting, and environment object issues.',
    template: 'debug',
    format: 'claude',
    save: false, // Don't auto-save for this example
  };

  try {
    const result1 = await generator.generateSkill(request1);
    console.log('Generated skill:');
    console.log('Name:', result1.skill.name);
    console.log('Description:', result1.skill.description);
    console.log('Format:', result1.skill.format);
    console.log('Template used:', result1.template_used);
    console.log('\nContent preview:');
    console.log(result1.skill.content.substring(0, 500) + '...\n');
  } catch (error) {
    console.error('Error generating skill:', error);
  }

  // Example 2: Generate a git workflow skill
  console.log('\nGenerating git workflow skill...\n');

  const request2: GenerateSkillRequest = {
    prompt: 'Create a skill for reviewing pull requests in GitHub. Include checking code quality, testing, security, and documentation.',
    template: 'git',
    format: 'claude',
    name: 'pr-reviewer',
    metadata: {
      author: 'SigSkills Generator',
      version: '1.0.0',
      category: 'git',
      tags: ['git', 'code-review', 'pull-request'],
    },
  };

  try {
    const result2 = await generator.generateSkill(request2);
    console.log('Generated skill:');
    console.log('Name:', result2.skill.name);
    console.log('Description:', result2.skill.description);
    console.log('Metadata:', result2.skill.metadata);
    console.log('\nContent preview:');
    console.log(result2.skill.content.substring(0, 500) + '...\n');
  } catch (error) {
    console.error('Error generating skill:', error);
  }

  // Example 3: Refine an existing skill
  console.log('\nRefining an existing skill...\n');

  const existingSkill = `---
name: Test Helper
description: Helps write unit tests
---

# Test Helper

Write unit tests.
`;

  try {
    const refinedContent = await generator.refineSkill(
      existingSkill,
      'Add more details about TDD workflow, include examples for Swift Testing framework, and add a section on mocking and dependency injection.'
    );
    console.log('Refined skill preview:');
    console.log(refinedContent.substring(0, 500) + '...\n');
  } catch (error) {
    console.error('Error refining skill:', error);
  }

  console.log('Examples completed!');
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main };
