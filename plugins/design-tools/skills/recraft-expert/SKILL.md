# Recraft Expert

Expert in using Recraft for design system components and structured visual assets.

## What is Recraft?

Recraft is an AI design tool that excels at creating design system components—consistent icon sets, controlled color palettes, and brand-aligned visuals. Unlike diffusion-based tools, it prioritizes precision and scalability.

## Capabilities

### Icon Generation
- Consistent icon sets with uniform style
- Multiple weights and sizes
- SVG output for scalability
- Brand-aligned visual language

### Design System Assets
- Component illustrations
- Pattern libraries
- Branded graphics
- UI element variations

### Precision Control
- Exact color specification
- Consistent stroke weights
- Pixel-perfect alignment
- Style locking across sets

## API Access

### Endpoint
```
POST https://api.recraft.ai/v1/generate
```

### Basic Request
```bash
curl -X POST https://api.recraft.ai/v1/generate \
  -H "Authorization: Bearer $RECRAFT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "minimal line icon of a shopping cart",
    "style": "icon",
    "colors": ["#000000"],
    "size": "64x64"
  }'
```

### Style Options
- `icon` - Clean, scalable icons
- `illustration` - Detailed illustrations
- `logo` - Brand marks
- `pattern` - Repeating patterns

## Icon Set Generation

### Consistent Set Prompt
```
Generate a set of 12 icons for an e-commerce app:
- cart, heart, user, search, home, orders
- menu, settings, notifications, filter, share, close

Style: 2px stroke, rounded caps, 24x24 grid
Color: single color (#1a1a1a)
Ensure visual consistency across all icons
```

### Exporting
- SVG for web/scalability
- PNG for specific sizes
- PDF for design tools

## Design System Integration

### Color Palette Control
```json
{
  "primary": "#0066FF",
  "secondary": "#00CC88",
  "neutral": "#1a1a1a",
  "background": "#ffffff"
}
```

### Typography Pairing
Recraft can generate assets that complement specific typefaces.

## Best Practices

### 1. Define Style Guide First
Before generating, establish:
- Stroke weights
- Corner radius
- Color palette
- Grid system

### 2. Generate in Batches
Create related icons together for consistency.

### 3. Use Style Locking
Lock style parameters across generations.

### 4. Export Multiple Formats
SVG primary, PNG for fallbacks.

## When to Use

- Building icon libraries
- Creating design system assets
- Generating brand-consistent graphics
- UI component illustrations
- Pattern and texture creation
