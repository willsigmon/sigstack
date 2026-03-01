"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileNav } from "@/components/layout/MobileNav";
import { useActiveSection } from "@/hooks/useActiveSection";
import { NAV_SECTIONS, SITE } from "@/lib/constants";

export function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const activeSection = useActiveSection();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setIsVisible(latest < 100 || latest < previous);
    setIsScrolled(latest > 50);
  });

  // Close mobile nav on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          isScrolled
            ? "bg-[var(--header-bg)] backdrop-blur-xl border-b border-[var(--header-border)]"
            : "bg-transparent"
        }`}
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <a href="#hero" className="font-black text-lg text-[var(--text-primary)] hover:opacity-80 transition-opacity">
            {SITE.NAME}
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {NAV_SECTIONS.filter((s) => s.id !== "hero").map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={`relative px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  activeSection === section.id
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {activeSection === section.id && (
                  <motion.div
                    className="absolute inset-0 bg-purple-500/15 rounded-lg"
                    layoutId="activeSection"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative">{section.label}</span>
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </motion.header>

      <MobileNav isOpen={isMenuOpen} activeSection={activeSection} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
