# Animation Expert

Expert in motion design, animations, and interactive visual effects.

## Capabilities

### Animation Types
- CSS animations and transitions
- Lottie/Bodymovin animations
- Rive interactive animations
- SVG animations (SMIL, CSS, JS)
- SwiftUI animations

### Motion Principles
- Timing and easing
- Anticipation and follow-through
- Secondary action
- Staging and appeal

## CSS Animations

### Keyframe Animation
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.element {
  animation: fadeInUp 0.6s ease-out forwards;
}
```

### Common Easings
```css
/* Smooth deceleration */
ease-out: cubic-bezier(0, 0, 0.2, 1);

/* Smooth acceleration */
ease-in: cubic-bezier(0.4, 0, 1, 1);

/* Bounce effect */
bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* Spring-like */
spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

### Micro-interactions
```css
/* Button press */
.button:active {
  transform: scale(0.95);
  transition: transform 0.1s ease-out;
}

/* Hover lift */
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
  transition: all 0.3s ease-out;
}
```

## SwiftUI Animations

### Basic Animation
```swift
withAnimation(.spring(response: 0.5, dampingFraction: 0.7)) {
    isExpanded.toggle()
}
```

### Animation Modifiers
```swift
.animation(.easeInOut(duration: 0.3), value: someValue)
.transition(.asymmetric(
    insertion: .scale.combined(with: .opacity),
    removal: .opacity
))
```

### Custom Timing
```swift
Animation.timingCurve(0.68, -0.55, 0.265, 1.55, duration: 0.6)
```

## Lottie Animations

### Integration (iOS)
```swift
import Lottie

let animationView = LottieAnimationView(name: "loading")
animationView.loopMode = .loop
animationView.play()
```

### Best Practices
- Keep file size under 100KB
- Use shape layers over images
- Limit to 60fps
- Test on low-end devices

## Motion Guidelines

### Durations
- **Micro** (buttons, toggles): 100-200ms
- **Small** (cards, modals): 200-300ms
- **Medium** (page transitions): 300-500ms
- **Large** (complex sequences): 500-800ms

### Principles
1. **Purpose**: Every animation should have meaning
2. **Performance**: 60fps minimum
3. **Subtlety**: Less is more
4. **Consistency**: Same patterns throughout
5. **Accessibility**: Respect reduced motion

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

```swift
if UIAccessibility.isReduceMotionEnabled {
    // Use simpler animation or none
}
```

## When to Use
- Adding polish to UI interactions
- Creating loading/empty states
- Building onboarding sequences
- Enhancing user feedback
