"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useMemo } from "react";

// ─── Palette constants (matching wsm-invoice) ───
const A1 = "#f97316";
const A2 = "#ec4899";
const GRAD = `linear-gradient(135deg, ${A1}, ${A2})`;
const GLOW = "rgba(249,115,22,0.25)";

// Magnetic button component
function MagneticButton({ children, href, className, variant = "default" }: { children: React.ReactNode; href: string; className?: string; variant?: "default" | "primary" | "secondary" }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 400, damping: 15 });
  const springY = useSpring(y, { stiffness: 400, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.2);
    y.set((e.clientY - centerY) * 0.2);
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
      className={`relative overflow-hidden ${className}`}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        scale: 1.05,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
      whileTap={{
        scale: 0.92,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
    >
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
        whileHover={{ translateX: "200%" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      {children}
    </motion.a>
  );
}

// Bouncy CTA button
function BouncyButton({ children, href, className, glow = false, style }: { children: React.ReactNode; href: string; className?: string; glow?: boolean; style?: React.CSSProperties }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      className={`relative group ${className}`}
      style={style}
      whileHover={{
        scale: 1.08,
        y: -4,
      }}
      whileTap={{
        scale: 0.95,
        y: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 15,
        mass: 0.8
      }}
    >
      {glow && (
        <motion.div
          className="absolute -inset-1 rounded-2xl blur-lg opacity-50 group-hover:opacity-80"
          style={{
            background: GRAD,
            backgroundSize: "200% 200%",
          }}
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      )}
      <span className="relative block">
        <span className="absolute inset-0 overflow-hidden rounded-xl">
          <motion.span
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
            initial={false}
            whileHover={{ translateX: "200%" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </span>
        {children}
      </span>
    </motion.a>
  );
}

// Fade-in component
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true, margin: "-50px" }}
    >
      {children}
    </motion.div>
  );
}

// Tech stack data
const coreStack = [
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

const voiceStack = [
  {
    name: "Typeless",
    description: "Speech to prompts",
    logo: "https://www.typeless.com/favicon.ico",
    bgColor: "bg-gradient-to-br from-blue-500/20 to-indigo-500/30",
    glowColor: "#3B82F6",
    url: "https://www.typeless.com/?via=wsig",
  },
];

const terminalStack = [
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

const agentStack = [
  {
    name: "Sled",
    description: "Voice from phone",
    logo: "https://cdn.simpleicons.org/airplayaudio/06B6D4",
    bgColor: "bg-gradient-to-br from-cyan-500/20 to-teal-500/30",
    glowColor: "#06B6D4",
    url: "https://sled.layercode.com",
    highlight: true,
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

const infraStack = [
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

const mcpServers = [
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

function StackCard({
  name,
  description,
  logo,
  fallbackLetter,
  bgColor,
  glowColor,
  url,
  highlight,
  index,
}: {
  name: string;
  description: string;
  logo?: string;
  fallbackLetter?: string;
  bgColor: string;
  glowColor?: string;
  url: string;
  highlight?: boolean;
  index: number;
}) {
  return (
    <FadeIn delay={index * 0.05}>
      <motion.a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`group relative block rounded-2xl p-5 sm:p-6 border overflow-hidden ${
          highlight ? "ring-2 ring-[#D4A574]/50" : ""
        }`}
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          boxShadow: highlight ? `0 10px 40px ${glowColor}30` : undefined,
        }}
        whileHover={{
          scale: 1.05,
          y: -6,
        }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        {/* Gradient top bar */}
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: GRAD }} />

        {/* Brand-colored hover glow */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 blur-2xl -z-10 transition-opacity duration-300"
          style={{ backgroundColor: glowColor || A1 }}
        />

        <div className="flex flex-col items-center text-center gap-3">
          <motion.div
            className={`h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 rounded-2xl ${bgColor} flex items-center justify-center shadow-lg border`}
            style={{ borderColor: "var(--border)" }}
            whileHover={{ scale: 1.15, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {logo ? (
              <Image
                src={logo}
                alt={name}
                width={48}
                height={48}
                className="object-contain w-10 h-10 sm:w-12 sm:h-12"
                style={{ maxWidth: 48, maxHeight: 48 }}
                unoptimized
              />
            ) : fallbackLetter ? (
              <span className="font-black text-2xl sm:text-3xl" style={{ color: "var(--foreground)" }}>{fallbackLetter}</span>
            ) : null}
          </motion.div>

          <div>
            <h3
              className="font-bold text-sm sm:text-base transition-colors leading-tight"
              style={{ color: highlight ? glowColor : "var(--foreground)" }}
            >
              {name}
            </h3>
            <p className="text-xs sm:text-sm mt-1" style={{ color: "var(--muted)" }}>{description}</p>
          </div>
        </div>
      </motion.a>
    </FadeIn>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <motion.pre
      className="rounded-xl sm:rounded-2xl p-4 sm:p-6 overflow-x-auto text-[11px] sm:text-sm shadow-lg border"
      style={{
        background: "linear-gradient(135deg, #3a3530 0%, #2e2a26 100%)",
        borderColor: "var(--border)",
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
    >
      <code style={{ color: "#d4a574" }}>{children}</code>
    </motion.pre>
  );
}

// Newsletter signup card
function NewsletterCard({
  title,
  description,
  emoji,
  borderColor,
  accentColor,
  newsletterType,
}: {
  title: string;
  description: string;
  emoji: string;
  borderColor: string;
  accentColor: "orange" | "pink";
  newsletterType: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newsletter: newsletterType }),
      });

      if (response.ok) {
        setStatus("success");
        setMessage("You're in! Check your inbox.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage("Something went wrong. Try again?");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Try again?");
    }

    setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 3000);
  };

  return (
    <motion.div
      className="rounded-xl sm:rounded-2xl p-5 sm:p-6 border"
      style={{
        background: "var(--surface)",
        borderColor,
      }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      {/* Gradient top bar */}
      <div className="h-1 -mx-5 sm:-mx-6 -mt-5 sm:-mt-6 mb-4 sm:mb-5 rounded-t-xl sm:rounded-t-2xl" style={{ background: GRAD }} />

      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl sm:text-3xl">{emoji}</span>
        <div>
          <h3 className="text-base sm:text-lg font-bold" style={{ color: "var(--foreground)" }}>{title}</h3>
          <p className="text-xs sm:text-sm mt-1 leading-relaxed" style={{ color: "var(--muted)" }}>{description}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
          style={{
            background: "var(--background)",
            border: `1px solid var(--border)`,
            color: "var(--foreground)",
          }}
          disabled={status === "loading" || status === "success"}
        />
        <motion.button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="rounded-full px-4 py-2 text-sm font-semibold text-white transition-all disabled:opacity-50"
          style={{ background: GRAD }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {status === "loading" ? "..." : status === "success" ? "Done" : "Subscribe"}
        </motion.button>
      </form>

      <AnimatePresence>
        {message && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`text-xs mt-2 ${status === "success" ? "text-green-600 dark:text-green-400" : "text-red-500"}`}
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Section header icons as SVGs
const SectionIcon = ({ type }: { type: "brain" | "voice" | "terminal" | "cloud" | "plug" | "server" }) => {
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
    server: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    ),
  };
  return <span style={{ color: A1 }}>{icons[type]}</span>;
};

// Floating accent dots
function FloatingAccents({ count = 6, color = "orange" }: { count?: number; color?: "orange" | "pink" | "warm" | "amber" }) {
  const [accents, setAccents] = useState<Array<{ left: number; top: number; size: number; delay: number }>>([]);

  useEffect(() => {
    setAccents(
      [...Array(count)].map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 2 + Math.random() * 4,
        delay: Math.random() * 2,
      }))
    );
  }, [count]);

  if (accents.length === 0) return null;

  const colors = {
    orange: "bg-orange-400",
    pink: "bg-pink-400",
    warm: "bg-amber-400",
    amber: "bg-amber-500",
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {accents.map((accent, i) => (
        <div
          key={i}
          className={`absolute ${colors[color]} rounded-full animate-float opacity-20`}
          style={{
            left: `${accent.left}%`,
            top: `${accent.top}%`,
            width: accent.size,
            height: accent.size,
            animationDelay: `${accent.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// Floating particles — warm-toned
function FloatingParticles() {
  const [particles, setParticles] = useState<Array<{ left: number; top: number; duration: number; delay: number }>>([]);

  useEffect(() => {
    setParticles(
      [...Array(15)].map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 3 + Math.random() * 2,
        delay: Math.random() * 2,
      }))
    );
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            backgroundColor: i % 2 === 0 ? A1 : A2,
            opacity: 0.15,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Stacking animation for "sigstack"
function StackingTitle({ onComplete, onReplay, skipAnimation = false }: { onComplete: () => void; onReplay?: () => void; skipAnimation?: boolean }) {
  const letters = "sigstack".split("");
  const [phase, setPhase] = useState<"falling" | "stacking" | "shuffling" | "done">(skipAnimation ? "done" : "falling");
  const containerRef = useRef<HTMLDivElement>(null);
  const [letterOffsets, setLetterOffsets] = useState<number[]>([]);

  const stackedPositions = useMemo(() => letters.map((_, i) => ({
    x: (Math.random() - 0.5) * 20,
    y: -i * 18,
    rotate: (Math.random() - 0.5) * 25,
    scale: 1,
  })), []);

  const initialPositions = useMemo(() => letters.map(() => ({
    y: -300 - (Math.random() * 60),
    x: (Math.random() - 0.5) * 200,
    rotate: Math.random() * 180 - 90,
  })), []);

  useEffect(() => {
    const measureLetters = () => {
      const measurements: number[] = [];
      const tempSpan = document.createElement('span');
      tempSpan.style.cssText = 'position:absolute;visibility:hidden;font-size:clamp(3.75rem,8vw,6rem);font-weight:900;letter-spacing:-0.025em;font-family:var(--font-instrument-serif),Georgia,serif;';
      document.body.appendChild(tempSpan);

      letters.forEach(letter => {
        tempSpan.textContent = letter;
        measurements.push(tempSpan.getBoundingClientRect().width);
      });

      document.body.removeChild(tempSpan);

      const offsets: number[] = [];
      const totalWidth = measurements.reduce((a, b) => a + b, 0);
      let cumulative = -totalWidth / 2;

      measurements.forEach((width) => {
        offsets.push(cumulative + width / 2);
        cumulative += width;
      });

      setLetterOffsets(offsets);
    };

    measureLetters();
    window.addEventListener('resize', measureLetters);
    return () => window.removeEventListener('resize', measureLetters);
  }, [letters]);

  useEffect(() => {
    if (skipAnimation) {
      onComplete();
      return;
    }

    const fallingDuration = 600;
    const stackingDuration = 800;
    const shufflingDuration = 900;

    const timer1 = setTimeout(() => setPhase("stacking"), fallingDuration);
    const timer2 = setTimeout(() => setPhase("shuffling"), fallingDuration + stackingDuration);
    const timer3 = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, fallingDuration + stackingDuration + shufflingDuration + 200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete, skipAnimation]);

  const handleClick = () => {
    if (phase === "done" && onReplay) {
      onReplay();
    }
  };

  const getOffset = (i: number) => {
    if (letterOffsets.length > 0) {
      return letterOffsets[i];
    }
    const avgWidth = 48;
    const totalWidth = letters.length * avgWidth;
    return (i * avgWidth) - (totalWidth / 2) + (avgWidth / 2);
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative h-[200px] sm:h-[280px] flex items-center justify-center"
      style={{ overflow: 'visible' }}
      onClick={handleClick}
      whileHover={phase === "done" ? { scale: 1.02 } : undefined}
      whileTap={phase === "done" ? { scale: 0.98 } : undefined}
      title={phase === "done" ? "Click to replay animation" : undefined}
    >
      <div
        className={`relative flex items-center justify-center ${phase === "done" ? "cursor-pointer" : ""}`}
        style={{ overflow: 'visible' }}
      >
        {letters.map((letter, i) => {
          const finalX = getOffset(i);

          return (
            <motion.span
              key={i}
              className="text-6xl sm:text-8xl font-black absolute"
              style={{
                fontFamily: "var(--font-instrument-serif), Georgia, serif",
                fontStyle: "italic",
                background: GRAD,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: `drop-shadow(0 4px 20px ${GLOW})`,
              }}
              initial={
                skipAnimation
                  ? {
                      y: 0,
                      x: finalX,
                      opacity: 1,
                      rotate: 0,
                      scale: 1,
                    }
                  : {
                      y: initialPositions[i].y,
                      x: initialPositions[i].x,
                      opacity: 0,
                      rotate: initialPositions[i].rotate,
                      scale: 0.8,
                    }
              }
              animate={
                phase === "falling"
                  ? {
                      y: 0,
                      x: 0,
                      opacity: 1,
                      rotate: (Math.random() - 0.5) * 30,
                      scale: 1,
                    }
                  : phase === "stacking"
                  ? {
                      y: stackedPositions[letters.length - 1 - i].y - 20,
                      x: stackedPositions[letters.length - 1 - i].x,
                      opacity: 1,
                      rotate: stackedPositions[letters.length - 1 - i].rotate,
                      scale: 1,
                    }
                  : {
                      y: 0,
                      x: finalX,
                      opacity: 1,
                      rotate: 0,
                      scale: 1,
                    }
              }
              transition={
                skipAnimation
                  ? { duration: 0 }
                  : phase === "falling"
                  ? {
                      type: "spring",
                      stiffness: 50,
                      damping: 15,
                      delay: i * 0.04,
                    }
                  : phase === "stacking"
                  ? {
                      type: "spring",
                      stiffness: 70,
                      damping: 20,
                      delay: i * 0.02,
                    }
                  : {
                      type: "spring",
                      stiffness: 80,
                      damping: 20,
                      mass: 0.8,
                      delay: i * 0.02,
                    }
              }
            >
              {letter}
            </motion.span>
          );
        })}
      </div>
    </motion.div>
  );
}

// Static title — clickable to replay
function StaticTitle({ onClick }: { onClick?: () => void }) {
  return (
    <motion.h1
      className="text-6xl sm:text-8xl font-black tracking-tight cursor-pointer"
      style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      title="Click to replay animation"
    >
      <span
        style={{
          background: GRAD,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontStyle: "italic",
          filter: `drop-shadow(0 4px 20px ${GLOW})`,
        }}
      >
        sigstack
      </span>
    </motion.h1>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

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

  const handleAnimationComplete = () => {};

  const replayAnimation = () => {
    setAnimationKey(prev => prev + 1);
    setShouldSkipAnimation(false);
  };

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      {/* Paper texture + vignette (matching wsm-invoice) */}
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

      {/* Ambient orbs — warm toned */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full filter blur-[120px]"
          style={{ background: `${A1}12`, animation: "breathe 10s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full filter blur-[100px]"
          style={{ background: `${A2}10`, animation: "breathe 14s ease-in-out infinite 2s" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full filter blur-[80px]"
          style={{ background: `${A1}08`, animation: "breathe 12s ease-in-out infinite 4s" }}
        />
        <FloatingParticles />
      </div>

      {/* CSS animations */}
      <style jsx global>{`
        @keyframes breathe {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.05); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      {/* ═══ Hero ═══ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center" style={{ zIndex: 1 }}>
        <motion.div
          className="relative z-10 mx-auto max-w-5xl px-6 text-center"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          {/* Stacking title */}
          <div className="mb-6 h-[200px] sm:h-[280px] flex items-center justify-center" style={{ overflow: 'visible' }}>
            {isClient ? (
              <StackingTitle
                key={animationKey}
                onComplete={handleAnimationComplete}
                onReplay={replayAnimation}
                skipAnimation={shouldSkipAnimation && animationKey === 0}
              />
            ) : (
              <StaticTitle />
            )}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl sm:text-2xl max-w-2xl mx-auto mb-4"
            style={{ color: "var(--sub)" }}
          >
            Now built on <span className="font-semibold" style={{ color: "var(--foreground)" }}>Cowork Plugins</span> — Anthropic&apos;s official plugin architecture
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-12"
            style={{ color: "var(--muted)" }}
          >
            <span className="font-medium" style={{ color: A1 }}>Feb 2026:</span> 36 plugins &middot; 84 skills &middot; 27 MCP servers &middot; v3.5 &quot;Marlin&quot;
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center gap-6 sm:gap-10 md:gap-16 mb-10 sm:mb-14"
          >
            {[
              { label: "Plugins", value: "36", color: A1 },
              { label: "Skills", value: "84", color: A2 },
              { label: "MCP Servers", value: "27", color: "#d4a574" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                className="text-center"
                whileHover={{ scale: 1.1, y: -5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div
                  className="text-3xl sm:text-4xl md:text-5xl font-black drop-shadow-lg"
                  style={{
                    fontFamily: "var(--font-instrument-serif), Georgia, serif",
                    color: stat.color,
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-xs mt-1" style={{ color: "var(--muted)" }}>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center px-4"
          >
            <BouncyButton
              href="https://github.com/willsigmon/sigstack"
              glow
              className="inline-flex items-center justify-center gap-2 sm:gap-3 rounded-full px-6 sm:px-9 py-4 sm:py-5 font-bold text-base sm:text-lg shadow-2xl border-2"
              style={{
                background: GRAD,
                color: "#fff",
                borderColor: `${A1}50`,
              }}
            >
              <motion.span
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5, delay: 2, repeat: Infinity, repeatDelay: 4 }}
              >
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </motion.span>
              Clone the Stack
            </BouncyButton>
            <motion.a
              href="#quick-start"
              className="group inline-flex items-center justify-center gap-2 rounded-full border-2 px-6 sm:px-9 py-4 sm:py-5 font-bold text-base sm:text-lg transition-all"
              style={{
                borderColor: "var(--border)",
                color: "var(--foreground)",
                background: "var(--surface)",
              }}
              whileHover={{
                scale: 1.05,
                y: -3,
                boxShadow: `0 20px 40px ${GLOW}`,
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <span>Quick Start</span>
              <motion.span
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
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
          {coreStack.map((item, i) => (
            <StackCard key={item.name} {...item} index={i} />
          ))}
          {voiceStack.map((item, i) => (
            <StackCard key={item.name} {...item} index={i + coreStack.length} />
          ))}
          {agentStack.map((item, i) => (
            <StackCard key={item.name} {...item} index={i + coreStack.length + voiceStack.length} />
          ))}
          {terminalStack.map((item, i) => (
            <StackCard key={item.name} {...item} index={i + coreStack.length + voiceStack.length + agentStack.length} />
          ))}
          {infraStack.map((item, i) => (
            <StackCard key={item.name} {...item} index={i + coreStack.length + voiceStack.length + agentStack.length + terminalStack.length} />
          ))}
        </div>

        {/* MCP Servers */}
        <div className="mt-8 sm:mt-10">
          <h3 className="text-xs sm:text-sm font-medium mb-4 uppercase tracking-widest text-center" style={{ color: "var(--muted)" }}>
            MCP Servers
          </h3>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {mcpServers.map((server, i) => (
              <motion.div
                key={server.name}
                className="flex items-center gap-2 px-4 py-2 rounded-full border"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ delay: i * 0.03 }}
                viewport={{ once: true }}
              >
                <div className="h-2 w-2 rounded-full animate-pulse-glow" style={{ backgroundColor: A1 }} />
                <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{server.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Hardware Network ═══ */}
      <section className="relative mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-12" style={{ zIndex: 1 }}>
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 text-center flex items-center justify-center gap-2 sm:gap-3" style={{ color: "var(--foreground)", fontFamily: "var(--font-instrument-serif), Georgia, serif", fontStyle: "italic" }}>
            <SectionIcon type="server" /> The Network
          </h2>
          <p className="text-xs sm:text-sm text-center mb-8 sm:mb-12" style={{ color: "var(--muted)" }}>How everything syncs together</p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="rounded-xl sm:rounded-2xl p-5 sm:p-8 border overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            {/* Gradient top bar */}
            <div className="h-1 -mx-5 sm:-mx-8 -mt-5 sm:-mt-8 mb-5 sm:mb-8" style={{ background: GRAD }} />

            <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
              {[
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
                  text: "Omi captures conversations. Typeless converts speech to prompts. Marlin Router auto-responds in 12 iMessage group chats using dual-LLM (Claude + OpenAI). Call Marlin at +1 (844) 719-3335.",
                },
                {
                  title: "Federated Memory",
                  text: "marlin-recall federates memory across MCP knowledge graph, contacts DB (2,475 records), Omi (18,300 conversations), and persistent memory files. Context survives across sessions, devices, and interfaces.",
                },
              ].map((item) => (
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
            <CodeBlock>{`# Install via Claude Code CLI
claude plugins install sigstack

# Or clone and symlink manually
git clone https://github.com/willsigmon/sigstack.git
ln -s $(pwd)/sigstack/plugins/* ~/.claude/plugins/cache/sigstack/`}</CodeBlock>
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
          {[
            { title: "ios-dev", description: "Swift, SwiftUI, Xcode, CloudKit, SwiftData", color: A1 },
            { title: "app-dev", description: "Features, audio, sync, ops, preferences", color: "#d4a574" },
            { title: "dev-essentials", description: "Glif, Resend, performance, multi-agent coordination", color: A2 },
            { title: "superclaude", description: "Meta-orchestration, agents, /spawn, /analyze", color: "#c2956a" },
            { title: "work", description: "Enterprise apps, databases, dashboards", color: A1 },
            { title: "media", description: "Podcasts, audio, RSS, streaming", color: "#b8956a" },
          ].map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.1}>
              <motion.div
                className="rounded-xl sm:rounded-2xl p-4 sm:p-6 border h-full overflow-hidden"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                }}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {/* Gradient top bar */}
                <div className="h-1 -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 mb-3 sm:mb-5" style={{ background: `linear-gradient(135deg, ${item.color}, ${A2})` }} />
                <h3 className="text-sm sm:text-lg font-bold mb-1 sm:mb-2" style={{ color: "var(--foreground)" }}>{item.title}</h3>
                <p className="text-[10px] sm:text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{item.description}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ═══ Philosophy / Workflow Patterns ═══ */}
      <section className="relative mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16" style={{ zIndex: 1 }}>
        <FloatingAccents count={6} color="pink" />
        <FadeIn>
          <motion.div
            className="rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-14 border relative overflow-hidden"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
            }}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {/* Animated gradient line */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ background: GRAD }}
            />

            <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-3 sm:mb-4 text-center" style={{ color: "var(--foreground)", fontFamily: "var(--font-instrument-serif), Georgia, serif", fontStyle: "italic" }}>
              Workflow Patterns
            </h2>
            <p className="text-xs sm:text-sm max-w-2xl mx-auto text-center mb-8 sm:mb-12" style={{ color: "var(--muted)" }}>
              Team-validated patterns from the Claude Code team. Plan first, improve docs, fix autonomously.
            </p>
            <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
              {[
                { principle: "Plan first", meaning: "Complex tasks -> plan mode, then one-shot implement" },
                { principle: "Self-improving docs", meaning: "After corrections: update docs to prevent repeats" },
                { principle: "Autonomous fixing", meaning: "Paste error + 'fix' -- minimal micromanagement" },
                { principle: "Subagents", meaning: "Offload subtasks, keep main context clean" },
              ].map((item, i) => (
                <motion.div
                  key={item.principle}
                  className="rounded-lg sm:rounded-xl p-3 sm:p-5 transition-colors border"
                  style={{
                    background: "var(--background)",
                    borderColor: "var(--border)",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -3 }}
                >
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
            {/* Gradient top bar */}
            <div className="h-1 -mx-4 sm:-mx-6 md:-mx-8 -mt-4 sm:-mt-6 md:-mt-8 mb-4 sm:mb-6 md:mb-8" style={{ background: GRAD }} />

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <motion.div
                className="flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image
                  src="/leavn-icon.png"
                  alt="Leavn App Icon"
                  width={64}
                  height={64}
                  className="rounded-[14px] shadow-lg w-14 h-14 sm:w-16 sm:h-16"
                />
              </motion.div>

              <div className="flex-1 text-center sm:text-left">
                <p className="text-[10px] sm:text-xs mb-0.5 sm:mb-1" style={{ color: "var(--muted)" }}>Built with this stack</p>
                <h3 className="text-base sm:text-lg font-bold mb-0.5 sm:mb-1" style={{ color: "var(--foreground)" }}>Leavn.app</h3>
                <p className="text-xs sm:text-sm max-w-md" style={{ color: "var(--muted)" }}>
                  A Bible study app built ~90% with Claude Code using this stack.
                </p>
              </div>

              <motion.a
                href="https://leavn.app"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-full px-4 sm:px-5 py-2 sm:py-2.5 border text-xs sm:text-sm font-medium transition-colors"
                style={{
                  background: "var(--background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View App
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </motion.a>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ═══ Newsletter ═══ */}
      <section className="relative mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16" style={{ zIndex: 1 }}>
        <FloatingAccents count={5} color="amber" />
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 text-center" style={{ color: "var(--foreground)", fontFamily: "var(--font-instrument-serif), Georgia, serif", fontStyle: "italic" }}>
            The SigStack Newsletter
          </h2>
          <p className="text-xs sm:text-sm text-center mb-8 sm:mb-10" style={{ color: "var(--muted)" }}>
            Curated news delivered to your inbox. Choose your flavor.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            <NewsletterCard
              title="AI & Tech News"
              description="Claude, GPT, Gemini, dev tools, and the future of AI-assisted development. Fresh stories only -- nothing older than 24 hours."
              emoji="🤖"
              borderColor={`${A1}30`}
              accentColor="orange"
              newsletterType="ai_news"
            />
            <NewsletterCard
              title="Personal Digest"
              description="Apple, podcasts, food, local NC news, Disney parks, and everything else I follow. The full RSS experience."
              emoji="📰"
              borderColor={`${A2}30`}
              accentColor="pink"
              newsletterType="personal_digest"
            />
          </div>
        </FadeIn>
      </section>

      {/* ═══ Support ═══ */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16" style={{ zIndex: 1 }}>
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 text-center" style={{ color: "var(--foreground)", fontFamily: "var(--font-instrument-serif), Georgia, serif", fontStyle: "italic" }}>Support the Stack</h2>
          <p className="text-xs sm:text-sm text-center mb-6 sm:mb-8" style={{ color: "var(--muted)" }}>
            If this helps you ship faster, consider using my affiliate links
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-5">
            {[
              { name: "Omi", url: "https://www.omi.me/?ref=WILLSIGMON", emoji: "🧠", highlight: false },
              { name: "Typeless", url: "https://www.typeless.com/?via=wsig", emoji: "🎤", highlight: false },
              { name: "Tip the Creator", url: "https://tip.wsig.me", highlight: true, emoji: "☕" },
            ].map((item, i) => (
              <motion.a
                key={item.name}
                href={item.url}
                target="_blank"
                className="group relative inline-flex items-center gap-2 sm:gap-3 rounded-full px-4 sm:px-7 py-3 sm:py-4 font-semibold text-sm sm:text-base overflow-hidden"
                style={{
                  background: item.highlight ? GRAD : "var(--surface)",
                  color: item.highlight ? "#fff" : "var(--foreground)",
                  border: item.highlight ? "none" : `2px solid var(--border)`,
                  boxShadow: item.highlight ? `0 8px 30px ${GLOW}` : undefined,
                }}
                whileHover={{
                  scale: 1.08,
                  y: -4,
                  boxShadow: item.highlight
                    ? `0 25px 50px ${GLOW}`
                    : `0 20px 40px rgba(0, 0, 0, 0.06)`,
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 12, delay: i * 0.05 }}
              >
                {item.highlight && (
                  <motion.div
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12"
                    animate={{ translateX: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 2, ease: "easeOut" }}
                  />
                )}
                <motion.span
                  className="text-lg sm:text-xl"
                  animate={item.highlight ? { rotate: [0, -15, 15, 0] } : {}}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                >
                  {item.emoji}
                </motion.span>
                <span className="relative">{item.name}</span>
                {!item.highlight && (
                  <motion.span
                    className="opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline"
                    style={{ color: "var(--muted)" }}
                  >
                    &rarr;
                  </motion.span>
                )}
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
              <div className="font-black text-lg sm:text-xl mb-1" style={{ color: "var(--foreground)", fontFamily: "var(--font-instrument-serif), Georgia, serif", fontStyle: "italic" }}>sigstack</div>
              <div className="text-xs sm:text-sm" style={{ color: "var(--muted)" }}>
                v3.5 &quot;Marlin&quot; — Built with Claude Code and ~5,000 hours of figuring out what works.
              </div>
            </div>
            <div className="flex gap-4 sm:gap-6">
              {[
                { href: "https://willsigmon.media", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />, stroke: true },
                { href: "https://x.com/willsigmon", icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /> },
                { href: "https://github.com/willsigmon", icon: <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /> },
                { href: "https://linkedin.com/in/willsigmon", icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /> },
                { href: "https://tip.wsig.me", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />, stroke: true },
              ].map((social: { href: string; icon: React.ReactNode; stroke?: boolean }) => (
                <motion.a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  className="transition-colors p-1"
                  style={{ color: "var(--muted)" }}
                  whileHover={{ scale: 1.2, y: -2 }}
                >
                  <svg
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    fill={social.stroke ? "none" : "currentColor"}
                    stroke={social.stroke ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                  >
                    {social.icon}
                  </svg>
                </motion.a>
              ))}
            </div>
          </div>
          <div className="mt-8 sm:mt-10 text-center text-xs sm:text-sm" style={{ color: "var(--muted)" }}>
            MIT License — Use it, modify it, make it yours.
          </div>
        </div>
      </footer>
    </div>
  );
}
