"use client";

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { BouncyButton } from "@/components/ui/BouncyButton";
import { URLS, SITE, HERO_STATS } from "@/lib/constants";

// Stacking animation for "sigstack"
function StackingTitle({
  onComplete,
  onReplay,
  skipAnimation = false,
}: {
  onComplete: () => void;
  onReplay?: () => void;
  skipAnimation?: boolean;
}) {
  const letters = "sigstack".split("");
  const [phase, setPhase] = useState<"falling" | "stacking" | "shuffling" | "done">(
    skipAnimation ? "done" : "falling"
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [letterOffsets, setLetterOffsets] = useState<number[]>([]);

  const stackedPositions = useMemo(
    () =>
      letters.map((_, i) => ({
        x: (Math.random() - 0.5) * 20,
        y: -i * 18,
        rotate: (Math.random() - 0.5) * 25,
        scale: 1,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const initialPositions = useMemo(
    () =>
      letters.map(() => ({
        y: -300 - Math.random() * 60,
        x: (Math.random() - 0.5) * 200,
        rotate: Math.random() * 180 - 90,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    const measureLetters = () => {
      const measurements: number[] = [];
      const tempSpan = document.createElement("span");
      tempSpan.style.cssText =
        "position:absolute;visibility:hidden;font-size:clamp(3.75rem,8vw,6rem);font-weight:900;letter-spacing:-0.025em;";
      document.body.appendChild(tempSpan);

      letters.forEach((letter) => {
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
    window.addEventListener("resize", measureLetters);
    return () => window.removeEventListener("resize", measureLetters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (skipAnimation) {
      onComplete();
      return;
    }

    const FALLING_MS = 600;
    const STACKING_MS = 800;
    const SHUFFLING_MS = 900;

    const timer1 = setTimeout(() => setPhase("stacking"), FALLING_MS);
    const timer2 = setTimeout(() => setPhase("shuffling"), FALLING_MS + STACKING_MS);
    const timer3 = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, FALLING_MS + STACKING_MS + SHUFFLING_MS + 200);

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
    if (letterOffsets.length > 0) return letterOffsets[i];
    const avgWidth = 48;
    const totalWidth = letters.length * avgWidth;
    return i * avgWidth - totalWidth / 2 + avgWidth / 2;
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative h-[200px] sm:h-[280px] flex items-center justify-center"
      style={{ overflow: "visible" }}
      onClick={handleClick}
      whileHover={phase === "done" ? { scale: 1.02 } : undefined}
      whileTap={phase === "done" ? { scale: 0.98 } : undefined}
      title={phase === "done" ? "Click to replay animation" : undefined}
    >
      <div
        className={`relative flex items-center justify-center ${phase === "done" ? "cursor-pointer" : ""}`}
        style={{ overflow: "visible" }}
      >
        {letters.map((letter, i) => {
          const finalX = getOffset(i);
          return (
            <motion.span
              key={i}
              className="text-6xl sm:text-8xl font-black bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent absolute"
              style={{
                textShadow: "0 4px 30px rgba(139, 92, 246, 0.5), 0 8px 60px rgba(59, 130, 246, 0.3)",
                filter:
                  "drop-shadow(0 4px 20px rgba(139, 92, 246, 0.4)) drop-shadow(0 8px 40px rgba(59, 130, 246, 0.2))",
              }}
              initial={
                skipAnimation
                  ? { y: 0, x: finalX, opacity: 1, rotate: 0, scale: 1 }
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
                  ? { y: 0, x: 0, opacity: 1, rotate: (Math.random() - 0.5) * 30, scale: 1 }
                  : phase === "stacking"
                    ? {
                        y: stackedPositions[letters.length - 1 - i].y - 20,
                        x: stackedPositions[letters.length - 1 - i].x,
                        opacity: 1,
                        rotate: stackedPositions[letters.length - 1 - i].rotate,
                        scale: 1,
                      }
                    : { y: 0, x: finalX, opacity: 1, rotate: 0, scale: 1 }
              }
              transition={
                skipAnimation
                  ? { duration: 0 }
                  : phase === "falling"
                    ? { type: "spring", stiffness: 50, damping: 15, delay: i * 0.04 }
                    : phase === "stacking"
                      ? { type: "spring", stiffness: 70, damping: 20, delay: i * 0.02 }
                      : { type: "spring", stiffness: 80, damping: 20, mass: 0.8, delay: i * 0.02 }
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

function StaticTitle({ onClick }: { onClick?: () => void }) {
  return (
    <motion.h1
      className="text-6xl sm:text-8xl font-black tracking-tight cursor-pointer leading-[1.1] pb-2"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      title="Click to replay animation"
    >
      <span
        className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent inline-block pb-2"
        style={{
          textShadow: "0 4px 30px rgba(139, 92, 246, 0.5), 0 8px 60px rgba(59, 130, 246, 0.3)",
          filter:
            "drop-shadow(0 4px 20px rgba(139, 92, 246, 0.4)) drop-shadow(0 8px 40px rgba(59, 130, 246, 0.2))",
        }}
      >
        sigstack
      </span>
    </motion.h1>
  );
}

export function Hero() {
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

  // Hydration-safe client detection + localStorage — must run in effect
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setIsClient(true);
    try {
      const hasVisited = localStorage.getItem("sigstack-visited");
      if (!hasVisited) {
        setShouldSkipAnimation(false);
        localStorage.setItem("sigstack-visited", "true");
      }
    } catch {
      // localStorage not available
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleAnimationComplete = useCallback(() => {
    // Animation complete — letters stay in final position
  }, []);

  const replayAnimation = useCallback(() => {
    setAnimationKey((prev) => prev + 1);
    setShouldSkipAnimation(false);
  }, []);

  return (
    <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center justify-center">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-500/30 rounded-full filter blur-[150px] animate-orb-1" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-blue-500/25 rounded-full filter blur-[120px] animate-orb-2" />
        <div className="absolute top-1/2 right-1/3 w-[400px] h-[400px] bg-pink-500/20 rounded-full filter blur-[100px] animate-orb-3" />
        <div className="absolute top-1/3 left-1/2 w-[300px] h-[300px] bg-cyan-500/15 rounded-full filter blur-[80px] animate-orb-4" />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900/70" />

      {/* Hero content */}
      <motion.div
        className="relative z-10 mx-auto max-w-5xl px-6 text-center"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        {/* Title */}
        <div
          className="mb-6 h-[200px] sm:h-[280px] flex items-center justify-center"
          style={{ overflow: "visible" }}
        >
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
          className="text-xl sm:text-2xl text-zinc-300 max-w-2xl mx-auto mb-4"
        >
          My personal <span className="text-white font-semibold">Claude Code stack</span> for shipping
          software with AI
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-zinc-400 mb-6"
        >
          {SITE.STATS_TAGLINE}
        </motion.p>

        {/* Last Updated Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mb-10"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.08] border border-white/[0.15] text-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-zinc-400">Last updated:</span>
            <span className="text-white font-medium">{SITE.LAST_UPDATED}</span>
          </span>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-center gap-6 sm:gap-10 md:gap-16 mb-10 sm:mb-14"
        >
          {HERO_STATS.map((stat) => (
            <motion.div
              key={stat.label}
              className="text-center"
              whileHover={{ scale: 1.1, y: -5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div
                className={`text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent drop-shadow-lg`}
              >
                {stat.value}
              </div>
              <div className="text-xs text-zinc-400 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <nav aria-label="Primary actions">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center px-4"
          >
            <BouncyButton
              href={URLS.GITHUB_REPO}
              glow
              className="inline-flex items-center justify-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-white via-zinc-100 to-white px-6 sm:px-9 py-4 sm:py-5 text-slate-900 font-bold text-base sm:text-lg shadow-2xl shadow-white/25 border-2 border-white/50"
            >
              <motion.span
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5, delay: 2, repeat: Infinity, repeatDelay: 4 }}
              >
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.span>
              Clone the Stack
            </BouncyButton>
            <motion.a
              href={URLS.QUICK_START_ANCHOR}
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </motion.span>
            </motion.a>
          </motion.div>
        </nav>
      </motion.div>
    </section>
  );
}
