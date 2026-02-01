# Google Stitch Expert

Expert in using Google Stitch for AI-powered UI design and code generation.

## What is Stitch?

Google Stitch is an AI-powered UI design tool from Google Labs that turns natural language prompts and image inputs into complex UI designs and frontend code. Built on Gemini 2.5 Pro.

**Free to use at**: https://stitch.withgoogle.com

## Capabilities

### Design Generation
- Text-to-UI: Describe interfaces in natural language
- Image-to-UI: Upload sketches/references for interpretation
- Style transfer: Apply design DNA from existing screens
- Multi-screen flows: Generate connected app experiences

### Code Export
- Clean HTML/CSS output
- Tailwind CSS support
- React component generation
- Figma-compatible exports

## MCP Integration

### Available MCP Servers

**stitch-mcp** (Recommended)
```json
{
  "mcpServers": {
    "stitch": {
      "command": "npx",
      "args": ["-y", "@anthropic/stitch-mcp"]
    }
  }
}
```

**@davideast/stitch-mcp** (Alternative with proxy mode)
```bash
npm install -g @_davideast/stitch-mcp
```

### MCP Tools Available

1. **create_project** - Initialize a new Stitch project
2. **generate_screen** - Generate UI from prompt
3. **extract_design_context** - Extract design DNA from existing screens
4. **export_code** - Export generated designs as code
5. **list_projects** - View existing projects

### extract_design_context Tool
Scans screens and extracts:
- Colors (Tailwind palette)
- Typography (fonts, weights)
- Structure (headers, navbars, buttons)

This "Design DNA" ensures generated screens maintain visual consistency.

## Effective Prompts

### Dashboard
```
Analytics dashboard for a SaaS app, teal and slate palette,
sidebar navigation, header with user avatar and notifications,
main area with 4 stat cards and 2 charts, clean modern style
```

### Mobile App
```
iOS fitness tracking app, dark mode,
bottom tab bar with 5 items,
home screen showing today's activity ring,
workout history list, minimal with accent colors
```

### Landing Page
```
Modern startup landing page, gradient hero section,
features grid with icons, testimonial carousel,
pricing table with 3 tiers, CTA buttons throughout
```

## Workflow

### 1. Generate Initial Design
```
Use Stitch to generate: [describe UI]
```

### 2. Extract Design DNA
```
Extract design context from: [reference screen/image]
Apply to new generations for consistency
```

### 3. Iterate
```
Refine: [specific changes]
Keep: [elements to preserve]
```

### 4. Export
- **To Figma**: Paste directly for further refinement
- **To Code**: Export HTML/CSS/React for development

## Best Practices

1. **Be Specific**: Include layout, colors, components
2. **Reference Styles**: "like Stripe" or "iOS native"
3. **Iterate**: Start broad, then refine details
4. **Extract DNA**: Use design context for consistency
5. **Combine with Code**: Let Claude implement the exports

## Setup Requirements

1. Google Cloud project with Stitch API enabled
2. Owner/Editor role on GCP project
3. Billing enabled
4. Stitch API enabled

## When to Use

- Rapidly prototyping UI concepts
- Generating design variations
- Creating consistent multi-screen flows
- Getting frontend code from ideas
- Design-to-development handoff
