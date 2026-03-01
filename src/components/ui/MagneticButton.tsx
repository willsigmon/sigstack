"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticButtonProps {
  readonly children: React.ReactNode;
  readonly href: string;
  readonly className?: string;
}

export function MagneticButton({ children, href, className }: MagneticButtonProps) {
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
      rel="noopener noreferrer"
      className={`relative overflow-hidden ${className}`}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        scale: 1.05,
        transition: { type: "spring", stiffness: 400, damping: 10 },
      }}
      whileTap={{
        scale: 0.92,
        transition: { type: "spring", stiffness: 400, damping: 10 },
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
