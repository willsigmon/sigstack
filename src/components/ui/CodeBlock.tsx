"use client";

import { motion } from "framer-motion";

interface CodeBlockProps {
  readonly children: string;
}

export function CodeBlock({ children }: CodeBlockProps) {
  return (
    <motion.pre
      className="rounded-xl sm:rounded-2xl p-4 sm:p-6 overflow-x-auto text-[11px] sm:text-sm bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md border border-white/[0.1] shadow-2xl"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
    >
      <code className="text-emerald-300">{children}</code>
    </motion.pre>
  );
}
