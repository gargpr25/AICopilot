import type { Metadata } from "next";
import { AtlasGraph } from "@/components/atlas/atlas-graph";
import { SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "The Atlas · GenAI Atlas",
  description: "A zoomable, interconnected knowledge graph of the entire Generative AI ecosystem.",
};

export default function AtlasPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <SectionHeading
        eyebrow="Free Exploration"
        title="The Atlas"
        subtitle="Every concept, connected. Zoom out to see the whole GenAI universe; zoom in and follow a path from Generative AI → Retrieval → Embeddings → Vector DBs, or → Agents → MCP → Tools."
      />
      <AtlasGraph />
    </div>
  );
}
