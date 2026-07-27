"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { COMPONENTS } from "@/lib/components-data";
import { MODULES } from "@/lib/modules-data";
import { ARCHITECTURES } from "@/lib/architectures-data";
import { FLAT_NAV } from "@/lib/nav";
import { CATEGORIES } from "@/lib/categories";
import { Icon } from "./icon";

interface Result {
  label: string;
  sub: string;
  href: string;
  kind: string;
  color?: string;
}

const INDEX: Result[] = [
  ...FLAT_NAV.map((n) => ({ label: n.label, sub: n.desc, href: n.href, kind: "Page" })),
  ...COMPONENTS.map((c) => ({
    label: c.name,
    sub: c.tagline,
    href: `/components/${c.slug}`,
    kind: CATEGORIES[c.category].name,
    color: CATEGORIES[c.category].color,
  })),
  ...MODULES.map((m) => ({ label: `Module ${m.id}: ${m.title}`, sub: m.summary, href: `/learn/${m.slug}`, kind: "Module" })),
  ...ARCHITECTURES.map((a) => ({ label: a.name, sub: a.tagline, href: `/architectures/${a.slug}`, kind: "Architecture" })),
];

export function SearchModal({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return INDEX.slice(0, 8);
    return INDEX.filter(
      (r) => r.label.toLowerCase().includes(query) || r.sub.toLowerCase().includes(query) || r.kind.toLowerCase().includes(query),
    ).slice(0, 20);
  }, [q]);

  function go(href: string) {
    onClose();
    router.push(href);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[12vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="glass-strong relative w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Icon name="Search" size={18} className="text-muted" />
          <input
            autoFocus
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") setActive((a) => Math.min(a + 1, results.length - 1));
              if (e.key === "ArrowUp") setActive((a) => Math.max(a - 1, 0));
              if (e.key === "Enter" && results[active]) go(results[active].href);
              if (e.key === "Escape") onClose();
            }}
            placeholder="Search components, modules, architectures…"
            className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-muted"
          />
          <kbd className="hidden sm:block rounded border border-border px-1.5 py-0.5 text-[10px] text-muted">ESC</kbd>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 && <div className="p-6 text-center text-sm text-muted">No results for “{q}”.</div>}
          {results.map((r, i) => (
            <button
              key={r.href + i}
              onMouseEnter={() => setActive(i)}
              onClick={() => go(r.href)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${i === active ? "bg-white/10" : "hover:bg-white/5"}`}
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{r.label}</div>
                <div className="text-xs text-muted truncate">{r.sub}</div>
              </div>
              <span
                className="shrink-0 rounded-full px-2 py-0.5 text-[10px]"
                style={{ background: `${r.color ?? "#7c8cff"}1a`, color: r.color ?? "#9aa5b8" }}
              >
                {r.kind}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
