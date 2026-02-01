---
name: Pika Video Expert
description: Pika - fast AI video generation, image animation, Discord workflow
allowed-tools: Read, Edit, Bash, WebFetch
model: sonnet
---

# Pika Video Expert

Fast, stylized AI video generation.

## Pricing (2026)

- **Free**: 50 credits/day
- **Basic**: $10/mo - 700 credits
- **Pro**: $35/mo - 2000 credits
- **Unlimited**: $70/mo

## Getting Started

### Discord
1. Join pika.art Discord
2. Use any #create channel
3. `/create [prompt]` or `/animate [image]`

### Web App
1. Go to pika.art
2. Sign in with Discord
3. Create → Text to Video or Image to Video

## Commands

### Text to Video
```
/create a majestic eagle soaring through clouds at sunset
```

### Image to Video
```
/animate [upload image] the waves gently crash on the shore
```

### Extend Video
```
/extend [video] the camera continues panning right
```

## Advanced Parameters

### Motion Strength
```
/create dancing flames in a fireplace --motion 3
```
- 0: Subtle movement
- 3: Strong motion

### Guidance Scale
```
/create mountain landscape --guidance 12
```
- Higher = more prompt adherence
- Lower = more creative freedom

### Negative Prompt
```
/create peaceful forest scene --negative blurry, distorted, ugly
```

### Aspect Ratio
```
/create city skyline --ar 16:9
/create phone wallpaper --ar 9:16
```

### FPS
```
/create smooth water flow --fps 24
```

## Pika 1.5 Features

### Lip Sync
Animate faces to match audio.

```
/lipsync [image] [audio file]
```

### Sound Effects
AI-generated SFX based on video.

```
/sfx [video] add realistic sounds
```

### Modify Region
Paint to specify what moves.

### Extend
Continue video in any direction.

## Best Prompts

### Effective Patterns
```
"A [subject] [action], [style], [camera movement]"

"A white horse galloping through snow, slow motion, tracking shot"
"Coffee steam rising from cup, macro lens, warm lighting"
"Neon city street at night, rain reflections, dolly forward"
```

### Camera Movements
- `zoom in/out`
- `pan left/right`
- `dolly forward/back`
- `tracking shot`
- `slow motion`
- `timelapse`

### Styles
- `cinematic`
- `anime`
- `3D render`
- `watercolor`
- `noir`
- `documentary`

## Workflow for Apps

### Animated App Previews
```
1. Screenshot your app UI
2. /animate [screenshot] the user scrolls through the feed
3. Download and use in marketing
```

### Logo Animation
```
1. Upload static logo
2. /animate [logo] subtle glow and particles emerge
3. Add to splash screen or video intro
```

### Feature Demos
```
1. Create mockup image
2. /animate [mockup] user taps the button and menu appears
3. No screen recording needed
```

## API Access

```python
# Pika API (requires Pro subscription)
import requests

response = requests.post(
    "https://api.pika.art/v1/create",
    headers={"Authorization": f"Bearer {API_KEY}"},
    json={
        "prompt": "A butterfly landing on a flower",
        "motion": 2,
        "aspect_ratio": "16:9",
        "fps": 24
    }
)

video_url = response.json()["video_url"]
```

## Comparison

| Feature | Pika | Runway | Kling |
|---------|------|--------|-------|
| Speed | Fast | Medium | Medium |
| Quality | Good | Excellent | Excellent |
| Price | $10/mo | $15/mo | $10/mo |
| Best for | Quick clips | High quality | Longer clips |

## Tips

1. **Simple prompts work best**: One subject, one action
2. **Use reference images**: More consistent results
3. **Iterate fast**: Generate many, pick best
4. **Extend for length**: 3s clips → extend to 10s
5. **Combine clips**: Edit multiple generations together

Use when: Quick video generation, image animation, social content, app previews
