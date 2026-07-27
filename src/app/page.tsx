import Link from "next/link";
import { Hero } from "@/components/home/hero";
import { LinkCard, SectionHeading, CategoryBadge } from "@/components/ui";
import { Icon } from "@/components/icon";
import { COMPONENTS } from "@/lib/components-data";
import { MODULES } from "@/lib/modules-data";
import { ARCHITECTURES } from "@/lib/architectures-data";
import { CATEGORY_LIST } from "@/lib/categories";

const FEATURES = [
  { href: "/flow", icon: "Workflow", title: "End-to-End Flow", desc: "Animate a prompt through 4 zoom levels — simple to enterprise.", color: "#7c8cff" },
  { href: "/atlas", icon: "Map", title: "The Atlas", desc: "A zoomable, interconnected map of every GenAI concept.", color: "#22d3ee" },
  { href: "/components", icon: "Component", title: "Component Worlds", desc: "Each component: why it exists, inputs/outputs, code, trade-offs.", color: "#f472b6" },
  { href: "/playground", icon: "FlaskConical", title: "Playground", desc: "Simulate embeddings, BM25 vs vector vs hybrid, chunking, RAG, agents.", color: "#34d399" },
  { href: "/learn", icon: "GraduationCap", title: "Learning Path", desc: "20 modules from Intro to GenAI up to Scaling.", color: "#a78bfa" },
  { href: "/architectures", icon: "Building2", title: "Architecture Library", desc: "Reverse-engineer ChatGPT, Cursor, Copilot, Perplexity & more.", color: "#fb923c" },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl space-y-14">
      <Hero />

      <section>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { n: COMPONENTS.length + "+", l: "Components" },
            { n: MODULES.length.toString(), l: "Modules" },
            { n: ARCHITECTURES.length.toString(), l: "Real architectures" },
            { n: "4", l: "Zoom levels" },
          ].map((s) => (
            <div key={s.l} className="glass rounded-2xl p-5 text-center">
              <div className="text-3xl font-bold gradient-text">{s.n}</div>
              <div className="text-xs text-muted mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading eyebrow="Explore" title="Six ways to learn the stack" subtitle="Every path is interactive. Click, drag, zoom, and simulate — no passive reading." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <LinkCard key={f.href} {...f} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading eyebrow="The big question" title="What happens after you press Enter?" subtitle="Follow the request through every layer. Each node is clickable." />
        <Link href="/flow" className="group block glass rounded-2xl p-6 hover:glow transition">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-3 text-sm">
            {["Prompt Box", "API Gateway", "Auth", "Memory", "Grounding", "Embedding", "Hybrid Retrieval", "Re-rank", "Context Builder", "LLM", "Tools / MCP", "Streaming", "Render"].map((n, i, arr) => (
              <span key={n} className="flex items-center gap-2">
                <span className="rounded-lg border border-border bg-white/5 px-2.5 py-1">{n}</span>
                {i < arr.length - 1 && <Icon name="ArrowRight" size={14} className="text-muted" />}
              </span>
            ))}
          </div>
          <div className="mt-4 inline-flex items-center gap-1.5 text-accent2 text-sm font-medium">
            Open the interactive flow <Icon name="ArrowRight" size={15} className="transition group-hover:translate-x-1" />
          </div>
        </Link>
      </section>

      <section>
        <SectionHeading eyebrow="Coverage" title="16 layers of the modern GenAI stack" />
        <div className="flex flex-wrap gap-2">
          {CATEGORY_LIST.map((c) => (
            <Link key={c.id} href={`/explorer#${c.id}`}>
              <CategoryBadge category={c.id} className="text-sm px-3 py-1 hover:brightness-125 transition" />
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading eyebrow="Learning Path" title="Start from zero" subtitle="A guided journey. Pick up wherever you are." />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.slice(0, 8).map((m) => (
            <Link key={m.slug} href={`/learn/${m.slug}`} className="glass rounded-2xl p-4 hover:-translate-y-1 hover:glow transition">
              <div className="text-xs text-accent2 font-semibold">Module {m.id}</div>
              <div className="font-semibold mt-1 text-sm">{m.title}</div>
              <div className="text-xs text-muted mt-1.5 line-clamp-2">{m.summary}</div>
            </Link>
          ))}
        </div>
        <div className="mt-4">
          <Link href="/learn" className="inline-flex items-center gap-1.5 text-sm text-accent2 font-medium">
            See all 20 modules <Icon name="ArrowRight" size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}
