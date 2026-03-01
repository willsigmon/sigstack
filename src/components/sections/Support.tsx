"use client";

import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/FadeIn";
import { SUPPORT_LINKS } from "@/lib/constants";

export function Support() {
  return (
    <section id="support" className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
      <FadeIn>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 text-center">
          Support the Stack
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm text-center mb-6 sm:mb-8">
          If this helps you ship faster, consider using my affiliate links
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-5">
          {SUPPORT_LINKS.map((item, i) => (
            <motion.a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative inline-flex items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl px-4 sm:px-7 py-3 sm:py-4 font-semibold text-sm sm:text-base overflow-hidden ${
                item.highlight
                  ? "bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white shadow-2xl shadow-purple-500/40"
                  : "bg-white/[0.08] backdrop-blur-md border-2 border-white/[0.15] text-white"
              }`}
              whileHover={{
                scale: 1.08,
                y: -4,
                boxShadow: item.highlight
                  ? "0 25px 50px rgba(168, 85, 247, 0.5)"
                  : "0 20px 40px rgba(255, 255, 255, 0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 12, delay: i * 0.05 }}
            >
              {/* Shimmer for highlighted */}
              {item.highlight && (
                <motion.div
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12"
                  animate={{ translateX: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 2, ease: "easeOut" }}
                />
              )}
              <motion.span
                className="text-lg sm:text-xl"
                animate={item.highlight ? { rotate: [0, -15, 15, 0] } : {}}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
              >
                {item.emoji}
              </motion.span>
              <span className="relative">{item.name}</span>
              {!item.highlight && (
                <motion.span
                  className="opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline"
                  initial={{ x: -5 }}
                  whileHover={{ x: 0 }}
                >
                  &rarr;
                </motion.span>
              )}
            </motion.a>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
