import Link from "next/link";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/categories";
import type { CategoryId } from "@/lib/types";
import { Icon } from "./icon";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("glass rounded-2xl p-5", className)}>{children}</div>;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-6", className)}>
      {eyebrow && (
        <div className="text-xs font-semibold uppercase tracking-widest text-accent2 mb-2">{eyebrow}</div>
      )}
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
      {subtitle && <p className="text-muted mt-2 max-w-2xl">{subtitle}</p>}
    </div>
  );
}

export function CategoryBadge({ category, className }: { category: CategoryId; className?: string }) {
  const c = CATEGORIES[category];
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", className)}
      style={{ background: `${c.color}1a`, color: c.color, border: `1px solid ${c.color}33` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: c.color }} />
      {c.name}
    </span>
  );
}

export function LevelPill({ level }: { level: number | string }) {
  const map: Record<string, string> = {
    "1": "Beginner", "2": "Intermediate", "3": "Advanced", "4": "Expert",
    Beginner: "Beginner", Intermediate: "Intermediate", Advanced: "Advanced", Expert: "Expert",
  };
  const label = map[String(level)] ?? String(level);
  const colors: Record<string, string> = {
    Beginner: "#34d399", Intermediate: "#22d3ee", Advanced: "#a78bfa", Expert: "#f472b6",
  };
  const color = colors[label] ?? "#9aa5b8";
  return (
    <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: `${color}1a`, color, border: `1px solid ${color}33` }}>
      {label}
    </span>
  );
}

export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border border-border bg-white/5 px-2.5 py-0.5 text-xs text-muted", className)}>
      {children}
    </span>
  );
}

export function LinkCard({
  href,
  icon,
  title,
  desc,
  color,
}: {
  href: string;
  icon: string;
  title: string;
  desc: string;
  color?: string;
}) {
  return (
    <Link
      href={href}
      className="group glass rounded-2xl p-5 transition hover:-translate-y-1 hover:glow flex flex-col gap-3"
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl"
        style={{ background: `${color ?? "#7c8cff"}1f`, color: color ?? "#7c8cff" }}
      >
        <Icon name={icon} size={20} />
      </div>
      <div>
        <div className="font-semibold flex items-center gap-1.5">
          {title}
          <Icon name="ArrowUpRight" size={15} className="opacity-0 -translate-x-1 transition group-hover:opacity-100 group-hover:translate-x-0" />
        </div>
        <div className="text-sm text-muted mt-1">{desc}</div>
      </div>
    </Link>
  );
}

export function Bullets({ items, tone = "muted" }: { items: string[]; tone?: "muted" | "ok" | "danger" }) {
  const dot = tone === "ok" ? "text-ok" : tone === "danger" ? "text-danger" : "text-accent2";
  const glyph = tone === "danger" ? "X" : "Check";
  return (
    <ul className="space-y-2">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2.5 text-sm">
          <Icon name={tone === "muted" ? "Dot" : glyph} size={16} className={cn("mt-0.5 shrink-0", dot)} />
          <span className="text-foreground/85">{it}</span>
        </li>
      ))}
    </ul>
  );
}

export function CodeBlock({ lang, code }: { lang?: string; code: string }) {
  return (
    <div className="rounded-xl border border-border bg-black/40 overflow-hidden">
      {lang && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-border text-[11px] text-muted">
          <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-warn/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-ok/70" />
          <span className="ml-2 font-mono uppercase tracking-wide">{lang}</span>
        </div>
      )}
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed font-mono text-foreground/90">
        <code>{code}</code>
      </pre>
    </div>
  );
}
