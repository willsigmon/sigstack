"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

import { A1, A2, GRAD, GLOW } from "@/lib/palette";
import { SITE, HERO_STATS, CORE_PLUGINS, WORKFLOW_PATTERNS, NETWORK_CARDS, SOCIAL_LINKS } from "@/lib/constants";
import { coreStack, agentStack, infraStack, terminalStack, mcpServers } from "@/data/stack";

import { FadeIn } from "@/components/ui/FadeIn";
import { BouncyButton } from "@/components/ui/BouncyButton";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { StackCard } from "@/components/shared/StackCard";
import { FloatingAccents } from "@/components/shared/FloatingAccents";
import { FloatingParticles } from "@/components/shared/FloatingParticles";
import { SectionIcon } from "@/components/shared/SectionIcon";
import { NewsletterCard } from "@/components/shared/NewsletterCard";
import { StackingTitle, StaticTitle } from "@/components/shared/StackingTitle";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const [animationKey, setAnimationKey] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [shouldSkipAnimation, setShouldSkipAnimation] = useState(true);

  useEffect(() => {
    setIsClient(true);
    const hasVisited = localStorage.getItem("sigstack-visited");
    if (!hasVisited) {
      setShouldSkipAnimation(false);
      localStorage.setItem("sigstack-visited", "true");
    }
  }, []);

  const replayAnimation = () => { setAnimationKey(prev => prev + 1); setShouldSkipAnimation(false); };

  const allStack = [...coreStack, ...agentStack, ...infraStack, ...terminalStack];

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      {/* Paper texture + vignette */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        <svg style={{ position: "absolute", width: 0, height: 0 }}>
          <filter id="paper-grain">
            <feTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </svg>
        <div className="paper-grain" style={{ filter: "url(#paper-grain)" }} />
        <div className="vignette" />
      </div>

      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full filter blur-[120px]" style={{ background: `${A1}12`, animation: "breathe 10s ease-in-out infinite" }} />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full filter blur-[100px]" style={{ background: `${A2}10`, animation: "breathe 14s ease-in-out infinite 2s" }} />
        <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full filter blur-[80px]" style={{ background: `${A1}08`, animation: "breathe 12s ease-in-out infinite 4s" }} />
        <FloatingParticles />
      </div>

      {/* Global keyframes */}
      <style jsx global>{`
        @keyframes breathe { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 0.9; transform: scale(1.05); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes pulse-glow { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
      `}</style>

      {/* ═══ Hero ═══ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center" style={{ zIndex: 1 }}>
        <motion.div className="relative z-10 mx-auto max-w-5xl px-6 text-center" style={{ opacity: heroOpacity, scale: heroScale }}>
          <div className="mb-6 h-[240px] sm:h-[320px] flex items-center justify-center" style={{ overflow: "visible" }}>
            {isClient ? (
              <StackingTitle key={animationKey} onComplete={() => {}} onReplay={replayAnimation} skipAnimation={shouldSkipAnimation && animationKey === 0} />
            ) : (
              <StaticTitle />
            )}
          </div>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="max-w-2xl mx-auto mb-4" style={{ color: "var(--sub)", fontSize: "clamp(1.125rem, 2vw + 0.5rem, 1.5rem)", lineHeight: 1.4 }}>
            Now built on <span className="font-semibold drop-shadow-md" style={{ color: "var(--foreground)" }}>Cowork Plugins</span> — Anthropic&apos;s official plugin architecture
          </motion.p>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="mb-12 tracking-wide" style={{ color: "var(--muted)", fontSize: "clamp(0.875rem, 1.5vw + 0.25rem, 1rem)" }}>
            <span className="font-medium" style={{ color: A1 }}>Mar 2026:</span> {SITE.STATS_TAGLINE.split("·").slice(0, 3).join("·")} &middot; v{SITE.VERSION} &quot;{SITE.CODENAME}&quot;
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="flex justify-center gap-6 sm:gap-10 md:gap-16 mb-10 sm:mb-14">
            {HERO_STATS.map((stat) => (
              <motion.div key={stat.label} className="text-center" whileHover={{ scale: 1.1, y: -5 }} transition={{ type: "spring", stiffness: 400 }}>
                <div className="font-black drop-shadow-lg" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif", fontStyle: "italic", fontSize: "clamp(2.5rem, 5vw + 1rem, 4.5rem)", lineHeight: 1, color: stat.color }}>{stat.value}</div>
                <div className="mt-2 tracking-widest uppercase" style={{ color: "var(--muted)", fontSize: "clamp(0.6rem, 1vw, 0.75rem)" }}>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center px-4">
            <BouncyButton href="https://github.com/willsigmon/sigstack" glow className="inline-flex items-center justify-center gap-2 sm:gap-3 rounded-full px-6 sm:px-9 py-4 sm:py-5 font-bold text-base sm:text-lg shadow-2xl border-2" style={{ background: GRAD, color: "#fff", borderColor: `${A1}50` }}>
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
              Clone the Stack
            </BouncyButton>
            <motion.a href="#quick-start" className="group inline-flex items-center justify-center gap-2 rounded-full border-2 px-6 sm:px-9 py-4 sm:py-5 font-bold text-base sm:text-lg transition-all" style={{ borderColor: "var(--border)", color: "var(--foreground)", background: "var(--surface)" }} whileHover={{ scale: 1.05, y: -3, boxShadow: `0 20px 40px ${GLOW}` }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
              Quick Start
              <motion.span animate={{ y: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              </motion.span>
            </motion.a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ The Stack ═══ */}
      <section className="relative mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16" style={{ zIndex: 1 }}>
        <FloatingAccents count={8} color="orange" />
        <FadeIn>
          <h2 className="text-3xl sm:text-4xl font-black mb-2 text-center" style={{ color: "var(--foreground)", fontFamily: "var(--font-instrument-serif), Georgia, serif", fontStyle: "italic" }}>The Stack</h2>
          <p className="text-sm sm:text-base text-center mb-8 sm:mb-10" style={{ color: "var(--muted)" }}>Tools that power the workflow</p>
        </FadeIn>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
          {allStack.map((item, i) => <StackCard key={item.name} {...item} index={i} />)}
        </div>
        <div className="mt-8 sm:mt-10">
          <h3 className="text-xs sm:text-sm font-medium mb-4 uppercase tracking-widest text-center" style={{ color: "var(--muted)" }}>MCP Servers</h3>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {mcpServers.map((server, i) => (
              <motion.div key={server.name} className="flex items-center gap-2 px-4 py-2 rounded-full border" style={{ background: "var(--surface)", borderColor: "var(--border)" }} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.05 }} transition={{ delay: i * 0.03 }} viewport={{ once: true }}>
                <div className="h-2 w-2 rounded-full animate-pulse-glow" style={{ backgroundColor: A1 }} />
                <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{server.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ The Network ═══ */}
      <section className="relative mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-12" style={{ zIndex: 1 }}>
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 text-center flex items-center justify-center gap-2 sm:gap-3" style={{ color: "var(--foreground)", fontFamily: "var(--font-instrument-serif), Georgia, serif", fontStyle: "italic" }}>
            <SectionIcon type="server" /> The Network
          </h2>
          <p className="text-xs sm:text-sm text-center mb-8 sm:mb-12" style={{ color: "var(--muted)" }}>How everything syncs together</p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="rounded-xl sm:rounded-2xl p-5 sm:p-8 border overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            <div className="h-1 -mx-5 sm:-mx-8 -mt-5 sm:-mt-8 mb-5 sm:mb-8" style={{ background: GRAD }} />
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
              {NETWORK_CARDS.map((item) => (
                <div key={item.title}>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3" style={{ color: "var(--foreground)" }}>{item.title}</h3>
                  <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ═══ Quick Start ═══ */}
      <section id="quick-start" className="relative mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16" style={{ zIndex: 1 }}>
        <FloatingAccents count={5} color="warm" />
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 text-center" style={{ color: "var(--foreground)", fontFamily: "var(--font-instrument-serif), Georgia, serif", fontStyle: "italic" }}>Quick Start</h2>
          <p className="text-xs sm:text-sm text-center mb-8 sm:mb-12" style={{ color: "var(--muted)" }}>Install the full plugin suite in seconds</p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="max-w-3xl mx-auto space-y-4">
            <CodeBlock>{`# Install via Claude Code CLI\nclaude plugins install sigstack\n\n# Or clone and symlink manually\ngit clone https://github.com/willsigmon/sigstack.git\nln -s $(pwd)/sigstack/plugins/* ~/.claude/plugins/cache/sigstack/`}</CodeBlock>
            <p className="text-xs text-center" style={{ color: "var(--muted)" }}>
              Built on the official <a href="https://claude.com/blog/cowork-plugins" target="_blank" style={{ color: A1 }} className="hover:opacity-80">Cowork Plugins</a> architecture
            </p>
          </div>
        </FadeIn>
      </section>

      {/* ═══ Core Plugins ═══ */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16" style={{ zIndex: 1 }}>
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 text-center" style={{ color: "var(--foreground)", fontFamily: "var(--font-instrument-serif), Georgia, serif", fontStyle: "italic" }}>Core Plugins</h2>
          <p className="text-xs sm:text-sm text-center mb-6 sm:mb-8" style={{ color: "var(--muted)" }}>6 domain plugins + 17 from community marketplaces — organized by context</p>
        </FadeIn>
        <div className="grid gap-3 sm:gap-5 grid-cols-2 lg:grid-cols-3">
          {CORE_PLUGINS.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.1}>
              <motion.div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 border h-full overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }} whileHover={{ y: -5, scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
                <div className="h-1 -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 mb-3 sm:mb-5" style={{ background: `linear-gradient(135deg, ${item.color}, ${A2})` }} />
                <h3 className="text-sm sm:text-lg font-bold mb-1 sm:mb-2" style={{ color: "var(--foreground)" }}>{item.title}</h3>
                <p className="text-[10px] sm:text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{item.description}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ═══ Workflow Patterns ═══ */}
      <section className="relative mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16" style={{ zIndex: 1 }}>
        <FloatingAccents count={6} color="pink" />
        <FadeIn>
          <motion.div className="rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-14 border relative overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }} whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 200 }}>
            <motion.div className="absolute top-0 left-0 right-0 h-1" style={{ background: GRAD }} />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-3 sm:mb-4 text-center" style={{ color: "var(--foreground)", fontFamily: "var(--font-instrument-serif), Georgia, serif", fontStyle: "italic" }}>Workflow Patterns</h2>
            <p className="text-xs sm:text-sm max-w-2xl mx-auto text-center mb-8 sm:mb-12" style={{ color: "var(--muted)" }}>Team-validated patterns from the Claude Code team. Plan first, improve docs, fix autonomously.</p>
            <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
              {WORKFLOW_PATTERNS.map((item, i) => (
                <motion.div key={item.principle} className="rounded-lg sm:rounded-xl p-3 sm:p-5 border" style={{ background: "var(--background)", borderColor: "var(--border)" }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} whileHover={{ y: -3 }}>
                  <div className="font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1" style={{ color: "var(--foreground)" }}>{item.principle}</div>
                  <div className="text-[10px] sm:text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{item.meaning}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </FadeIn>
      </section>

      {/* ═══ Showcase — Leavn ═══ */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12" style={{ zIndex: 1 }}>
        <FadeIn>
          <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            <div className="h-1 -mx-4 sm:-mx-6 md:-mx-8 -mt-4 sm:-mt-6 md:-mt-8 mb-4 sm:mb-6 md:mb-8" style={{ background: GRAD }} />
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <motion.div className="flex-shrink-0" whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                <Image src="/leavn-icon.png" alt="Leavn App Icon" width={64} height={64} className="rounded-[14px] shadow-lg w-14 h-14 sm:w-16 sm:h-16" />
              </motion.div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-[10px] sm:text-xs mb-0.5 sm:mb-1" style={{ color: "var(--muted)" }}>Built with this stack</p>
                <h3 className="text-base sm:text-lg font-bold mb-0.5 sm:mb-1" style={{ color: "var(--foreground)" }}>Leavn.app</h3>
                <p className="text-xs sm:text-sm max-w-md" style={{ color: "var(--muted)" }}>A Bible study app built ~90% with Claude Code using this stack.</p>
              </div>
              <motion.a href="https://leavn.app" target="_blank" className="inline-flex items-center gap-2 rounded-full px-4 sm:px-5 py-2 sm:py-2.5 border text-xs sm:text-sm font-medium" style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                View App
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </motion.a>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ═══ Newsletter ═══ */}
      <section className="relative mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16" style={{ zIndex: 1 }}>
        <FloatingAccents count={5} color="amber" />
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 text-center" style={{ color: "var(--foreground)", fontFamily: "var(--font-instrument-serif), Georgia, serif", fontStyle: "italic" }}>The SigStack Newsletter</h2>
          <p className="text-xs sm:text-sm text-center mb-8 sm:mb-10" style={{ color: "var(--muted)" }}>Curated news delivered to your inbox. Choose your flavor.</p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            <NewsletterCard title="AI & Tech News" description="Claude, GPT, Gemini, dev tools, and the future of AI-assisted development. Fresh stories only -- nothing older than 24 hours." emoji="🤖" borderColor={`${A1}30`} accentColor="orange" newsletterType="ai_news" />
            <NewsletterCard title="Personal Digest" description="Apple, podcasts, food, local NC news, Disney parks, and everything else I follow. The full RSS experience." emoji="📰" borderColor={`${A2}30`} accentColor="pink" newsletterType="personal_digest" />
          </div>
        </FadeIn>
      </section>

      {/* ═══ Support ═══ */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16" style={{ zIndex: 1 }}>
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 text-center" style={{ color: "var(--foreground)", fontFamily: "var(--font-instrument-serif), Georgia, serif", fontStyle: "italic" }}>Support the Stack</h2>
          <p className="text-xs sm:text-sm text-center mb-6 sm:mb-8" style={{ color: "var(--muted)" }}>If this helps you ship faster, consider using my affiliate links</p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-5">
            {[
              { name: "Omi", url: "https://www.omi.me/?ref=WILLSIGMON", emoji: "🧠", highlight: false },
              { name: "Typeless", url: "https://www.typeless.com/?via=wsig", emoji: "🎤", highlight: false },
              { name: "Tip the Creator", url: "https://tip.wsig.me", highlight: true, emoji: "☕" },
            ].map((item, i) => (
              <motion.a key={item.name} href={item.url} target="_blank" className="group relative inline-flex items-center gap-2 sm:gap-3 rounded-full px-4 sm:px-7 py-3 sm:py-4 font-semibold text-sm sm:text-base overflow-hidden" style={{ background: item.highlight ? GRAD : "var(--surface)", color: item.highlight ? "#fff" : "var(--foreground)", border: item.highlight ? "none" : "2px solid var(--border)", boxShadow: item.highlight ? `0 8px 30px ${GLOW}` : undefined }} whileHover={{ scale: 1.08, y: -4, boxShadow: item.highlight ? `0 25px 50px ${GLOW}` : "0 20px 40px rgba(0,0,0,0.06)" }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 12, delay: i * 0.05 }}>
                {item.highlight && <motion.div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12" animate={{ translateX: ["-100%", "200%"] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 2, ease: "easeOut" }} />}
                <motion.span className="text-lg sm:text-xl" animate={item.highlight ? { rotate: [0, -15, 15, 0] } : {}} transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}>{item.emoji}</motion.span>
                <span className="relative">{item.name}</span>
                {!item.highlight && <motion.span className="opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline" style={{ color: "var(--muted)" }}>&rarr;</motion.span>}
              </motion.a>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="border-t py-10 sm:py-14" style={{ borderColor: "var(--border)", zIndex: 1, position: "relative" }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6">
            <div className="text-center sm:text-left">
              <div className="font-black text-lg sm:text-xl mb-1" style={{ color: "var(--foreground)", fontFamily: "var(--font-instrument-serif), Georgia, serif", fontStyle: "italic" }}>
                sigstack<sup className="font-mono font-normal text-[0.5em] ml-1" style={{ fontFamily: "var(--font-geist-mono), monospace", color: "var(--muted)" }}>4.1</sup>
              </div>
              <div className="text-xs sm:text-sm" style={{ color: "var(--muted)" }}>v{SITE.VERSION} &quot;{SITE.CODENAME}&quot; — {SITE.BUILT_WITH}</div>
            </div>
            <div className="flex gap-4 sm:gap-6">
              {SOCIAL_LINKS.map((social) => (
                <motion.a key={social.href} href={social.href} target="_blank" className="transition-colors p-1" style={{ color: "var(--muted)" }} whileHover={{ scale: 1.2, y: -2 }}>
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill={social.stroke ? "none" : "currentColor"} stroke={social.stroke ? "currentColor" : "none"} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={social.stroke ? 2 : undefined} fillRule={social.stroke ? undefined : "evenodd"} d={social.iconPath} /></svg>
                </motion.a>
              ))}
            </div>
          </div>
          <div className="mt-8 sm:mt-10 text-center text-xs sm:text-sm" style={{ color: "var(--muted)" }}>{SITE.LICENSE}</div>
        </div>
      </footer>
    </div>
  );
}
