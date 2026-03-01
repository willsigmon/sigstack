---
name: {{name}}
description: {{description}}
{{#if allowed_tools}}allowed-tools: {{allowed_tools}}{{/if}}
{{#if author}}author: {{author}}{{/if}}
{{#if version}}version: {{version}}{{/if}}
{{#if category}}category: {{category}}{{/if}}
---

# {{name}}

{{description}}

## Your Job

{{job_description}}

## Key Responsibilities

{{#each responsibilities}}
- {{this}}
{{/each}}

## Guidelines

{{#each guidelines}}
{{this}}

{{/each}}

{{#if examples}}
## Examples

{{#each examples}}
### Example {{@index}}

{{this}}

{{/each}}
{{/if}}

{{#if custom_sections}}
{{#each custom_sections}}
## {{@key}}

{{this}}

{{/each}}
{{/if}}

## When to Use

{{when_to_use}}

{{#if related_skills}}
## Related Skills

{{#each related_skills}}
- {{this}}
{{/each}}
{{/if}}
