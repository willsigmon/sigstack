---
name: Udio Music Expert
description: Udio - AI music generation, song creation, custom audio for apps
allowed-tools: Read, Edit, Bash, WebFetch
model: sonnet
---

# Udio Music Expert

Generate original music with AI.

## Pricing (2026)

- **Free**: 10 songs/day
- **Standard**: $10/mo - 1200 songs
- **Pro**: $30/mo - 3000 songs + commercial use

## Getting Started

1. Go to udio.com
2. Enter prompt describing music
3. Generate and iterate
4. Download for use

## Prompt Structure

```
[genre] [mood] [instruments] [tempo] [era]
```

### Examples
```
"Upbeat indie pop with acoustic guitar and dreamy vocals, summer vibes"

"Dark electronic ambient, no vocals, cinematic tension"

"Lo-fi hip hop beats, chill study music, jazzy piano samples"

"Epic orchestral trailer music, building to climax, brass and strings"
```

## Genre Keywords

### Electronic
```
lo-fi, ambient, synthwave, techno, house,
drum and bass, chillstep, dubstep
```

### Acoustic
```
folk, acoustic, singer-songwriter, indie folk,
fingerpicking guitar, campfire vibes
```

### Orchestral
```
cinematic, epic trailer, orchestral,
string quartet, piano solo, film score
```

### Modern
```
indie pop, bedroom pop, alt rock, dream pop,
shoegaze, post-rock, emo
```

## Use Cases for Apps

### Background Music
```
"Soft ambient background music, no vocals,
for focus app, gentle synths, calming"
```

### Podcast Intros
```
"Upbeat podcast intro music, 15 seconds,
building energy, modern and clean"
```

### App Notifications
```
"Cheerful notification chime, 2 seconds,
positive feedback sound, mobile app"
```

### Meditation Apps
```
"Peaceful meditation music, singing bowls,
soft drones, nature sounds, 10 minutes"
```

## Advanced Features

### Extend
Continue a generated track to make it longer.

### Remix
Take existing generation and modify style.

### Inpainting
Replace a section of the song.

### Custom Lyrics
```
"Pop song with lyrics about [topic]
Verse about discovery
Chorus about freedom
Bridge about letting go"
```

## Vocal Styles

```
"female vocals, ethereal, reverb"
"male vocals, warm baritone, intimate"
"no vocals, instrumental only"
"vocoder, robotic, electronic"
"choir, harmonies, powerful"
```

## Prompt Tips

### Good Prompts
```
✅ "Nostalgic 80s synthwave with driving bass, no vocals, neon vibes"
✅ "Gentle acoustic lullaby, female humming, music box, dreamy"
✅ "High energy workout music, EDM drops, motivational"
```

### Avoid
```
❌ Copying specific artists (copyright issues)
❌ Too many conflicting genres
❌ Very specific lyrics (less control)
```

## Comparison

| Platform | Quality | Vocals | Price |
|----------|---------|--------|-------|
| Udio | Excellent | Yes | $10/mo |
| Suno | Very Good | Yes | $10/mo |
| Mubert | Good | Instrumental | $14/mo |
| Soundraw | Good | Instrumental | $17/mo |

## Integration Ideas

### Swift (Background Audio)
```swift
import AVFoundation

let player = try AVAudioPlayer(contentsOf: audioURL)
player.numberOfLoops = -1  // Loop forever
player.volume = 0.3        // Background level
player.play()
```

### React Native
```javascript
import Sound from 'react-native-sound';

const bgMusic = new Sound('ambient.mp3', Sound.MAIN_BUNDLE, () => {
  bgMusic.setNumberOfLoops(-1);
  bgMusic.setVolume(0.3);
  bgMusic.play();
});
```

## Commercial Use

- Free tier: Personal only
- Paid tiers: Commercial use allowed
- Attribution not required (check terms)
- Cannot claim AI music is human-made

Use when: App background music, podcast intros, notification sounds, video content
