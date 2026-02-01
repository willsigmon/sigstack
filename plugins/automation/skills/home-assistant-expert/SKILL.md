---
name: Home Assistant Expert
description: Home Assistant automation - smart home, developer desk setup, coding environment
allowed-tools: Read, Edit, Bash, WebFetch
model: sonnet
---

# Home Assistant Expert

Smart home automation for developers. Control your coding environment.

## Why for Developers?
- "Hey Siri, start coding mode" → Lights, music, do-not-disturb
- Automate desk setup based on time
- Monitor your dev environment
- Track productivity patterns

## Key Integrations

### Development Tools
- Start/stop dev containers
- Monitor build status (RGB light feedback)
- Alert on CI/CD failures
- Control music based on focus mode

### Desk Automation
- Standing desk height presets
- Monitor brightness by time
- Ambient lighting for video calls
- Air quality for focus

## REST API

### Call a Service
```bash
curl -X POST \
  -H "Authorization: Bearer $HA_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"entity_id": "light.office"}' \
  http://homeassistant.local:8123/api/services/light/toggle
```

### Get State
```bash
curl -H "Authorization: Bearer $HA_TOKEN" \
  http://homeassistant.local:8123/api/states/sensor.desk_height
```

## Automations for Coders

### Coding Mode
```yaml
automation:
  - alias: "Start Coding Mode"
    trigger:
      - platform: webhook
        webhook_id: coding_mode
    action:
      - service: light.turn_on
        target:
          entity_id: light.office
        data:
          brightness: 180
          color_temp: 400
      - service: media_player.play_media
        target:
          entity_id: media_player.office
        data:
          media_content_id: spotify:playlist:lofi
          media_content_type: playlist
      - service: input_boolean.turn_on
        entity_id: input_boolean.do_not_disturb
```

### Build Status Light
```yaml
automation:
  - alias: "CI Status Light"
    trigger:
      - platform: webhook
        webhook_id: ci_status
    action:
      - choose:
          - conditions:
              - "{{ trigger.json.status == 'success' }}"
            sequence:
              - service: light.turn_on
                target:
                  entity_id: light.status_lamp
                data:
                  color_name: green
          - conditions:
              - "{{ trigger.json.status == 'failure' }}"
            sequence:
              - service: light.turn_on
                target:
                  entity_id: light.status_lamp
                data:
                  color_name: red
```

## MCP Integration

Home Assistant can be triggered from Claude via webhooks or the REST API, enabling voice → Claude → Home Assistant workflows.

## Tower (Unraid) Setup
Running HA on Tower:
```bash
# Community Apps → Home Assistant
# Set config path: /mnt/user/appdata/homeassistant
```

Use when: Coding environment automation, desk setup, productivity tracking
