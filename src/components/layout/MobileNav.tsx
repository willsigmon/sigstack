"use client";

import { motion, AnimatePresence } from "framer-motion";
import { NAV_SECTIONS } from "@/lib/constants";

interface MobileNavProps {
  readonly isOpen: boolean;
  readonly activeSection: string;
  readonly onClose: () => void;
}

export function MobileNav({ isOpen, activeSection, onClose }: MobileNavProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.nav
            className="fixed top-0 right-0 z-50 h-full w-64 bg-[var(--background)]/95 backdrop-blur-xl border-l border-[var(--border)] p-6"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Close navigation menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mt-12 flex flex-col gap-1">
              {NAV_SECTIONS.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={onClose}
                  className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors min-h-[44px] flex items-center ${
                    activeSection === section.id
                      ? "bg-purple-500/20 text-white"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)]"
                  }`}
                >
                  {section.label}
                </a>
              ))}
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
