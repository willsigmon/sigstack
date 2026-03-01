"use client";

import { FadeIn } from "@/components/ui/FadeIn";
import { ShowcaseCard } from "@/components/shared/ShowcaseCard";
import { showcaseProjects } from "@/data/showcase";

export function Showcase() {
  return (
    <section id="showcase" className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
      <FadeIn>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 text-center">
          Showcase
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm text-center mb-6 sm:mb-8">
          Apps built with this stack
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {showcaseProjects.map((project) => (
            <ShowcaseCard key={project.name} project={project} />
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
