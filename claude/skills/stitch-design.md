# stitch-design

Use Google Stitch for AI-powered UI design generation. Invoke when user wants to create mockups, explore design directions, or generate UI components before coding.

## Workflow

1. **User describes** the screen/feature in natural language
2. **Stitch generates** 3 design directions
3. **User picks** the winner (or remixes elements)
4. **Export** to Figma or screenshot
5. **Claude implements** in SwiftUI/code

## MCP Tools Available

Once Stitch MCP loads, these tools become available:
- `generate_design` - Create UI from text description
- `create_variants` - Generate alternative versions
- `extract_design_context` - Scan existing UI for "Design DNA" (colors, typography, structure)
- `export_design` - Export to various formats

## Current Features

### Design Generation
- Text-to-UI for mobile (App) and web interfaces
- Uses Gemini 3.0 Flash for fast iteration
- Supports design system tokens (colors, fonts, spacing)

### Design Systems
- Define and manage design tokens
- Switch between different systems
- Ensures consistency across generated UIs

### Authentication
- **API Key** (simple): Generate in Stitch Settings → connect tools instantly
- **ADC** (current setup): Uses Google Cloud credentials, project-based

## Upcoming Features (In Development)

### Deep Design Mode
- Leverages additional compute or external information sources
- More comprehensive, detailed design outputs
- Likely slower but higher fidelity

### Figma Export (Highly Anticipated)
- Direct export to Figma files
- Addresses major adoption barrier for professional designers
- Enables integration with existing design workflows

### Agent Manager
- Coordinate multiple design agents on complex tasks
- Parallel problem-solving for specialized workflows
- Think: one agent for layout, one for colors, one for typography

### Voice Dictation
- New bottom panel supports voice input
- Describe designs verbally

## Best Practices

### For Leavn iOS Development
1. **Start in Stitch** before writing SwiftUI
2. **Specify constraints**: "iPhone 15 Pro, safe areas, bottom tab bar"
3. **Reference existing screens**: "Match the style of the reading plan view"
4. **Include states**: "Show loading, empty, and populated states"

### Prompting Tips
- Be specific about platform (iOS, Android, Web)
- Mention existing design system or brand colors
- Describe user flow, not just static screens
- Ask for multiple states (loading, error, success, empty)

## Project Config

```
Project: gen-lang-client-0815365308 (Leavn)
Auth: Application Default Credentials
MCP: @_davideast/stitch-mcp proxy
```

## Troubleshooting

Run health check:
```bash
export CLOUDSDK_PYTHON=/opt/homebrew/bin/python3.13
npx @_davideast/stitch-mcp doctor
```

Common issues:
- **403 error**: Re-run `gcloud auth application-default login`
- **MCP not loading**: Restart Claude Code after config changes
- **Slow generation**: Deep Design mode uses more compute

## References

- [Stitch Web App](https://stitch.withgoogle.com)
- [Stitch MCP GitHub](https://github.com/davideast/stitch-mcp)
- [Testing Catalog - Deep Design Article](https://www.testingcatalog.com/google-tests-deep-design-for-stitch-figma-export-and-more/)
