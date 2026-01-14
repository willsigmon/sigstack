import Link from "next/link";

// Tech stack items with their logos (using simple-icons CDN or inline SVGs)
const brainStack = [
  {
    name: "Claude Code",
    description: "CLI-first AI coding with Opus 4.5",
    logo: "https://cdn.simpleicons.org/anthropic/white",
    url: "https://claude.ai/code",
    highlight: true,
  },
  {
    name: "Omi",
    description: "AI wearable + MCP for memory persistence",
    logo: "https://www.omi.me/cdn/shop/files/OMI_LOGO_WEB_80ec2009-6d2f-43b9-a81d-7ae7b7fa6cf0.png?v=1732038253&width=500",
    url: "https://www.omi.me/?ref=WILLSIGMON",
  },
];

const voiceStack = [
  {
    name: "Typeless",
    description: "Dictation that actually works",
    logo: "https://framerusercontent.com/images/FJhzz7gLCB9nAqG8cANzU0gT8.png",
    url: "https://www.typeless.com/?via=wsig",
  },
  {
    name: "Wispr Flow",
    description: "Voice-to-code engine",
    logo: "https://wisprflow.ai/_next/image?url=%2Fflow-icon.png&w=128&q=75",
    url: "https://wisprflow.ai/r?WILL48",
  },
];

const terminalStack = [
  {
    name: "iTerm2",
    description: "Feature-rich macOS terminal",
    logo: "https://iterm2.com/img/logo2x.jpg",
    url: "https://iterm2.com",
  },
];

const infraStack = [
  {
    name: "GitHub",
    description: "Code, PRs, Actions",
    logo: "https://cdn.simpleicons.org/github/white",
    url: "https://github.com",
  },
  {
    name: "Vercel",
    description: "Deploy frontend + serverless",
    logo: "https://cdn.simpleicons.org/vercel/white",
    url: "https://vercel.com",
  },
  {
    name: "Supabase",
    description: "Postgres + Auth + Realtime",
    logo: "https://cdn.simpleicons.org/supabase/white",
    url: "https://supabase.com",
  },
];

const mcpServers = [
  { name: "Omi", purpose: "Memory persistence" },
  { name: "Sosumi", purpose: "Apple documentation" },
  { name: "GitHub", purpose: "PR reviews, issues" },
  { name: "SQLite", purpose: "Local database" },
  { name: "Puppeteer", purpose: "Browser automation" },
];

const stats = [
  { label: "Skills", value: "89", color: "text-blue-400" },
  { label: "Commands", value: "24", color: "text-green-400" },
  { label: "MCP Servers", value: "15+", color: "text-purple-400" },
];

function StackCard({
  name,
  description,
  logo,
  url,
  highlight,
}: {
  name: string;
  description: string;
  logo: string;
  url: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group glass rounded-xl p-5 transition-all hover:scale-[1.02] ${
        highlight ? "glow-purple ring-1 ring-purple-500/30" : "hover:glow-blue"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-white/10 p-2">
          <img
            src={logo}
            alt={name}
            className="h-full w-full object-contain"
          />
        </div>
        <div>
          <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
            {name}
            {highlight && (
              <span className="ml-2 text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                Core
              </span>
            )}
          </h3>
          <p className="text-sm text-zinc-400">{description}</p>
        </div>
      </div>
    </Link>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="code-block rounded-lg p-4 overflow-x-auto text-sm">
      <code className="text-green-400">{children}</code>
    </pre>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-emerald-900/20 animate-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-zinc-400 ring-1 ring-white/10 mb-8">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Open Source
            </div>

            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent mb-6">
              sigstack
            </h1>

            <p className="text-xl sm:text-2xl text-zinc-400 max-w-2xl mx-auto mb-4">
              My personal <span className="text-white">Claude Code stack</span> for shipping software with AI
            </p>

            <p className="text-zinc-500 mb-8">
              89 skills &bull; 24 commands &bull; iOS bundle + Apple&apos;s hidden docs &bull; Ready to clone
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-8 mb-12">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className={`text-4xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-zinc-500">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://github.com/willsigmon/sigstack"
                target="_blank"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3 text-black font-medium hover:bg-zinc-200 transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                View on GitHub
              </Link>
              <Link
                href="#quick-start"
                className="inline-flex items-center justify-center rounded-full border border-zinc-700 px-8 py-3 text-white font-medium hover:bg-white/5 transition-colors"
              >
                Quick Start
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Stack */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">The Stack</h2>
        <p className="text-zinc-500 text-center mb-12">Tools that power the workflow</p>

        {/* Brain */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold text-zinc-300 mb-4 flex items-center gap-2">
            <span className="text-2xl">🧠</span> The Brain
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {brainStack.map((item) => (
              <StackCard key={item.name} {...item} />
            ))}
          </div>
        </div>

        {/* Voice */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold text-zinc-300 mb-4 flex items-center gap-2">
            <span className="text-2xl">🎤</span> Voice Input
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {voiceStack.map((item) => (
              <StackCard key={item.name} {...item} />
            ))}
          </div>
        </div>

        {/* Terminal */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold text-zinc-300 mb-4 flex items-center gap-2">
            <span className="text-2xl">💻</span> Terminal
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {terminalStack.map((item) => (
              <StackCard key={item.name} {...item} />
            ))}
          </div>
        </div>

        {/* Infrastructure */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold text-zinc-300 mb-4 flex items-center gap-2">
            <span className="text-2xl">☁️</span> Infrastructure
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {infraStack.map((item) => (
              <StackCard key={item.name} {...item} />
            ))}
          </div>
        </div>

        {/* MCP Servers */}
        <div>
          <h3 className="text-lg font-semibold text-zinc-300 mb-4 flex items-center gap-2">
            <span className="text-2xl">🔌</span> MCP Servers
          </h3>
          <div className="glass rounded-xl p-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {mcpServers.map((server) => (
                <div key={server.name} className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-white font-medium">{server.name}</span>
                  <span className="text-zinc-500 text-sm">{server.purpose}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section id="quick-start" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Quick Start</h2>
        <p className="text-zinc-500 text-center mb-8">Clone and install in 30 seconds</p>

        <div className="max-w-3xl mx-auto">
          <CodeBlock>{`# Clone and install
git clone https://github.com/willsigmon/sigstack.git && cd sigstack && \\
cp -r skills/* ~/.claude/skills/ && \\
cp -r commands/* ~/.claude/commands/ && \\
mkdir -p ~/.claude/rules && cp -r rules/* ~/.claude/rules/`}</CodeBlock>
        </div>
      </section>

      {/* What&apos;s Inside */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">What&apos;s Inside</h2>
        <p className="text-zinc-500 text-center mb-12">Everything you need to ship with Claude Code</p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: "🧠",
              title: "89 Skills",
              description: "iOS, audio/ML, debug, architecture, n8n workflows, and more",
            },
            {
              icon: "⚡",
              title: "24 Commands",
              description: "/test, /build, /deploy, /analyze, /cleanup, /git...",
            },
            {
              icon: "🍎",
              title: "iOS Bundle",
              description: "Sosumi + Ralph Wiggum protocol + 20 Apple internal docs",
            },
            {
              icon: "🔮",
              title: "BRAIN Network",
              description: "Multi-device sync via Tailscale for Claude context",
            },
          ].map((item) => (
            <div key={item.title} className="glass rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-zinc-400">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="glass rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Philosophy: Nanobot Healing Swarm
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto mb-8">
            My CLAUDE.md instructs Claude to act as a &ldquo;healing swarm of nanobots&rdquo;&mdash;find every bug,
            scrub every infection, optimize every inefficiency.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-left">
            {[
              { principle: "Tools first", meaning: "Check MCP/skill before writing code" },
              { principle: "Parallel agents", meaning: "Spawn 20+ agents for complex tasks" },
              { principle: "Context is attention", meaning: "Manage 60% threshold, use /compact" },
              { principle: "Memory graph", meaning: "Use Omi for session continuity" },
            ].map((item) => (
              <div key={item.principle} className="bg-white/5 rounded-lg p-4">
                <div className="font-semibold text-white mb-1">{item.principle}</div>
                <div className="text-sm text-zinc-500">{item.meaning}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Support the Stack</h2>
        <p className="text-zinc-500 text-center mb-8">
          If this helps you ship faster, consider using my affiliate links
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          {[
            { name: "Omi", url: "https://www.omi.me/?ref=WILLSIGMON", icon: "🧠" },
            { name: "Typeless", url: "https://www.typeless.com/?via=wsig", icon: "🎤" },
            { name: "Wispr Flow", url: "https://wisprflow.ai/r?WILL48", icon: "🗣" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.url}
              target="_blank"
              className="inline-flex items-center gap-2 glass rounded-full px-6 py-3 hover:bg-white/10 transition-colors"
            >
              <span>{item.icon}</span>
              <span className="text-white">{item.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <div className="font-bold text-white mb-1">sigstack</div>
              <div className="text-sm text-zinc-500">
                Built with Claude Code Opus 4.5 and ~5,000 hours of figuring out what works.
              </div>
            </div>
            <div className="flex gap-6">
              <Link href="https://x.com/willsigmon" target="_blank" className="text-zinc-400 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              <Link href="https://github.com/willsigmon" target="_blank" className="text-zinc-400 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="https://linkedin.com/in/willsigmon" target="_blank" className="text-zinc-400 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-zinc-600">
            MIT License — Use it, modify it, make it yours.
          </div>
        </div>
      </footer>
    </div>
  );
}
