"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { A1, A2 } from "@/lib/palette";

interface Particle {
  readonly left: number;
  readonly top: number;
  readonly duration: number;
  readonly delay: number;
}

export function FloatingParticles() {
  const [particles, setParticles] = useState<readonly Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 15 }, () => ({
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
          animate={{ y: [0, -30, 0], opacity: [0.1, 0.25, 0.1] }}
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
