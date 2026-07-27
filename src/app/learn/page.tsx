import type { Metadata } from "next";
import Link from "next/link";
import { MODULES } from "@/lib/modules-data";
import { SectionHeading, LevelPill } from "@/components/ui";
import { Icon } from "@/components/icon";

export const metadata: Metadata = {
  title: "Learning Path · GenAI Atlas",
  description: "20 modules from Introduction to Generative AI up to Scaling.",
};

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <SectionHeading eyebrow="Guided Learning" title="Learning Path" subtitle="20 modules, beginner to expert. Each links to the interactive components it teaches." />
      <div className="relative space-y-3 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-border">
        {MODULES.map((m) => (
          <Link key={m.slug} href={`/learn/${m.slug}`} className="group relative flex gap-4 glass rounded-2xl p-4 pl-5 transition hover:-translate-y-0.5 hover:glow">
            <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent3 text-sm font-bold text-white">{m.id}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold">{m.title}</span>
                <LevelPill level={m.level} />
              </div>
              <p className="text-sm text-muted mt-1">{m.summary}</p>
            </div>
            <Icon name="ArrowRight" size={18} className="self-center text-muted transition group-hover:translate-x-1 group-hover:text-accent2" />
          </Link>
        ))}
      </div>
    </div>
  );
}
