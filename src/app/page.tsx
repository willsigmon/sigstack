"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useRef } from "react";

// Magnetic button component
function MagneticButton({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.15);
    y.set((e.clientY - centerY) * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.a>
  );
}

// Simple fade-in component
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
    >
      {children}
    </motion.div>
  );
}

// Tech stack data
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
    logo: "https://cdn.simpleicons.org/openai/white",
    url: "https://www.omi.me/?ref=WILLSIGMON",
  },
];

const voiceStack = [
  {
    name: "Typeless",
    description: "Dictation that actually works",
    logo: "https://cdn.simpleicons.org/keyboardmaestro/white",
    url: "https://www.typeless.com/?via=wsig",
  },
  {
    name: "Wispr Flow",
    description: "Voice-to-code engine",
    logo: "https://cdn.simpleicons.org/deepnote/white",
    url: "https://wisprflow.ai/r?WILL48",
  },
];

const terminalStack = [
  {
    name: "iTerm2",
    description: "Feature-rich macOS terminal",
    logo: "https://cdn.simpleicons.org/iterm2/white",
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

function StackCard({
  name,
  description,
  logo,
  url,
  highlight,
  index,
}: {
  name: string;
  description: string;
  logo: string;
  url: string;
  highlight?: boolean;
  index: number;
}) {
  return (
    <FadeIn delay={index * 0.05}>
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`group block rounded-xl p-5 transition-all duration-200 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.1] ${
          highlight ? "ring-1 ring-purple-500/30" : ""
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-white/10 p-2">
            <img src={logo} alt={name} className="h-full w-full object-contain" />
          </div>
          <div>
            <h3 className="font-medium text-white group-hover:text-purple-300 transition-colors">
              {name}
              {highlight && (
                <span className="ml-2 text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                  Core
                </span>
              )}
            </h3>
            <p className="text-sm text-zinc-500">{description}</p>
          </div>
        </div>
      </Link>
    </FadeIn>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <motion.pre
      className="rounded-lg p-5 overflow-x-auto text-sm bg-[#111] border border-white/[0.06]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <code className="text-purple-300">{children}</code>
    </motion.pre>
  );
}

// Section header icons as SVGs
const SectionIcon = ({ type }: { type: "brain" | "voice" | "terminal" | "cloud" | "plug" }) => {
  const icons = {
    brain: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    voice: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
    terminal: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    cloud: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    plug: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  };
  return <span className="text-purple-400">{icons[type]}</span>;
};

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center">
        {/* Subtle gradient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/[0.03] via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        </div>

        {/* Hero content */}
        <motion.div
          className="relative z-10 mx-auto max-w-4xl px-6 text-center"
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/[0.03] px-4 py-2 text-sm text-zinc-500 border border-white/[0.06] mb-8"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Open Source
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-7xl font-bold tracking-tight mb-6 text-white"
          >
            sigstack
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-zinc-400 max-w-xl mx-auto mb-4"
          >
            My personal <span className="text-white">Claude Code stack</span> for shipping software with AI
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-zinc-600 mb-12 text-sm"
          >
            89 skills · 24 commands · iOS bundle + Apple&apos;s hidden docs · Ready to clone
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center gap-12 mb-12"
          >
            {[
              { label: "Skills", value: "89" },
              { label: "Commands", value: "24" },
              { label: "MCP Servers", value: "15+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-zinc-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <MagneticButton
              href="https://github.com/willsigmon/sigstack"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-black font-medium hover:bg-zinc-100 transition-colors"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              View on GitHub
            </MagneticButton>
            <Link
              href="#quick-start"
              className="inline-flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.06] px-6 py-3 text-white font-medium hover:bg-white/[0.06] transition-colors"
            >
              Quick Start
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* The Stack */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <FadeIn>
          <h2 className="text-2xl font-bold text-white mb-1 text-center">The Stack</h2>
          <p className="text-zinc-600 text-center text-sm mb-16">Tools that power the workflow</p>
        </FadeIn>

        {/* Brain */}
        <div className="mb-12">
          <FadeIn>
            <h3 className="text-sm font-medium text-zinc-400 mb-4 flex items-center gap-2">
              <SectionIcon type="brain" /> The Brain
            </h3>
          </FadeIn>
          <div className="grid gap-3 sm:grid-cols-2">
            {brainStack.map((item, i) => (
              <StackCard key={item.name} {...item} index={i} />
            ))}
          </div>
        </div>

        {/* Voice */}
        <div className="mb-12">
          <FadeIn>
            <h3 className="text-sm font-medium text-zinc-400 mb-4 flex items-center gap-2">
              <SectionIcon type="voice" /> Voice Input
            </h3>
          </FadeIn>
          <div className="grid gap-3 sm:grid-cols-2">
            {voiceStack.map((item, i) => (
              <StackCard key={item.name} {...item} index={i} />
            ))}
          </div>
        </div>

        {/* Terminal */}
        <div className="mb-12">
          <FadeIn>
            <h3 className="text-sm font-medium text-zinc-400 mb-4 flex items-center gap-2">
              <SectionIcon type="terminal" /> Terminal
            </h3>
          </FadeIn>
          <div className="grid gap-3 sm:grid-cols-2">
            {terminalStack.map((item, i) => (
              <StackCard key={item.name} {...item} index={i} />
            ))}
          </div>
        </div>

        {/* Infrastructure */}
        <div className="mb-12">
          <FadeIn>
            <h3 className="text-sm font-medium text-zinc-400 mb-4 flex items-center gap-2">
              <SectionIcon type="cloud" /> Infrastructure
            </h3>
          </FadeIn>
          <div className="grid gap-3 sm:grid-cols-3">
            {infraStack.map((item, i) => (
              <StackCard key={item.name} {...item} index={i} />
            ))}
          </div>
        </div>

        {/* MCP Servers */}
        <FadeIn>
          <h3 className="text-sm font-medium text-zinc-400 mb-4 flex items-center gap-2">
            <SectionIcon type="plug" /> MCP Servers
          </h3>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="rounded-xl p-5 bg-white/[0.03] border border-white/[0.06]">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {mcpServers.map((server) => (
                <div key={server.name} className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  <span className="text-white text-sm">{server.name}</span>
                  <span className="text-zinc-600 text-xs">{server.purpose}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Quick Start */}
      <section id="quick-start" className="mx-auto max-w-4xl px-6 py-24">
        <FadeIn>
          <h2 className="text-2xl font-bold text-white mb-1 text-center">Quick Start</h2>
          <p className="text-zinc-600 text-center text-sm mb-10">Clone and install in 30 seconds</p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="max-w-2xl mx-auto">
            <CodeBlock>{`# Clone and install
git clone https://github.com/willsigmon/sigstack.git && cd sigstack && \\
cp -r skills/* ~/.claude/skills/ && \\
cp -r commands/* ~/.claude/commands/ && \\
mkdir -p ~/.claude/rules && cp -r rules/* ~/.claude/rules/`}</CodeBlock>
          </div>
        </FadeIn>
      </section>

      {/* What's Inside */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <FadeIn>
          <h2 className="text-2xl font-bold text-white mb-1 text-center">What&apos;s Inside</h2>
          <p className="text-zinc-600 text-center text-sm mb-12">Everything you need to ship with Claude Code</p>
        </FadeIn>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "89 Skills",
              description: "iOS, audio/ML, debug, architecture, n8n workflows",
            },
            {
              title: "24 Commands",
              description: "/test, /build, /deploy, /analyze, /cleanup, /git",
            },
            {
              title: "iOS Bundle",
              description: "Sosumi + Ralph Wiggum protocol + Apple docs",
            },
            {
              title: "BRAIN Network",
              description: "Multi-device sync via Tailscale for context",
            },
          ].map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.05}>
              <div className="rounded-xl p-5 bg-white/[0.03] border border-white/[0.06] h-full">
                <h3 className="text-sm font-medium text-white mb-2">{item.title}</h3>
                <p className="text-xs text-zinc-500">{item.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <FadeIn>
          <h2 className="text-2xl font-bold text-white mb-1 text-center">
            Philosophy: Nanobot Healing Swarm
          </h2>
          <p className="text-zinc-600 text-sm max-w-xl mx-auto text-center mb-10">
            My CLAUDE.md instructs Claude to act as a &ldquo;healing swarm of nanobots&rdquo;&mdash;find every bug,
            scrub every infection, optimize every inefficiency.
          </p>
        </FadeIn>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { principle: "Tools first", meaning: "Check MCP/skill before writing code" },
            { principle: "Parallel agents", meaning: "Spawn 20+ agents for complex tasks" },
            { principle: "Context is attention", meaning: "Manage 60% threshold, use /compact" },
            { principle: "Memory graph", meaning: "Use Omi for session continuity" },
          ].map((item, i) => (
            <FadeIn key={item.principle} delay={i * 0.05}>
              <div className="rounded-xl p-5 bg-white/[0.03] border border-white/[0.06] h-full">
                <div className="text-sm font-medium text-white mb-2">{item.principle}</div>
                <div className="text-xs text-zinc-500">{item.meaning}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Support */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <FadeIn>
          <h2 className="text-2xl font-bold text-white mb-1 text-center">Support the Stack</h2>
          <p className="text-zinc-600 text-center text-sm mb-10">
            If this helps you ship faster, consider using my affiliate links
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: "Omi", url: "https://www.omi.me/?ref=WILLSIGMON" },
              { name: "Typeless", url: "https://www.typeless.com/?via=wsig" },
              { name: "Wispr Flow", url: "https://wisprflow.ai/r?WILL48" },
              { name: "Tip the Creator", url: "https://tip.wsig.me" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.url}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-lg bg-white/[0.03] border border-white/[0.06] px-5 py-2.5 text-sm text-white hover:bg-white/[0.06] transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-12">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <div className="font-bold text-white mb-1">sigstack</div>
              <div className="text-xs text-zinc-600">
                Built with Claude Code and ~5,000 hours of figuring out what works.
              </div>
            </div>
            <div className="flex gap-5">
              {[
                { href: "https://x.com/willsigmon", icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /> },
                { href: "https://github.com/willsigmon", icon: <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /> },
                { href: "https://linkedin.com/in/willsigmon", icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /> },
              ].map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  className="text-zinc-600 hover:text-white transition-colors"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    {social.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-zinc-700">
            MIT License — Use it, modify it, make it yours.
          </div>
        </div>
      </footer>
    </div>
  );
}
