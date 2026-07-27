import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading, LevelPill } from "@/components/ui";
import { CATEGORY_LIST } from "@/lib/categories";
import { componentsByCategory } from "@/lib/components-data";

export const metadata: Metadata = {
  title: "Architecture Explorer · GenAI Atlas",
  description: "Browse the GenAI stack layer by layer.",
};

export default function ExplorerPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <SectionHeading
        eyebrow="Architecture Explorer"
        title="The stack, layer by layer"
        subtitle="16 layers of the modern GenAI system. Jump to a layer and explore its components."
      />

      <div className="flex flex-wrap gap-1.5 mb-8">
        {CATEGORY_LIST.map((c) => (
          <a key={c.id} href={`#${c.id}`} className="rounded-full px-2.5 py-1 text-xs border transition hover:brightness-125" style={{ borderColor: `${c.color}44`, color: c.color, background: `${c.color}12` }}>
            {c.name}
          </a>
        ))}
      </div>

      <div className="space-y-10">
        {CATEGORY_LIST.map((c) => {
          const comps = componentsByCategory(c.id);
          return (
            <section key={c.id} id={c.id} className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-3">
                <span className="h-8 w-1.5 rounded-full" style={{ background: c.color }} />
                <div>
                  <h2 className="text-xl font-bold" style={{ color: c.color }}>{c.name}</h2>
                  <p className="text-sm text-muted">{c.blurb}</p>
                </div>
              </div>
              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {comps.map((comp) => (
                  <Link key={comp.slug} href={`/components/${comp.slug}`} className="group glass rounded-xl p-3.5 transition hover:-translate-y-0.5 hover:glow">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{comp.name}</span>
                      <LevelPill level={comp.level} />
                    </div>
                    <div className="text-xs text-muted mt-1 flex items-center gap-1">
                      {comp.tagline}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
