"use client";

import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/FadeIn";
import { FloatingAccents } from "@/components/shared/FloatingAccents";
import { StackCard } from "@/components/shared/StackCard";
import { allStackItems, mcpServers } from "@/data/stack";

export function TheStack() {
  return (
    <section id="the-stack" className="relative mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
      <FloatingAccents count={8} color="purple" />
      <FadeIn>
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-2 text-center">The Stack</h2>
        <p className="text-zinc-400 text-sm sm:text-base text-center mb-8 sm:mb-10">
          Tools that power the workflow
        </p>
      </FadeIn>

      {/* All tools in a unified grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
        {allStackItems.map((item, i) => (
          <StackCard key={item.name} {...item} index={i} />
        ))}
      </div>

      {/* MCP Servers */}
      <div className="mt-8 sm:mt-10">
        <h3 className="text-xs sm:text-sm font-medium text-zinc-400 mb-4 uppercase tracking-widest text-center">
          MCP Servers
        </h3>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {mcpServers.map((server, i) => (
            <motion.div
              key={server.name}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.1]"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              transition={{ delay: i * 0.03 }}
              viewport={{ once: true }}
            >
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white text-sm font-medium">{server.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
