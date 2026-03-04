"use client";

import { motion } from "framer-motion";

interface CodeBlockProps {
  readonly children: string;
}

export function CodeBlock({ children }: CodeBlockProps) {
  return (
    <motion.pre
      className="rounded-xl sm:rounded-2xl p-4 sm:p-6 overflow-x-auto text-[11px] sm:text-sm shadow-lg border"
      style={{
        background: "linear-gradient(135deg, #3a3530 0%, #2e2a26 100%)",
        borderColor: "var(--border)",
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
    >
      <code style={{ color: "#d4a574" }}>{children}</code>
    </motion.pre>
  );
}
