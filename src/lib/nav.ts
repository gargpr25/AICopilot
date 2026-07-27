export interface NavItem {
  label: string;
  href: string;
  icon: string; // lucide icon name
  desc: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAV: NavSection[] = [
  {
    title: "Explore",
    items: [
      { label: "Home", href: "/", icon: "Home", desc: "Start here" },
      { label: "The Atlas", href: "/atlas", icon: "Map", desc: "Zoomable knowledge graph of everything" },
      { label: "End-to-End Flow", href: "/flow", icon: "Workflow", desc: "What happens after you press Enter — 4 zoom levels" },
      { label: "Architecture Explorer", href: "/explorer", icon: "Boxes", desc: "Browse components by layer" },
    ],
  },
  {
    title: "Learn",
    items: [
      { label: "Learning Path", href: "/learn", icon: "GraduationCap", desc: "20 modules, beginner → expert" },
      { label: "Component Explorer", href: "/components", icon: "Component", desc: "Every component, deeply explained" },
      { label: "Architecture Library", href: "/architectures", icon: "Building2", desc: "ChatGPT, Cursor, Copilot, Perplexity…" },
    ],
  },
  {
    title: "Practice",
    items: [
      { label: "Playground", href: "/playground", icon: "FlaskConical", desc: "Simulate embeddings, retrieval, RAG, agents" },
      { label: "Comparisons", href: "/compare", icon: "Table2", desc: "BM25 vs Vector, Pinecone vs Weaviate…" },
    ],
  },
  {
    title: "Reference",
    items: [
      { label: "Interview Questions", href: "/interview", icon: "MessageCircleQuestion", desc: "Curated by topic" },
      { label: "Cheat Sheets", href: "/cheatsheets", icon: "ScrollText", desc: "Checklists + quick refs" },
      { label: "Glossary", href: "/glossary", icon: "BookA", desc: "Every term, defined" },
      { label: "Future Trends", href: "/trends", icon: "Sparkles", desc: "Where GenAI is heading" },
    ],
  },
];

export const FLAT_NAV: NavItem[] = NAV.flatMap((s) => s.items);
