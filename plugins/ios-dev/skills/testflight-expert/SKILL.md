---
name: TestFlight Expert
description: TestFlight - beta testing, internal/external testers, build distribution
allowed-tools: Read, Edit, Bash, WebFetch
model: sonnet
---

# TestFlight Expert

Distribute beta builds and collect feedback through Apple's TestFlight.

## TestFlight Overview

- **Internal Testing**: Up to 100 testers (no review)
- **External Testing**: Up to 10,000 testers (requires review)
- **Build Expiry**: 90 days
- **Feedback**: Screenshots and crash reports

## Fastlane Upload

### Basic Upload
```ruby
# Fastfile
lane :beta do
  build_app(scheme: "App")
  upload_to_testflight(
    skip_waiting_for_build_processing: true
  )
end
```

### With Changelog
```ruby
lane :beta do
  build_app(scheme: "App")
  upload_to_testflight(
    changelog: "Bug fixes and improvements",
    distribute_external: true,
    groups: ["Beta Testers"]
  )
end
```

## App Store Connect API

### Setup
```bash
# Create API key in App Store Connect
# Users and Access → Keys → App Store Connect API

# Store credentials
export APP_STORE_CONNECT_API_KEY_ID="XXXXXXXXXX"
export APP_STORE_CONNECT_ISSUER_ID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
export APP_STORE_CONNECT_API_KEY_PATH="~/.appstore/AuthKey.p8"
```

### Fastlane Config
```ruby
# Appfile
app_store_connect_api_key(
  key_id: ENV["APP_STORE_CONNECT_API_KEY_ID"],
  issuer_id: ENV["APP_STORE_CONNECT_ISSUER_ID"],
  key_filepath: ENV["APP_STORE_CONNECT_API_KEY_PATH"]
)
```

## Managing Testers

### Add Internal Tester
```ruby
# Must be App Store Connect user
# Add manually in App Store Connect
```

### Add External Group
```ruby
lane :add_testers do
  upload_to_testflight(
    groups: ["Beta Testers", "VIP Testers"],
    distribute_external: true
  )
end
```

### CLI Tester Management
```bash
# Using app-store-connect-cli
asc testflight add-tester \
  --email "tester@example.com" \
  --group "Beta Testers" \
  --app-id 123456789
```

## CI/CD Integration

### GitHub Actions
```yaml
name: TestFlight
on:
  push:
    branches: [main]

jobs:
  testflight:
    runs-on: macos-14
    steps:
      - uses: actions/checkout@v4

      - name: Setup Signing
        uses: apple-actions/import-codesign-certs@v2
        with:
          p12-file-base64: ${{ secrets.CERTIFICATES_P12 }}
          p12-password: ${{ secrets.CERTIFICATES_PASSWORD }}

      - name: Build & Upload
        run: |
          bundle exec fastlane beta
        env:
          APP_STORE_CONNECT_API_KEY_ID: ${{ secrets.ASC_KEY_ID }}
          APP_STORE_CONNECT_ISSUER_ID: ${{ secrets.ASC_ISSUER_ID }}
          APP_STORE_CONNECT_API_KEY: ${{ secrets.ASC_KEY }}
```

## Build Processing

### Wait for Processing
```ruby
lane :beta do
  build_app(scheme: "App")
  upload_to_testflight(
    skip_waiting_for_build_processing: false,
    wait_processing_timeout_duration: 3600
  )
  # Build is ready for testing
end
```

### Skip Waiting
```ruby
lane :beta do
  build_app(scheme: "App")
  upload_to_testflight(
    skip_waiting_for_build_processing: true
  )
  # Continue without waiting (faster CI)
end
```

## Beta Review Tips

### What Gets Reviewed
- First build of new app
- Major version changes
- Significant feature additions

### Speed Up Review
- Complete app description
- Add test account credentials
- Clear beta release notes
- No placeholder content

### Typical Review Time
- 24-48 hours for external builds
- Internal builds: No review needed

## Collecting Feedback

### In-App Feedback
```swift
import StoreKit

// Prompt for beta feedback
SKStoreReviewController.requestReview()
```

### TestFlight Feedback
- Users shake device to send feedback
- Includes screenshot + notes
- Crash reports auto-collected

## Version Management

```ruby
lane :beta do
  # Auto-increment build number
  increment_build_number(
    build_number: latest_testflight_build_number + 1
  )

  build_app(scheme: "App")
  upload_to_testflight
end
```

Use when: Beta distribution, tester management, CI upload automation
