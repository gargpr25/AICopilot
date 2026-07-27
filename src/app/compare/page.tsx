import type { Metadata } from "next";
import Link from "next/link";
import { COMPARISONS } from "@/lib/reference-data";
import { SectionHeading } from "@/components/ui";
import { Icon } from "@/components/icon";

export const metadata: Metadata = {
  title: "Comparisons · GenAI Atlas",
  description: "Side-by-side comparison tables for the key GenAI decisions.",
};

function Table({ columns, rows }: { columns: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-white/5">
            {columns.map((c, i) => (
              <th key={c} className={`px-3 py-2.5 text-left font-semibold ${i === 0 ? "text-muted" : ""}`}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className="border-t border-border">
              {r.map((cell, ci) => (
                <td key={ci} className={`px-3 py-2.5 align-top ${ci === 0 ? "font-medium text-muted" : "text-foreground/85"}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-5xl">
      <SectionHeading eyebrow="Compare Mode" title="Comparison Tables" subtitle="The trade-offs behind every big GenAI decision, side by side." />
      <div className="space-y-8">
        {COMPARISONS.map((c) => (
          <section key={c.slug} id={c.slug} className="scroll-mt-24">
            <h2 className="text-lg font-bold mb-3">{c.title}</h2>
            <Table columns={c.columns} rows={c.rows} />
            <div className="mt-2 flex items-start gap-2 text-sm text-muted">
              <Icon name="Lightbulb" size={16} className="text-warn mt-0.5 shrink-0" />
              <span><span className="font-medium text-foreground">Takeaway:</span> {c.takeaway}</span>
            </div>
          </section>
        ))}
      </div>
      <div className="mt-8">
        <Link href="/playground" className="inline-flex items-center gap-1.5 text-sm text-accent2 font-medium">
          <Icon name="FlaskConical" size={15} /> Try BM25 vs Vector vs Hybrid live in the Playground
        </Link>
      </div>
    </div>
  );
}
