---
name: iOS Simulator QA
description: iOS Simulator automation - screenshot capture, UI testing, visual QA for SwiftUI apps
allowed-tools: Read, Edit, Bash, mcp__xcode__build, mcp__xcode__run_tests
model: sonnet
---

# iOS Simulator QA Expert

Automate iOS testing and visual QA using the Simulator.

## For Vibe Coders
You don't need to know Xcode testing frameworks. Use simctl commands and Claude Vision to QA your iOS apps.

## Simulator Control (simctl)

### List Simulators
```bash
xcrun simctl list devices
# Shows available iPhone/iPad simulators
```

### Boot Simulator
```bash
# Boot specific device
xcrun simctl boot "iPhone 15 Pro"

# Open Simulator app
open -a Simulator
```

### Screenshot
```bash
# Capture current screen
xcrun simctl io booted screenshot ~/Desktop/ios-qa.png

# With specific simulator
xcrun simctl io "iPhone 15 Pro" screenshot ~/Desktop/screen.png
```

### Screen Recording
```bash
# Start recording
xcrun simctl io booted recordVideo ~/Desktop/recording.mp4

# Stop with Ctrl+C
```

## Automated QA Flow

### Full Device Matrix
```bash
#!/bin/bash
# qa-all-devices.sh

devices=("iPhone SE (3rd generation)" "iPhone 15 Pro" "iPhone 15 Pro Max" "iPad Pro (12.9-inch)")

for device in "${devices[@]}"; do
  echo "Testing on $device..."

  # Boot device
  xcrun simctl boot "$device" 2>/dev/null

  # Wait for boot
  sleep 5

  # Install app
  xcrun simctl install "$device" build/MyApp.app

  # Launch app
  xcrun simctl launch "$device" com.example.myapp

  # Wait for launch
  sleep 3

  # Screenshot
  xcrun simctl io "$device" screenshot "qa-${device// /_}.png"

  # Shutdown
  xcrun simctl shutdown "$device"
done

echo "Screenshots ready for review!"
```

### Dark Mode Toggle
```bash
# Enable dark mode
xcrun simctl ui booted appearance dark
xcrun simctl io booted screenshot dark-mode.png

# Enable light mode
xcrun simctl ui booted appearance light
xcrun simctl io booted screenshot light-mode.png
```

### Accessibility Testing
```bash
# Enable VoiceOver (for testing)
# Note: VoiceOver testing best done manually

# Increase text size
xcrun simctl ui booted content_size extra-large
xcrun simctl io booted screenshot large-text.png

# Reset
xcrun simctl ui booted content_size default
```

## Deep Linking for Navigation

```bash
# Open specific screen via URL scheme
xcrun simctl openurl booted "myapp://settings"
sleep 2
xcrun simctl io booted screenshot settings-screen.png

xcrun simctl openurl booted "myapp://profile"
sleep 2
xcrun simctl io booted screenshot profile-screen.png
```

## Push Notification Testing

```bash
# Send test notification
cat > notification.apns << EOF
{
  "aps": {
    "alert": {
      "title": "Test Notification",
      "body": "This is a test"
    }
  }
}
EOF

xcrun simctl push booted com.example.myapp notification.apns
```

## Integration with Claude Vision

After capturing screenshots, drag them into Claude Code and ask:
- "Review this iOS screen for UI issues"
- "Is this following iOS Human Interface Guidelines?"
- "Check accessibility - text size, contrast, touch targets"

## Common Issues to Check
- [ ] Safe area handling (notch, home indicator)
- [ ] Keyboard appearance handling
- [ ] Landscape orientation
- [ ] Dynamic Type sizes
- [ ] Dark mode colors
- [ ] VoiceOver labels

Use when: iOS visual testing, device matrix testing, automated screenshot capture
