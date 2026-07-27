import type { Architecture } from "./types";

export const ARCHITECTURES: Architecture[] = [
  {
    slug: "chatgpt", name: "ChatGPT", vendor: "OpenAI", tagline: "General-purpose conversational assistant at massive scale.",
    steps: [
      { label: "User", slug: "prompt-box", detail: "Types a message in the chat composer." },
      { label: "Edge / Gateway", slug: "api-gateway", detail: "Global edge routing, auth, rate limiting." },
      { label: "Conversation Store", slug: "conversation-memory", detail: "Loads prior turns for continuity." },
      { label: "Tools / Retrieval", slug: "tool-calling", detail: "Optional web browsing, code, file search." },
      { label: "GPT model", slug: "llm", detail: "Frontier model generates the response." },
      { label: "Streaming", slug: "streaming", detail: "Tokens streamed back to the UI." },
    ],
    highlights: ["Massive multi-tenant scale", "Optional tools (browsing, code interpreter)", "Streaming-first UX"],
    stack: ["GPT-4o / o-series", "Tool calling", "Memory", "SSE streaming"],
  },
  {
    slug: "cursor", name: "Cursor", vendor: "Anysphere", tagline: "AI code editor with deep codebase context and MCP.",
    steps: [
      { label: "IDE", slug: "prompt-box", detail: "Developer asks in the editor." },
      { label: "Codebase Indexing", slug: "embeddings", detail: "Embeds the repo for semantic code search." },
      { label: "Retriever", slug: "retrieval", detail: "Pulls relevant files/symbols as context." },
      { label: "MCP", slug: "mcp", detail: "Connects to tools: filesystem, terminal, git, docs." },
      { label: "LLM", slug: "llm", detail: "Claude/GPT reasons over code + context." },
      { label: "Edit Code", slug: "tool-calling", detail: "Applies multi-file edits back to the editor." },
    ],
    highlights: ["Repo-wide embeddings", "MCP tool ecosystem", "Multi-file agentic edits"],
    stack: ["Claude / GPT", "Codebase embeddings", "MCP", "Agent loop"],
  },
  {
    slug: "github-copilot", name: "GitHub Copilot", vendor: "GitHub / Microsoft", tagline: "Inline code completion + chat in the editor.",
    steps: [
      { label: "Editor", slug: "prompt-box", detail: "Cursor position + open files." },
      { label: "Context Gathering", slug: "context-builder", detail: "Current file, neighbors, symbols." },
      { label: "Retriever", slug: "retrieval", detail: "Relevant snippets from the repo." },
      { label: "Prompt Builder", slug: "prompt-assembly", detail: "Assembles fill-in-the-middle prompt." },
      { label: "LLM", slug: "llm", detail: "Code model predicts the completion." },
      { label: "Completion", slug: "streaming", detail: "Ghost text streamed inline." },
    ],
    highlights: ["Fill-in-the-middle prompting", "Low-latency completions", "Repo-aware context"],
    stack: ["Codex-class model", "FIM prompting", "Editor context"],
  },
  {
    slug: "perplexity", name: "Perplexity", vendor: "Perplexity AI", tagline: "Answer engine that searches the web and cites sources.",
    steps: [
      { label: "Question", slug: "prompt-box", detail: "User asks a question." },
      { label: "Search Engine", slug: "external-apis", detail: "Live web search for candidate pages." },
      { label: "Crawler / Fetch", slug: "document-parsing", detail: "Fetches + extracts page content." },
      { label: "Retriever + Rerank", slug: "reranking", detail: "Selects the most relevant passages." },
      { label: "LLM", slug: "llm", detail: "Synthesizes an answer from sources." },
      { label: "Citations", slug: "context-builder", detail: "Renders answer with inline citations." },
    ],
    highlights: ["Live web retrieval", "Citation-first answers", "Freshness over parametric memory"],
    stack: ["Web search", "Re-ranking", "RAG", "Citations"],
  },
  {
    slug: "notebooklm", name: "NotebookLM", vendor: "Google", tagline: "Grounded assistant over your uploaded documents.",
    steps: [
      { label: "Upload Docs", slug: "document-parsing", detail: "Parse PDFs, slides, links." },
      { label: "Chunk + Embed", slug: "chunking", detail: "Split and embed sources." },
      { label: "Vector Store", slug: "vector-database", detail: "Index the user's corpus." },
      { label: "Retriever", slug: "retrieval", detail: "Grounds answers strictly in sources." },
      { label: "Gemini", slug: "gemini", detail: "Long-context synthesis + audio overview." },
      { label: "Cited Answer", slug: "context-builder", detail: "Answers with source citations." },
    ],
    highlights: ["Source-grounded only", "Long-context Gemini", "Audio overviews"],
    stack: ["Gemini", "RAG", "Long context", "Citations"],
  },
  {
    slug: "enterprise-rag", name: "Enterprise RAG", vendor: "Reference architecture", tagline: "Secure, grounded assistant over internal knowledge.",
    steps: [
      { label: "Documents", slug: "document-parsing", detail: "Ingest from SharePoint, Drive, Confluence." },
      { label: "Extraction / OCR", slug: "document-parsing", detail: "Clean text, tables, and scans." },
      { label: "Chunk + Embed", slug: "chunking", detail: "Chunk with metadata + ACLs." },
      { label: "Vector DB", slug: "vector-database", detail: "Tenant-isolated, metadata-filtered index." },
      { label: "Hybrid Retrieve + Rerank", slug: "hybrid-search", detail: "BM25 + vectors + cross-encoder." },
      { label: "Grounding", slug: "grounding", detail: "Enforce answer from retrieved context." },
      { label: "LLM", slug: "llm", detail: "Generates the grounded, cited answer." },
    ],
    highlights: ["ACL-aware retrieval", "Hybrid search + re-ranking", "Auditability + evals"],
    stack: ["Hybrid retrieval", "Metadata filtering", "Guardrails", "Observability"],
  },
];

export const ARCHITECTURE_MAP: Record<string, Architecture> = Object.fromEntries(
  ARCHITECTURES.map((a) => [a.slug, a]),
);
