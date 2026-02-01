# Background Removal Expert

Expert in AI-powered background removal for images.

## Top Tools

### 1. Remove.bg (Industry Standard)
- Most accurate for complex edges
- Hair and fur handling excellent
- API + web interface
- Trusted by e-commerce platforms

### 2. Photoroom
- Great for product photos
- Batch processing
- Templates and editing
- $0.02/image API

### 3. Clipdrop
- Part of Stability AI
- Good quality
- Additional editing tools
- 100 free API credits

### 4. withoutBG (Open Source)
- Self-hostable
- Apache 2.0 license
- No API calls needed
- Full privacy

## API Examples

### Remove.bg
```bash
curl -H "X-Api-Key: $REMOVE_BG_KEY" \
  -F "image_file=@photo.jpg" \
  -F "size=auto" \
  https://api.remove.bg/v1.0/removebg \
  -o result.png
```

```python
import requests

response = requests.post(
    'https://api.remove.bg/v1.0/removebg',
    files={'image_file': open('photo.jpg', 'rb')},
    data={'size': 'auto'},
    headers={'X-Api-Key': API_KEY},
)
with open('result.png', 'wb') as f:
    f.write(response.content)
```

### Photoroom
```bash
curl -X POST https://sdk.photoroom.com/v1/segment \
  -H "x-api-key: $PHOTOROOM_KEY" \
  -F "image_file=@photo.jpg" \
  -o result.png
```

### withoutBG (Self-hosted)
```python
from withoutbg import remove_background

# Local processing, no API
result = remove_background("photo.jpg")
result.save("result.png")
```

## Pricing Comparison

| Service | Free Tier | Paid |
|---------|-----------|------|
| Remove.bg | 1 free/mo (preview) | $1.99/10 images |
| Photoroom | 5/day | $6/mo (100 images) |
| Clipdrop | 100 API credits | Pay-as-you-go |
| withoutBG | Unlimited (self-host) | $0 |

## Quality Tips

### Best Results When:
- Subject is clearly defined
- Good contrast with background
- Adequate lighting
- High resolution input

### Challenging Cases:
- Wispy hair
- Transparent objects
- Similar colors to background
- Motion blur

### Post-Processing
```python
from PIL import Image

# Load result with transparency
img = Image.open('result.png')

# Add solid color background
background = Image.new('RGBA', img.size, (255, 255, 255, 255))
background.paste(img, mask=img.split()[3])
background.save('white_bg.png')

# Add gradient background
# ... gradient generation code
```

## Batch Processing

### Remove.bg Batch
```python
import os
import requests

images = ['photo1.jpg', 'photo2.jpg', 'photo3.jpg']

for img_path in images:
    response = requests.post(
        'https://api.remove.bg/v1.0/removebg',
        files={'image_file': open(img_path, 'rb')},
        headers={'X-Api-Key': API_KEY}
    )
    output_path = img_path.replace('.jpg', '_nobg.png')
    with open(output_path, 'wb') as f:
        f.write(response.content)
```

## iOS Integration

```swift
import UIKit

func removeBackground(image: UIImage) async throws -> UIImage {
    guard let imageData = image.jpegData(compressionQuality: 0.9) else {
        throw ImageError.invalidImage
    }

    var request = URLRequest(url: URL(string: "https://api.remove.bg/v1.0/removebg")!)
    request.httpMethod = "POST"
    request.setValue(apiKey, forHTTPHeaderField: "X-Api-Key")

    // ... multipart form data setup

    let (data, _) = try await URLSession.shared.data(for: request)
    return UIImage(data: data)!
}
```

## When to Use

- Product photography
- Profile pictures
- App user uploads
- E-commerce listings
- Social media content
- Design compositions
