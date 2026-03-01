"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { URLS } from "@/lib/constants";

interface NewsletterCardProps {
  readonly title: string;
  readonly description: string;
  readonly emoji: string;
  readonly gradient: string;
  readonly borderColor: string;
  readonly accentColor: "purple" | "orange";
  readonly newsletterType: string;
}

const BUTTON_COLORS = {
  purple: "from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400",
  orange: "from-orange-500 to-pink-500 hover:from-orange-400 hover:to-pink-400",
} as const;

const RESET_DELAY_MS = 3000;

export function NewsletterCard({
  title,
  description,
  emoji,
  gradient,
  borderColor,
  accentColor,
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
      const response = await fetch(URLS.SUBSCRIBE_API, {
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
    }, RESET_DELAY_MS);
  };

  return (
    <motion.div
      className={`rounded-xl sm:rounded-2xl p-5 sm:p-6 bg-gradient-to-br ${gradient} backdrop-blur-md border ${borderColor}`}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl sm:text-3xl">{emoji}</span>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white">{title}</h3>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 leading-relaxed">{description}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <label htmlFor={`email-${newsletterType}`} className="sr-only">
          Email address for {title}
        </label>
        <input
          id={`email-${newsletterType}`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-label={`Email address for ${title}`}
          aria-required="true"
          className="flex-1 rounded-lg px-3 py-2 text-sm bg-white/10 border border-white/20 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/30"
          disabled={status === "loading" || status === "success"}
        />
        <motion.button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className={`rounded-lg px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r ${BUTTON_COLORS[accentColor]} transition-all disabled:opacity-50 cursor-pointer min-h-[44px]`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {status === "loading" ? "..." : status === "success" ? "✓" : "Subscribe"}
        </motion.button>
      </form>

      <AnimatePresence>
        {message && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`text-xs mt-2 ${status === "success" ? "text-green-400" : "text-red-400"}`}
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
