import type { Metadata } from "next";
import { Card, SectionHeading, Pill } from "@/components/ui";
import { Icon } from "@/components/icon";

export const metadata: Metadata = {
  title: "Future Trends · GenAI Atlas",
  description: "Where Generative AI architecture is heading next.",
};

const TRENDS = [
  { icon: "Bot", title: "Agentic everything", body: "Systems shift from single completions to long-running, tool-using agents with planning, memory, and reflection — and orchestration frameworks to keep them controllable.", tags: ["Agents", "LangGraph", "Reflection"] },
  { icon: "Plug", title: "MCP as the integration standard", body: "The Model Context Protocol is becoming the USB-C for AI tools, collapsing N×M bespoke integrations into portable servers shared across apps.", tags: ["MCP", "Tools", "Interoperability"] },
  { icon: "Network", title: "GraphRAG & structured retrieval", body: "Flat chunk retrieval gives way to knowledge graphs and hybrid structured+semantic retrieval for multi-hop, global reasoning.", tags: ["GraphRAG", "Knowledge Graph"] },
  { icon: "Brain", title: "Reasoning & inference-time compute", body: "Models that 'think' longer at inference time trade latency for dramatically better reasoning, changing how we budget cost and route requests.", tags: ["Reasoning", "Routing"] },
  { icon: "Expand", title: "Long context vs RAG convergence", body: "Multi-million-token context windows blur the line with RAG; the winning pattern combines retrieval, compression, and long context.", tags: ["Context", "Compression"] },
  { icon: "ShieldCheck", title: "Security & governance maturity", body: "Prompt-injection defenses, agent sandboxing, provenance, and evaluation become first-class, regulated concerns rather than afterthoughts.", tags: ["Security", "Eval", "Governance"] },
  { icon: "Cpu", title: "Small, specialized & on-device models", body: "Cheap, fast small models handle the majority of routed traffic; on-device inference brings privacy and latency wins.", tags: ["SLMs", "Edge", "Routing"] },
  { icon: "Boxes", title: "Multimodal & world models", body: "Text-only pipelines expand to unified image, audio, video, and action models — reshaping ingestion, embeddings, and UIs.", tags: ["Multimodal"] },
];

export default function TrendsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <SectionHeading eyebrow="Looking Ahead" title="Future Trends" subtitle="The shifts reshaping GenAI architecture — and where the components in this Atlas are heading." />
      <div className="grid gap-4 md:grid-cols-2">
        {TRENDS.map((t) => (
          <Card key={t.title}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent2 mb-3">
              <Icon name={t.icon} size={20} />
            </div>
            <h2 className="font-bold">{t.title}</h2>
            <p className="text-sm text-muted mt-1.5">{t.body}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">{t.tags.map((tag) => <Pill key={tag}>{tag}</Pill>)}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
