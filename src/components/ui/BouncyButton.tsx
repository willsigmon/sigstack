"use client";

import { motion } from "framer-motion";
import { GRAD } from "@/lib/palette";

interface BouncyButtonProps {
  readonly children: React.ReactNode;
  readonly href: string;
  readonly className?: string;
  readonly glow?: boolean;
  readonly style?: React.CSSProperties;
}

export function BouncyButton({ children, href, className, glow = false, style }: BouncyButtonProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      className={`relative group ${className}`}
      style={style}
      whileHover={{ scale: 1.08, y: -4 }}
      whileTap={{ scale: 0.95, y: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 15, mass: 0.8 }}
    >
      {glow && (
        <motion.div
          className="absolute -inset-1 rounded-2xl blur-lg opacity-50 group-hover:opacity-80"
          style={{ background: GRAD, backgroundSize: "200% 200%" }}
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
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
