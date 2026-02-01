---
name: Audio Enhancement Expert
description: AI audio enhancement - Auphonic, Adobe Speech, noise removal, leveling, podcast polish
allowed-tools: Read, Edit, Bash, WebFetch
model: sonnet
---

# Audio Enhancement Expert

Polish podcast and voice audio with AI enhancement tools.

## Top Tools

### Auphonic (API Available)
- Loudness normalization (LUFS)
- Noise/hum reduction
- Leveling between speakers
- API + Zapier integration
- Pricing: 2 hours free/mo, then pay-per-use

### Adobe Speech Enhancer
- Free (1 hour/day limit)
- Web-based at podcast.adobe.com/enhance
- Premium: 4 hours, video support
- Great for quick cleanup

### Cleanvoice AI
- Removes filler words (um, uh)
- Background noise removal
- Mouth sounds/clicks removal
- Pricing: Pay-per-minute

### Dolby.io
- Enterprise audio APIs
- Real-time enhancement
- SDK integration
- Developer-focused

## Auphonic API

### Single Production
```bash
curl -X POST https://auphonic.com/api/simple/productions.json \
  -u "user:pass" \
  -F "input_file=@episode.mp3" \
  -F "output_basename=episode-enhanced" \
  -F "algorithms=loudness,leveler,denoise"
```

### Python SDK
```python
import auphonic

client = auphonic.Client(username="...", password="...")

production = client.create_production(
    input_file="episode.mp3",
    algorithms=["loudness", "leveler", "denoise", "filtering"],
    output_files=[{
        "format": "mp3",
        "bitrate": 128
    }]
)

production.start()
```

## Enhancement Pipeline

### Recommended Order
```
1. Noise reduction (remove constant noise)
2. De-reverb (reduce room echo)
3. Leveling (balance speakers)
4. Compression (even out volume)
5. Loudness normalization (hit target LUFS)
```

### Target Levels
- Podcasts: -16 LUFS (Spotify), -14 LUFS (Apple)
- Audiobooks: -18 to -20 LUFS
- Video: -24 LUFS (broadcast)

## Local Processing

### FFmpeg Noise Reduction
```bash
# Get noise profile
ffmpeg -i input.mp3 -af "silencedetect=n=-30dB:d=0.5" -f null -

# Apply noise reduction
ffmpeg -i input.mp3 \
  -af "highpass=f=80,lowpass=f=12000,afftdn=nf=-20" \
  output.mp3
```

### SoX Enhancement
```bash
# Normalize + noise reduce
sox input.mp3 output.mp3 \
  norm -1 \
  noisered noise.prof 0.21
```

## Batch Processing
```python
# Auphonic batch
for file in audio_files:
    production = client.create_production(
        input_file=file,
        algorithms=["loudness", "leveler"]
    )
    production.start()
```

Use when: Podcast polish, voice clarity, noise removal, loudness normalization
