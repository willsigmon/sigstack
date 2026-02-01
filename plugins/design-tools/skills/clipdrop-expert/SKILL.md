# Clipdrop API Expert

Expert in using Clipdrop (Stability AI) for image editing and manipulation.

## What is Clipdrop?

Clipdrop is a suite of AI-powered image editing tools from Stability AI. Available as web app and API for developers.

**Website**: https://clipdrop.co

## API Capabilities

### Core Tools
- **Remove Background**: Instant bg removal
- **Cleanup**: Remove objects/defects
- **Relight**: Change image lighting
- **Upscale**: Increase resolution
- **Uncrop**: Extend image canvas
- **Replace Background**: New AI backgrounds
- **Text-to-Image**: Stable Diffusion access

## API Setup

### Get API Key
1. Go to https://clipdrop.co/apis
2. Sign up / Login
3. Generate API key

### Pricing
- 100 free credits for development
- Pay-as-you-go: ~$0.01-0.05 per operation
- Volume discounts available

## API Examples

### Remove Background
```bash
curl -X POST https://clipdrop-api.co/remove-background/v1 \
  -H "x-api-key: $CLIPDROP_API_KEY" \
  -F "image_file=@photo.jpg" \
  --output result.png
```

```python
import requests

response = requests.post(
    'https://clipdrop-api.co/remove-background/v1',
    files={'image_file': open('photo.jpg', 'rb')},
    headers={'x-api-key': CLIPDROP_API_KEY}
)

with open('result.png', 'wb') as f:
    f.write(response.content)
```

### Cleanup (Remove Objects)
```bash
curl -X POST https://clipdrop-api.co/cleanup/v1 \
  -H "x-api-key: $CLIPDROP_API_KEY" \
  -F "image_file=@photo.jpg" \
  -F "mask_file=@mask.png" \
  --output cleaned.jpg
```

### Relight
```bash
curl -X POST https://clipdrop-api.co/relight/v1 \
  -H "x-api-key: $CLIPDROP_API_KEY" \
  -F "image_file=@photo.jpg" \
  -F "mode=product" \
  --output relit.jpg
```

### Upscale
```bash
curl -X POST https://clipdrop-api.co/image-upscaling/v1/upscale \
  -H "x-api-key: $CLIPDROP_API_KEY" \
  -F "image_file=@photo.jpg" \
  -F "target_width=2048" \
  --output upscaled.jpg
```

### Uncrop (Extend Canvas)
```bash
curl -X POST https://clipdrop-api.co/uncrop/v1 \
  -H "x-api-key: $CLIPDROP_API_KEY" \
  -F "image_file=@photo.jpg" \
  -F "extend_left=200" \
  -F "extend_right=200" \
  --output extended.jpg
```

### Replace Background
```bash
curl -X POST https://clipdrop-api.co/replace-background/v1 \
  -H "x-api-key: $CLIPDROP_API_KEY" \
  -F "image_file=@photo.jpg" \
  -F "prompt=modern office interior" \
  --output new_bg.jpg
```

## Common Workflows

### Product Photo Pipeline
```python
# 1. Remove background
no_bg = remove_background(product_image)

# 2. Relight for consistency
relit = relight(no_bg, mode="product")

# 3. Add new background
final = replace_background(relit, "clean white studio")

# 4. Upscale for quality
hd = upscale(final, target_width=2048)
```

### Social Media Adaptation
```python
# Extend image for different aspect ratios
square = uncrop(image, extend_all=100)  # 1:1
story = uncrop(image, extend_top=400, extend_bottom=400)  # 9:16
```

## Best Practices

1. **Image Quality**: Higher input = better output
2. **Mask Precision**: For cleanup, precise masks matter
3. **Batch Processing**: Use async for multiple images
4. **Cache Results**: Don't re-process unchanged images
5. **Format Choice**: PNG for transparency, JPEG for photos

## Use Cases

- E-commerce product photos
- Social media content adaptation
- App screenshot enhancement
- Marketing asset creation
- User-uploaded image processing

## When to Use

- Automating image editing workflows
- Building apps that process user images
- E-commerce photo enhancement
- Content creation pipelines
