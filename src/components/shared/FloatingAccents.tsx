"use client";

import { useEffect, useState } from "react";

type AccentColor = "orange" | "pink" | "warm" | "amber";

const COLOR_MAP: Record<AccentColor, string> = {
  orange: "bg-orange-400",
  pink: "bg-pink-400",
  warm: "bg-amber-400",
  amber: "bg-amber-500",
};

interface Accent {
  readonly left: number;
  readonly top: number;
  readonly size: number;
  readonly delay: number;
}

export function FloatingAccents({ count = 6, color = "orange" }: { count?: number; color?: AccentColor }) {
  const [accents, setAccents] = useState<readonly Accent[]>([]);

  useEffect(() => {
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
          className={`absolute ${COLOR_MAP[color]} rounded-full animate-float opacity-20`}
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
