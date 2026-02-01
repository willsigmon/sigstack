---
name: Deepgram Expert
description: Deepgram - real-time transcription, low latency, speaker diarization, enterprise-ready
allowed-tools: Read, Edit, Bash, WebFetch
model: sonnet
---

# Deepgram Expert

Enterprise-grade real-time speech-to-text.

## Pricing (2026)

- **$0.0043/minute** (pay-as-you-go)
- Volume tiers automatic (no contracts)
- Real-time and batch options
- Speaker diarization included

## Key Advantages
- **20 seconds** to transcribe 1 hour
- Low latency streaming (0.2-0.3x real-time)
- 5.8% WER on technical audio
- Speaker diarization built-in
- 30+ languages

## API Usage

### Batch Transcription
```python
from deepgram import DeepgramClient, PrerecordedOptions

deepgram = DeepgramClient(api_key="...")

options = PrerecordedOptions(
    model="nova-3",
    smart_format=True,
    diarize=True,
    punctuate=True
)

response = deepgram.listen.rest.v1.transcribe_file(
    {"buffer": open("audio.mp3", "rb")},
    options
)

print(response.results.channels[0].alternatives[0].transcript)
```

### Real-Time Streaming
```python
from deepgram import DeepgramClient, LiveOptions

deepgram = DeepgramClient(api_key="...")

options = LiveOptions(
    model="nova-3",
    language="en",
    smart_format=True,
    interim_results=True
)

connection = deepgram.listen.websocket.v1.start(options)

@connection.on("transcript_received")
def on_transcript(transcript):
    if transcript.is_final:
        print(transcript.channel.alternatives[0].transcript)

# Stream audio
connection.send(audio_chunk)
```

### Speaker Diarization
```python
options = PrerecordedOptions(
    model="nova-3",
    diarize=True
)

# Response includes speaker labels
for word in response.results.channels[0].alternatives[0].words:
    print(f"Speaker {word.speaker}: {word.word}")
```

## Model Options

| Model | Speed | Accuracy | Use Case |
|-------|-------|----------|----------|
| nova-3 | Fast | Best | General |
| whisper | Medium | Good | Accuracy focus |
| enhanced | Fast | Good | Low latency |

## Integration

### Node.js SDK
```typescript
import { createClient } from "@deepgram/sdk";

const deepgram = createClient(process.env.DEEPGRAM_KEY);

const { result } = await deepgram.listen.prerecorded.transcribeFile(
  fs.createReadStream("audio.mp3"),
  { model: "nova-3", smart_format: true }
);
```

## Best For
- Real-time applications
- Call center transcription
- Live captioning
- Voice analytics
- Technical/medical audio

Use when: Real-time transcription, low-latency requirements, speaker identification
