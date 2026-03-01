"use client";

import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/FadeIn";
import { FloatingAccents } from "@/components/shared/FloatingAccents";
import { LOOP_STEPS, SUPERPOWERS } from "@/lib/constants";

export function Philosophy() {
  return (
    <section id="philosophy" className="relative mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
      <FloatingAccents count={6} color="pink" />
      <FadeIn>
        <motion.div
          className="rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-14 bg-gradient-to-br from-purple-800/30 via-transparent to-blue-800/30 backdrop-blur-md border border-white/[0.12] relative overflow-hidden"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          {/* Animated gradient line */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />

          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-3 sm:mb-4 text-center">
            The Sigstack Loop
          </h2>
          <p className="text-zinc-300 text-xs sm:text-sm max-w-2xl mx-auto text-center mb-6 sm:mb-8">
            THE workflow for every feature, bug fix, and change.
          </p>

          {/* The Loop Visualization */}
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-8 sm:mb-12 text-xs sm:text-sm">
            {LOOP_STEPS.map((step, i) => (
              <div key={step} className="flex items-center gap-2 sm:gap-3">
                <span className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gradient-to-r from-purple-500/30 to-blue-500/30 text-white font-semibold border border-white/20">
                  {step}
                </span>
                {i < LOOP_STEPS.length - 1 && <span className="text-zinc-500">&rarr;</span>}
              </div>
            ))}
            <span className="text-zinc-500 ml-1">&#8635;</span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white mb-4 text-center">Superpowers Mode</h3>
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            {SUPERPOWERS.map((item, i) => (
              <motion.div
                key={item.principle}
                className="bg-white/[0.08] rounded-lg sm:rounded-xl p-3 sm:p-5 hover:bg-white/[0.12] transition-colors border border-white/[0.08]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -3 }}
              >
                <div className="font-semibold text-white text-xs sm:text-sm mb-0.5 sm:mb-1">
                  {item.principle}
                </div>
                <div className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{item.meaning}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </FadeIn>
    </section>
  );
}
