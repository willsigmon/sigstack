"use client";

import { useEffect, useState } from "react";
import { NAV_SECTIONS } from "@/lib/constants";

const SECTION_IDS = NAV_SECTIONS.map((s) => s.id);

export function useActiveSection(): string {
  const [activeSection, setActiveSection] = useState<string>(SECTION_IDS[0]);

  useEffect(() => {
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      }
    };

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    });

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return activeSection;
}
