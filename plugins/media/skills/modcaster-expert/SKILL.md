---
name: Modcaster Expert
description: Modcaster podcast app - RSS parsing, queue management, sync, season UI, audio fingerprinting
allowed-tools: Read, Edit, Grep
---

# Modcaster Expert

Podcast app architecture for Modcaster.

## RSS Feed Parsing
- Standard RSS 2.0 + iTunes extensions
- Handle malformed feeds gracefully
- Extract: episodes, artwork, chapters, transcripts
- Refresh strategies (conditional GET, ETags)

## Queue Management
Multiple named queues (solving Pocket Casts #1 request):
- Default queue (Up Next)
- Custom queues (Commute, Workout, etc.)
- Queue ordering, shuffle, repeat
- Cross-queue episode state

## Cross-Device Sync
Learning from Apple Podcasts failures:
- Optimistic UI updates
- Conflict resolution (last-listen-wins for position)
- Offline queue management
- Incremental sync (not full refresh)

## Season-Centric UI
- Group episodes by season
- Season artwork/descriptions
- Binge mode (auto-play season)
- Season progress tracking

## Audio Fingerprinting
Detect intros/outros/ads:
- FFT-based spectral analysis
- Constellation map matching
- Store fingerprints for known segments
- Skip/trim automation

Use when: Podcast features, sync bugs, queue logic, RSS issues
