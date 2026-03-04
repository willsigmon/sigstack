export interface StackItem {
  readonly name: string;
  readonly description: string;
  readonly logo?: string;
  readonly fallbackLetter?: string;
  readonly bgColor: string;
  readonly glowColor: string;
  readonly url: string;
  readonly highlight?: boolean;
}

export interface McpServer {
  readonly name: string;
  readonly purpose: string;
}

export const coreStack: readonly StackItem[] = [
  {
    name: "Claude Code",
    description: "CLI-first AI coding",
    logo: "https://cdn.simpleicons.org/anthropic/D4A574",
    bgColor: "bg-gradient-to-br from-[#D4A574]/20 to-[#B8956A]/30",
    glowColor: "#D4A574",
    url: "https://claude.ai/code",
    highlight: true,
  },
  {
    name: "Omi",
    description: "AI wearable memory",
    logo: "/icons/omi.png",
    bgColor: "bg-gradient-to-br from-emerald-500/20 to-teal-500/30",
    glowColor: "#10B981",
    url: "https://www.omi.me/?ref=WILLSIGMON",
  },
  {
    name: "Letta",
    description: "Cross-session memory",
    logo: "/icons/letta.png",
    bgColor: "bg-gradient-to-br from-teal-500/20 to-cyan-500/30",
    glowColor: "#14B8A6",
    url: "https://letta.com",
  },
];

export const agentStack: readonly StackItem[] = [
  {
    name: "OpenClaw",
    description: "AI agent gateway",
    logo: "/icons/openclaw.svg",
    bgColor: "bg-gradient-to-br from-violet-500/20 to-purple-600/30",
    glowColor: "#8B5CF6",
    url: "https://github.com/willsigmon/openclaw",
    highlight: true,
  },
  {
    name: "Sled",
    description: "Voice from phone",
    logo: "https://cdn.simpleicons.org/airplayaudio/06B6D4",
    bgColor: "bg-gradient-to-br from-cyan-500/20 to-teal-500/30",
    glowColor: "#06B6D4",
    url: "https://sled.layercode.com",
  },
  {
    name: "Plural",
    description: "Parallel branches",
    logo: "https://cdn.simpleicons.org/git/F05032",
    bgColor: "bg-gradient-to-br from-orange-500/20 to-red-500/30",
    glowColor: "#F05032",
    url: "https://github.com/zhubert/plural",
  },
  {
    name: "Agor",
    description: "Agent canvas",
    logo: "https://cdn.simpleicons.org/figma/F24E1E",
    bgColor: "bg-gradient-to-br from-pink-500/20 to-rose-500/30",
    glowColor: "#F24E1E",
    url: "https://github.com/preset-io/agor",
  },
];

export const terminalStack: readonly StackItem[] = [
  {
    name: "iTerm2",
    description: "macOS terminal",
    logo: "https://cdn.simpleicons.org/iterm2/10B981",
    bgColor: "bg-gradient-to-br from-[#10B981]/20 to-[#059669]/30",
    glowColor: "#10B981",
    url: "https://iterm2.com",
  },
  {
    name: "CleanShot X",
    description: "Screenshots",
    logo: "/icons/cleanshot.png",
    bgColor: "bg-gradient-to-br from-[#5B9BD5]/20 to-[#2B6CB0]/30",
    glowColor: "#5B9BD5",
    url: "https://cleanshot.sjv.io/5520D3",
  },
];

export const infraStack: readonly StackItem[] = [
  {
    name: "GitHub",
    description: "Code & PRs",
    logo: "https://cdn.simpleicons.org/github/1a1814",
    bgColor: "bg-gradient-to-br from-stone-400/20 to-stone-600/30",
    glowColor: "#78716c",
    url: "https://github.com",
  },
  {
    name: "Vercel",
    description: "Deploy",
    logo: "https://cdn.simpleicons.org/vercel/1a1814",
    bgColor: "bg-gradient-to-br from-stone-300/20 to-stone-500/30",
    glowColor: "#78716c",
    url: "https://vercel.com",
  },
  {
    name: "Supabase",
    description: "Postgres & Auth",
    logo: "https://cdn.simpleicons.org/supabase/3FCF8E",
    bgColor: "bg-gradient-to-br from-[#3FCF8E]/20 to-[#22C55E]/30",
    glowColor: "#3FCF8E",
    url: "https://supabase.com",
  },
];

export const allStackItems: readonly StackItem[] = [
  ...coreStack,
  ...agentStack,
  ...infraStack,
  ...terminalStack,
];

export const mcpServers: readonly McpServer[] = [
  { name: "Sosumi", purpose: "Apple docs" },
  { name: "GitHub", purpose: "PRs & issues" },
  { name: "Vercel", purpose: "Deploy" },
  { name: "Supabase", purpose: "Database" },
  { name: "Memory", purpose: "Knowledge graph" },
  { name: "Context7", purpose: "Library docs" },
  { name: "n8n", purpose: "Workflows" },
  { name: "Puppeteer", purpose: "Browser" },
  { name: "Playwright", purpose: "Web automation" },
  { name: "Xcode", purpose: "iOS builds" },
  { name: "Calendar", purpose: "Events" },
  { name: "Clipboard", purpose: "System clipboard" },
  { name: "Notifications", purpose: "macOS alerts" },
  { name: "osascript", purpose: "AppleScript" },
  { name: "Fetch", purpose: "HTTP requests" },
  { name: "Filesystem", purpose: "File access" },
  { name: "Time", purpose: "Timezone" },
  { name: "YouTube", purpose: "Transcripts" },
  { name: "Pandoc", purpose: "Doc conversion" },
  { name: "Greptile", purpose: "Code search" },
  { name: "Firebase", purpose: "Backend" },
  { name: "Stitch", purpose: "UI design" },
  { name: "Glif", purpose: "AI workflows" },
  { name: "iMessage", purpose: "Messages" },
  { name: "Omi", purpose: "Wearable memory" },
  { name: "Marlin Recall", purpose: "Federated memory" },
  { name: "wsiglog", purpose: "Life logging" },
  { name: "SigServe GW", purpose: "Remote access" },
  { name: "Gemini Imagen", purpose: "Image gen" },
  { name: "SigSkills", purpose: "Custom skills" },
];
