"use client";

import { motion } from "framer-motion";

interface FadeInProps {
  readonly children: React.ReactNode;
  readonly delay?: number;
  readonly className?: string;
}

export function FadeIn({ children, delay = 0, className = "" }: FadeInProps) {
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
