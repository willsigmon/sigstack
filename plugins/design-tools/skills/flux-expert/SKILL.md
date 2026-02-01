# Flux Image Generation Expert

Expert in using Flux models for fast, high-quality image generation.

## What is Flux?

Flux is a family of image generation models known for speed and quality. Developed by Black Forest Labs, Flux models excel at generating detailed images quickly.

## Model Variants

### Flux.1 Pro
- Highest quality output
- Best for final production images
- Slower but more detailed

### Flux.1 Dev
- Good balance of speed/quality
- Suitable for most use cases
- Open weights available

### Flux.1 Schnell
- Fastest generation
- Great for rapid iteration
- Lower detail but instant results

## API Access

### Replicate
```bash
curl -X POST https://api.replicate.com/v1/predictions \
  -H "Authorization: Token $REPLICATE_API_TOKEN" \
  -d '{
    "version": "flux-1.1-pro",
    "input": {
      "prompt": "your prompt here",
      "aspect_ratio": "16:9"
    }
  }'
```

### FAL.ai
```bash
curl -X POST https://fal.run/fal-ai/flux/dev \
  -H "Authorization: Key $FAL_KEY" \
  -d '{
    "prompt": "your prompt here",
    "image_size": "landscape_16_9"
  }'
```

## Effective Prompts

### Portrait
```
Professional headshot photo of [subject],
soft studio lighting, neutral background,
sharp focus, high resolution, photorealistic
```

### Product Shot
```
[Product] on white background,
professional product photography,
soft shadows, studio lighting,
high detail, commercial quality
```

### Concept Art
```
[Scene description], concept art style,
dramatic lighting, cinematic composition,
highly detailed, 8k resolution
```

## Aspect Ratios

- `1:1` - Square (social media)
- `16:9` - Landscape (hero images)
- `9:16` - Portrait (stories)
- `4:3` - Standard (photos)
- `21:9` - Ultra-wide (banners)

## Generation Parameters

### Guidance Scale
- Low (1-5): More creative, less prompt-following
- Medium (5-10): Balanced
- High (10-15): Strict prompt adherence

### Steps
- Schnell: 1-4 steps
- Dev: 20-30 steps
- Pro: 25-50 steps

## Best Practices

### 1. Start with Schnell
Iterate quickly, then use Pro for finals.

### 2. Be Descriptive
More detail = better results.

### 3. Use Negative Prompts
Exclude unwanted elements explicitly.

### 4. Seed Control
Save seeds for reproducible results.

## When to Use

- Rapid image prototyping
- Hero images and backgrounds
- Concept visualization
- Product mockups
- Marketing visuals
