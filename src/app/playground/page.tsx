import type { Metadata } from "next";
import { Playground } from "@/components/playground/playground";
import { SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Playground · GenAI Atlas",
  description: "Simulate embeddings, BM25 vs vector vs hybrid retrieval, chunking, RAG, agents, and MCP — entirely in your browser.",
};

export default function PlaygroundPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <SectionHeading
        eyebrow="AI Playground"
        title="Simulate the whole pipeline"
        subtitle="No API keys needed — these run locally to build intuition. Slide between keyword and semantic search, watch chunks form, and step through a RAG or agent loop."
      />
      <Playground />
    </div>
  );
}
