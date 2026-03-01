"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ShowcaseProject } from "@/data/showcase";

interface ShowcaseCardProps {
  readonly project: ShowcaseProject;
}

export function ShowcaseCard({ project }: ShowcaseCardProps) {
  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 bg-white/[0.04] backdrop-blur-md border border-white/[0.1] overflow-hidden"
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        {/* App icon */}
        <motion.div
          className="flex-shrink-0"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Image
            src={project.icon}
            alt={`${project.name} Icon`}
            width={64}
            height={64}
            className="rounded-[14px] shadow-lg w-14 h-14 sm:w-16 sm:h-16"
          />
        </motion.div>

        {/* Content */}
        <div className="flex-1 text-center sm:text-left">
          <p className="text-zinc-500 text-xs mb-0.5 sm:mb-1">{project.builtWith}</p>
          <h3 className="text-base sm:text-lg font-bold text-white mb-0.5 sm:mb-1">
            {project.name}
            {project.badge && (
              <span className="ml-2 inline-flex items-center rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-medium text-green-400 border border-green-500/30">
                {project.badge}
              </span>
            )}
          </h3>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-md">{project.description}</p>
        </div>

        {/* CTA */}
        <div className="inline-flex items-center gap-2 rounded-lg sm:rounded-xl px-4 sm:px-5 py-2 sm:py-2.5 bg-white/[0.1] border border-white/[0.15] text-white text-xs sm:text-sm font-medium group-hover:bg-white/[0.15] transition-colors">
          View App
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
      </div>
    </motion.a>
  );
}
