---
name: Audio Fingerprint Expert
description: Audio fingerprinting - music recognition, ad detection, intro/outro skipping
allowed-tools: Read, Edit, Bash, WebFetch
model: sonnet
---

# Audio Fingerprint Expert

Identify and match audio content using fingerprinting.

## Use Cases for Modcaster
- Skip intros/outros automatically
- Detect and skip ads
- Identify music in podcasts
- Match duplicate content

## Top Services

### Commercial APIs

**AudD ($2-5/1000 requests)**
- Neural network based
- Music recognition
- Real-time and batch

**ACRCloud**
- Industry leader
- Cross-platform SDKs
- Custom fingerprint databases

**ShazamAPI (via RapidAPI)**
- The classic
- Huge music database
- Enterprise options

### Open Source

**AcoustID (Free)**
- Links to MusicBrainz
- Community-powered
- Chromaprint fingerprinting

**Dejavu**
- Python implementation
- Self-hosted
- Custom audio matching

## AudD API

### Recognize Music
```bash
curl -X POST "https://api.audd.io/" \
  -F "api_token=YOUR_TOKEN" \
  -F "file=@audio.mp3" \
  -F "return=spotify,apple_music"
```

### Python
```python
import requests

response = requests.post('https://api.audd.io/', data={
    'api_token': 'YOUR_TOKEN',
    'return': 'spotify,apple_music',
}, files={
    'file': open('audio.mp3', 'rb'),
})

result = response.json()
if result['result']:
    print(f"Found: {result['result']['title']} by {result['result']['artist']}")
```

## AcoustID (Free)

### Generate Fingerprint
```bash
# Install chromaprint
brew install chromaprint

# Generate fingerprint
fpcalc -json audio.mp3
```

### Lookup
```python
import acoustid

for score, recording_id, title, artist in acoustid.match(API_KEY, 'audio.mp3'):
    print(f"Match ({score:.2f}): {title} by {artist}")
```

## Dejavu (Self-Hosted)

### Setup
```python
from dejavu import Dejavu

djv = Dejavu(config={
    "database_type": "sqlite",
    "database": "fingerprints.db"
})

# Fingerprint known audio
djv.fingerprint_directory("known_intros/", [".mp3", ".wav"])

# Match unknown audio
songs = djv.recognize(FileRecognizer, "podcast_episode.mp3")
print(songs)  # Returns matches with timestamps
```

## Podcast Ad Detection Pattern

```python
# 1. Fingerprint known ads
for ad_file in known_ads:
    dejavu.fingerprint_file(ad_file)

# 2. When processing episode
matches = dejavu.recognize(episode_file)

# 3. Get timestamps of ads
ad_segments = [(m['offset'], m['offset'] + m['duration']) for m in matches]

# 4. Skip those segments in player
```

## Accuracy Tips
- Use 10-30 second samples
- Higher sample rate = better accuracy
- Noise affects matching
- Store fingerprints, not audio

Use when: Music recognition, ad skipping, duplicate detection, audio matching
