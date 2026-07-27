import type { Metadata } from "next";
import { INTERVIEW_QUESTIONS } from "@/lib/reference-data";
import { Card, SectionHeading } from "@/components/ui";
import { Icon } from "@/components/icon";

export const metadata: Metadata = {
  title: "Interview Questions · GenAI Atlas",
  description: "Curated GenAI architecture interview questions by topic.",
};

export default function InterviewPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <SectionHeading eyebrow="Prepare" title="Interview Questions" subtitle="The questions that actually come up for GenAI / AI engineer and architect roles, grouped by topic." />
      <div className="space-y-4">
        {INTERVIEW_QUESTIONS.map((g) => (
          <Card key={g.category}>
            <h2 className="text-base font-bold mb-3 flex items-center gap-2"><Icon name="MessageCircleQuestion" size={17} className="text-accent3" /> {g.category}</h2>
            <ul className="space-y-2.5">
              {g.questions.map((q) => (
                <li key={q} className="flex gap-2.5 text-sm">
                  <span className="text-accent3 font-mono shrink-0">Q</span>
                  <span className="text-foreground/85">{q}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
