---
name: community-features-expert
description: Work with Leavn community features - prayer wall, groups, messaging, CloudKit sync, content moderation
allowed-tools: Read, Edit, Grep
disable-model-invocation: false
context: fork
user-invocable: true
argument-hint: "[context]"
---

# Community Features Expert

Expert in social/community features:

**Features**:
- Prayer wall + requests
- Community groups
- Direct messaging
- CloudKit sync
- Content moderation

**Files**:
- CommunityViewModel (@Observable)
- CloudKitCommunityClient (actor)
- PrayerRequestService
- CommunityGroupService

Use when: Community bugs, prayer wall issues, CloudKit sync, messaging
