# Kling AI Video Expert

Expert in AI video generation using Kling for photorealistic video content.

## What is Kling?

Kling AI (by ByteDance) is a leading text-to-video and image-to-video model, known for realistic human faces and movements. Kling 2.0 supports up to 120-second videos.

## Capabilities

### Generation Modes
- Text-to-video
- Image-to-video (animate still images)
- Video-to-video (style transfer)
- Motion transfer

### Strengths
- Best-in-class human faces and movements
- Long video generation (up to 120s)
- High motion consistency
- Photorealistic output

## Pricing

| Plan | Price | Features |
|------|-------|----------|
| Standard | $6.99/mo | Basic access |
| Pro | $29.99/mo | Priority, longer videos |
| Enterprise | Custom | API access |

## API Access

### Via WaveSpeedAI
```bash
curl -X POST https://api.wavespeed.ai/v1/video/generate \
  -H "Authorization: Bearer $WAVESPEED_KEY" \
  -d '{
    "model": "kling-2.0",
    "prompt": "A woman walking through autumn leaves in Central Park",
    "duration": 5,
    "aspect_ratio": "16:9"
  }'
```

### Via FAL.ai
```python
import fal_client

result = fal_client.submit(
    "fal-ai/kling-video",
    arguments={
        "prompt": "Cinematic shot of waves crashing",
        "duration": "5s"
    }
)
```

## Effective Prompts

### Character-Focused
```
A young woman with brown hair smiles and turns to face the camera,
natural sunlight, shallow depth of field, cinematic, 4K quality
```

### Action Sequences
```
Man running through rain-soaked city streets at night,
neon reflections, dynamic camera following, slow motion moments
```

### Product Shots
```
Sleek smartphone rotating on minimalist white surface,
studio lighting, product photography style, smooth 360 rotation
```

### Nature/Landscape
```
Drone shot ascending over misty mountain forest at sunrise,
golden light rays through trees, cinematic color grading
```

## Image-to-Video

### Best Practices
1. Use high-quality source images
2. Describe the motion you want
3. Keep motion reasonable for the image
4. Specify camera movement separately

### Example
```
Source: [Upload portrait photo]
Prompt: Subtle smile forming, gentle head tilt,
hair moving slightly in breeze, maintain photorealistic quality
```

## Parameters

- **Duration**: 5s, 10s, up to 120s
- **Aspect Ratio**: 16:9, 9:16, 1:1, 4:3
- **Quality**: Standard, High
- **Motion Intensity**: Low, Medium, High

## Best Practices

1. **Human Content**: Kling excels at realistic people
2. **Describe Motion**: Be specific about movement
3. **Camera Direction**: Specify pans, tilts, tracking
4. **Lighting**: Mention lighting conditions
5. **Style Reference**: "cinematic", "documentary", etc.

## When to Use

- Realistic human video content
- Product demonstrations
- Social media video ads
- App preview videos
- Animated portraits
