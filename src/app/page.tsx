"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// Magnetic button component - juicy and playful
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
      {/* Shimmer effect on hover */}
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
        whileHover={{ translateX: "200%" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      {children}
    </motion.a>
  );
}

// Playful bouncy button for CTAs
function BouncyButton({ children, href, className, glow = false }: { children: React.ReactNode; href: string; className?: string; glow?: boolean }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      className={`relative group ${className}`}
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
      {/* Glow effect */}
      {glow && (
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-80"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{ backgroundSize: "200% 200%" }}
        />
      )}
      {/* Button content */}
      <span className="relative block">
        {/* Shimmer */}
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

// Fade-in component with blur
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

// Tech stack data - brand-matched colors
const brainStack = [
  {
    name: "Claude Code",
    description: "CLI-first AI coding",
    logo: "https://cdn.simpleicons.org/anthropic/D4A574",
    bgColor: "bg-gradient-to-br from-[#D4A574]/30 to-[#B8956A]/40",
    glowColor: "#D4A574",
    url: "https://claude.ai/code",
    highlight: true,
  },
  {
    name: "Omi + Fieldy",
    description: "AI wearable memory",
    logo: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/e6/55/35/e65535de-583d-0a0e-88ac-de4394e10ddf/prodAppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/460x0w.webp",
    bgColor: "bg-gradient-to-br from-emerald-500/30 to-teal-500/40",
    glowColor: "#10B981",
    url: "https://www.omi.me/?ref=WILLSIGMON",
  },
];

const voiceStack = [
  {
    name: "Typeless",
    description: "Speech to prompts",
    logo: "https://www.typeless.com/favicon.ico",
    bgColor: "bg-gradient-to-br from-blue-500/30 to-indigo-500/40",
    glowColor: "#3B82F6",
    url: "https://www.typeless.com/?via=wsig",
  },
  {
    name: "Wispr Flow",
    description: "Voice-to-code",
    logo: "https://cdn.prod.website-files.com/682f84b3838c89f8ff7667db/68d427f5e3a837706e390bde_logo-symbol-light.png",
    bgColor: "bg-gradient-to-br from-violet-500/30 to-purple-500/40",
    glowColor: "#8B5CF6",
    url: "https://wisprflow.ai/r?WILL48",
  },
];

const terminalStack = [
  {
    name: "iTerm2",
    description: "macOS terminal",
    logo: "https://cdn.simpleicons.org/iterm2/10B981",
    bgColor: "bg-gradient-to-br from-[#10B981]/30 to-[#059669]/40",
    glowColor: "#10B981",
    url: "https://iterm2.com",
  },
  {
    name: "CleanShot X",
    description: "Screenshots",
    logo: "/icons/cleanshot.png",
    bgColor: "bg-gradient-to-br from-[#5B9BD5]/30 to-[#2B6CB0]/40",
    glowColor: "#5B9BD5",
    url: "https://cleanshot.com",
  },
];

const infraStack = [
  {
    name: "GitHub",
    description: "Code & PRs",
    logo: "https://cdn.simpleicons.org/github/white",
    bgColor: "bg-gradient-to-br from-zinc-400/30 to-zinc-600/40",
    glowColor: "#A1A1AA",
    url: "https://github.com",
  },
  {
    name: "Vercel",
    description: "Deploy",
    logo: "https://cdn.simpleicons.org/vercel/white",
    bgColor: "bg-gradient-to-br from-zinc-300/30 to-zinc-500/40",
    glowColor: "#FFFFFF",
    url: "https://vercel.com",
  },
  {
    name: "Supabase",
    description: "Postgres & Auth",
    logo: "https://cdn.simpleicons.org/supabase/3FCF8E",
    bgColor: "bg-gradient-to-br from-[#3FCF8E]/30 to-[#22C55E]/40",
    glowColor: "#3FCF8E",
    url: "https://supabase.com",
  },
];

const mcpServers = [
  { name: "Sosumi", purpose: "Apple docs" },
  { name: "GitHub", purpose: "PRs & issues" },
  { name: "Vercel", purpose: "Deploy" },
  { name: "Supabase", purpose: "Database" },
  { name: "n8n", purpose: "Workflows" },
  { name: "Memory", purpose: "Knowledge graph" },
  { name: "BRAIN", purpose: "Life data" },
  { name: "Puppeteer", purpose: "Browser" },
  { name: "Glif", purpose: "AI images" },
  { name: "Xcode", purpose: "iOS builds" },
  { name: "Calendar", purpose: "Events" },
  { name: "Clipboard", purpose: "Copy/paste" },
  { name: "Filesystem", purpose: "File access" },
  { name: "Chrome", purpose: "Web automation" },
  { name: "Omi", purpose: "Wearable memory" },
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
        className={`group relative block rounded-2xl p-5 sm:p-6 bg-white/[0.05] backdrop-blur-md border border-white/[0.1] overflow-hidden ${
          highlight ? "ring-2 ring-[#D4A574]/50" : ""
        }`}
        whileHover={{
          scale: 1.05,
          y: -6,
        }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        style={{
          boxShadow: highlight ? `0 10px 40px ${glowColor}40` : undefined,
        }}
      >
        {/* Brand-colored hover glow */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 blur-2xl -z-10 transition-opacity duration-300"
          style={{ backgroundColor: glowColor || "#8B5CF6" }}
        />

        {/* Icon-first layout */}
        <div className="flex flex-col items-center text-center gap-3">
          {/* Big bold icon */}
          <motion.div
            className={`h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 rounded-2xl ${bgColor} flex items-center justify-center shadow-lg border border-white/[0.1]`}
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
              <span className="text-white font-black text-2xl sm:text-3xl">{fallbackLetter}</span>
            ) : null}
          </motion.div>

          {/* Text */}
          <div>
            <h3
              className="font-bold text-white text-sm sm:text-base transition-colors leading-tight"
              style={{ color: highlight ? glowColor : undefined }}
            >
              {name}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">{description}</p>
          </div>
        </div>
      </motion.a>
    </FadeIn>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <motion.pre
      className="rounded-xl sm:rounded-2xl p-4 sm:p-6 overflow-x-auto text-[11px] sm:text-sm bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md border border-white/[0.1] shadow-2xl"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
    >
      <code className="text-emerald-300">{children}</code>
    </motion.pre>
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
  return <span className="text-purple-300">{icons[type]}</span>;
};

// Floating accent dots for section decoration
function FloatingAccents({ count = 6, color = "purple" }: { count?: number; color?: "purple" | "blue" | "pink" | "cyan" }) {
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
    purple: "bg-purple-400",
    blue: "bg-blue-400",
    pink: "bg-pink-400",
    cyan: "bg-cyan-400",
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {accents.map((accent, i) => (
        <div
          key={i}
          className={`absolute ${colors[color]} rounded-full animate-float opacity-30`}
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

// Floating particles component - positions generated client-side to avoid hydration mismatch
function FloatingParticles() {
  const [particles, setParticles] = useState<Array<{ left: number; top: number; duration: number; delay: number }>>([]);

  useEffect(() => {
    // Generate random positions only on client side
    setParticles(
      [...Array(20)].map(() => ({
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
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
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

// Stacking animation for "sigstack" - letters fall and stack like blocks, then fan out
function StackingTitle({ onComplete }: { onComplete: () => void }) {
  const letters = "sigstack".split("");
  const [phase, setPhase] = useState<"falling" | "stacking" | "shuffling" | "done">("falling");

  // Stacked positions - letters pile up vertically like building blocks
  const stackedPositions = letters.map((_, i) => ({
    x: (Math.random() - 0.5) * 20, // Slight horizontal wobble
    y: -i * 18, // Stack upward with more visible spacing
    rotate: (Math.random() - 0.5) * 25, // More rotation for messier stack
    scale: 1,
  }));

  useEffect(() => {
    // Phase timing - give stacking more time to be visible
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
  }, [onComplete]);

  return (
    <div className="relative h-[160px] sm:h-[200px] flex items-end justify-center overflow-visible pb-4">
      <div className="relative flex items-end justify-center overflow-visible">
        {letters.map((letter, i) => {
          // Calculate horizontal offset for final position
          const letterWidth = 48; // Approximate width per letter
          const totalWidth = letters.length * letterWidth;
          const finalX = (i * letterWidth) - (totalWidth / 2) + (letterWidth / 2);

          return (
            <motion.span
              key={i}
              className="text-6xl sm:text-8xl font-black bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent absolute"
              style={{
                textShadow: "0 4px 30px rgba(139, 92, 246, 0.5), 0 8px 60px rgba(59, 130, 246, 0.3)",
                filter: "drop-shadow(0 4px 20px rgba(139, 92, 246, 0.4))",
              }}
              initial={{
                y: -300 - (i * 60), // Start above viewport, staggered
                x: (Math.random() - 0.5) * 200, // Random horizontal start
                opacity: 0,
                rotate: Math.random() * 180 - 90,
                scale: 0.8,
              }}
              animate={
                phase === "falling"
                  ? {
                      y: 40, // Fall to landing zone
                      x: 0, // Converge to center
                      opacity: 1,
                      rotate: (Math.random() - 0.5) * 30,
                      scale: 1,
                    }
                  : phase === "stacking"
                  ? {
                      y: stackedPositions[letters.length - 1 - i].y, // Stack from bottom up
                      x: stackedPositions[letters.length - 1 - i].x, // Slight wobble
                      opacity: 1,
                      rotate: stackedPositions[letters.length - 1 - i].rotate,
                      scale: 1,
                    }
                  : {
                      y: 0, // Final position
                      x: finalX,
                      opacity: 1,
                      rotate: 0,
                      scale: 1,
                    }
              }
              transition={
                phase === "falling"
                  ? {
                      type: "spring",
                      stiffness: 60,
                      damping: 18,
                      delay: i * 0.04,
                    }
                  : phase === "stacking"
                  ? {
                      type: "spring",
                      stiffness: 80,
                      damping: 22,
                      delay: i * 0.02,
                    }
                  : {
                      type: "tween",
                      duration: 0.6,
                      ease: [0.25, 0.1, 0.25, 1], // Smooth ease-out
                      delay: i * 0.03,
                    }
              }
            >
              {letter}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}

// Static title with depth and shadow - clickable to replay animation
function StaticTitle({ onClick }: { onClick?: () => void }) {
  return (
    <motion.h1
      className="text-6xl sm:text-8xl font-black tracking-tight cursor-pointer"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      title="Click to replay animation"
    >
      <span
        className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent"
        style={{
          textShadow: "0 4px 30px rgba(139, 92, 246, 0.5), 0 8px 60px rgba(59, 130, 246, 0.3)",
          filter: "drop-shadow(0 4px 20px rgba(139, 92, 246, 0.4)) drop-shadow(0 8px 40px rgba(59, 130, 246, 0.2))",
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

  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check if this is first visit
    const hasVisited = localStorage.getItem("sigstack-visited");
    if (!hasVisited) {
      setIsAnimating(true);
      localStorage.setItem("sigstack-visited", "true");
    }
  }, []);

  const handleAnimationComplete = () => {
    setIsAnimating(false);
  };

  const replayAnimation = () => {
    setAnimationKey(prev => prev + 1);
    setIsAnimating(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-[#0f0a1f] to-slate-900 overflow-hidden">
      {/* Breathing background wallpaper - CSS animations for smoothness */}
      <div className="fixed inset-0 -z-10">
        {/* Main breathing gradient - pure CSS */}
        <div
          className="absolute inset-0 animate-breathe"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139, 92, 246, 0.3), transparent),
              radial-gradient(ellipse 60% 40% at 100% 50%, rgba(59, 130, 246, 0.2), transparent),
              radial-gradient(ellipse 50% 30% at 0% 80%, rgba(236, 72, 153, 0.15), transparent)
            `,
          }}
        />
        {/* Secondary breathing layer */}
        <div
          className="absolute inset-0 animate-breathe-slow"
          style={{
            background: `
              radial-gradient(circle at 30% 70%, rgba(168, 85, 247, 0.15), transparent 50%),
              radial-gradient(circle at 70% 30%, rgba(34, 211, 238, 0.12), transparent 50%)
            `,
          }}
        />
        {/* Mesh grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        <FloatingParticles />
      </div>

      {/* CSS for breathing animations */}
      <style jsx global>{`
        @keyframes breathe {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }
        @keyframes breathe-slow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.05); }
        }
        @keyframes orb-1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          50% { transform: translate(50px, -30px) scale(1.3); opacity: 0.5; }
        }
        @keyframes orb-2 {
          0%, 100% { transform: translate(0, 0) scale(1.2); opacity: 0.2; }
          50% { transform: translate(-30px, 40px) scale(1); opacity: 0.4; }
        }
        @keyframes orb-3 {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.4); opacity: 0.35; }
        }
        @keyframes orb-4 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.1; }
          50% { transform: translate(-20px, 0) scale(1.2); opacity: 0.25; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .animate-breathe {
          animation: breathe 8s ease-in-out infinite;
        }
        .animate-breathe-slow {
          animation: breathe-slow 12s ease-in-out infinite;
        }
        .animate-orb-1 {
          animation: orb-1 10s ease-in-out infinite;
        }
        .animate-orb-2 {
          animation: orb-2 12s ease-in-out infinite;
        }
        .animate-orb-3 {
          animation: orb-3 14s ease-in-out infinite;
        }
        .animate-orb-4 {
          animation: orb-4 8s ease-in-out infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center">
        {/* Animated background orbs - CSS for smooth breathing */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-500/30 rounded-full filter blur-[150px] animate-orb-1" />
          <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-blue-500/25 rounded-full filter blur-[120px] animate-orb-2" />
          <div className="absolute top-1/2 right-1/3 w-[400px] h-[400px] bg-pink-500/20 rounded-full filter blur-[100px] animate-orb-3" />
          <div className="absolute top-1/3 left-1/2 w-[300px] h-[300px] bg-cyan-500/15 rounded-full filter blur-[80px] animate-orb-4" />
        </div>

        {/* Gradient overlay - lighter */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900/70" />

        {/* Hero content */}
        <motion.div
          className="relative z-10 mx-auto max-w-5xl px-6 text-center"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          {/* Title with stacking animation - click to replay */}
          <div className="mb-6 h-[160px] sm:h-[200px] flex items-end justify-center">
            {isClient && isAnimating ? (
              <StackingTitle key={animationKey} onComplete={handleAnimationComplete} />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="pb-4"
              >
                <StaticTitle onClick={replayAnimation} />
              </motion.div>
            )}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl sm:text-2xl text-zinc-300 max-w-2xl mx-auto mb-4"
          >
            My personal <span className="text-white font-semibold">Claude Code stack</span> for shipping software with AI
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-zinc-400 mb-12"
          >
            89 skills · 24 commands · iOS bundle + Apple&apos;s hidden docs · Ready to clone
          </motion.p>

          {/* Colorful Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center gap-6 sm:gap-10 md:gap-16 mb-10 sm:mb-14"
          >
            {[
              { label: "Skills", value: "89", gradient: "from-blue-400 to-cyan-300" },
              { label: "Commands", value: "24", gradient: "from-green-400 to-emerald-300" },
              { label: "MCP Servers", value: "15+", gradient: "from-purple-400 to-pink-300" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                className="text-center"
                whileHover={{ scale: 1.1, y: -5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className={`text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent drop-shadow-lg`}>
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-xs text-zinc-400 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center px-4"
          >
            <BouncyButton
              href="https://github.com/willsigmon/sigstack"
              glow
              className="inline-flex items-center justify-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-white via-zinc-100 to-white px-6 sm:px-9 py-4 sm:py-5 text-slate-900 font-bold text-base sm:text-lg shadow-2xl shadow-white/25 border-2 border-white/50"
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
              className="group inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 backdrop-blur-md border-2 border-white/20 px-6 sm:px-9 py-4 sm:py-5 text-white font-bold text-base sm:text-lg hover:border-white/40 transition-all"
              whileHover={{
                scale: 1.05,
                y: -3,
                boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)",
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

      {/* The Stack */}
      <section className="relative mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
        <FloatingAccents count={8} color="purple" />
        <FadeIn>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-2 text-center">The Stack</h2>
          <p className="text-zinc-400 text-sm sm:text-base text-center mb-8 sm:mb-10">Tools that power the workflow</p>
        </FadeIn>

        {/* All tools in a unified grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
          {/* Brain */}
          {brainStack.map((item, i) => (
            <StackCard key={item.name} {...item} index={i} />
          ))}
          {/* Voice */}
          {voiceStack.map((item, i) => (
            <StackCard key={item.name} {...item} index={i + brainStack.length} />
          ))}
          {/* Tools */}
          {terminalStack.map((item, i) => (
            <StackCard key={item.name} {...item} index={i + brainStack.length + voiceStack.length} />
          ))}
          {/* Infrastructure */}
          {infraStack.map((item, i) => (
            <StackCard key={item.name} {...item} index={i + brainStack.length + voiceStack.length + terminalStack.length} />
          ))}
        </div>

        {/* MCP Servers */}
        <div className="mt-8 sm:mt-10">
          <h3 className="text-xs sm:text-sm font-medium text-zinc-400 mb-4 uppercase tracking-widest text-center">
            MCP Servers
          </h3>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {mcpServers.map((server, i) => (
              <motion.div
                key={server.name}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.1]"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                transition={{ delay: i * 0.03 }}
                viewport={{ once: true }}
              >
                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white text-sm font-medium">{server.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hardware Network */}
      <section className="relative mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-12">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[300px] sm:w-[400px] h-[150px] sm:h-[200px] bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full filter blur-[80px]" />
        </div>

        <FadeIn>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 text-center flex items-center justify-center gap-2 sm:gap-3">
            <SectionIcon type="server" /> The Network
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm text-center mb-8 sm:mb-12">How everything syncs together</p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="rounded-xl sm:rounded-2xl p-5 sm:p-8 bg-white/[0.04] backdrop-blur-md border border-white/[0.1]">
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Local Server (BRAIN)</h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  A home server running Unraid handles persistent services: n8n for workflow automation,
                  PostgreSQL for life logging, and Home Assistant for smart home integration. All accessible
                  via Tailscale VPN from any device.
                </p>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Multi-Device Sync</h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  Code lives on GitHub. Config and memory persist on BRAIN. Syncthing keeps dotfiles
                  synchronized across machines. Claude Code sessions can continue across any terminal
                  with full context.
                </p>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Voice-First Workflow</h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  Omi captures conversations and sends them to Fieldy for organization. Typeless converts
                  natural speech directly into formatted prompts. Wispr Flow handles voice-to-code with
                  context awareness.
                </p>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Memory Persistence</h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  The Omi MCP server gives Claude access to conversation history and memories. Combined
                  with the memory graph, sessions maintain continuity even after context resets.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Quick Start */}
      <section id="quick-start" className="relative mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
        <FloatingAccents count={5} color="cyan" />
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[400px] sm:w-[600px] h-[250px] sm:h-[400px] bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full filter blur-[100px] sm:blur-[120px]" />
        </div>

        <FadeIn>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 text-center">Quick Start</h2>
          <p className="text-zinc-400 text-xs sm:text-sm text-center mb-8 sm:mb-12">Clone and install in 30 seconds</p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="max-w-3xl mx-auto">
            <CodeBlock>{`# Clone and install
git clone https://github.com/willsigmon/sigstack.git && cd sigstack && \\
cp -r skills/* ~/.claude/skills/ && \\
cp -r commands/* ~/.claude/commands/ && \\
mkdir -p ~/.claude/rules && cp -r rules/* ~/.claude/rules/`}</CodeBlock>
          </div>
        </FadeIn>
      </section>

      {/* What's Inside */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 text-center">What&apos;s Inside</h2>
          <p className="text-zinc-400 text-xs sm:text-sm text-center mb-6 sm:mb-8">Everything you need to ship with Claude Code</p>
        </FadeIn>

        <div className="grid gap-3 sm:gap-5 grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "89 Skills",
              description: "iOS, audio/ML, debug, architecture, n8n workflows",
              gradient: "from-blue-500/30 to-cyan-500/30",
            },
            {
              title: "24 Commands",
              description: "/test, /build, /deploy, /analyze, /cleanup, /git",
              gradient: "from-green-500/30 to-emerald-500/30",
            },
            {
              title: "iOS Bundle",
              description: "Sosumi + Ralph Wiggum protocol + Apple docs",
              gradient: "from-pink-500/30 to-rose-500/30",
            },
            {
              title: "BRAIN Network",
              description: "Multi-device sync via Tailscale for context",
              gradient: "from-purple-500/30 to-violet-500/30",
            },
          ].map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.1}>
              <motion.div
                className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-gradient-to-br ${item.gradient} backdrop-blur-md border border-white/[0.12] h-full`}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <h3 className="text-sm sm:text-lg font-bold text-white mb-1 sm:mb-2">{item.title}</h3>
                <p className="text-[10px] sm:text-sm text-zinc-300 leading-relaxed">{item.description}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section className="relative mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
        <FloatingAccents count={6} color="pink" />
        <FadeIn>
          <motion.div
            className="rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-14 bg-gradient-to-br from-purple-800/30 via-transparent to-blue-800/30 backdrop-blur-md border border-white/[0.12] relative overflow-hidden"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {/* Animated gradient line */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-3 sm:mb-4 text-center">
              Philosophy: Nanobot Healing Swarm
            </h2>
            <p className="text-zinc-300 text-xs sm:text-sm max-w-2xl mx-auto text-center mb-8 sm:mb-12">
              My CLAUDE.md instructs Claude to act as a &ldquo;healing swarm of nanobots&rdquo;&mdash;find every bug,
              scrub every infection, optimize every inefficiency.
            </p>
            <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
              {[
                { principle: "Tools first", meaning: "Check MCP/skill before writing code" },
                { principle: "Parallel agents", meaning: "Spawn 20+ agents for complex tasks" },
                { principle: "Context is attention", meaning: "Manage 60% threshold, use /compact" },
                { principle: "Memory graph", meaning: "Use Omi for session continuity" },
              ].map((item, i) => (
                <motion.div
                  key={item.principle}
                  className="bg-white/[0.08] rounded-lg sm:rounded-xl p-3 sm:p-5 hover:bg-white/[0.12] transition-colors border border-white/[0.08]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -3 }}
                >
                  <div className="font-semibold text-white text-xs sm:text-sm mb-0.5 sm:mb-1">{item.principle}</div>
                  <div className="text-[10px] sm:text-sm text-zinc-400 leading-relaxed">{item.meaning}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </FadeIn>
      </section>

      {/* Showcase - Leavn */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
        <FadeIn>
          <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 bg-white/[0.04] backdrop-blur-md border border-white/[0.1]">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              {/* App icon */}
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

              {/* Content */}
              <div className="flex-1 text-center sm:text-left">
                <p className="text-zinc-500 text-[10px] sm:text-xs mb-0.5 sm:mb-1">Built with this stack</p>
                <h3 className="text-base sm:text-lg font-bold text-white mb-0.5 sm:mb-1">Leavn.app</h3>
                <p className="text-zinc-400 text-xs sm:text-sm max-w-md">
                  A Bible study app built ~90% with Claude Code using this stack.
                </p>
              </div>

              {/* CTA */}
              <motion.a
                href="https://leavn.app"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-lg sm:rounded-xl px-4 sm:px-5 py-2 sm:py-2.5 bg-white/[0.1] border border-white/[0.15] text-white text-xs sm:text-sm font-medium hover:bg-white/[0.15] transition-colors"
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

      {/* Support */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 text-center">Support the Stack</h2>
          <p className="text-zinc-400 text-xs sm:text-sm text-center mb-6 sm:mb-8">
            If this helps you ship faster, consider using my affiliate links
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-5">
            {[
              { name: "Omi", url: "https://www.omi.me/?ref=WILLSIGMON", emoji: "🧠" },
              { name: "Typeless", url: "https://www.typeless.com/?via=wsig", emoji: "🎤" },
              { name: "Wispr Flow", url: "https://wisprflow.ai/r?WILL48", emoji: "💨" },
              { name: "Tip the Creator", url: "https://tip.wsig.me", highlight: true, emoji: "☕" },
            ].map((item, i) => (
              <motion.a
                key={item.name}
                href={item.url}
                target="_blank"
                className={`group relative inline-flex items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl px-4 sm:px-7 py-3 sm:py-4 font-semibold text-sm sm:text-base overflow-hidden ${
                  item.highlight
                    ? "bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white shadow-2xl shadow-purple-500/40"
                    : "bg-white/[0.08] backdrop-blur-md border-2 border-white/[0.15] text-white"
                }`}
                whileHover={{
                  scale: 1.08,
                  y: -4,
                  boxShadow: item.highlight
                    ? "0 25px 50px rgba(168, 85, 247, 0.5)"
                    : "0 20px 40px rgba(255, 255, 255, 0.1)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 12, delay: i * 0.05 }}
              >
                {/* Shimmer for highlighted */}
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
                    initial={{ x: -5 }}
                    whileHover={{ x: 0 }}
                  >
                    →
                  </motion.span>
                )}
              </motion.a>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.1] py-10 sm:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6">
            <div className="text-center sm:text-left">
              <div className="font-black text-lg sm:text-xl text-white mb-1">sigstack</div>
              <div className="text-xs sm:text-sm text-zinc-400">
                Built with Claude Code and ~5,000 hours of figuring out what works.
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
                  className="text-zinc-400 hover:text-white transition-colors p-1"
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
          <div className="mt-8 sm:mt-10 text-center text-xs sm:text-sm text-zinc-500">
            MIT License — Use it, modify it, make it yours.
          </div>
        </div>
      </footer>
    </div>
  );
}
