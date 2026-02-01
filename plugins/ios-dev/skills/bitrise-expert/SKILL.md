---
name: Bitrise Expert
description: Bitrise CI/CD - iOS builds, automated testing, deployment, managed macOS runners
allowed-tools: Read, Edit, Bash, WebFetch
model: sonnet
---

# Bitrise CI/CD Expert

Mobile-focused CI/CD platform with managed macOS infrastructure.

## Pricing (2026)

| Plan | Credits/mo | Price |
|------|------------|-------|
| Hobby | 300 | Free |
| Starter | 500 | $35/mo |
| Teams | 1,500 | $90/mo |
| Enterprise | Custom | Custom |

## Key Features
- Managed macOS with latest Xcode (within 24 hours)
- Automatic code signing
- 300+ integrations
- Native Apple Silicon support

## bitrise.yml Configuration

### Basic iOS Build
```yaml
format_version: "13"
default_step_lib_source: https://github.com/bitrise-io/bitrise-steplib.git

workflows:
  primary:
    steps:
    - git-clone@8: {}
    - cache-pull@2: {}
    - cocoapods-install@2: {}

    - xcode-test@5:
        inputs:
        - project_path: App.xcworkspace
        - scheme: App

    - xcode-archive@5:
        inputs:
        - project_path: App.xcworkspace
        - scheme: App
        - distribution_method: app-store

    - deploy-to-bitrise-io@2: {}
    - cache-push@2: {}
```

### TestFlight Deployment
```yaml
workflows:
  deploy:
    steps:
    - certificate-and-profile-installer@1: {}
    - xcode-archive@5:
        inputs:
        - distribution_method: app-store
    - deploy-to-itunesconnect-deliver@2:
        inputs:
        - connection: api_key
        - api_key_path: $BITRISEIO_API_KEY_PATH
        - submit_to_testflight: "yes"
```

## Code Signing

### Automatic (Recommended)
1. Connect Apple Developer account
2. Bitrise generates profiles automatically
3. No manual certificate management

### Manual
```yaml
- certificate-and-profile-installer@1:
    inputs:
    - certificate_url: $BITRISE_CERTIFICATE_URL
    - certificate_passphrase: $BITRISE_CERTIFICATE_PASSPHRASE
    - provisioning_profile_url: $BITRISE_PROVISION_URL
```

## Triggers

```yaml
trigger_map:
- push_branch: main
  workflow: deploy
- pull_request_source_branch: "*"
  workflow: primary
```

## Caching

```yaml
- cache-pull@2: {}  # At start

# After dependencies
- cache-push@2:
    inputs:
    - cache_paths: |
        ./Pods -> ./Podfile.lock
        ~/.cocoapods -> ./Podfile.lock
```

## Advantages over Xcode Cloud
- Android + iOS in one platform
- More Xcode version options
- External tool integrations
- Self-hosted runner option

Use when: iOS CI/CD, TestFlight automation, multi-platform mobile builds
