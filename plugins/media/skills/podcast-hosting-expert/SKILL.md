---
name: Podcast Hosting Expert
description: Podcast hosting platforms - Transistor, Podbean, RSS.com, API access for developers
allowed-tools: Read, Edit, Bash, WebFetch
model: sonnet
---

# Podcast Hosting Expert

Choose and integrate podcast hosting platforms with APIs.

## Platforms with APIs

### Transistor ($24.99/mo)
- API access included
- Unlimited podcasts
- AI transcripts
- Private podcasts
- Analytics API

### Simplecast ($15-35/mo)
- Simplecast 2.0 API
- Custom embed players
- Analytics data
- Higher tiers for API

### Podbean ($19-79/mo)
- REST API
- Monetization
- Live streaming
- Enterprise SOC2

### RSS.com (Free/$12/mo)
- Basic features free
- Automatic distribution
- Transcriptions included
- Good for starting

## Transistor API

### List Episodes
```bash
curl https://api.transistor.fm/v1/episodes \
  -H "x-api-key: YOUR_API_KEY"
```

### Create Episode
```bash
curl -X POST https://api.transistor.fm/v1/episodes \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "episode": {
      "show_id": "123",
      "title": "Episode Title",
      "audio_url": "https://example.com/audio.mp3",
      "description": "Episode description"
    }
  }'
```

### Get Analytics
```bash
curl https://api.transistor.fm/v1/analytics/episodes/123 \
  -H "x-api-key: YOUR_API_KEY"
```

## RSS Feed Structure

Standard podcast RSS with iTunes extensions:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>Podcast Name</title>
    <itunes:author>Author Name</itunes:author>
    <itunes:image href="https://example.com/artwork.jpg"/>

    <item>
      <title>Episode Title</title>
      <enclosure url="https://example.com/ep1.mp3" type="audio/mpeg"/>
      <itunes:duration>00:45:30</itunes:duration>
      <pubDate>Sat, 01 Feb 2026 12:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>
```

## Distribution Workflow

```
1. Upload audio to host
2. Add metadata (title, description, artwork)
3. Host generates RSS feed
4. Feed submitted to directories:
   - Apple Podcasts
   - Spotify
   - Google Podcasts
   - Amazon Music
5. Directories poll RSS for updates
```

## For Modcaster

When building podcast apps, fetch RSS feeds:
```swift
// Fetch and parse RSS
let url = URL(string: "https://feed.example.com/podcast.rss")!
let parser = RSSParser()
let episodes = try await parser.parse(url)
```

Use when: Podcast publishing, API integration, RSS management, distribution
