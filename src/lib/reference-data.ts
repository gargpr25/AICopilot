import type { ComparisonTable, GlossaryEntry, CheatSheet } from "./types";

export const COMPARISONS: ComparisonTable[] = [
  {
    slug: "bm25-vs-vector", title: "BM25 vs Vector Search",
    columns: ["Dimension", "BM25 (Lexical)", "Vector Search (Semantic)"],
    rows: [
      ["Matches on", "Exact terms / keywords", "Meaning / semantics"],
      ["Synonyms", "Misses them", "Handles them"],
      ["Rare tokens / IDs / codes", "Excellent", "Often misses"],
      ["Cost", "Cheap, no embeddings", "Embedding + ANN cost"],
      ["Interpretability", "High", "Low (opaque)"],
      ["Best for", "Names, codes, exact phrases", "Paraphrase, concepts"],
    ],
    takeaway: "They fail in opposite ways — combine them with hybrid search + re-ranking.",
  },
  {
    slug: "vector-vs-hybrid", title: "Vector Search vs Hybrid Search",
    columns: ["Dimension", "Pure Vector", "Hybrid (BM25 + Vector)"],
    rows: [
      ["Recall", "Good on semantics", "Best overall"],
      ["Exact matches", "Weak", "Strong"],
      ["Complexity", "Lower", "Higher (fusion + tuning)"],
      ["Robustness across queries", "Variable", "Consistent"],
      ["Fusion method", "N/A", "Reciprocal Rank Fusion"],
    ],
    takeaway: "Hybrid is the safe default for production RAG; always re-rank afterwards.",
  },
  {
    slug: "pinecone-vs-weaviate", title: "Pinecone vs Weaviate vs Qdrant",
    columns: ["Dimension", "Pinecone", "Weaviate", "Qdrant"],
    rows: [
      ["Hosting", "Managed / serverless", "OSS + cloud", "OSS + cloud"],
      ["Hybrid search", "Add-on", "Native", "Native"],
      ["Ops burden", "None", "Medium", "Medium (Rust, fast)"],
      ["Lock-in", "Higher", "Lower", "Lower"],
      ["Best for", "Zero-ops scale", "Batteries-included", "Self-host + filtering"],
    ],
    takeaway: "Managed for speed-to-market; OSS for control and cost at scale.",
  },
  {
    slug: "faiss-vs-chroma", title: "FAISS vs Chroma",
    columns: ["Dimension", "FAISS", "Chroma"],
    rows: [
      ["Type", "ANN library", "Lightweight DB"],
      ["Persistence", "DIY", "Built-in"],
      ["Metadata filtering", "DIY", "Built-in"],
      ["Scale", "Very high (with work)", "Prototype / small"],
      ["Best for", "Custom high-perf search", "Local dev + demos"],
    ],
    takeaway: "FAISS is a building block; Chroma is a quick-start DB. Neither is a managed prod service.",
  },
  {
    slug: "openai-vs-claude", title: "OpenAI vs Claude vs Gemini",
    columns: ["Dimension", "OpenAI (GPT)", "Claude", "Gemini"],
    rows: [
      ["Strengths", "General, tooling", "Coding, long context, MCP", "Multimodal, huge context"],
      ["Context window", "Large", "Very large", "Largest"],
      ["Ecosystem", "Broadest", "MCP-native", "Google Cloud"],
      ["Weights", "Closed", "Closed", "Closed"],
    ],
    takeaway: "Route per task: cheap models for easy work, frontier models for hard reasoning.",
  },
  {
    slug: "agent-vs-workflow", title: "Agent vs Workflow",
    columns: ["Dimension", "Agent", "Workflow"],
    rows: [
      ["Control flow", "Model decides", "Predefined by you"],
      ["Predictability", "Lower", "Higher"],
      ["Flexibility", "High (dynamic)", "Low (fixed)"],
      ["Debuggability", "Harder", "Easier"],
      ["Best for", "Open-ended tasks", "Known, repeatable paths"],
    ],
    takeaway: "Use workflows when you know the steps; use agents only when the path is genuinely dynamic.",
  },
  {
    slug: "tool-calling-vs-mcp", title: "Tool Calling vs MCP",
    columns: ["Dimension", "Function Calling", "MCP"],
    rows: [
      ["Scope", "Per-app, per-provider", "Cross-app standard"],
      ["Reusability", "Low (rebuild per app)", "High (portable servers)"],
      ["Transport", "Provider API", "JSON-RPC (stdio/HTTP)"],
      ["Ecosystem", "Provider-specific", "Shared MCP servers"],
      ["Best for", "Simple, app-local tools", "Reusable integrations at scale"],
    ],
    takeaway: "Function calling is the primitive; MCP standardizes and shares it across apps.",
  },
  {
    slug: "redis-vs-vectordb", title: "Redis vs Vector DB",
    columns: ["Dimension", "Redis", "Vector DB"],
    rows: [
      ["Primary use", "State, cache, counters", "Semantic search over vectors"],
      ["Lookup", "Exact key", "Approximate nearest neighbor"],
      ["Latency", "Sub-ms", "Single-digit ms"],
      ["In GenAI", "Memory, rate limits, cache", "RAG retrieval, long-term memory"],
    ],
    takeaway: "Different jobs — Redis for fast state, vector DB for meaning-based retrieval.",
  },
  {
    slug: "chunking-strategies", title: "Chunking Strategy Comparison",
    columns: ["Strategy", "How", "Best for", "Watch out"],
    rows: [
      ["Fixed-size", "N tokens per chunk", "Simple, uniform text", "Cuts mid-thought"],
      ["Overlap / sliding", "Fixed + overlap", "Preserving context", "Duplication cost"],
      ["Recursive", "Split by separators recursively", "Structured docs", "Tuning separators"],
      ["Semantic", "Split at meaning boundaries", "Highest quality", "Compute cost"],
      ["Markdown-aware", "Respect headings/sections", "Docs/wikis", "Needs clean markup"],
    ],
    takeaway: "Respect semantic boundaries and add 10–20% overlap; measure retrieval quality.",
  },
  {
    slug: "memory-types", title: "Memory Types",
    columns: ["Type", "Lifespan", "Where it lives"],
    rows: [
      ["Short-term", "This request", "Context window"],
      ["Conversation", "This session", "Redis / store"],
      ["Long-term", "Across sessions", "Vector store"],
      ["Semantic", "Durable facts", "KG / vector store"],
    ],
    takeaway: "Match memory type to lifespan; summarize and forget to control cost.",
  },
  {
    slug: "embedding-models", title: "Embedding Model Comparison",
    columns: ["Model", "Notes", "Typical dims"],
    rows: [
      ["OpenAI text-embedding-3", "Strong general baseline", "1536 / 3072"],
      ["Cohere embed v3", "Great multilingual + rerank pairing", "1024"],
      ["Voyage", "Strong retrieval quality", "1024+"],
      ["BGE / E5 (open)", "Self-hostable, competitive", "768 / 1024"],
      ["Nomic (open)", "Long context, open", "768"],
    ],
    takeaway: "Use the same model for index + query; benchmark on YOUR data (MTEB is only a proxy).",
  },
  {
    slug: "agent-frameworks", title: "Agent Framework Comparison",
    columns: ["Framework", "Model", "Best for"],
    rows: [
      ["LangGraph", "Graph of steps", "Controllable, stateful agents"],
      ["CrewAI", "Role-based crews", "Multi-agent collaboration"],
      ["AutoGen", "Conversational agents", "Research / experimentation"],
      ["OpenAI Agents SDK", "Handoffs + tools", "OpenAI-centric stacks"],
    ],
    takeaway: "Prefer explicit, inspectable control flow (graphs) over free-for-all agent chatter.",
  },
];

export const COMPARISON_MAP: Record<string, ComparisonTable> = Object.fromEntries(
  COMPARISONS.map((c) => [c.slug, c]),
);

export const GLOSSARY: GlossaryEntry[] = [
  { term: "ANN", definition: "Approximate Nearest Neighbor — fast vector search that trades exactness for speed.", slug: "vector-database" },
  { term: "BM25", definition: "A probabilistic lexical ranking function; the backbone of keyword search.", slug: "bm25" },
  { term: "Chunking", definition: "Splitting documents into retrievable passages for embedding + retrieval.", slug: "chunking" },
  { term: "Context Window", definition: "Max tokens a model can attend to in one call (input + output).", slug: "context-window" },
  { term: "Cross-Encoder", definition: "A model that scores (query, passage) jointly for precise re-ranking.", slug: "cross-encoder" },
  { term: "Embedding", definition: "A dense vector representing the meaning of text.", slug: "embeddings" },
  { term: "Faithfulness", definition: "Whether an answer is actually supported by the retrieved context.", slug: "faithfulness" },
  { term: "Function Calling", definition: "The model emitting a structured call your code executes.", slug: "function-calling" },
  { term: "Grounding", definition: "Basing an answer on retrieved sources rather than parametric memory.", slug: "grounding" },
  { term: "Guardrails", definition: "Input/output safety filters around the model.", slug: "guardrails" },
  { term: "Hallucination", definition: "Confident but false or unsupported model output.", slug: "hallucination" },
  { term: "HNSW", definition: "A graph-based ANN index giving fast, high-recall vector search.", slug: "vector-database" },
  { term: "Hybrid Search", definition: "Fusing lexical (BM25) and semantic (vector) retrieval.", slug: "hybrid-search" },
  { term: "MCP", definition: "Model Context Protocol — an open standard for tools + context.", slug: "mcp" },
  { term: "Prompt Injection", definition: "Malicious text that overrides the system prompt.", slug: "prompt-injection" },
  { term: "RAG", definition: "Retrieval-Augmented Generation — grounding LLMs in retrieved data.", slug: "rag" },
  { term: "Re-ranking", definition: "Reordering retrieved candidates with a precise scorer.", slug: "reranking" },
  { term: "ReAct", definition: "Reason + Act loop for agents: think, call a tool, observe, repeat.", slug: "agent-reasoning" },
  { term: "RRF", definition: "Reciprocal Rank Fusion — combines rankings from multiple retrievers.", slug: "hybrid-search" },
  { term: "Token", definition: "The sub-word unit LLMs read and bill in (~4 chars in English).", slug: "tokens" },
  { term: "Temperature", definition: "A decoding parameter controlling output randomness.", slug: "temperature" },
  { term: "Vector Database", definition: "A store optimized for ANN search over embeddings.", slug: "vector-database" },
];

export const CHEATSHEETS: CheatSheet[] = [
  {
    slug: "rag-checklist", title: "RAG Production Checklist",
    sections: [
      { heading: "Ingestion", items: ["Parse cleanly (tables, OCR)", "Chunk with 10–20% overlap", "Attach source + ACL metadata", "Embed with a fixed model"] },
      { heading: "Retrieval", items: ["Hybrid (BM25 + vector)", "Over-retrieve (k≈50)", "Metadata / tenant filter", "Cross-encoder re-rank to ~5"] },
      { heading: "Generation", items: ["Cite sources", "Enforce grounding in system prompt", "Budget context tokens", "Handle 'no answer in context'"] },
      { heading: "Quality", items: ["Eval retrieval + generation separately", "Track faithfulness + groundedness", "Golden test set in CI"] },
    ],
  },
  {
    slug: "latency-budget", title: "Latency Budget (typical)",
    sections: [
      { heading: "Read path", items: ["Gateway + auth: ~5–20ms", "Embed query: ~30–80ms", "Vector search: ~5–20ms", "Re-rank (k=50): ~50–150ms", "LLM TTFT: ~300–800ms", "Streaming: rest of tokens"] },
      { heading: "Levers", items: ["Semantic cache for FAQs", "Smaller/faster models via router", "Parallelize retrieval arms", "Stream to hide total latency"] },
    ],
  },
  {
    slug: "security-checklist", title: "GenAI Security Checklist",
    sections: [
      { heading: "Input", items: ["Screen for prompt injection", "Cap tokens", "Detect + redact PII"] },
      { heading: "Tools/Agents", items: ["Least-privilege credentials", "Sandbox + timeout tools", "Human approval for risky actions", "Treat retrieved/tool content as untrusted"] },
      { heading: "Output", items: ["Moderate output", "Verify citations", "Redact PII before logging"] },
    ],
  },
  {
    slug: "model-params", title: "Sampling Parameters",
    sections: [
      { heading: "Temperature", items: ["0–0.3: factual, structured, deterministic", "0.7–1.0: creative, varied", "Use 0 for JSON/structured output"] },
      { heading: "Top-p / Top-k", items: ["top-p (nucleus): keep smallest set summing to p", "top-k: keep k most likely tokens", "Tune one, not both, aggressively"] },
    ],
  },
];

export const CHEATSHEET_MAP: Record<string, CheatSheet> = Object.fromEntries(
  CHEATSHEETS.map((c) => [c.slug, c]),
);

export const INTERVIEW_QUESTIONS: { category: string; questions: string[] }[] = [
  {
    category: "Retrieval & RAG",
    questions: [
      "Walk me through a production RAG pipeline end to end.",
      "Where does RAG most commonly fail, and how do you debug it?",
      "BM25 vs vector search — when does each win, and why use hybrid?",
      "What is Reciprocal Rank Fusion?",
      "Why over-retrieve then re-rank instead of just retrieving fewer?",
      "How do you choose chunk size and overlap?",
      "RAG vs fine-tuning — how do you decide?",
    ],
  },
  {
    category: "Embeddings & Vector DBs",
    questions: [
      "Why can't you compare embeddings from two different models?",
      "Cosine vs dot product vs Euclidean — when does the choice matter?",
      "HNSW vs IVF — trade-offs?",
      "How do you guarantee tenant isolation in a shared vector index?",
      "What breaks when your corpus grows 100x?",
    ],
  },
  {
    category: "LLMs & Inference",
    questions: [
      "What limits a model's context window?",
      "How do temperature, top-p, and top-k interact?",
      "How do you reduce hallucination in production?",
      "When would you reach for a reasoning model?",
      "How does streaming improve UX, and how do you implement it?",
    ],
  },
  {
    category: "Agents, Tools & MCP",
    questions: [
      "Agent vs workflow — how do you decide?",
      "How do you stop an agent from looping forever?",
      "Function calling vs MCP — what's the difference and when to use each?",
      "How do you secure tool execution and MCP servers?",
      "Design a multi-agent system for a research assistant.",
    ],
  },
  {
    category: "Production, Security & Scaling",
    questions: [
      "Draw the full production request path for a chat assistant.",
      "How do you defend against prompt injection with RAG + tools?",
      "How do you autoscale LLM inference, and on what signal?",
      "What do you cache in a GenAI system, and how?",
      "How do you evaluate a GenAI system before shipping a change?",
    ],
  },
];
