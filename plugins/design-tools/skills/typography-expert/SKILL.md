---
name: Typography Expert
description: Typography - font pairing, licensing, web fonts, iOS/Android font integration
allowed-tools: Read, Edit, Bash, WebFetch
model: sonnet
---

# Typography Expert

Choose and implement fonts that elevate your design.

## Font Sources

| Source | Commercial Use | Pricing |
|--------|---------------|---------|
| Google Fonts | Free | Free |
| Adobe Fonts | With CC | $55/mo (CC) |
| Fontshare | Free | Free |
| Font Squirrel | Varies | Free |
| MyFonts | License | Per font |
| Type.io | Pairing tool | Free |

## Quick Font Pairings

### Modern App
```
Headings: Inter, SF Pro, Satoshi
Body: Inter, System UI, -apple-system
```

### Editorial
```
Headings: Playfair Display, Freight, Tiempos
Body: Georgia, Lora, Source Serif
```

### Tech/Startup
```
Headings: Space Grotesk, Manrope, General Sans
Body: Inter, Plus Jakarta Sans, DM Sans
```

### Friendly/Casual
```
Headings: Nunito, Quicksand, Poppins
Body: Open Sans, Lato, Rubik
```

## iOS Implementation

### System Fonts (Recommended)
```swift
// San Francisco (default)
Text("Hello")
    .font(.largeTitle)
    .fontWeight(.bold)

// Dynamic Type
Text("Body text")
    .font(.body)

// Custom size with weight
Text("Custom")
    .font(.system(size: 24, weight: .semibold, design: .rounded))
```

### Custom Fonts
```swift
// 1. Add .ttf/.otf to Xcode project
// 2. Add to Info.plist: Fonts provided by application

// 3. Use in SwiftUI
Text("Custom Font")
    .font(.custom("Satoshi-Bold", size: 24))

// With relative sizing
Text("Scales")
    .font(.custom("Satoshi-Regular", size: 16, relativeTo: .body))
```

### Font Extension Pattern
```swift
extension Font {
    static let appTitle = Font.custom("Satoshi-Bold", size: 32)
    static let appHeadline = Font.custom("Satoshi-Medium", size: 20)
    static let appBody = Font.custom("Satoshi-Regular", size: 16)
    static let appCaption = Font.custom("Satoshi-Regular", size: 12)
}

// Usage
Text("Title").font(.appTitle)
```

## Web Implementation

### Google Fonts
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

```css
body {
  font-family: 'Inter', system-ui, sans-serif;
}
```

### Self-Hosted (Faster)
```css
@font-face {
  font-family: 'Satoshi';
  src: url('/fonts/Satoshi-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

### Variable Fonts
```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-VariableFont.woff2') format('woff2-variations');
  font-weight: 100 900;
}

.heading {
  font-weight: 650;  /* Any value 100-900 */
}
```

## Typography Scale

### Recommended Scale
```
xs:    12px  (0.75rem)
sm:    14px  (0.875rem)
base:  16px  (1rem)
lg:    18px  (1.125rem)
xl:    20px  (1.25rem)
2xl:   24px  (1.5rem)
3xl:   30px  (1.875rem)
4xl:   36px  (2.25rem)
5xl:   48px  (3rem)
```

### Tailwind
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      serif: ['Georgia', 'serif'],
    }
  }
}
```

## Accessibility

### Minimum Sizes
```
Body text: 16px minimum
Captions: 12px minimum
Touch targets: 44pt minimum height
```

### Dynamic Type (iOS)
```swift
// Always support Dynamic Type
Text("Accessible")
    .dynamicTypeSize(.large ... .accessibility5)
```

### Line Height
```css
/* Good readability */
body {
  line-height: 1.5;  /* 150% */
}

h1, h2, h3 {
  line-height: 1.2;  /* 120% for headings */
}
```

## Licensing Checklist

- [ ] Commercial use allowed?
- [ ] App embedding allowed?
- [ ] Web use allowed?
- [ ] How many pageviews/installs?
- [ ] Desktop use if needed?
- [ ] Modification allowed?

Use when: Font selection, typography implementation, font licensing, design systems
