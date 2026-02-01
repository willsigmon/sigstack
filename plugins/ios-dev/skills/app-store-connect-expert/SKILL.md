---
name: App Store Connect Expert
description: App Store Connect API - metadata, screenshots, release automation
allowed-tools: Read, Edit, Bash, WebFetch
model: sonnet
---

# App Store Connect Expert

Automate App Store submissions with the Connect API.

## API Setup

### Create API Key
1. App Store Connect → Users and Access → Keys
2. Generate new key with appropriate role
3. Download .p8 file (only once!)

### Environment Variables
```bash
export ASC_KEY_ID="XXXXXXXXXX"
export ASC_ISSUER_ID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
export ASC_KEY_PATH="~/.appstore/AuthKey_XXXXXXXXXX.p8"
```

## Fastlane Integration

### Deliver (Metadata & Screenshots)
```ruby
lane :metadata do
  deliver(
    submit_for_review: false,
    automatic_release: false,
    force: true,
    metadata_path: "./fastlane/metadata",
    screenshots_path: "./fastlane/screenshots"
  )
end
```

### Metadata Structure
```
fastlane/
├── metadata/
│   ├── en-US/
│   │   ├── name.txt
│   │   ├── subtitle.txt
│   │   ├── description.txt
│   │   ├── keywords.txt
│   │   ├── promotional_text.txt
│   │   ├── privacy_url.txt
│   │   └── support_url.txt
│   └── ja/
│       └── ...
└── screenshots/
    └── en-US/
        ├── iPhone 6.5"/
        ├── iPhone 5.5"/
        └── iPad Pro 12.9"/
```

## Screenshot Automation

### Fastlane Snapshot
```ruby
# Snapfile
devices([
  "iPhone 15 Pro Max",
  "iPhone 8 Plus",
  "iPad Pro (12.9-inch) (6th generation)"
])

languages([
  "en-US",
  "ja"
])

scheme("AppUITests")
output_directory("./fastlane/screenshots")
```

### Run Snapshots
```bash
fastlane snapshot
```

### Frame Screenshots
```ruby
lane :frames do
  frameit(
    white: true,
    path: "./fastlane/screenshots"
  )
end
```

## Release Automation

### Submit for Review
```ruby
lane :release do
  deliver(
    submit_for_review: true,
    automatic_release: true,
    submission_information: {
      add_id_info_uses_idfa: false
    },
    precheck_include_in_app_purchases: false
  )
end
```

### Phased Release
```ruby
deliver(
  phased_release: true,
  automatic_release: true
)
```

## App Store Connect CLI

### Installation
```bash
brew install app-store-connect-cli
# Or
pip install appstoreconnect
```

### List Apps
```bash
asc apps list
```

### Get Build Status
```bash
asc builds list --app-id 123456789
```

## API Direct Access

### JWT Token Generation
```python
import jwt
import time

def generate_token():
    headers = {
        "alg": "ES256",
        "kid": KEY_ID,
        "typ": "JWT"
    }

    payload = {
        "iss": ISSUER_ID,
        "exp": int(time.time()) + 1200,  # 20 minutes
        "aud": "appstoreconnect-v1"
    }

    with open(KEY_PATH, 'r') as f:
        private_key = f.read()

    return jwt.encode(payload, private_key,
                      algorithm='ES256', headers=headers)
```

### API Request
```python
import requests

token = generate_token()
response = requests.get(
    "https://api.appstoreconnect.apple.com/v1/apps",
    headers={
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
)
```

## Roles & Permissions

| Role | Capabilities |
|------|-------------|
| Admin | Everything |
| App Manager | Manage apps, no financials |
| Developer | Builds, TestFlight |
| Marketing | Metadata, screenshots |
| Sales | Reports, analytics |

## Common Automations

### Nightly Build Info
```ruby
lane :check_status do
  latest = latest_testflight_build_number
  puts "Latest build: #{latest}"

  # Check review status
  # ... API call
end
```

### Auto-Reply Reviews
```ruby
# Note: App Store Connect doesn't support this via API
# Use third-party tools like AppFollow
```

Use when: App Store submission, metadata management, screenshot automation
