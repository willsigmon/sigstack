---
name: Podcast Analytics Expert
description: Podcast analytics - downloads, listener data, Spotify/Apple metrics, growth tracking
allowed-tools: Read, Edit, Bash, WebFetch
model: sonnet
---

# Podcast Analytics Expert

Understand your audience and grow your podcast.

## Analytics Sources

| Source | Data | Access |
|--------|------|--------|
| Hosting Platform | Downloads, geo, devices | API |
| Spotify for Podcasters | Streams, retention, demographics | Dashboard |
| Apple Podcasts Connect | Followers, plays, devices | Dashboard/API |
| YouTube | Views, watch time, subs | API |
| Op3 | Open analytics, prefix | Free |

## Key Metrics

### Downloads
- **Downloads**: Total file requests
- **Unique listeners**: Deduplicated by IP/device
- **Per episode**: Performance comparison
- **Trend**: Week-over-week growth

### Engagement
- **Completion rate**: % who finish episodes
- **Drop-off points**: Where listeners stop
- **Average consumption**: Minutes per listener
- **Retention curve**: Listener loyalty over time

### Audience
- **Geographic**: Countries, cities
- **Devices**: iOS vs Android vs Desktop
- **Apps**: Which podcast apps
- **Demographics**: Age, gender (Spotify only)

## Transistor Analytics API

```bash
# Get show analytics
curl https://api.transistor.fm/v1/analytics/shows/123 \
  -H "x-api-key: YOUR_API_KEY"

# Episode analytics
curl "https://api.transistor.fm/v1/analytics/episodes/456?start_date=2026-01-01" \
  -H "x-api-key: YOUR_API_KEY"
```

### Response
```json
{
  "data": {
    "downloads": 1234,
    "unique_listeners": 890,
    "countries": {
      "US": 450,
      "UK": 120,
      "CA": 80
    }
  }
}
```

## OP3 (Open Podcast Prefix Project)

**FREE**, open-source, privacy-focused analytics. 17M+ downloads/month tracked.

### Setup
Prepend prefix to your RSS enclosure URLs:
```xml
<enclosure url="https://op3.dev/e/https://your-host.com/episode.mp3"/>
```

### Query Downloads
```bash
curl "https://op3.dev/api/1/shows/YOUR_SHOW_ID/downloads?start=2026-01-01"
```

### Why OP3?
- Completely free forever
- Open data (public API)
- Privacy-focused (no user tracking)
- Works with any podcast host
- Great for indie podcasters

## Spotify for Podcasters API

### Get Episode Performance
```python
# Spotify doesn't have public API for podcasters
# Use dashboard exports or third-party tools

# Chartable, Podtrac for cross-platform analytics
```

## Apple Podcasts Connect

### Analytics Export
```python
import requests

# Apple Podcasts Connect API (requires JWT auth)
# See: https://developer.apple.com/documentation/appstoreconnectapi

headers = {"Authorization": f"Bearer {jwt_token}"}
response = requests.get(
    "https://api.appstoreconnect.apple.com/v1/analyticsReportRequests",
    headers=headers
)
```

## Building a Dashboard

### Python Analytics Aggregator
```python
from dataclasses import dataclass
from datetime import date

@dataclass
class PodcastMetrics:
    date: date
    downloads: int
    unique_listeners: int
    avg_completion: float
    top_countries: dict

async def aggregate_metrics(show_id: str, start: date, end: date):
    # Fetch from multiple sources
    transistor = await fetch_transistor(show_id, start, end)
    op3 = await fetch_op3(show_id, start, end)

    return PodcastMetrics(
        date=end,
        downloads=transistor.downloads + op3.downloads,
        unique_listeners=transistor.unique_listeners,
        avg_completion=transistor.avg_completion,
        top_countries=transistor.countries
    )
```

## Growth Benchmarks

### Indie Podcast (Monthly Downloads)
- Starting out: 50-100
- Growing: 500-1,000
- Established: 5,000-10,000
- Popular: 50,000+

### Retention Benchmarks
- Excellent: 80%+ completion
- Good: 60-80%
- Average: 40-60%
- Needs work: <40%

## Actionable Insights

### Episode Length
```
Analyze completion rates by episode length.
If 60min episodes have 40% completion but 30min have 70%,
consider shorter episodes.
```

### Release Timing
```
Track downloads by day of week and time.
Optimize release schedule for your audience's habits.
```

### Content Analysis
```
Compare episode metrics to topics.
What topics drive the highest engagement?
```

## Tools for Vibe Coders

### Chartable
- Cross-platform analytics
- Attribution tracking
- SmartLinks

### Podtrac
- Industry-standard measurement
- IAB certified
- Free tier available

### Spotify for Podcasters
- Deep Spotify insights
- Free
- Spotify-only data

Use when: Podcast growth, audience analysis, content optimization, multi-platform tracking
