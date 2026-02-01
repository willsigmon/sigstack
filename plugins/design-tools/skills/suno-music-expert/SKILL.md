# Suno Music Expert

Expert in AI music generation using Suno for complete songs with vocals.

## What is Suno?

Suno is the market leader in AI music generation, creating complete songs with vocals, lyrics, instrumentals, and professional mixing from text descriptions. Suno V4 represents a quantum leap in quality.

**Website**: https://suno.com

## Capabilities

### Song Generation
- Full songs with vocals and lyrics
- Multiple genres and styles
- Instrumental tracks
- Custom lyrics input
- Extend and remix existing songs

### Quality
- Professional studio-quality output
- Natural-sounding vocals
- Complex arrangements
- Up to 4 minutes per generation

## Pricing

| Plan | Price | Credits | Songs |
|------|-------|---------|-------|
| Free | $0 | 50/day | ~10/day |
| Pro | $10/mo | 2,500/mo | ~500/mo |
| Premier | $30/mo | 10,000/mo | ~2,000/mo |

## API Access

Suno offers API access for developers. Check https://suno.com/api for current availability.

### Unofficial API (Community)
```python
# Via replicate or similar aggregators
import replicate

output = replicate.run(
    "suno/suno-v4",
    input={
        "prompt": "upbeat indie rock song about coding at night",
        "duration": 120
    }
)
```

## Effective Prompts

### Genre-Specific
```
[Genre] song about [topic]

Examples:
- "Upbeat indie pop song about summer road trips"
- "Melancholic jazz ballad about lost love"
- "Energetic EDM track with build-ups and drops"
- "Acoustic folk song about mountain hiking"
```

### With Style References
```
[Style] in the style of [artist/era]

Examples:
- "80s synthwave track, Stranger Things vibes"
- "Modern R&B with gospel influences"
- "Lo-fi hip hop study beats"
```

### Custom Lyrics Mode
```
Provide your own lyrics:
[Verse 1]
Your lyrics here

[Chorus]
More lyrics

Style: [genre], [tempo], [mood]
```

## Best Practices

1. **Be Specific**: Genre + mood + tempo + topic
2. **Use Sections**: Verse, chorus, bridge structure
3. **Iterate**: Generate multiple versions
4. **Extend**: Use extend feature for longer songs
5. **Remix**: Vary successful prompts

## Use Cases

- App background music
- Podcast intros/outros
- Video soundtracks
- Game music
- Content creation
- Prototyping compositions

## Limitations

- Commercial rights depend on plan
- Some genres better than others
- Vocals can occasionally be unclear
- No fine-grained mixing control

## When to Use

- Need complete songs with vocals quickly
- Creating background music for content
- Prototyping musical ideas
- Need variety of styles fast
