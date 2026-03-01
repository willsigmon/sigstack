"use client";

import { FadeIn } from "@/components/ui/FadeIn";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { FloatingAccents } from "@/components/shared/FloatingAccents";
import { QUICK_START_CODE } from "@/lib/constants";

export function QuickStart() {
  return (
    <section id="quick-start" className="relative mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
      <FloatingAccents count={5} color="cyan" />
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[400px] sm:w-[600px] h-[250px] sm:h-[400px] bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full filter blur-[100px] sm:blur-[120px]" />
      </div>

      <FadeIn>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 text-center">
          Quick Start
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm text-center mb-8 sm:mb-12">
          Clone and install in 30 seconds
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="max-w-3xl mx-auto">
          <CodeBlock>{QUICK_START_CODE}</CodeBlock>
        </div>
      </FadeIn>
    </section>
  );
}
