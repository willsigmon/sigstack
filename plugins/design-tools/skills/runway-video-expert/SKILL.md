# Runway Video Expert

Expert in using Runway for professional AI video generation and editing.

## What is Runway?

Runway is the professional's choice for AI video, offering Gen-4 with industry-leading quality and granular control. Used in Hollywood productions and by creative professionals.

**Website**: https://runwayml.com

## Capabilities

### Gen-4 Features
- Text-to-video generation
- Image-to-video animation
- Video-to-video style transfer
- Motion brush for guided movement
- Multi-motion control
- Up to 1080p at 30fps

### Editing Tools
- Inpainting (remove/replace objects)
- Green screen removal
- Frame interpolation
- Upscaling
- Audio generation

## Pricing

| Plan | Price | Features |
|------|-------|----------|
| Basic | $12/mo | 625 credits |
| Standard | $28/mo | 2250 credits |
| Pro | $76/mo | 6750 credits |
| Enterprise | Custom | Unlimited |

Cost: ~$0.05-0.12 per second of video

## API Access

### Via Runway API
```python
import runway

client = runway.Client(api_key="your_api_key")

# Generate video from text
task = client.video.create(
    prompt="A majestic eagle soaring over mountains at sunrise",
    duration=5,
    aspect_ratio="16:9"
)

# Poll for completion
while task.status != "completed":
    task = client.tasks.get(task.id)
    time.sleep(2)

video_url = task.output
```

### Via Replicate
```python
import replicate

output = replicate.run(
    "runway/gen-3-turbo",
    input={
        "prompt": "Cinematic shot of ocean waves",
        "aspect_ratio": "16:9"
    }
)
```

## Effective Prompts

### Cinematic Shots
```
Sweeping aerial shot over a neon-lit cyberpunk city at night,
rain falling, flying cars in the distance, Blade Runner aesthetic,
cinematic camera movement, 4K quality
```

### Product Videos
```
Luxury watch rotating slowly on black velvet surface,
dramatic studio lighting, reflections and highlights,
premium product photography style, smooth rotation
```

### Abstract/Artistic
```
Abstract fluid simulation, iridescent colors flowing
and mixing, organic movement, satisfying visual,
seamless loop potential, high contrast
```

### Character Motion
```
Person walking confidently down a city street,
camera tracking alongside, shallow depth of field,
golden hour lighting, cinematic color grading
```

## Advanced Features

### Motion Brush
Paint areas to define movement:
- Select regions that should move
- Define direction and intensity
- Keep other areas static

### Multi-Motion
Control multiple elements independently:
- Background motion
- Subject motion
- Camera motion

### Image-to-Video
```python
task = client.video.create(
    image="https://example.com/photo.jpg",
    prompt="Camera slowly zooms in, subtle hair movement",
    motion_strength=0.5
)
```

## Best Practices

1. **Be Cinematic**: Include camera, lighting, style
2. **Control Motion**: Use motion brush for precision
3. **Quality vs Speed**: Gen-4 Turbo is faster
4. **Iterate Quickly**: Generate variations
5. **Extend Clips**: Chain shorter clips for longer videos

## Use Cases

- Film and TV production
- Marketing videos
- Social media content
- App demo videos
- Music videos
- Concept visualization

## When to Use

- Need highest quality video output
- Professional/commercial projects
- Fine control over motion required
- Cinematic aesthetic needed
