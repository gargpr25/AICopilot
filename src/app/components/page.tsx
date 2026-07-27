import type { Metadata } from "next";
import { ComponentGrid } from "@/components/component-grid";
import { SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Component Explorer · GenAI Atlas",
  description: "Every component of a modern GenAI system, deeply explained with the consistent 'why' schema.",
};

export default function ComponentsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <SectionHeading
        eyebrow="Component Worlds"
        title="Component Explorer"
        subtitle="Every building block of a modern GenAI system. Each opens into its own world: purpose, inputs/outputs, code, trade-offs, real production usage, and interview questions."
      />
      <ComponentGrid />
    </div>
  );
}
