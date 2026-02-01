---
name: AssemblyAI Expert
description: AssemblyAI - cheapest transcription, AI features, sentiment analysis, PII redaction
allowed-tools: Read, Edit, Bash, WebFetch
model: sonnet
---

# AssemblyAI Expert

The most affordable transcription API with AI superpowers.

## Pricing (2026)

- **$0.0025/minute** base rate (cheapest!)
- Speaker diarization: +$0.02/hr
- Sentiment analysis: +$0.02/hr
- PII redaction: +$0.02/hr
- Free credits for testing

## Key Advantages
- Cheapest per-minute rate
- AI features built-in (sentiment, topics, summaries)
- PII redaction for compliance
- Real-time streaming option
- HIPAA-compliant option available

## Quick Start

### Install
```bash
pip install assemblyai
```

### Basic Transcription
```python
import assemblyai as aai

aai.settings.api_key = "your-api-key"
transcriber = aai.Transcriber()

transcript = transcriber.transcribe("audio.mp3")
print(transcript.text)
```

### With Speaker Labels
```python
config = aai.TranscriptionConfig(speaker_labels=True)
transcript = transcriber.transcribe("audio.mp3", config=config)

for utterance in transcript.utterances:
    print(f"Speaker {utterance.speaker}: {utterance.text}")
```

### With AI Features
```python
config = aai.TranscriptionConfig(
    speaker_labels=True,
    sentiment_analysis=True,
    auto_chapters=True,
    entity_detection=True,
    summarization=True
)

transcript = transcriber.transcribe("audio.mp3", config=config)

# Summary
print(transcript.summary)

# Sentiment per segment
for sentiment in transcript.sentiment_analysis:
    print(f"{sentiment.sentiment}: {sentiment.text}")

# Auto chapters
for chapter in transcript.chapters:
    print(f"{chapter.headline}: {chapter.summary}")
```

### PII Redaction
```python
config = aai.TranscriptionConfig(
    redact_pii=True,
    redact_pii_policies=[
        aai.PIIRedactionPolicy.person_name,
        aai.PIIRedactionPolicy.credit_card_number,
        aai.PIIRedactionPolicy.ssn
    ]
)
```

## Real-Time Streaming
```python
def on_data(transcript):
    if transcript.text:
        print(transcript.text, end="", flush=True)

transcriber = aai.RealtimeTranscriber(
    on_data=on_data,
    sample_rate=16000
)

transcriber.connect()
# Stream audio...
```

## Best For
- Budget-conscious projects
- Content analysis (sentiment, topics)
- Compliance needs (PII redaction)
- Podcast summarization
- Meeting insights

Use when: Cheapest option needed, AI analysis of audio, PII compliance
