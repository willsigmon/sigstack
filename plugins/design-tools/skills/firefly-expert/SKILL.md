# Adobe Firefly Expert

Expert in using Adobe Firefly for commercially-safe creative asset generation.

## What is Firefly?

Adobe Firefly is Adobe's generative AI tool focused on visual creativity. It generates images, vectors, icons, and design elements that are **commercially safe** for production use.

## Capabilities

### Image Generation
- Text-to-image with style controls
- Image expansion (generative fill)
- Background generation/removal
- Style transfer and matching

### Vector Graphics
- SVG icon generation
- Scalable illustrations
- Pattern creation
- Logo concepts

### Design Assets
- Mood boards
- Color palette extraction
- Texture generation
- 3D text effects

## API Access

### Adobe Creative Cloud API
```bash
curl -X POST https://firefly.adobe.io/v1/generate \
  -H "Authorization: Bearer $ADOBE_TOKEN" \
  -H "x-api-key: $ADOBE_CLIENT_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "minimalist app icon with gradient",
    "size": "1024x1024",
    "style": "digital_art"
  }'
```

### Available Endpoints
- `/v1/generate` - Text to image
- `/v1/expand` - Generative fill
- `/v1/similar` - Style-matched variations
- `/v1/edit` - Image modifications

## Style Presets

### Artistic Styles
- `photo` - Photorealistic
- `digital_art` - Clean digital
- `watercolor` - Painted look
- `3d_render` - 3D rendered

### Mood Controls
- Lighting: dramatic, soft, studio
- Color: vibrant, muted, monochrome
- Composition: centered, rule-of-thirds

## Commercial Safety

### Why It Matters
Firefly is trained on Adobe Stock, openly licensed content, and public domain—making outputs safe for commercial use without copyright concerns.

### Content Credentials
Firefly outputs include Content Credentials (digital provenance) showing AI generation.

## Best Practices

### 1. Use Reference Images
Upload style references for consistent output.

### 2. Iterate with Seeds
Save seeds for variations of good outputs.

### 3. Combine with Photoshop
Use Firefly features directly in Photoshop for editing.

### 4. Export Appropriate Formats
- PNG for web images
- SVG for scalable graphics
- PSD for further editing

## Integration Workflows

### Marketing Assets
```
1. Generate hero image with Firefly
2. Expand canvas for different aspect ratios
3. Create variations for A/B testing
4. Export in multiple sizes
```

### App Assets
```
1. Generate icon concepts
2. Create app store screenshots backgrounds
3. Generate onboarding illustrations
4. Produce promotional graphics
```

## When to Use

- Generating production-safe images
- Creating marketing and promotional assets
- Building visual libraries
- Icon and illustration concepts
- Background and texture generation
