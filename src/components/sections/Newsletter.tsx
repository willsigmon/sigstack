"use client";

import { FadeIn } from "@/components/ui/FadeIn";
import { FloatingAccents } from "@/components/shared/FloatingAccents";
import { NewsletterCard } from "@/components/shared/NewsletterCard";
import { NEWSLETTER_CONFIG } from "@/lib/constants";

export function Newsletter() {
  return (
    <section id="newsletter" className="relative mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
      <FloatingAccents count={5} color="blue" />
      <FadeIn>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 text-center">
          The SigStack Newsletter
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm text-center mb-8 sm:mb-10">
          Curated news delivered to your inbox. Choose your flavor.
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 max-w-3xl mx-auto">
          <NewsletterCard {...NEWSLETTER_CONFIG.AI_NEWS} />
          <NewsletterCard {...NEWSLETTER_CONFIG.PERSONAL_DIGEST} />
        </div>
      </FadeIn>
    </section>
  );
}
