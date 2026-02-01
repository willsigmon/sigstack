# Superdesign MCP Expert

Expert in using Superdesign MCP for AI-powered design orchestration.

## What is Superdesign?

Superdesign is an open-source AI design agent that provides structured design specifications for your IDE's LLM to execute. It acts as a "design orchestrator" that bridges design intent with code implementation.

## Capabilities

### Design Specifications
- Structured UI component specs
- Layout and spacing guidelines
- Color and typography rules
- Interaction patterns

### Orchestration
- Multi-step design workflows
- Component hierarchy planning
- Design system alignment
- Consistency enforcement

## MCP Setup

```json
{
  "mcpServers": {
    "superdesign": {
      "command": "npx",
      "args": ["-y", "@jonthebeef/superdesign-mcp"]
    }
  }
}
```

## How It Works

### 1. Design Intent
You describe what you want to build:
```
Create a settings page with:
- Profile section with avatar
- Notification preferences
- Theme toggle
- Account management
```

### 2. Structured Specs
Superdesign generates detailed specifications:
```json
{
  "component": "SettingsPage",
  "layout": "stack",
  "sections": [
    {
      "name": "ProfileSection",
      "components": ["Avatar", "NameField", "EmailField"],
      "spacing": "lg"
    }
  ]
}
```

### 3. Code Generation
Claude uses these specs to generate consistent code.

## Best Practices

### Be Descriptive
```
Instead of: "settings page"
Say: "iOS-style settings page with grouped sections,
     disclosure indicators, and system-standard spacing"
```

### Reference Patterns
```
"Like Apple's Settings app" or
"Following Material Design 3 patterns"
```

### Specify Interactions
```
"Toggle should animate, disclosure rows
 should push to detail views"
```

## Integration with Other Tools

### With Figma MCP
1. Extract design from Figma
2. Use Superdesign to structure specs
3. Generate code with enhanced consistency

### With Stitch
1. Generate UI in Stitch
2. Use Superdesign for implementation specs
3. Build with structured approach

## When to Use

- Planning complex UI implementations
- Ensuring design consistency
- Structuring component hierarchies
- Bridging design and development
