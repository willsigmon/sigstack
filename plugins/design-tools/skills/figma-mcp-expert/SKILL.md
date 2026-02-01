# Figma MCP Expert

Expert in using the Figma MCP server for design-to-code workflows.

## What is Figma MCP?

The Figma MCP server bridges Claude with Figma, enabling translation of design files into production-ready code directly from conversation.

## Capabilities

### Design Access
- Read Figma files and components
- Extract design tokens (colors, spacing, typography)
- Access component libraries
- Parse auto-layout structures

### Code Generation
- React/Next.js components
- SwiftUI views
- Tailwind CSS styling
- Design system extraction

## Setup

### MCP Configuration
```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "@anthropic/figma-mcp"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "your-figma-token"
      }
    }
  }
}
```

### Getting Figma Token
1. Go to Figma → Settings → Account
2. Scroll to "Personal access tokens"
3. Generate new token with read permissions

## MCP Tools

### get_file
Retrieve complete Figma file structure
```
Get Figma file: [file-key]
```

### get_file_nodes
Get specific nodes/frames from a file
```
Get nodes from file [file-key]: [node-ids]
```

### get_images
Export frames as images
```
Export frame [node-id] as PNG from [file-key]
```

### get_components
List all components in a file
```
List components in Figma file [file-key]
```

## Workflow Examples

### Design to React
```
1. Read the Figma file at [URL]
2. Extract the "Hero Section" frame
3. Generate a React component with Tailwind CSS
4. Include responsive breakpoints based on auto-layout
```

### Extract Design Tokens
```
From Figma file [URL]:
1. Extract all colors used
2. Extract typography styles
3. Extract spacing values
4. Generate a design tokens file
```

### Component Library
```
From Figma file [URL]:
1. List all components
2. For each button variant, generate React code
3. Match the exact styling and states
```

## Best Practices

### 1. Use Auto-Layout
Figma files with auto-layout translate better to flexbox/stack code.

### 2. Name Layers Well
Semantic layer names become component/variable names.

### 3. Use Components
Components in Figma become reusable code components.

### 4. Define Variants
Button variants → component props automatically.

### 5. Set Constraints
Constraints inform responsive behavior in code.

## Extracting from Figma URLs

Figma URLs contain the file key:
```
https://www.figma.com/file/ABC123xyz/Design-System
                           ^^^^^^^^^^^
                           This is the file key
```

Node IDs are in the URL after selecting a frame:
```
?node-id=1234:5678
```

## Design Token Extraction

### Colors
```
Extract color palette from Figma:
- Primary colors
- Semantic colors (success, error, warning)
- Neutral scale
Output as CSS variables and Tailwind config
```

### Typography
```
Extract typography scale:
- Font families
- Font sizes
- Line heights
- Font weights
Output as Tailwind typography config
```

## When to Use

- Implementing designs from Figma specs
- Extracting design systems
- Generating component code from designs
- Keeping code in sync with design changes
- Design token extraction
