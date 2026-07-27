import type { Metadata } from "next";
import { CHEATSHEETS } from "@/lib/reference-data";
import { Card, SectionHeading } from "@/components/ui";
import { Icon } from "@/components/icon";

export const metadata: Metadata = {
  title: "Cheat Sheets · GenAI Atlas",
  description: "Production checklists and quick references for building GenAI systems.",
};

export default function CheatSheetsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <SectionHeading eyebrow="Quick Reference" title="Cheat Sheets" subtitle="Battle-tested checklists you can pin next to your keyboard." />
      <div className="grid gap-4 md:grid-cols-2">
        {CHEATSHEETS.map((c) => (
          <Card key={c.slug}>
            <h2 className="text-base font-bold mb-3 flex items-center gap-2"><Icon name="ScrollText" size={17} className="text-accent2" /> {c.title}</h2>
            <div className="space-y-3">
              {c.sections.map((s) => (
                <div key={s.heading}>
                  <div className="text-xs font-semibold uppercase tracking-wide text-accent2/80 mb-1.5">{s.heading}</div>
                  <ul className="space-y-1">
                    {s.items.map((it) => (
                      <li key={it} className="flex gap-2 text-sm">
                        <Icon name="Check" size={15} className="text-ok mt-0.5 shrink-0" />
                        <span className="text-foreground/85">{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
