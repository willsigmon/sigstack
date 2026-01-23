# Synesthesia Color Palette
> Master reference for wsig's grapheme-color synesthesia system
> All tools should use these colors for consistency

## Project Colors (RGB → Hex)

| Project | Emoji | RGB | Hex | Feeling |
|---------|-------|-----|-----|---------|
| **Leavn** | 💜 | 36, 28, 48 | `#241c30` | Deep lavender - spiritual, calm |
| **HubDash** | 🌊 | 20, 31, 41 | `#141f29` | Deep teal - flowing, data |
| **SigStack** | ⚡ | 31, 26, 20 | `#1f1a14` | Warm amber - energy, personal |
| **Overnight** | 🌙 | 20, 15, 31 | `#140f1f` | Deep violet - nocturnal, creative |
| **Media** | 🎬 | 36, 20, 26 | `#24141a` | Rose burgundy - artistic, visual |
| **Scripts** | 🧪 | 15, 31, 20 | `#0f1f14` | Matrix green - experimental |
| **Tip** | 💰 | 26, 31, 15 | `#1a1f0f` | Money lime - transactional |
| **Modcaster** | 🎙️ | 41, 20, 36 | `#291424` | Podcast magenta - audio, voice |
| **Claude** | 🤖 | 31, 23, 15 | `#1f170f` | Terracotta - AI, warmth |
| **n8n** | 🔄 | 28, 20, 15 | `#1c140f` | Workflow brown - automation |
| **BRAIN** | 🧠 | 20, 28, 35 | `#141c23` | Neural blue - memory, data |
| **Client** | 🤝 | 38, 35, 15 | `#26230f` | Client gold - professional |
| **Catalyst** | 🚀 | 18, 28, 41 | `#121c29` | Navy blue - launch, momentum |

## Accent Colors

| Purpose | Hex | Usage |
|---------|-----|-------|
| **Primary Accent** | `#e08151` | Claude terracotta - CTAs, highlights |
| **Success** | `#8cb369` | Green - additions, confirmations |
| **Warning** | `#d4a93a` | Amber - caution, changes |
| **Error** | `#cc6666` | Muted red - deletions, errors |
| **Info** | `#7aa2c9` | Soft blue - information |
| **Purple Accent** | `#9d8ec2` | Lavender - structure, headers |

## Text Colors

| Type | Light Mode | Dark Mode |
|------|------------|-----------|
| **Primary** | `#2d231b` | `#eee8df` |
| **Secondary** | `#5a4a3a` | `#a89888` |
| **Muted** | `#8a7a6a` | `#666058` |
| **Bold** | `#1b140e` | `#fff9f0` |

## Tool Mappings

### iTerm2 / Terminal
- Background changes per project (see Project Colors)
- Tab titles show emoji + project name
- Badge shows emoji only

### Git (Delta)
- File headers: `#e08151` (terracotta)
- Hunk headers: `#9d8ec2` (lavender)
- Added: `#1a2d1f` bg, `#8cb369` line numbers
- Removed: `#2d1a1f` bg, `#cc6666` line numbers

### FZF
- Background: matches current project
- Highlight: `#e08151`
- Pointer: `#e08151`
- Marker: `#8cb369`

### Starship Prompt
- Directory: cyan bold
- Git branch: purple/magenta
- Success: purple `❯`
- Error: red `❯`

### bat
- Theme: gruvbox-dark (closest to palette)

### Ghostty
- Uses iTerm2 synesthesia profiles
- Selection: `#3d59a8`

## Usage Principles

1. **Consistency** - Same project = same color everywhere
2. **Cognitive anchors** - Colors help identify context instantly
3. **Warmth over coldness** - Prefer amber/terracotta over stark blue
4. **Muted backgrounds** - Dark, desaturated backgrounds reduce strain
5. **Bright accents** - Use `#e08151` sparingly for important elements
