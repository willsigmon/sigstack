"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GRAD } from "@/lib/palette";

interface NewsletterCardProps {
  readonly title: string;
  readonly description: string;
  readonly emoji: string;
  readonly borderColor: string;
  readonly accentColor: "orange" | "pink";
  readonly newsletterType: string;
}

export function NewsletterCard({
  title,
  description,
  emoji,
  borderColor,
  newsletterType,
}: NewsletterCardProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newsletter: newsletterType }),
      });

      if (response.ok) {
        setStatus("success");
        setMessage("You're in! Check your inbox.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage("Something went wrong. Try again?");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Try again?");
    }

    setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 3000);
  };

  return (
    <motion.div
      className="rounded-xl sm:rounded-2xl p-5 sm:p-6 border"
      style={{ background: "var(--surface)", borderColor }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      <div className="h-1 -mx-5 sm:-mx-6 -mt-5 sm:-mt-6 mb-4 sm:mb-5 rounded-t-xl sm:rounded-t-2xl" style={{ background: GRAD }} />

      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl sm:text-3xl">{emoji}</span>
        <div>
          <h3 className="text-base sm:text-lg font-bold" style={{ color: "var(--foreground)" }}>{title}</h3>
          <p className="text-xs sm:text-sm mt-1 leading-relaxed" style={{ color: "var(--muted)" }}>{description}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
          style={{
            background: "var(--background)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
          }}
          disabled={status === "loading" || status === "success"}
        />
        <motion.button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="rounded-full px-4 py-2 text-sm font-semibold text-white transition-all disabled:opacity-50"
          style={{ background: GRAD }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {status === "loading" ? "..." : status === "success" ? "Done" : "Subscribe"}
        </motion.button>
      </form>

      <AnimatePresence>
        {message && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`text-xs mt-2 ${status === "success" ? "text-green-600 dark:text-green-400" : "text-red-500"}`}
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
