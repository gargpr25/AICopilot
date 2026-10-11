import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARCHITECTURES, ARCHITECTURE_MAP } from "@/lib/architectures-data";
import { getComponent } from "@/lib/components-data";
import { Card, Pill, Bullets } from "@/components/ui";
import { Icon } from "@/components/icon";

export function generateStaticParams() {
  return ARCHITECTURES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = ARCHITECTURE_MAP[slug];
  return a ? { title: `${a.name} architecture · GenAI Atlas`, description: a.tagline } : { title: "Not found" };
}

export default async function ArchitecturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = ARCHITECTURE_MAP[slug];
  if (!a) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="glass-strong rounded-3xl p-6 md:p-8">
        <div className="text-xs text-accent2 font-semibold uppercase tracking-widest">{a.vendor}</div>
        <h1 className="text-3xl font-bold tracking-tight mt-1">{a.name}</h1>
        <p className="mt-2 text-lg text-muted">{a.tagline}</p>
        <div className="flex flex-wrap gap-1.5 mt-4">{a.stack.map((s) => <Pill key={s}>{s}</Pill>)}</div>
      </div>

      <Card>
        <h2 className="text-lg font-bold mb-4">Request flow</h2>
        <div className="space-y-2">
          {a.steps.map((s, i) => (
            <div key={i}>
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-bold">{i + 1}</div>
                  {i < a.steps.length - 1 && <div className="w-px flex-1 bg-border my-1" />}
                </div>
                <div className="pb-4 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{s.label}</span>
                    {s.slug && getComponent(s.slug) && (
                      <Link href={`/components/${s.slug}`} className="text-xs text-accent2 inline-flex items-center gap-0.5 hover:underline">
                        explore <Icon name="ArrowUpRight" size={12} />
                      </Link>
                    )}
                  </div>
                  <p className="text-sm text-muted mt-0.5">{s.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-base font-bold mb-3">What makes it distinctive</h2>
        <Bullets items={a.highlights} tone="ok" />
      </Card>

      {a.overview && (
        <Card>
          <h2 className="text-base font-bold mb-3">Overview</h2>
          <p className="text-sm text-muted leading-relaxed">{a.overview}</p>
        </Card>
      )}

      {a.keyDecisions && a.keyDecisions.length > 0 && (
        <Card>
          <h2 className="text-base font-bold mb-3">Key architectural decisions</h2>
          <Bullets items={a.keyDecisions} tone="ok" />
        </Card>
      )}

      {a.tradeoffs && a.tradeoffs.length > 0 && (
        <Card>
          <h2 className="text-base font-bold mb-3">Trade-offs</h2>
          <Bullets items={a.tradeoffs} tone="danger" />
        </Card>
      )}

      {a.scaleNotes && (
        <Card>
          <h2 className="text-base font-bold mb-3">At scale</h2>
          <p className="text-sm text-muted leading-relaxed">{a.scaleNotes}</p>
        </Card>
      )}

      {a.lessonsLearned && a.lessonsLearned.length > 0 && (
        <Card>
          <h2 className="text-base font-bold mb-3">Lessons learned</h2>
          <Bullets items={a.lessonsLearned} tone="ok" />
        </Card>
      )}

      <Link href="/architectures" className="inline-flex items-center gap-1.5 text-sm text-accent2 font-medium">
        <Icon name="ArrowLeft" size={15} /> All architectures
      </Link>
    </div>
  );
}
