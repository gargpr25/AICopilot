"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "@/components/icon";

const CHAIN = [
  { label: "Prompt", color: "#60a5fa" },
  { label: "API", color: "#818cf8" },
  { label: "Retrieval", color: "#34d399" },
  { label: "Embeddings", color: "#22d3ee" },
  { label: "Re-rank", color: "#34d399" },
  { label: "LLM", color: "#a78bfa" },
  { label: "Tools", color: "#e879f9" },
  { label: "Stream", color: "#c084fc" },
];

export function Hero() {
  return (
    <div className="relative overflow-hidden rounded-3xl glass-strong p-8 md:p-14">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-accent3/20 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-3xl"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-3 py-1 text-xs text-muted mb-5">
          <span className="h-1.5 w-1.5 rounded-full bg-ok animate-pulse" />
          Interactive · Zoomable · Simulatable
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
          The <span className="gradient-text">Google Maps</span> of
          <br /> Generative AI systems
        </h1>
        <p className="mt-5 text-lg text-muted max-w-2xl">
          Don&apos;t memorize isolated tools. Follow a prompt through the entire AI ecosystem —
          from the moment you press Enter to the final streamed token — and click into every component to explore it in depth.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/flow" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent3 px-5 py-3 font-semibold text-white glow">
            <Icon name="Play" size={18} /> Run the End-to-End Flow
          </Link>
          <Link href="/atlas" className="inline-flex items-center gap-2 rounded-xl border border-border bg-white/5 px-5 py-3 font-semibold hover:bg-white/10 transition">
            <Icon name="Map" size={18} /> Open the Atlas
          </Link>
        </div>
      </motion.div>

      {/* animated chain */}
      <div className="relative mt-10 flex flex-wrap items-center gap-2">
        {CHAIN.map((c, i) => (
          <div key={c.label} className="flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.12 }}
              className="rounded-xl border px-3 py-1.5 text-sm font-medium"
              style={{ background: `${c.color}1a`, borderColor: `${c.color}44`, color: c.color }}
            >
              {c.label}
            </motion.div>
            {i < CHAIN.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2 }}
              >
                <Icon name="ChevronRight" size={16} className="text-muted" />
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
