---
name: Knack Expert
description: HTI Knack database operations - auth, CRUD, pagination, caching, exports, dashboards, compliance reporting
allowed-tools: Read, Edit
---

# Knack Expert

Complete HTI Knack database expertise for the HUBZone Technology Initiative.

## Capabilities

### Authentication
- API key auth (server-side): `X-Knack-Application-Id`, `X-Knack-REST-API-Key`
- User token auth (client-side): Session creation, refresh, validation

### Data Operations
- **Read**: `GET /v1/objects/{object_key}/records` - fetch with filters/sorting
- **Pagination**: 1,000 records/page limit - use `fetch_all_pages` pattern
- **Rate Limit**: 10 req/sec - enforce 100ms minimum between requests
- **Caching**: Cache dashboard metrics, slow queries, computed aggregates

### Filtering & Sorting
```json
{ "match": "and", "rules": [{ "field": "field_123", "operator": "is", "value": "active" }] }
```
Operators: is, is not, contains, higher than, lower than, is blank, is not blank

### Exports
Formats: PDF, CSV, JSON, Excel, HTML
Templates: ncdit_compliance, board_summary, donor_impact

### Real-time Sync
- Polling with change detection
- Webhooks on record events
- Incremental updates (fetch only changed)

### Dashboard AI
- Metrics generation (aggregate to KPIs)
- Trend analysis, anomaly detection
- Forecast progress toward goals

### Goal Tracking
Grant goals (2024-2026): 3,500 laptops acquired, 2,500 converted, 70% conversion rate
Reporting: Quarterly NCDIT compliance

### DevOps
- Vercel deployment triggers
- Environment sync
- Performance monitoring
