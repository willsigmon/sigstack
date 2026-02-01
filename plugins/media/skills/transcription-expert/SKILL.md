---
name: Transcription Expert
description: Audio/video transcription - Whisper, Deepgram, AssemblyAI comparison and usage
allowed-tools: Read, Edit, Bash, WebFetch
model: sonnet
---

# Transcription Expert

Choose the right transcription service for your use case.

## Pricing Comparison (2026)

| Service | Price/min | Speed | Diarization | Real-time |
|---------|-----------|-------|-------------|-----------|
| Whisper API | $0.006 | Slow | No (+extra) | No |
| Deepgram | $0.0043 | 20s/hr | Yes | Yes |
| AssemblyAI | $0.0025 | Fast | +$0.02/hr | Yes |

## When to Use Each

### Whisper
- One-time batch processing
- Self-hosting option (free)
- Privacy-sensitive (local)
- Best: Podcasts, offline processing

### Deepgram
- Real-time applications
- Live captioning
- Speaker identification built-in
- Best: Meetings, call centers, voice apps

### AssemblyAI
- Cheapest per-minute
- AI features (sentiment, topics)
- PII redaction
- Best: Content analysis, compliance

## Quick Implementations

### Whisper (OpenAI)
```python
from openai import OpenAI
client = OpenAI()

with open("audio.mp3", "rb") as f:
    transcript = client.audio.transcriptions.create(
        model="whisper-1", file=f
    )
print(transcript.text)
```

### Deepgram
```python
from deepgram import DeepgramClient, PrerecordedOptions

dg = DeepgramClient(api_key="...")
options = PrerecordedOptions(model="nova-3", diarize=True)

response = dg.listen.rest.v1.transcribe_file(
    {"buffer": open("audio.mp3", "rb")}, options
)
```

### AssemblyAI
```python
import assemblyai as aai

aai.settings.api_key = "..."
transcriber = aai.Transcriber()

transcript = transcriber.transcribe("audio.mp3")
print(transcript.text)
```

## Speaker Diarization

### Deepgram (Built-in)
```python
options = PrerecordedOptions(diarize=True)
# Response includes speaker labels automatically
```

### AssemblyAI
```python
config = aai.TranscriptionConfig(speaker_labels=True)
# +$0.02/hr additional
```

### Whisper (Requires Extra)
```python
# Need separate diarization service like pyannote
from pyannote.audio import Pipeline
pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization")
```

## Batch Processing
```python
import asyncio

async def transcribe_batch(files):
    tasks = [transcribe(f) for f in files]
    return await asyncio.gather(*tasks)
```

## Output Formats
- Plain text
- SRT/VTT subtitles
- JSON with timestamps
- Word-level timing

Use when: Podcast transcription, meeting notes, video subtitles, voice content indexing
