"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/FadeIn";
import { A1, GRAD } from "@/lib/palette";
import type { StackItem } from "@/data/stack";

interface StackCardProps extends StackItem {
  readonly index: number;
}

export function StackCard({
  name,
  description,
  logo,
  fallbackLetter,
  bgColor,
  glowColor,
  url,
  highlight,
  index,
}: StackCardProps) {
  return (
    <FadeIn delay={index * 0.05}>
      <motion.a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`group relative block rounded-2xl p-5 sm:p-6 border overflow-hidden ${
          highlight ? "ring-2 ring-[#D4A574]/50" : ""
        }`}
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          boxShadow: highlight ? `0 10px 40px ${glowColor}30` : undefined,
        }}
        whileHover={{ scale: 1.05, y: -6 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: GRAD }} />

        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 blur-2xl -z-10 transition-opacity duration-300"
          style={{ backgroundColor: glowColor || A1 }}
        />

        <div className="flex flex-col items-center text-center gap-3">
          <motion.div
            className={`h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 rounded-2xl ${bgColor} flex items-center justify-center shadow-lg border`}
            style={{ borderColor: "var(--border)" }}
            whileHover={{ scale: 1.15, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {logo ? (
              <Image
                src={logo}
                alt={name}
                width={48}
                height={48}
                className="object-contain w-10 h-10 sm:w-12 sm:h-12"
                style={{ maxWidth: 48, maxHeight: 48 }}
                unoptimized
              />
            ) : fallbackLetter ? (
              <span className="font-black text-2xl sm:text-3xl" style={{ color: "var(--foreground)" }}>{fallbackLetter}</span>
            ) : null}
          </motion.div>

          <div>
            <h3
              className="font-bold text-sm sm:text-base transition-colors leading-tight"
              style={{ color: highlight ? glowColor : "var(--foreground)" }}
            >
              {name}
            </h3>
            <p className="text-xs sm:text-sm mt-1" style={{ color: "var(--muted)" }}>{description}</p>
          </div>
        </div>
      </motion.a>
    </FadeIn>
  );
}
