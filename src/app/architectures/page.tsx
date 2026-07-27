import type { Metadata } from "next";
import Link from "next/link";
import { ARCHITECTURES } from "@/lib/architectures-data";
import { SectionHeading, Pill } from "@/components/ui";
import { Icon } from "@/components/icon";

export const metadata: Metadata = {
  title: "Architecture Library · GenAI Atlas",
  description: "Reverse-engineer real GenAI products: ChatGPT, Cursor, GitHub Copilot, Perplexity, NotebookLM, and Enterprise RAG.",
};

export default function ArchitecturesPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <SectionHeading eyebrow="Real-World Examples" title="Architecture Library" subtitle="How real products assemble the same building blocks differently. Click any to trace its request flow." />
      <div className="grid gap-4 md:grid-cols-2">
        {ARCHITECTURES.map((a) => (
          <Link key={a.slug} href={`/architectures/${a.slug}`} className="group glass rounded-2xl p-5 transition hover:-translate-y-1 hover:glow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold flex items-center gap-1">{a.name} <Icon name="ArrowUpRight" size={15} className="opacity-0 group-hover:opacity-100" /></div>
                <div className="text-xs text-muted">{a.vendor}</div>
              </div>
              <Icon name="Building2" size={20} className="text-accent2" />
            </div>
            <p className="text-sm text-muted mt-2">{a.tagline}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {a.stack.map((s) => <Pill key={s}>{s}</Pill>)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
