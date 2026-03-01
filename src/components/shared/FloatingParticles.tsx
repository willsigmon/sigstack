"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const PARTICLE_COUNT = 20;

interface Particle {
  readonly left: number;
  readonly top: number;
  readonly duration: number;
  readonly delay: number;
}

export function FloatingParticles() {
  const [particles, setParticles] = useState<readonly Particle[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: generate random positions client-side to avoid hydration mismatch
    setParticles(
      Array.from({ length: PARTICLE_COUNT }, () => ({
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
          style={{ left: `${particle.left}%`, top: `${particle.top}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.5, 0.2] }}
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
