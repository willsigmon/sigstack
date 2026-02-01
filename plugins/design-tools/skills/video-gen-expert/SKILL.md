---
name: Video Gen Expert
description: AI video generation - text to video, image animation, video editing
allowed-tools: Read, Edit, Bash, WebFetch
model: sonnet
---

# Video Gen Expert

Generate and edit videos with AI.

## Platform Comparison (2026)

| Platform | Quality | Speed | Free | Pricing |
|----------|---------|-------|------|---------|
| Runway Gen-3 | Excellent | Medium | Limited | $15/mo |
| Pika | Good | Fast | Limited | $10/mo |
| Kling | Excellent | Medium | Some | $10/mo |
| Sora | Best | Slow | Limited | ChatGPT Plus |
| Stable Video | Good | Fast | Open | Free/API |

## Runway Gen-3 Alpha

Current leader in quality and control.

### Text to Video
```
Prompt: A golden retriever running through a field of sunflowers,
slow motion, cinematic lighting, 4K
```

### Image to Video
1. Upload starting frame
2. Describe motion
3. Generate 4-10 second clip

### Motion Brush
Paint motion onto specific areas of image.

### API Access
```python
import requests

response = requests.post(
    "https://api.runwayml.com/v1/generations",
    headers={"Authorization": f"Bearer {API_KEY}"},
    json={
        "prompt": "A coffee cup steaming on a wooden table",
        "duration": 5,
        "resolution": "1080p"
    }
)
```

## Pika Labs

Fast, stylized results.

### Discord Commands
```
/create A samurai warrior walking through cherry blossoms
/animate [upload image] make the leaves fall gently
```

### API
```python
# Pika 1.5 API
response = requests.post(
    "https://api.pika.art/v1/generate",
    headers={"Authorization": f"Bearer {API_KEY}"},
    json={
        "prompt": "Astronaut floating in space",
        "style": "cinematic",
        "motion": "slow_pan"
    }
)
```

## Stable Video Diffusion

Open source, self-hostable.

### ComfyUI Setup
```bash
# Install SVD nodes in ComfyUI
cd ComfyUI/custom_nodes
git clone https://github.com/Stability-AI/stable-video-diffusion
```

### Python
```python
from diffusers import StableVideoDiffusionPipeline
import torch

pipe = StableVideoDiffusionPipeline.from_pretrained(
    "stabilityai/stable-video-diffusion-img2vid-xt",
    torch_dtype=torch.float16
)
pipe.to("cuda")

image = load_image("input.png")
frames = pipe(image, num_frames=25).frames[0]
export_to_video(frames, "output.mp4")
```

## Use Cases for Apps

### App Store Preview Videos
```
Requirements:
- 15-30 seconds
- 1080p or 4K
- Show app in action
- Music/voiceover

Workflow:
1. Screen record app
2. Use Runway for transitions
3. Add music with CapCut
```

### Marketing Videos
```
1. Generate hero animation with Runway
2. Overlay app UI mockups
3. Add text and CTA
4. Export for social platforms
```

### Product Demos
```
1. Capture screen recordings
2. Use Pika to animate static mockups
3. Combine with voiceover
4. Professional result in hours
```

## Video Editing Stack

### CapCut (Free)
- Mobile/desktop
- Templates
- Auto captions

### DaVinci Resolve (Free)
- Professional editing
- Color grading
- AI features

### FFmpeg (CLI)
```bash
# Combine clips
ffmpeg -f concat -safe 0 -i files.txt -c copy output.mp4

# Add audio
ffmpeg -i video.mp4 -i audio.mp3 -c:v copy -c:a aac output.mp4

# Resize for social
ffmpeg -i input.mp4 -vf "scale=1080:1920" vertical.mp4
```

## Prompt Tips

### Good Video Prompts
```
✅ "A cat slowly turns its head, curious expression, studio lighting"
✅ "Camera slowly pushes in on a steaming cup of coffee"
✅ "Timelapse of city traffic at night, light trails"
```

### Avoid
```
❌ Complex multi-character interactions
❌ Precise text or logos
❌ Very specific actions
❌ Long sequences (break into clips)
```

## Platform-Specific Sizes

```
YouTube: 1920x1080 (16:9)
TikTok/Reels: 1080x1920 (9:16)
Twitter/X: 1280x720 (16:9)
App Store: 1920x1080 or 886x1920
```

Use when: Marketing videos, app previews, social content, animated mockups
