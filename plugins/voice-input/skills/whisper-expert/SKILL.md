---
name: Whisper Expert
description: OpenAI Whisper - speech-to-text, transcription, local and API options
allowed-tools: Read, Edit, Bash, WebFetch
model: sonnet
---

# OpenAI Whisper Expert

High-accuracy speech-to-text transcription.

## Pricing (2026)

### API
- **$0.006/minute** flat rate
- No volume discounts
- 1-2 min minimum billing
- No speaker diarization included

### Self-Hosted
- **Free** (local processing)
- Requires GPU for speed
- Full control over data

## API Usage

```python
from openai import OpenAI

client = OpenAI()

# Transcribe audio
with open("audio.mp3", "rb") as file:
    transcript = client.audio.transcriptions.create(
        model="whisper-1",
        file=file,
        response_format="text"  # or "json", "srt", "vtt"
    )

print(transcript)
```

### With Timestamps
```python
transcript = client.audio.transcriptions.create(
    model="whisper-1",
    file=audio_file,
    response_format="verbose_json",
    timestamp_granularities=["word", "segment"]
)

for segment in transcript.segments:
    print(f"[{segment['start']:.2f}s] {segment['text']}")
```

## Local Installation

### faster-whisper (Recommended)
```bash
pip install faster-whisper

# Usage
from faster_whisper import WhisperModel

model = WhisperModel("large-v3", device="cuda")
segments, info = model.transcribe("audio.mp3")

for segment in segments:
    print(f"[{segment.start:.2f}s] {segment.text}")
```

### whisper.cpp (C++ speed)
```bash
# Clone and build
git clone https://github.com/ggerganov/whisper.cpp
cd whisper.cpp && make

# Download model
./models/download-ggml-model.sh large-v3

# Transcribe
./main -m models/ggml-large-v3.bin -f audio.wav
```

## Model Sizes

| Model | VRAM | Speed | Accuracy |
|-------|------|-------|----------|
| tiny | 1GB | 32x | Basic |
| base | 1GB | 16x | Good |
| small | 2GB | 6x | Better |
| medium | 5GB | 2x | Great |
| large-v3 | 10GB | 1x | Best |

## Use Cases
- Podcast transcription
- Meeting notes
- Voice commands
- Accessibility
- Content indexing

## Limitations
- No real-time streaming (API)
- No speaker diarization (need separate service)
- No HIPAA BAA available

Use when: Transcription, voice-to-text, podcast processing, accessibility
