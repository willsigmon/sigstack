"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { GRAD, GLOW } from "@/lib/palette";

interface StackingTitleProps {
  readonly onComplete: () => void;
  readonly onReplay?: () => void;
  readonly skipAnimation?: boolean;
}

const LETTERS = "sigstack".split("");

export function StackingTitle({ onComplete, onReplay, skipAnimation = false }: StackingTitleProps) {
  const [phase, setPhase] = useState<"falling" | "stacking" | "shuffling" | "done">(skipAnimation ? "done" : "falling");
  const containerRef = useRef<HTMLDivElement>(null);
  const [letterOffsets, setLetterOffsets] = useState<number[]>([]);

  const stackedPositions = useMemo(() => LETTERS.map((_, i) => ({
    x: (Math.random() - 0.5) * 20,
    y: -i * 18,
    rotate: (Math.random() - 0.5) * 25,
    scale: 1,
  })), []);

  const initialPositions = useMemo(() => LETTERS.map(() => ({
    y: -300 - (Math.random() * 60),
    x: (Math.random() - 0.5) * 200,
    rotate: Math.random() * 180 - 90,
  })), []);

  useEffect(() => {
    const measureLetters = () => {
      const measurements: number[] = [];
      const tempSpan = document.createElement("span");
      tempSpan.style.cssText = "position:absolute;visibility:hidden;font-size:clamp(4.5rem, 12vw + 1rem, 9rem);font-weight:900;letter-spacing:-0.025em;font-family:var(--font-instrument-serif),Georgia,serif;font-style:italic;";
      document.body.appendChild(tempSpan);

      LETTERS.forEach(letter => {
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
  }, []);

  useEffect(() => {
    if (skipAnimation) {
      onComplete();
      return;
    }

    const t1 = setTimeout(() => setPhase("stacking"), 600);
    const t2 = setTimeout(() => setPhase("shuffling"), 1400);
    const t3 = setTimeout(() => { setPhase("done"); onComplete(); }, 2500);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete, skipAnimation]);

  const handleClick = () => { if (phase === "done" && onReplay) onReplay(); };

  const getOffset = (i: number) => {
    if (letterOffsets.length > 0) return letterOffsets[i];
    // Fallback: estimate ~65px per letter at typical viewport widths
    const avgWidth = 65;
    const totalWidth = LETTERS.length * avgWidth;
    return (i * avgWidth) - (totalWidth / 2) + (avgWidth / 2);
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative h-[240px] sm:h-[320px] flex items-center justify-center"
      style={{ overflow: "visible" }}
      onClick={handleClick}
      whileHover={phase === "done" ? { scale: 1.02 } : undefined}
      whileTap={phase === "done" ? { scale: 0.98 } : undefined}
      title={phase === "done" ? "Click to replay animation" : undefined}
    >
      <div className={`relative flex items-center justify-center ${phase === "done" ? "cursor-pointer" : ""}`} style={{ overflow: "visible" }}>
        {LETTERS.map((letter, i) => {
          const finalX = getOffset(i);
          return (
            <motion.span
              key={i}
              className="font-black absolute"
              style={{
                fontSize: "clamp(4.5rem, 12vw + 1rem, 9rem)",
                fontFamily: "var(--font-instrument-serif), Georgia, serif",
                fontStyle: "italic",
                background: GRAD,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: `drop-shadow(0 4px 20px ${GLOW})`,
              }}
              initial={
                skipAnimation
                  ? { y: 0, x: finalX, opacity: 1, rotate: 0, scale: 1 }
                  : { y: initialPositions[i].y, x: initialPositions[i].x, opacity: 0, rotate: initialPositions[i].rotate, scale: 0.8 }
              }
              animate={
                phase === "falling"
                  ? { y: 0, x: 0, opacity: 1, rotate: (Math.random() - 0.5) * 30, scale: 1 }
                  : phase === "stacking"
                  ? { y: stackedPositions[LETTERS.length - 1 - i].y - 20, x: stackedPositions[LETTERS.length - 1 - i].x, opacity: 1, rotate: stackedPositions[LETTERS.length - 1 - i].rotate, scale: 1 }
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
        {phase === "done" && (
          <motion.span
            className="absolute font-mono font-normal"
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "clamp(0.75rem, 1.5vw, 1rem)",
              color: "var(--muted)",
              right: "-2em",
              top: "0.5em",
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.6, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            4.1
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}

interface StaticTitleProps {
  readonly onClick?: () => void;
}

export function StaticTitle({ onClick }: StaticTitleProps) {
  return (
    <motion.h1
      className="font-black tracking-tight cursor-pointer"
      style={{
        fontFamily: "var(--font-instrument-serif), Georgia, serif",
        fontSize: "clamp(4.5rem, 12vw + 1rem, 9rem)",
      }}
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
      <sup
        className="font-mono font-normal tracking-normal"
        style={{
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: "0.2em",
          color: "var(--muted)",
          verticalAlign: "super",
          marginLeft: "0.15em",
        }}
      >
        4.1
      </sup>
    </motion.h1>
  );
}
