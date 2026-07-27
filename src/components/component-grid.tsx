"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { COMPONENTS } from "@/lib/components-data";
import { CATEGORIES, CATEGORY_LIST } from "@/lib/categories";
import type { CategoryId } from "@/lib/types";
import { CategoryBadge, LevelPill } from "@/components/ui";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

export function ComponentGrid() {
  const [cat, setCat] = useState<CategoryId | "all">("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return COMPONENTS.filter((c) => (cat === "all" || c.category === cat))
      .filter((c) => !query || c.name.toLowerCase().includes(query) || c.tagline.toLowerCase().includes(query) || c.whatIsIt.toLowerCase().includes(query))
      .sort((a, b) => a.level - b.level);
  }, [cat, q]);

  return (
    <div>
      <div className="flex flex-col gap-3 mb-5">
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter components…"
            className="w-full rounded-xl border border-border bg-white/5 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-accent"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setCat("all")}
            className={cn("rounded-full px-3 py-1 text-xs border transition", cat === "all" ? "bg-white/10 border-accent" : "border-border text-muted hover:bg-white/5")}
          >
            All ({COMPONENTS.length})
          </button>
          {CATEGORY_LIST.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className="rounded-full px-2.5 py-1 text-xs border transition"
              style={{
                background: cat === c.id ? `${c.color}2e` : "transparent",
                borderColor: cat === c.id ? c.color : "rgba(255,255,255,0.08)",
                color: cat === c.id ? c.color : "#9aa5b8",
              }}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <Link
            key={c.slug}
            href={`/components/${c.slug}`}
            className="group glass rounded-2xl p-4 transition hover:-translate-y-1 hover:glow flex flex-col"
            style={{ borderTop: `2px solid ${CATEGORIES[c.category].color}` }}
          >
            <div className="flex items-center justify-between gap-2">
              <CategoryBadge category={c.category} />
              <LevelPill level={c.level} />
            </div>
            <div className="font-semibold mt-3 flex items-center gap-1">
              {c.name}
              <Icon name="ArrowUpRight" size={14} className="opacity-0 transition group-hover:opacity-100" />
            </div>
            <div className="text-sm text-muted mt-1 flex-1">{c.tagline}</div>
          </Link>
        ))}
      </div>
      {filtered.length === 0 && <div className="glass rounded-2xl p-8 text-center text-muted">No components match your filter.</div>}
    </div>
  );
}
