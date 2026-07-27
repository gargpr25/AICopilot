import type { Metadata } from "next";
import { FlowCanvas } from "@/components/flow/flow-canvas";
import { SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "End-to-End Flow · GenAI Atlas",
  description: "Animate a prompt through the full GenAI pipeline across 4 zoom levels — from simple to enterprise.",
};

export default function FlowPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <SectionHeading
        eyebrow="Guided Journey"
        title="What happens after you press Enter?"
        subtitle="Watch a request travel through the entire pipeline. Switch zoom levels from a 5-step mental model to a full enterprise architecture. Every node is clickable."
      />
      <FlowCanvas />
    </div>
  );
}
