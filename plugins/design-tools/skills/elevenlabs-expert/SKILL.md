# ElevenLabs Voice Expert

Expert in AI voice generation, cloning, and audio synthesis using ElevenLabs.

## Capabilities

### Voice Generation
- Text-to-speech with premium voices
- Voice cloning from samples
- Multilingual voice synthesis
- Emotional tone control

### Audio Production
- Podcast voice generation
- Audiobook narration
- Voice-over for videos
- Character voice creation

### Integration Patterns
- Streaming audio generation
- Batch processing workflows
- Real-time voice synthesis
- API cost optimization

## API Reference

### Text to Speech
```bash
curl -X POST "https://api.elevenlabs.io/v1/text-to-speech/{voice_id}" \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your text here",
    "model_id": "eleven_multilingual_v2",
    "voice_settings": {
      "stability": 0.5,
      "similarity_boost": 0.75
    }
  }'
```

### Voice Settings
- **stability** (0-1): Lower = more expressive, Higher = more consistent
- **similarity_boost** (0-1): How closely to match original voice
- **style** (0-1): Style exaggeration (v2 models only)
- **use_speaker_boost**: Enhance speaker clarity

### Popular Voice IDs
- Rachel (narrative): `21m00Tcm4TlvDq8ikWAM`
- Domi (young female): `AZnzlk1XvdvUeBnXmlld`
- Bella (soft female): `EXAVITQu4vr4xnSDxMaL`
- Antoni (male): `ErXwobaYiN019PkySvjV`
- Josh (deep male): `TxGEqnHWrfWFTfGW9XjX`

### Models
- `eleven_multilingual_v2` - Best quality, 29 languages
- `eleven_turbo_v2` - Fast, English optimized
- `eleven_monolingual_v1` - Legacy English

## Best Practices

1. **Voice Selection**: Match voice to content type
2. **Chunking**: Break long text into paragraphs
3. **SSML**: Use pauses and emphasis for natural flow
4. **Cost**: Turbo model for drafts, v2 for final
5. **Caching**: Store generated audio to avoid re-generation

## When to Use
- Generating voice content for apps
- Creating podcast intros/outros
- Voice prototyping for products
- Accessibility audio generation
