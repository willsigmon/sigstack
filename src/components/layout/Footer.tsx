"use client";

import { motion } from "framer-motion";
import { SITE, SOCIAL_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.1] py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6">
          <div className="text-center sm:text-left">
            <div className="font-black text-lg sm:text-xl text-white mb-1">{SITE.NAME}</div>
            <div className="text-xs sm:text-sm text-zinc-400">{SITE.BUILT_WITH}</div>
          </div>
          <div className="flex gap-4 sm:gap-6">
            {SOCIAL_LINKS.map((social) => (
              <motion.a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${social.label} (opens in new tab)`}
                className="text-zinc-400 hover:text-white transition-colors p-1"
                whileHover={{ scale: 1.2, y: -2 }}
              >
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  fill={social.stroke ? "none" : "currentColor"}
                  stroke={social.stroke ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  {social.stroke ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={social.iconPath}
                    />
                  ) : (
                    <path d={social.iconPath} />
                  )}
                </svg>
              </motion.a>
            ))}
          </div>
        </div>
        <div className="mt-8 sm:mt-10 text-center text-xs sm:text-sm text-zinc-500">{SITE.LICENSE}</div>
      </div>
    </footer>
  );
}
