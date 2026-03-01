"use client";

import { useEffect, useState } from "react";

type AccentColor = "purple" | "blue" | "pink" | "cyan";

interface FloatingAccentsProps {
  readonly count?: number;
  readonly color?: AccentColor;
}

const COLOR_MAP: Record<AccentColor, string> = {
  purple: "bg-purple-400",
  blue: "bg-blue-400",
  pink: "bg-pink-400",
  cyan: "bg-cyan-400",
};

interface Accent {
  readonly left: number;
  readonly top: number;
  readonly size: number;
  readonly delay: number;
}

export function FloatingAccents({ count = 6, color = "purple" }: FloatingAccentsProps) {
  const [accents, setAccents] = useState<readonly Accent[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: generate random positions client-side to avoid hydration mismatch
    setAccents(
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 2 + Math.random() * 4,
        delay: Math.random() * 2,
      }))
    );
  }, [count]);

  if (accents.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {accents.map((accent, i) => (
        <div
          key={i}
          className={`absolute ${COLOR_MAP[color]} rounded-full animate-float opacity-30`}
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
