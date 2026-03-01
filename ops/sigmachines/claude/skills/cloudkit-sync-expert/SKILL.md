---
name: cloudkit-sync-expert
description: Work with Leavn CloudKit integration - community data sync, prayer requests, groups, conflict resolution, offline support
allowed-tools: Read, Edit, Grep
disable-model-invocation: false
context: fork
user-invocable: true
argument-hint: "[context]"
---

# CloudKit Sync Expert

Expert in CloudKit architecture:

**Components**:
- CloudKitCommunityClient (actor)
- SyncStatusManager (@Observable)
- CloudKitSyncEngine
- Operation queue

**Features**:
- Prayer request sync
- Group management
- Conflict resolution
- Offline queue

Use when: CloudKit errors, sync issues, community data, offline conflicts
