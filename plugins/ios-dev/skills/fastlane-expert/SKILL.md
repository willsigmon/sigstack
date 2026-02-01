---
name: Fastlane Expert
description: Fastlane automation - build, test, deploy iOS apps, TestFlight, App Store Connect
allowed-tools: Read, Edit, Bash
model: sonnet
---

# Fastlane Automation Expert

Automate iOS builds, testing, and deployment with fastlane.

## Setup

```bash
# Install
brew install fastlane

# Init in project
cd ios-project
fastlane init
```

## Fastfile Patterns

### Beta to TestFlight
```ruby
# Fastfile
default_platform(:ios)

platform :ios do
  desc "Push a new beta build to TestFlight"
  lane :beta do
    increment_build_number(xcodeproj: "App.xcodeproj")
    build_app(scheme: "App")
    upload_to_testflight(
      skip_waiting_for_build_processing: true
    )
  end
end
```

### App Store Release
```ruby
lane :release do
  capture_screenshots
  build_app(scheme: "App")
  upload_to_app_store(
    submit_for_review: true,
    automatic_release: true,
    force: true,
    skip_metadata: false,
    skip_screenshots: false
  )
end
```

### Testing Lane
```ruby
lane :test do
  run_tests(
    scheme: "AppTests",
    devices: ["iPhone 15 Pro"],
    code_coverage: true
  )
end
```

## App Store Connect API

```ruby
# Appfile
app_identifier "com.example.app"
apple_id "developer@example.com"
team_id "ABC123"

# API key auth (recommended)
# Store key file securely
lane_context[SharedValues::APP_STORE_CONNECT_API_KEY] = app_store_connect_api_key(
  key_id: "ABC123",
  issuer_id: "def-456",
  key_filepath: "./AuthKey.p8"
)
```

## Code Signing

### Match (Recommended)
```ruby
lane :sync_certs do
  match(
    type: "appstore",
    app_identifier: "com.example.app",
    git_url: "git@github.com:org/certs.git"
  )
end

lane :beta do
  match(type: "appstore")
  build_app(scheme: "App")
  upload_to_testflight
end
```

## CI/CD Integration

### GitHub Actions
```yaml
- name: Build and Upload
  env:
    APP_STORE_CONNECT_API_KEY: ${{ secrets.ASC_KEY }}
    MATCH_PASSWORD: ${{ secrets.MATCH_PASSWORD }}
  run: bundle exec fastlane beta
```

## Common Actions
- `build_app`: Build iOS app
- `upload_to_testflight`: Beta distribution
- `upload_to_app_store`: Production release
- `match`: Code signing sync
- `snapshot`: Screenshot automation
- `deliver`: Metadata/screenshots upload

Use when: iOS builds, TestFlight uploads, App Store releases, CI/CD automation
