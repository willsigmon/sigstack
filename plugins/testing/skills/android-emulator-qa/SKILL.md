---
name: Android Emulator QA
description: Android Emulator automation - screenshot capture, UI testing, visual QA for Android apps
allowed-tools: Read, Edit, Bash
model: sonnet
---

# Android Emulator QA Expert

Automate Android testing and visual QA using the Emulator.

## For Vibe Coders
Use ADB commands and Claude Vision to QA Android apps without writing test code.

## ADB Basics

### Device Connection
```bash
# List connected devices/emulators
adb devices

# Connect to specific emulator
adb -s emulator-5554 shell
```

### Screenshot
```bash
# Capture screenshot
adb exec-out screencap -p > android-screen.png

# With device selection
adb -s emulator-5554 exec-out screencap -p > screen.png
```

### Screen Recording
```bash
# Start recording (max 3 minutes)
adb shell screenrecord /sdcard/recording.mp4

# Stop with Ctrl+C, then pull file
adb pull /sdcard/recording.mp4 ./recording.mp4
```

## Emulator Commands

### Launch Emulator
```bash
# List available AVDs
emulator -list-avds

# Launch specific AVD
emulator -avd Pixel_7_API_34 &
```

### Quick Boot
```bash
# Cold boot (fresh start)
emulator -avd Pixel_7_API_34 -no-snapshot-load

# Quick boot (resume state)
emulator -avd Pixel_7_API_34
```

## Automated QA Flow

### Multi-Device Testing
```bash
#!/bin/bash
# qa-android-devices.sh

devices=("Pixel_4_API_34" "Pixel_7_API_34" "Pixel_Tablet_API_34")

for device in "${devices[@]}"; do
  echo "Testing on $device..."

  # Launch emulator
  emulator -avd "$device" -no-window &
  sleep 30  # Wait for boot

  # Install app
  adb install -r app/build/outputs/apk/debug/app-debug.apk

  # Launch app
  adb shell am start -n com.example.app/.MainActivity

  sleep 3

  # Screenshot
  adb exec-out screencap -p > "qa-${device}.png"

  # Kill emulator
  adb emu kill
done

echo "Screenshots ready for review!"
```

### Dark Theme Toggle
```bash
# Enable dark theme
adb shell "cmd uimode night yes"
sleep 2
adb exec-out screencap -p > dark-mode.png

# Enable light theme
adb shell "cmd uimode night no"
sleep 2
adb exec-out screencap -p > light-mode.png
```

### Font Scale Testing
```bash
# Large font
adb shell settings put system font_scale 1.3
sleep 2
adb exec-out screencap -p > large-font.png

# Default
adb shell settings put system font_scale 1.0
```

## Deep Linking

```bash
# Open specific activity via intent
adb shell am start -a android.intent.action.VIEW \
  -d "myapp://settings" com.example.app
sleep 2
adb exec-out screencap -p > settings.png
```

## App Interaction

### Tap/Click
```bash
# Tap at coordinates (x, y)
adb shell input tap 540 1200
```

### Swipe
```bash
# Swipe down (scroll)
adb shell input swipe 540 1000 540 200 300
```

### Text Input
```bash
adb shell input text "Hello%sWorld"  # %s = space
```

## Common Checks for Claude Vision
- [ ] Material Design compliance
- [ ] Edge-to-edge display
- [ ] Navigation bar handling
- [ ] Tablet layouts
- [ ] RTL language support
- [ ] Dark theme colors

## Integration with Claude

Drag screenshots into Claude and ask:
- "Is this following Material Design guidelines?"
- "Check for Android-specific UI issues"
- "Compare phone vs tablet layout"

Use when: Android visual testing, emulator automation, multi-device QA
