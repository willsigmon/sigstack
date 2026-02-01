---
name: Upscale Expert
description: AI upscaling - image enhancement, resolution increase, photo restoration
allowed-tools: Read, Edit, Bash, WebFetch
model: sonnet
---

# Upscale Expert

Enhance image resolution and quality with AI.

## Tools Comparison

| Tool | Best For | Free Tier | Pricing |
|------|----------|-----------|---------|
| Topaz Gigapixel | Photos | Trial | $99 one-time |
| Real-ESRGAN | Open source | Unlimited | Free |
| Magnific AI | Creative upscale | 10 images | $39/mo |
| Let's Enhance | Easy web tool | 10 images | $12/mo |
| Upscayl | Local, free | Unlimited | Free |

## Upscayl (Free, Local)

Best free option for developers.

### Install
```bash
# macOS
brew install --cask upscayl

# Or download from upscayl.org
```

### CLI Usage
```bash
upscayl-cli -i input.png -o output.png -s 4 -m realesrgan-x4plus
```

### Models
- `realesrgan-x4plus`: General purpose
- `realesrgan-x4plus-anime`: Anime/illustrations
- `ultramix_balanced`: Balanced quality
- `ultrasharp`: Maximum sharpness

## Real-ESRGAN (Python)

### Install
```bash
pip install realesrgan
```

### Usage
```python
from realesrgan import RealESRGAN
from PIL import Image

model = RealESRGAN('cuda')  # or 'cpu'
model.load_weights('weights/RealESRGAN_x4plus.pth')

image = Image.open('input.png')
upscaled = model.predict(image)
upscaled.save('output.png')
```

### CLI
```bash
realesrgan-ncnn-vulkan -i input.png -o output.png -s 4
```

## Magnific AI (Creative)

Best for creative enhancement, not just upscaling.

### Features
- Resolution increase up to 16x
- Creative hallucination (adds detail)
- Style control
- Face enhancement

### API
```python
import requests

response = requests.post(
    "https://api.magnific.ai/v1/upscale",
    headers={"Authorization": f"Bearer {API_KEY}"},
    json={
        "image_url": "https://example.com/image.jpg",
        "scale": 4,
        "creativity": 0.5,  # 0-1, higher = more AI enhancement
        "style": "photo"    # photo, art, anime
    }
)
```

## Use Cases for App Development

### App Store Screenshots
```bash
# Upscale 1x to 3x for retina displays
upscayl-cli -i screenshot.png -o screenshot@3x.png -s 3
```

### Icon Generation
```bash
# From 256px to 1024px for App Store
upscayl-cli -i icon_256.png -o icon_1024.png -s 4
```

### Marketing Assets
```bash
# Upscale for print/billboard
upscayl-cli -i hero.png -o hero_print.png -s 8
```

## Batch Processing

### Script
```bash
#!/bin/bash
for file in input/*.png; do
    filename=$(basename "$file")
    upscayl-cli -i "$file" -o "output/${filename%.png}_4x.png" -s 4
done
```

### Python
```python
from pathlib import Path
from realesrgan import RealESRGAN
from PIL import Image

model = RealESRGAN('cuda')
model.load_weights('weights/RealESRGAN_x4plus.pth')

for path in Path('input').glob('*.png'):
    image = Image.open(path)
    upscaled = model.predict(image)
    upscaled.save(f'output/{path.stem}_4x.png')
```

## Quality Tips

### Best Results
1. Start with highest quality source
2. Remove compression artifacts first
3. Use appropriate model for content type
4. Don't upscale more than 4x per pass

### Multiple Passes
```bash
# For extreme upscaling, do 2 passes
upscayl-cli -i input.png -o temp.png -s 4
upscayl-cli -i temp.png -o output.png -s 4
# Total: 16x upscale
```

### Face Enhancement
```bash
# Use GFPGAN for face restoration
pip install gfpgan
gfpgan -i face.png -o restored.png --upscale 4
```

## Comparison by Content

| Content | Recommended Tool |
|---------|------------------|
| Photos | Topaz or Real-ESRGAN |
| Anime/Art | Waifu2x or Real-ESRGAN-anime |
| Faces | GFPGAN |
| Text/UI | Lanczos (no AI) |
| Creative | Magnific |

Use when: App Store assets, marketing images, icon generation, photo restoration
