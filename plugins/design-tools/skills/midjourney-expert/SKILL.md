---
name: Midjourney Expert
description: Midjourney - AI image generation, prompting, styles, Discord workflow
allowed-tools: Read, Edit, Bash, WebFetch
model: sonnet
---

# Midjourney Expert

Create stunning images through Discord prompts.

## Pricing (2026)

- **Basic**: $10/mo - 200 images
- **Standard**: $30/mo - 15 hrs fast
- **Pro**: $60/mo - 30 hrs fast
- **Mega**: $120/mo - 60 hrs fast

## Getting Started

### Discord Setup
1. Join discord.gg/midjourney
2. Go to any #newbie channel
3. Type `/imagine prompt: your description`

### Basic Prompt
```
/imagine prompt: a cozy coffee shop interior with warm lighting and wooden furniture
```

## Prompt Structure

```
/imagine prompt: [subject] [style] [details] [parameters]
```

### Example
```
/imagine prompt: futuristic city skyline at sunset,
cyberpunk aesthetic, neon lights reflecting on wet streets,
cinematic composition, 8k, highly detailed --ar 16:9 --v 6
```

## Key Parameters

### Aspect Ratio
```
--ar 16:9    # Widescreen
--ar 1:1     # Square
--ar 9:16    # Portrait/mobile
--ar 3:2     # Photo standard
```

### Version
```
--v 6        # Latest version
--niji 6     # Anime style
```

### Quality/Speed
```
--q 0.5      # Draft (fast)
--q 1        # Standard
--q 2        # High quality (slow)
```

### Stylize
```
--s 0        # Less stylized, more literal
--s 100      # Default
--s 1000     # Very stylized
```

### Chaos
```
--c 0        # Consistent outputs
--c 100      # Wild variations
```

## Style Keywords

### Art Styles
```
watercolor, oil painting, digital art,
pencil sketch, vector illustration,
3D render, pixel art, isometric
```

### Photography
```
portrait photography, macro photography,
street photography, product photography,
studio lighting, natural lighting, golden hour
```

### Aesthetics
```
minimalist, maximalist, vintage, retro,
cyberpunk, solarpunk, cottagecore, dark academia
```

## App Development Use Cases

### App Icons
```
/imagine prompt: app icon for a podcast player,
minimalist design, purple gradient background,
white headphones symbol, iOS style --ar 1:1
```

### Marketing Images
```
/imagine prompt: person using smartphone app,
lifestyle photography, clean modern apartment,
natural lighting, Apple aesthetic --ar 16:9
```

### Feature Graphics
```
/imagine prompt: abstract sound waves visualization,
music streaming concept, dark background,
colorful frequency bars, modern tech aesthetic
```

### Onboarding Illustrations
```
/imagine prompt: friendly illustration of person
listening to podcast while walking dog,
flat design, pastel colors, vector style
```

## Advanced Techniques

### Image Prompts
```
/imagine prompt: [upload image] transform into watercolor style
```

### Blend
```
/blend [image1] [image2]
```

### Multi-Prompts
```
/imagine prompt: forest:: sunset:: fireflies:: --s 500
```

### Negative Prompts
```
/imagine prompt: beautiful landscape --no people, text, watermark
```

## Workflow Integration

### Glif for Automation
```python
# Use Glif to automate Midjourney via API wrapper
# See glif-expert skill
```

### Batch Generation
```
1. Generate variations with /imagine
2. Upscale best with U1-U4
3. Create variations with V1-V4
4. Download and organize
```

## Best Practices

1. **Be specific**: More detail = better results
2. **Reference artists**: "in the style of Studio Ghibli"
3. **Use lighting terms**: "rim lighting", "volumetric fog"
4. **Iterate**: Generate, vary, refine
5. **Save good prompts**: Build a prompt library

Use when: Marketing images, app icons, illustrations, concept art
