import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COMPONENTS, getComponent } from "@/lib/components-data";
import { CATEGORIES } from "@/lib/categories";
import { Card, CategoryBadge, LevelPill, Bullets, CodeBlock, Pill } from "@/components/ui";
import { Icon } from "@/components/icon";

export function generateStaticParams() {
  return COMPONENTS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getComponent(slug);
  if (!c) return { title: "Not found · GenAI Atlas" };
  return { title: `${c.name} · GenAI Atlas`, description: c.tagline };
}

function RelChips({ slugs, label, icon }: { slugs: string[]; label: string; icon: string }) {
  const resolved = slugs.map((s) => ({ slug: s, comp: getComponent(s) })).filter((r) => r.comp);
  if (resolved.length === 0) return null;
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted/70 mb-2">
        <Icon name={icon} size={13} /> {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {resolved.map((r) => (
          <Link key={r.slug} href={`/components/${r.slug}`} className="rounded-full border border-border bg-white/5 px-3 py-1 text-sm hover:bg-white/10 transition">
            {r.comp!.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

function WhyRow({ q, a }: { q: string; a: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border py-3 last:border-0 sm:flex-row sm:gap-4">
      <div className="text-sm font-semibold text-foreground sm:w-56 shrink-0">{q}</div>
      <div className="text-sm text-muted">{a}</div>
    </div>
  );
}

function IOTable({ title, items, color }: { title: string; items: { name: string; type: string; desc: string }[]; color: string }) {
  if (items.length === 0) return null;
  return (
    <div>
      <div className="text-sm font-semibold mb-2" style={{ color }}>{title}</div>
      <div className="space-y-2">
        {items.map((io) => (
          <div key={io.name} className="rounded-lg border border-border bg-white/5 p-2.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs" style={{ color }}>{io.name}</span>
              <span className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-muted">{io.type}</span>
            </div>
            <div className="text-xs text-muted mt-1">{io.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getComponent(slug);
  if (!c) notFound();

  const cat = CATEGORIES[c.category];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* header */}
      <div className="glass-strong rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl" style={{ background: `${cat.color}22` }} />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <CategoryBadge category={c.category} />
            <LevelPill level={c.level} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{c.name}</h1>
          <p className="mt-2 text-lg text-muted max-w-3xl">{c.tagline}</p>
          <p className="mt-4 text-foreground/85 max-w-3xl">{c.whatIsIt}</p>
        </div>
      </div>

      {/* Why view */}
      <Card>
        <div className="flex items-center gap-2 mb-2">
          <Icon name="HelpCircle" size={18} className="text-accent2" />
          <h2 className="text-lg font-bold">The &ldquo;Why&rdquo; View</h2>
        </div>
        <div>
          <WhyRow q="What problem does it solve?" a={c.whyItExists} />
          <WhyRow q="Why can't we skip it?" a={c.whyCantSkip} />
          <WhyRow q="What happens if we remove it?" a={c.ifRemoved} />
          <WhyRow q="Where does it sit?" a={c.whereItFits} />
          <WhyRow q="Who calls it?" a={c.calledBy.map((s) => getComponent(s)?.name ?? s).join(", ") || "Upstream pipeline stages"} />
          <WhyRow q="What does it call next?" a={c.callsNext.map((s) => getComponent(s)?.name ?? s).join(", ") || "Downstream stages"} />
          <WhyRow q="How does it scale?" a={c.scaling} />
          <WhyRow q="Performance profile?" a={c.performance} />
        </div>
      </Card>

      {/* IO + examples */}
      {(c.inputs.length > 0 || c.outputs.length > 0 || c.requestExample || c.responseExample) && (
        <div className="grid gap-4 md:grid-cols-2">
          {(c.inputs.length > 0 || c.outputs.length > 0) && (
            <Card>
              <h2 className="text-lg font-bold mb-4">Inputs & Outputs</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <IOTable title="Inputs" items={c.inputs} color={cat.color} />
                <IOTable title="Outputs" items={c.outputs} color="#34d399" />
              </div>
            </Card>
          )}
          {(c.requestExample || c.responseExample) && (
            <Card>
              <h2 className="text-lg font-bold mb-4">Request / Response</h2>
              <div className="space-y-3">
                {c.requestExample && <CodeBlock lang="request" code={c.requestExample} />}
                {c.responseExample && <CodeBlock lang="response" code={c.responseExample} />}
              </div>
            </Card>
          )}
        </div>
      )}

      {c.code && (
        <Card>
          <h2 className="text-lg font-bold mb-4">Code Example</h2>
          <CodeBlock lang={c.code.lang} code={c.code.body} />
        </Card>
      )}

      {/* pros/cons/mistakes */}
      <div className="grid gap-4 md:grid-cols-2">
        {c.advantages.length > 0 && (
          <Card>
            <h2 className="text-base font-bold mb-3 text-ok">Advantages</h2>
            <Bullets items={c.advantages} tone="ok" />
          </Card>
        )}
        {c.disadvantages.length > 0 && (
          <Card>
            <h2 className="text-base font-bold mb-3 text-danger">Disadvantages</h2>
            <Bullets items={c.disadvantages} tone="danger" />
          </Card>
        )}
        {c.bestPractices.length > 0 && (
          <Card>
            <h2 className="text-base font-bold mb-3 text-ok">Best Practices</h2>
            <Bullets items={c.bestPractices} tone="ok" />
          </Card>
        )}
        {c.commonMistakes.length > 0 && (
          <Card>
            <h2 className="text-base font-bold mb-3 text-danger">Common Mistakes</h2>
            <Bullets items={c.commonMistakes} tone="danger" />
          </Card>
        )}
      </div>

      {/* alternatives + companies */}
      <div className="grid gap-4 md:grid-cols-2">
        {c.alternatives.length > 0 && (
          <Card>
            <h2 className="text-base font-bold mb-3">Alternatives</h2>
            <div className="flex flex-wrap gap-2">
              {c.alternatives.map((a) => <Pill key={a}>{a}</Pill>)}
            </div>
          </Card>
        )}
        {c.realCompanies.length > 0 && (
          <Card>
            <h2 className="text-base font-bold mb-3">Real Companies Using It</h2>
            <div className="flex flex-wrap gap-2">
              {c.realCompanies.map((a) => (
                <span key={a} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/5 px-3 py-1 text-sm">
                  <Icon name="Building2" size={13} className="text-accent2" /> {a}
                </span>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* interview */}
      {c.interviewQuestions.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Icon name="MessageCircleQuestion" size={18} className="text-accent3" />
            <h2 className="text-lg font-bold">Interview Questions</h2>
          </div>
          <ul className="space-y-2">
            {c.interviewQuestions.map((q) => (
              <li key={q} className="flex gap-2.5 text-sm">
                <span className="text-accent3 font-mono">Q</span>
                <span className="text-foreground/85">{q}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* graph links */}
      <Card>
        <h2 className="text-lg font-bold mb-4">Connected Concepts</h2>
        <div className="space-y-4">
          <RelChips slugs={c.prerequisites} label="Prerequisites" icon="ArrowLeft" />
          <RelChips slugs={c.related} label="Related" icon="Link" />
          <RelChips slugs={c.advanced} label="Go deeper" icon="ArrowRight" />
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/atlas" className="inline-flex items-center gap-1.5 text-sm text-accent2 font-medium">
            <Icon name="Map" size={15} /> See it in the Atlas
          </Link>
          <Link href="/flow" className="inline-flex items-center gap-1.5 text-sm text-accent2 font-medium">
            <Icon name="Workflow" size={15} /> See it in the Flow
          </Link>
        </div>
      </Card>
    </div>
  );
}
