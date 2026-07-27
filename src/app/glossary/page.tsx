import type { Metadata } from "next";
import Link from "next/link";
import { GLOSSARY } from "@/lib/reference-data";
import { SectionHeading } from "@/components/ui";
import { Icon } from "@/components/icon";

export const metadata: Metadata = {
  title: "Glossary · GenAI Atlas",
  description: "Every GenAI term, defined and linked to its interactive component.",
};

export default function GlossaryPage() {
  const sorted = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term));
  return (
    <div className="mx-auto max-w-4xl">
      <SectionHeading eyebrow="Reference" title="Glossary" subtitle="Every term, defined in one line — with a link to explore it further." />
      <div className="grid gap-3 sm:grid-cols-2">
        {sorted.map((g) => (
          <div key={g.term} className="glass rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{g.term}</span>
              {g.slug && (
                <Link href={`/components/${g.slug}`} className="text-accent2" aria-label={`Explore ${g.term}`}>
                  <Icon name="ArrowUpRight" size={15} />
                </Link>
              )}
            </div>
            <p className="text-sm text-muted mt-1">{g.definition}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
