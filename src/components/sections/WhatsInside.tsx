"use client";

import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/FadeIn";
import { WHATS_INSIDE_ITEMS } from "@/lib/constants";

export function WhatsInside() {
  return (
    <section id="whats-inside" className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
      <FadeIn>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 text-center">
          What&apos;s Inside
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm text-center mb-6 sm:mb-8">
          Everything you need to ship with Claude Code
        </p>
      </FadeIn>

      <div className="grid gap-3 sm:gap-5 grid-cols-2 lg:grid-cols-4">
        {WHATS_INSIDE_ITEMS.map((item, i) => (
          <FadeIn key={item.title} delay={i * 0.1}>
            <motion.div
              className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-gradient-to-br ${item.gradient} backdrop-blur-md border border-white/[0.12] h-full`}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <h3 className="text-sm sm:text-lg font-bold text-white mb-1 sm:mb-2">{item.title}</h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">{item.description}</p>
            </motion.div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
