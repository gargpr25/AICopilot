import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MODULES, MODULE_MAP } from "@/lib/modules-data";
import { getComponent } from "@/lib/components-data";
import { Card, LevelPill, Bullets } from "@/components/ui";
import { Icon } from "@/components/icon";
import { CATEGORIES } from "@/lib/categories";

export function generateStaticParams() {
  return MODULES.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = MODULE_MAP[slug];
  return m ? { title: `${m.title} · GenAI Atlas`, description: m.summary } : { title: "Not found" };
}

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = MODULE_MAP[slug];
  if (!m) notFound();
  const idx = MODULES.findIndex((x) => x.slug === slug);
  const prev = MODULES[idx - 1];
  const next = MODULES[idx + 1];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="glass-strong rounded-3xl p-6 md:p-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent3 font-bold text-white">{m.id}</span>
          <LevelPill level={m.level} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{m.title}</h1>
        <p className="mt-2 text-lg text-muted">{m.summary}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="text-base font-bold mb-3 flex items-center gap-2"><Icon name="Target" size={17} className="text-accent2" /> Learning Objectives</h2>
          <Bullets items={m.objectives} tone="ok" />
        </Card>
        <Card>
          <h2 className="text-base font-bold mb-3 flex items-center gap-2"><Icon name="Lightbulb" size={17} className="text-warn" /> Key Takeaways</h2>
          <Bullets items={m.keyTakeaways} />
        </Card>
      </div>

      <Card>
        <h2 className="text-base font-bold mb-3">Concepts in this module</h2>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {m.concepts.map((c) => {
            const comp = getComponent(c);
            if (!comp) return null;
            return (
              <Link key={c} href={`/components/${c}`} className="group glass rounded-xl p-3 transition hover:-translate-y-0.5 hover:glow" style={{ borderLeft: `3px solid ${CATEGORIES[comp.category].color}` }}>
                <div className="font-medium text-sm flex items-center justify-between">{comp.name} <Icon name="ArrowUpRight" size={14} className="opacity-0 group-hover:opacity-100" /></div>
                <div className="text-xs text-muted mt-0.5">{comp.tagline}</div>
              </Link>
            );
          })}
        </div>
      </Card>

      {m.overview && (
        <Card>
          <h2 className="text-base font-bold mb-3 flex items-center gap-2"><Icon name="BookOpen" size={17} className="text-accent" /> Overview</h2>
          <p className="text-sm text-muted leading-relaxed">{m.overview}</p>
        </Card>
      )}

      {m.commonMistakes && m.commonMistakes.length > 0 && (
        <Card>
          <h2 className="text-base font-bold mb-3 flex items-center gap-2"><Icon name="AlertTriangle" size={17} className="text-danger" /> Common Mistakes</h2>
          <Bullets items={m.commonMistakes} tone="danger" />
        </Card>
      )}

      {m.practicalExercises && m.practicalExercises.length > 0 && (
        <Card>
          <h2 className="text-base font-bold mb-3 flex items-center gap-2"><Icon name="Wrench" size={17} className="text-accent2" /> Practical Exercises</h2>
          <Bullets items={m.practicalExercises} tone="ok" />
        </Card>
      )}

      {m.interviewQuestions && m.interviewQuestions.length > 0 && (
        <Card>
          <h2 className="text-base font-bold mb-3 flex items-center gap-2"><Icon name="MessageSquare" size={17} className="text-accent3" /> Interview Questions</h2>
          <Bullets items={m.interviewQuestions} />
        </Card>
      )}

      <div className="flex items-center justify-between gap-3">
        {prev ? (
          <Link href={`/learn/${prev.slug}`} className="glass rounded-xl px-4 py-3 text-sm hover:bg-white/10 transition flex items-center gap-2">
            <Icon name="ArrowLeft" size={15} /> <span className="hidden sm:inline">{prev.title}</span><span className="sm:hidden">Prev</span>
          </Link>
        ) : <span />}
        {next ? (
          <Link href={`/learn/${next.slug}`} className="glass rounded-xl px-4 py-3 text-sm hover:bg-white/10 transition flex items-center gap-2">
            <span className="hidden sm:inline">{next.title}</span><span className="sm:hidden">Next</span> <Icon name="ArrowRight" size={15} />
          </Link>
        ) : <span />}
      </div>
    </div>
  );
}
