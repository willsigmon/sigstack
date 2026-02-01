# Lottie & Rive Animation Expert

Expert in creating lightweight, scalable animations for apps and web.

## Overview

### Lottie
- JSON-based animation format
- Exported from After Effects via Bodymovin
- Lightweight (~4x smaller than GIF)
- Widely supported (iOS, Android, Web, React Native)

### Rive
- .riv binary format
- Native editor with state machines
- Interactive animations
- Better performance (60fps vs ~17fps)

## When to Use Each

| Use Case | Lottie | Rive |
|----------|--------|------|
| Simple animations | ✓ | ✓ |
| After Effects workflow | ✓ | ✗ |
| Interactive/stateful | Limited | ✓ |
| Performance-critical | Good | Better |
| Character animation | Good | Better (bones) |
| Learning curve | Lower | Higher |

## AI-Powered Creation

### LottieFiles AI
```
1. Go to lottiefiles.com/ai
2. Describe your animation
3. Generate and customize
4. Export .json
```

### Recraft AI → Lottie
```
1. Generate vector design in Recraft
2. Export as Lottie format
3. Import into LottieFiles editor
4. Add motion if needed
```

### Jitter (Web-based)
```
1. Create animation in Jitter editor
2. AI-assisted motion interpolation
3. Export as Lottie, GIF, or video
4. Up to 4K/120fps
```

## iOS Integration

### Lottie (iOS)
```swift
import Lottie

let animationView = LottieAnimationView(name: "loading")
animationView.frame = view.bounds
animationView.contentMode = .scaleAspectFit
animationView.loopMode = .loop
view.addSubview(animationView)
animationView.play()
```

### Rive (iOS)
```swift
import RiveRuntime

let riveView = RiveView(riveFile: "animation")
riveView.play(animationName: "idle")

// State machine interaction
riveView.setInput("isHovered", value: true)
```

## Web Integration

### Lottie (Web)
```html
<script src="https://unpkg.com/@lottiefiles/lottie-player@latest"></script>
<lottie-player
  src="animation.json"
  background="transparent"
  speed="1"
  loop
  autoplay>
</lottie-player>
```

### Rive (Web)
```javascript
import { Rive } from '@rive-app/canvas';

const r = new Rive({
  src: 'animation.riv',
  canvas: document.getElementById('canvas'),
  autoplay: true,
  stateMachines: 'State Machine 1',
});
```

## React Native

### Lottie
```jsx
import LottieView from 'lottie-react-native';

<LottieView
  source={require('./animation.json')}
  autoPlay
  loop
  style={{ width: 200, height: 200 }}
/>
```

### Rive
```jsx
import Rive from 'rive-react-native';

<Rive
  resourceName="animation"
  autoplay={true}
  style={{ width: 200, height: 200 }}
/>
```

## Best Practices

### File Size
- Keep Lottie under 100KB
- Optimize paths and shapes
- Remove unused layers
- Use shape layers over images

### Performance
- Limit to 60fps
- Reduce complexity for mobile
- Use Rive for interactive animations
- Test on low-end devices

### Accessibility
```swift
// Respect reduced motion
if UIAccessibility.isReduceMotionEnabled {
    animationView.currentProgress = 1.0 // Show final frame
} else {
    animationView.play()
}
```

## Common Animation Types

### Loading Indicators
- Spinners, progress bars
- Skeleton loaders
- Pull-to-refresh

### Micro-interactions
- Button states
- Toggle switches
- Success/error feedback

### Onboarding
- Illustration sequences
- Feature highlights
- Tutorial animations

### Empty States
- No data illustrations
- Error states
- First-time user experience

## When to Use

- App loading states
- Micro-interactions
- Onboarding flows
- Illustrated empty states
- Interactive UI elements
- Game UI animations
