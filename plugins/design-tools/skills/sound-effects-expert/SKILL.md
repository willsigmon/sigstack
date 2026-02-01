# Sound Effects Expert

Expert in AI-generated sound effects for apps, games, videos, and creative projects.

## Capabilities

### Generation
- Text-to-sound effects
- Ambient soundscapes
- UI/UX sounds
- Game audio
- Cinematic effects
- Foley sounds

### Platforms

**ElevenLabs Sound Effects** (Recommended)
- Up to 30-second clips
- Seamless looping
- 48kHz professional quality
- Royalty-free commercial use

**AudioCraft (Meta)**
- Open source
- Self-hostable
- Full control

## ElevenLabs SFX API

### Basic Generation
```bash
curl -X POST "https://api.elevenlabs.io/v1/sound-generation" \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "futuristic whoosh sound, sci-fi UI",
    "duration_seconds": 2,
    "prompt_influence": 0.5
  }'
```

### Looping Sounds
```bash
curl -X POST "https://api.elevenlabs.io/v1/sound-generation" \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  -d '{
    "text": "gentle rain on window, ambient loop",
    "duration_seconds": 10,
    "model_id": "eleven_text_to_sound_v2",
    "loop": true
  }'
```

### Parameters
- `duration_seconds`: 1-30 seconds
- `prompt_influence`: 0.0-1.0 (higher = more prompt adherence)
- `loop`: boolean for seamless loops

## Prompt Patterns

### UI/UX Sounds
```
"Soft click sound, mobile button tap, subtle and clean"
"Success chime, positive notification, friendly tone"
"Error buzz, gentle warning, not harsh"
"Swoosh transition, smooth slide, modern app"
"Toggle switch click, satisfying mechanical"
```

### Game Audio
```
"Coin collect sound, bright and rewarding, 8-bit inspired"
"Level up fanfare, triumphant, short celebration"
"Footsteps on gravel, walking pace, outdoor"
"Magic spell cast, ethereal whoosh, fantasy"
"Explosion, medium distance, cinematic impact"
```

### Ambient/Background
```
"Coffee shop ambiance, quiet chatter, espresso machine"
"Forest atmosphere, birds singing, gentle breeze"
"Ocean waves, peaceful beach, seagulls distant"
"Rain on roof, cozy interior, thunderstorm distant"
"Office ambiance, keyboard typing, air conditioning hum"
```

### Cinematic
```
"Dramatic bass drop, tension build, trailer impact"
"Whoosh transition, fast camera move, action scene"
"Door creak, horror atmosphere, slow and ominous"
"Heartbeat, tense moment, increasing tempo"
```

## Best Practices

1. **Be Descriptive**: Include material, intensity, environment
2. **Specify Duration**: Match to actual use case
3. **Request Loops**: For background/ambient sounds
4. **Layer Sounds**: Combine multiple for complex soundscapes
5. **Test in Context**: Always preview in actual use

## Pricing

ElevenLabs charges per generation:
- Sound effects billed by duration
- Included in subscription credits
- All outputs royalty-free

## When to Use

- Creating UI feedback sounds
- Game audio prototyping
- Video/podcast sound design
- Ambient backgrounds for apps
- Notification and alert sounds
