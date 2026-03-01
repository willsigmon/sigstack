"use client";

import { FadeIn } from "@/components/ui/FadeIn";
import { SectionIcon } from "@/components/shared/SectionIcon";

const NETWORK_ITEMS = [
  {
    title: "Local Server (Tower)",
    description:
      "A home server running Unraid handles persistent services: n8n for workflow automation, PostgreSQL for life logging, and Home Assistant for smart home integration. All accessible via Tailscale VPN from any device.",
  },
  {
    title: "Multi-Device Sync",
    description:
      "Code lives on GitHub. Config and memory persist on BRAIN. Syncthing keeps dotfiles synchronized across machines. Claude Code sessions can continue across any terminal with full context.",
  },
  {
    title: "Voice-First Workflow",
    description:
      "Omi captures conversations and memories throughout the day. Typeless converts natural speech directly into formatted prompts. Voice input enables hands-free coding and ideation.",
  },
  {
    title: "Memory Persistence",
    description:
      "Letta Subconscious provides cross-session memory that survives context resets. Combined with Omi for conversation history and the memory graph, Claude maintains full continuity across sessions and devices.",
  },
] as const;

export function TheNetwork() {
  return (
    <section id="the-network" className="relative mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-12">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[300px] sm:w-[400px] h-[150px] sm:h-[200px] bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full filter blur-[80px]" />
      </div>

      <FadeIn>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 text-center flex items-center justify-center gap-2 sm:gap-3">
          <SectionIcon type="server" /> The Network
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm text-center mb-8 sm:mb-12">
          How everything syncs together
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="rounded-xl sm:rounded-2xl p-5 sm:p-8 bg-white/[0.04] backdrop-blur-md border border-white/[0.1]">
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
            {NETWORK_ITEMS.map((item) => (
              <div key={item.title}>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">{item.title}</h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
