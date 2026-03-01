import { URLS } from "@/lib/constants";

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
    logo: "/icons/anthropic.svg",
    bgColor: "bg-gradient-to-br from-[#D4A574]/30 to-[#B8956A]/40",
    glowColor: "#D4A574",
    url: URLS.CLAUDE_CODE,
    highlight: true,
  },
  {
    name: "Omi",
    description: "AI wearable memory",
    logo: "/icons/omi.png",
    bgColor: "bg-gradient-to-br from-emerald-500/30 to-teal-500/40",
    glowColor: "#10B981",
    url: URLS.OMI,
  },
  {
    name: "Letta",
    description: "Cross-session memory",
    logo: "/icons/letta.png",
    bgColor: "bg-gradient-to-br from-teal-500/30 to-cyan-500/40",
    glowColor: "#14B8A6",
    url: URLS.LETTA,
  },
];

export const voiceStack: readonly StackItem[] = [
  {
    name: "Typeless",
    description: "Speech to prompts",
    logo: "https://www.typeless.com/favicon.ico",
    bgColor: "bg-gradient-to-br from-blue-500/30 to-indigo-500/40",
    glowColor: "#3B82F6",
    url: URLS.TYPELESS,
  },
];

export const terminalStack: readonly StackItem[] = [
  {
    name: "iTerm2",
    description: "macOS terminal",
    logo: "/icons/iterm2.svg",
    bgColor: "bg-gradient-to-br from-[#10B981]/30 to-[#059669]/40",
    glowColor: "#10B981",
    url: URLS.ITERM2,
  },
  {
    name: "CleanShot X",
    description: "Screenshots",
    logo: "/icons/cleanshot.png",
    bgColor: "bg-gradient-to-br from-[#5B9BD5]/30 to-[#2B6CB0]/40",
    glowColor: "#5B9BD5",
    url: URLS.CLEANSHOT,
  },
];

export const agentStack: readonly StackItem[] = [
  {
    name: "Plural",
    description: "Parallel branches",
    logo: "/icons/git.svg",
    bgColor: "bg-gradient-to-br from-orange-500/30 to-red-500/40",
    glowColor: "#F05032",
    url: URLS.PLURAL,
  },
  {
    name: "Agor",
    description: "Agent canvas",
    logo: "/icons/figma.svg",
    bgColor: "bg-gradient-to-br from-pink-500/30 to-rose-500/40",
    glowColor: "#F24E1E",
    url: URLS.AGOR,
  },
  {
    name: "Sled",
    description: "Mobile voice",
    logo: "/icons/airplay.svg",
    bgColor: "bg-gradient-to-br from-cyan-500/30 to-teal-500/40",
    glowColor: "#06B6D4",
    url: URLS.SLED,
  },
];

export const infraStack: readonly StackItem[] = [
  {
    name: "GitHub",
    description: "Code & PRs",
    logo: "/icons/github.svg",
    bgColor: "bg-gradient-to-br from-zinc-400/30 to-zinc-600/40",
    glowColor: "#A1A1AA",
    url: URLS.GITHUB,
  },
  {
    name: "Vercel",
    description: "Deploy",
    logo: "/icons/vercel.svg",
    bgColor: "bg-gradient-to-br from-zinc-300/30 to-zinc-500/40",
    glowColor: "#FFFFFF",
    url: URLS.VERCEL,
  },
  {
    name: "Supabase",
    description: "Postgres & Auth",
    logo: "/icons/supabase.svg",
    bgColor: "bg-gradient-to-br from-[#3FCF8E]/30 to-[#22C55E]/40",
    glowColor: "#3FCF8E",
    url: URLS.SUPABASE,
  },
];

// All stacks combined for unified grid rendering
export const allStackItems: readonly StackItem[] = [
  ...coreStack,
  ...voiceStack,
  ...agentStack,
  ...terminalStack,
  ...infraStack,
];

export const mcpServers: readonly McpServer[] = [
  { name: "Sosumi", purpose: "Apple docs" },
  { name: "GitHub", purpose: "PRs & issues" },
  { name: "Vercel", purpose: "Deploy" },
  { name: "Supabase", purpose: "Database" },
  { name: "Letta", purpose: "Cross-session memory" },
  { name: "Context7", purpose: "Library docs" },
  { name: "n8n", purpose: "Workflows" },
  { name: "Memory", purpose: "Knowledge graph" },
  { name: "Puppeteer", purpose: "Browser" },
  { name: "Playwright", purpose: "Web automation" },
  { name: "Chrome DevTools", purpose: "Browser debug" },
  { name: "Repomix", purpose: "Codebase analysis" },
  { name: "Xcode", purpose: "iOS builds" },
  { name: "Calendar", purpose: "Events" },
  { name: "SQLite", purpose: "Local database" },
  { name: "Omi", purpose: "Wearable memory" },
];
