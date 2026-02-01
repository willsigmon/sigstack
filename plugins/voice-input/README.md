# Voice Input Plugin

**Speech-to-text and voice-to-code.** Whisper, Deepgram, AssemblyAI, Sled mobile voice.

## Skills

| Skill | Description | Pricing |
|-------|-------------|---------|
| `whisper-expert` | OpenAI Whisper transcription | $0.006/min or free local |
| `deepgram-expert` | Real-time, low-latency | $0.0043/min |
| `assemblyai-expert` | Cheapest, AI features | $0.0025/min |
| `speech-to-code-expert` | Voice-to-code workflows | - |
| `sled-expert` | Mobile voice control for Claude | ~/Developer/sled |

## Key Value

**For Vibe Coders:**
- Talk instead of type
- Control Claude from your phone (Sled)
- Transcribe meetings → context for Claude
- Hands-free coding workflows

## Price Comparison

| Service | Price/min | Real-time | Diarization |
|---------|-----------|-----------|-------------|
| Whisper | $0.006 | No | Extra |
| Deepgram | $0.0043 | Yes | Included |
| AssemblyAI | $0.0025 | Yes | +$0.02/hr |
| Local Whisper | Free | Depends | Extra |

## Quick Start

### Deepgram (Best Overall)
```python
from deepgram import DeepgramClient

dg = DeepgramClient(api_key="...")
response = dg.listen.rest.v1.transcribe_file(
    {"buffer": open("audio.mp3", "rb")},
    {"model": "nova-3", "diarize": True}
)
```

### Local Whisper (Free)
```bash
pip install faster-whisper

python -c "
from faster_whisper import WhisperModel
model = WhisperModel('large-v3')
segments, _ = model.transcribe('audio.mp3')
print([s.text for s in segments])
"
```

### Sled (Mobile Voice)
```bash
cd ~/Developer/sled
./start.sh
# Now talk to Claude from your phone
```

## Use Cases
- Voice memos → Claude context
- Meeting notes → project context
- Hands-free coding (Sled)
- Podcast transcription
- Accessibility
