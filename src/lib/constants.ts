// External URLs — single source of truth for all links across the site
export const URLS = {
  // Primary CTAs
  GITHUB_REPO: "https://github.com/willsigmon/sigstack",
  QUICK_START_ANCHOR: "#quick-start",

  // Stack tools — Core
  CLAUDE_CODE: "https://claude.ai/code",
  OMI: "https://www.omi.me/?ref=WILLSIGMON", // affiliate
  // Stack tools — Voice
  TYPELESS: "https://www.typeless.com/?via=wsig", // affiliate

  // Stack tools — Agent
  PLURAL: "https://github.com/zhubert/plural",
  AGOR: "https://github.com/preset-io/agor",
  SLED: "https://sled.layercode.com",

  // Stack tools — Terminal
  ITERM2: "https://iterm2.com",
  CLEANSHOT: "https://cleanshot.sjv.io/5520D3", // affiliate

  // Stack tools — Infrastructure
  GITHUB: "https://github.com",
  VERCEL: "https://vercel.com",
  SUPABASE: "https://supabase.com",

  // Showcase
  LEAVN: "https://leavn.app",

  // Support / Affiliate
  TIP_JAR: "https://tip.wsig.me",

  // Social / Footer
  PERSONAL_SITE: "https://willsigmon.media",
  TWITTER: "https://x.com/willsigmon",
  GITHUB_PROFILE: "https://github.com/willsigmon",
  LINKEDIN: "https://linkedin.com/in/willsigmon",

  // API
  SUBSCRIBE_API: "/api/subscribe",
} as const;

// Site metadata constants
export const SITE = {
  NAME: "sigstack",
  DOMAIN: "sigstack.dev",
  URL: "https://sigstack.dev",
  VERSION: "4.1",
  CODENAME: "Marlin",
  LAST_UPDATED: "Mar 2026",
  TAGLINE: "My personal Claude Code stack for shipping software with AI",
  STATS_TAGLINE: "84 skills · 36 plugins · 27 MCP servers · Cowork Plugins architecture · Ready to clone",
  LICENSE: "MIT License — Use it, modify it, make it yours.",
  BUILT_WITH: "Built with Claude Code and ~5,000 hours of figuring out what works.",
} as const;

// Hero stats
export const HERO_STATS = [
  { label: "Plugins", value: "36", color: "#f97316" },
  { label: "Skills", value: "84", color: "#ec4899" },
  { label: "MCP Servers", value: "27", color: "#d4a574" },
] as const;

// Quick start code snippet
export const QUICK_START_CODE = `# Clone sigstack
git clone https://github.com/willsigmon/sigstack.git ~/.sigstack

# Run setup (installs plugins to Claude Code)
cd ~/.sigstack && ./setup.sh

# Start Claude Code
claude`;

// Core plugins
export const CORE_PLUGINS = [
  { title: "ios-dev", description: "Swift, SwiftUI, Xcode, CloudKit, SwiftData", color: "#f97316" },
  { title: "app-dev", description: "Features, audio, sync, ops, preferences", color: "#d4a574" },
  { title: "dev-essentials", description: "Glif, Resend, performance, multi-agent coordination", color: "#ec4899" },
  { title: "superclaude", description: "Meta-orchestration, agents, /spawn, /analyze", color: "#c2956a" },
  { title: "work", description: "Enterprise apps, databases, dashboards", color: "#f97316" },
  { title: "media", description: "Podcasts, audio, RSS, streaming", color: "#b8956a" },
] as const;

// Workflow patterns
export const WORKFLOW_PATTERNS = [
  { principle: "Plan first", meaning: "Complex tasks -> plan mode, then one-shot implement" },
  { principle: "Self-improving docs", meaning: "After corrections: update docs to prevent repeats" },
  { principle: "Autonomous fixing", meaning: "Paste error + 'fix' -- minimal micromanagement" },
  { principle: "Subagents", meaning: "Offload subtasks, keep main context clean" },
] as const;

// Network cards
export const NETWORK_CARDS = [
  {
    title: "SigServe — The Brain",
    text: "A Mac Studio M2 Max running 30+ services is the single source of truth. All Claude interfaces (Web, Desktop, Code) route through SigServe via MCP Gateway + Tailscale Funnels. Accessible from anywhere.",
  },
  {
    title: "Multi-Device Sync",
    text: "sigstack-sync pushes config hourly to SigStudio and SigAir. git-autopush commits every 30s. Claude Desktop configs, shell aliases, and SSH keys are auto-deployed to all machines.",
  },
  {
    title: "Voice & Chat Everywhere",
    text: "Omi captures conversations. Typeless converts speech to prompts. Marlin Router auto-responds across iMessage group chats using dual-LLM (Claude + OpenAI). Voice calls via Twilio with realtime STT/TTS.",
  },
  {
    title: "Federated Memory",
    text: "marlin-recall federates memory across MCP knowledge graph, contacts DB, Omi conversation history, and persistent memory files. Context survives across sessions, devices, and interfaces.",
  },
] as const;

// Support links
export const SUPPORT_LINKS: readonly {
  readonly name: string;
  readonly url: string;
  readonly emoji: string;
  readonly highlight?: boolean;
}[] = [
  { name: "Omi", url: URLS.OMI, emoji: "🧠" },
  { name: "Typeless", url: URLS.TYPELESS, emoji: "🎤" },
  { name: "Tip the Creator", url: URLS.TIP_JAR, highlight: true, emoji: "☕" },
];

// Newsletter types
export const NEWSLETTER_CONFIG = {
  AI_NEWS: {
    title: "AI & Tech News",
    description: "Claude, GPT, Gemini, dev tools, and the future of AI-assisted development. Fresh stories only — nothing older than 24 hours.",
    emoji: "🤖",
    gradient: "from-purple-500/20 to-blue-500/20",
    borderColor: "border-purple-500/30",
    accentColor: "purple" as const,
    newsletterType: "ai_news",
  },
  PERSONAL_DIGEST: {
    title: "Personal Digest",
    description: "Apple, podcasts, food, local NC news, Disney parks, and everything else I follow. The full RSS experience.",
    emoji: "📰",
    gradient: "from-orange-500/20 to-pink-500/20",
    borderColor: "border-orange-500/30",
    accentColor: "orange" as const,
    newsletterType: "personal_digest",
  },
} as const;

// Navigation sections (used by Header + useActiveSection)
export const NAV_SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "the-stack", label: "The Stack" },
  { id: "the-network", label: "Network" },
  { id: "quick-start", label: "Quick Start" },
  { id: "whats-inside", label: "Inside" },
  { id: "philosophy", label: "Philosophy" },
  { id: "showcase", label: "Showcase" },
  { id: "newsletter", label: "Newsletter" },
  { id: "support", label: "Support" },
] as const;

// Social links for footer
export const SOCIAL_LINKS = [
  {
    href: URLS.PERSONAL_SITE,
    label: "Visit Will Sigmon's website",
    iconPath: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
    stroke: true,
  },
  {
    href: URLS.TWITTER,
    label: "Follow on X (Twitter)",
    iconPath: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    stroke: false,
  },
  {
    href: URLS.GITHUB_PROFILE,
    label: "View GitHub profile",
    iconPath: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z",
    stroke: false,
  },
  {
    href: URLS.LINKEDIN,
    label: "Connect on LinkedIn",
    iconPath: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
    stroke: false,
  },
  {
    href: URLS.TIP_JAR,
    label: "Leave a tip",
    iconPath: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    stroke: true,
  },
] as const;
