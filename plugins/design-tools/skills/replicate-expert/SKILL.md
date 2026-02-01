# Replicate API Expert

Expert in using Replicate for accessing 600+ AI models via unified API.

## What is Replicate?

Replicate provides API access to hundreds of AI models for image, video, audio, and text generation. One API, many models, pay-per-use pricing.

**Website**: https://replicate.com

## Why Replicate?

- **Unified API**: Same interface for all models
- **No infrastructure**: Models run in the cloud
- **Pay-per-use**: Only pay for compute used
- **Model variety**: 600+ models available
- **Easy switching**: Try different models easily

## Quick Start

### Installation
```bash
pip install replicate
# or
npm install replicate
```

### Environment
```bash
export REPLICATE_API_TOKEN=r8_your_token_here
```

### Basic Usage (Python)
```python
import replicate

output = replicate.run(
    "stability-ai/sdxl:latest",
    input={"prompt": "An astronaut riding a horse"}
)
print(output)
```

### Basic Usage (JavaScript)
```javascript
import Replicate from "replicate";

const replicate = new Replicate();
const output = await replicate.run(
    "stability-ai/sdxl:latest",
    { input: { prompt: "An astronaut riding a horse" } }
);
```

## Top Models by Category

### Image Generation
| Model | Best For | Speed |
|-------|----------|-------|
| `flux-1.1-pro` | High quality | Medium |
| `flux-schnell` | Fast iteration | Fast |
| `sdxl` | Versatile | Medium |
| `ideogram` | Text in images | Medium |

### Video Generation
| Model | Best For |
|-------|----------|
| `kling-video` | Realistic humans |
| `runway-gen3` | Cinematic |
| `stable-video-diffusion` | Image animation |

### Audio
| Model | Best For |
|-------|----------|
| `musicgen` | Instrumental music |
| `bark` | Speech with emotion |
| `whisper` | Transcription |

### Image Editing
| Model | Best For |
|-------|----------|
| `remove-bg` | Background removal |
| `real-esrgan` | Upscaling |
| `instruct-pix2pix` | Image editing |

## Common Workflows

### Generate and Upscale
```python
# Generate image
image = replicate.run(
    "flux-schnell",
    input={"prompt": "beautiful landscape"}
)

# Upscale result
upscaled = replicate.run(
    "nightmareai/real-esrgan",
    input={"image": image[0], "scale": 4}
)
```

### Image to Video
```python
# Animate a still image
video = replicate.run(
    "stability-ai/stable-video-diffusion",
    input={
        "input_image": "https://example.com/image.png",
        "motion_bucket_id": 127
    }
)
```

### Background Removal
```python
result = replicate.run(
    "cjwbw/rembg",
    input={"image": "https://example.com/photo.jpg"}
)
```

## Async Operations

For long-running models:
```python
# Start prediction
prediction = replicate.predictions.create(
    model="kling-video",
    input={"prompt": "A cat playing piano"}
)

# Check status
prediction = replicate.predictions.get(prediction.id)
print(prediction.status)  # "processing" or "succeeded"

# Wait for completion
prediction.wait()
print(prediction.output)
```

## Webhooks

```python
prediction = replicate.predictions.create(
    model="flux-1.1-pro",
    input={"prompt": "sunset over ocean"},
    webhook="https://your-server.com/webhook",
    webhook_events_filter=["completed"]
)
```

## Pricing

- Pay per second of compute
- Prices vary by model
- Typically $0.001-0.01 per generation
- No monthly minimums

## Best Practices

1. **Use Webhooks**: For production, don't poll
2. **Cache Results**: Store outputs, don't regenerate
3. **Choose Right Model**: Fast for iteration, quality for final
4. **Handle Failures**: Models can fail, implement retries
5. **Monitor Usage**: Set up billing alerts

## When to Use

- Accessing multiple AI models from one API
- Rapid prototyping with different models
- Production apps needing reliable AI inference
- Avoiding infrastructure management
