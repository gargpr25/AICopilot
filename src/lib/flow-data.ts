import type { CategoryId, FlowLevel } from "./types";

export interface FlowNode {
  id: string;
  label: string;
  category: CategoryId;
  slug?: string;
  note: string;
}

// Master node dictionary used across zoom levels
export const FLOW_NODES: Record<string, FlowNode> = {
  user: { id: "user", label: "User", category: "frontend", note: "A human with a question or task." },
  frontend: { id: "frontend", label: "Frontend", category: "frontend", slug: "chat-ui", note: "The app UI that captures the prompt and renders the answer." },
  "prompt-box": { id: "prompt-box", label: "Prompt Box", category: "frontend", slug: "prompt-box", note: "Where the user types the prompt." },
  api: { id: "api", label: "API", category: "backend", slug: "api-gateway", note: "The backend endpoint receiving the request." },
  gateway: { id: "gateway", label: "API Gateway", category: "backend", slug: "api-gateway", note: "Front door: routing, TLS, request IDs." },
  auth: { id: "auth", label: "Authentication", category: "backend", slug: "authentication", note: "Verifies identity and permissions." },
  ratelimit: { id: "ratelimit", label: "Rate Limiter", category: "backend", slug: "rate-limiter", note: "Enforces token + request budgets." },
  middleware: { id: "middleware", label: "Middleware", category: "backend", slug: "middleware", note: "Logging, tracing, correlation IDs." },
  validation: { id: "validation", label: "Prompt Validation", category: "backend", slug: "prompt-validation", note: "Bounds + screens the prompt." },
  enrichment: { id: "enrichment", label: "Prompt Enrichment", category: "backend", slug: "prompt-enrichment", note: "Adds user + app context." },
  memory: { id: "memory", label: "Conversation Memory", category: "memory", slug: "conversation-memory", note: "Recalls prior turns for continuity." },
  system: { id: "system", label: "System Prompt", category: "backend", slug: "system-prompt", note: "The model's operating instructions." },
  router: { id: "router", label: "Model Router", category: "backend", slug: "model-router", note: "Picks the right model for cost/latency/quality." },
  grounding: { id: "grounding", label: "Grounding Decision", category: "retrieval", slug: "grounding", note: "Decide whether to retrieve (RAG)." },
  embedding: { id: "embedding", label: "Embedding", category: "embeddings", slug: "embeddings", note: "Turns the query into a vector." },
  retriever: { id: "retriever", label: "Retriever", category: "retrieval", slug: "retrieval", note: "Fetches candidate passages." },
  bm25: { id: "bm25", label: "BM25", category: "retrieval", slug: "bm25", note: "Lexical keyword scoring." },
  vsearch: { id: "vsearch", label: "Vector Search", category: "retrieval", slug: "vector-search", note: "Semantic nearest-neighbor search." },
  hybrid: { id: "hybrid", label: "Hybrid Search", category: "retrieval", slug: "hybrid-search", note: "Fuses BM25 + vectors (RRF)." },
  metafilter: { id: "metafilter", label: "Metadata Filter", category: "retrieval", slug: "metadata-filter", note: "Constrains by tenant/date/source." },
  rerank: { id: "rerank", label: "Re-ranking", category: "retrieval", slug: "reranking", note: "Cross-encoder reorders candidates." },
  ctxbuild: { id: "ctxbuild", label: "Context Builder", category: "rag", slug: "context-builder", note: "Formats chunks + citations." },
  assembly: { id: "assembly", label: "Prompt Assembly", category: "rag", slug: "prompt-assembly", note: "Packs everything into the context window." },
  llm: { id: "llm", label: "LLM", category: "llm", slug: "llm", note: "Generates the response tokens." },
  tools: { id: "tools", label: "Tool Calling", category: "tools", slug: "tool-calling", note: "Executes model-requested tools." },
  mcp: { id: "mcp", label: "MCP Server", category: "mcp", slug: "mcp-server", note: "Standardized tool/data access." },
  db: { id: "db", label: "Database", category: "tools", slug: "database", note: "System of record." },
  apis: { id: "apis", label: "External APIs", category: "tools", slug: "external-apis", note: "Third-party services." },
  agent: { id: "agent", label: "Agent Reasoning", category: "agents", slug: "agent-reasoning", note: "Reason → act → observe loop." },
  response: { id: "response", label: "Response", category: "inference", slug: "streaming", note: "The generated answer." },
  streaming: { id: "streaming", label: "Streaming", category: "inference", slug: "streaming", note: "Tokens streamed to the client." },
  render: { id: "render", label: "Frontend Rendering", category: "frontend", slug: "streaming-ui", note: "Progressive rendering of the answer." },
  backend: { id: "backend", label: "Backend", category: "backend", slug: "api-gateway", note: "Server logic + orchestration." },
  retriever2: { id: "retriever2", label: "Retriever", category: "retrieval", slug: "retrieval", note: "Fetches context." },
  // enterprise extras
  cdn: { id: "cdn", label: "CDN / Edge", category: "scaling", slug: "caching", note: "Edge caching + static delivery." },
  lb: { id: "lb", label: "Load Balancer", category: "scaling", slug: "load-balancer", note: "Distributes traffic." },
  telemetry: { id: "telemetry", label: "Telemetry", category: "observability", slug: "observability", note: "Tracing, metrics, cost." },
  embedsvc: { id: "embedsvc", label: "Embedding Service", category: "embeddings", slug: "embeddings", note: "Batched embedding service." },
  kg: { id: "kg", label: "Knowledge Graph", category: "rag", slug: "knowledge-graph", note: "Entity/relationship store." },
  graphrag: { id: "graphrag", label: "GraphRAG", category: "rag", slug: "graphrag", note: "Multi-hop graph retrieval." },
  compress: { id: "compress", label: "Context Compression", category: "rag", slug: "context-builder", note: "Compress context to fit budget." },
  guardrails: { id: "guardrails", label: "Guardrails", category: "security", slug: "guardrails", note: "Input/output safety." },
  eval: { id: "eval", label: "Evaluation", category: "evaluation", slug: "evaluation", note: "Online quality checks." },
  agentruntime: { id: "agentruntime", label: "Agent Runtime", category: "agents", slug: "agents", note: "Executes agent loops." },
};

export const FLOW_LEVELS: (FlowLevel & { nodes: string[] })[] = [
  {
    id: 1,
    name: "Simple",
    description: "The mental model every beginner needs: you talk to a frontend, it calls a backend, which calls an LLM, and the answer comes back.",
    nodes: ["user", "frontend", "backend", "llm", "response"],
  },
  {
    id: 2,
    name: "Intermediate",
    description: "Add the real backend concerns: an API with middleware, memory for continuity, and a retriever that grounds the model in your data.",
    nodes: ["user", "frontend", "api", "middleware", "memory", "retriever", "llm", "response"],
  },
  {
    id: 3,
    name: "Production",
    description: "The full production request path — auth, rate limiting, grounding, hybrid retrieval, re-ranking, tool calling, agents, MCP, and streaming.",
    nodes: [
      "frontend", "gateway", "auth", "ratelimit", "middleware", "memory", "system",
      "grounding", "embedding", "retriever", "bm25", "vsearch", "hybrid", "rerank",
      "ctxbuild", "assembly", "llm", "tools", "agent", "mcp", "apis", "streaming", "render",
    ],
  },
  {
    id: 4,
    name: "Enterprise",
    description: "Everything, at scale: CDN/edge, load balancing, telemetry, embedding services, knowledge graphs + GraphRAG, context compression, an LLM router across providers, an agent runtime with 100+ tools, and continuous evaluation.",
    nodes: [
      "cdn", "lb", "gateway", "auth", "ratelimit", "middleware", "telemetry", "memory",
      "system", "guardrails", "grounding", "embedsvc", "retriever", "bm25", "vsearch", "hybrid",
      "kg", "graphrag", "rerank", "compress", "assembly", "router", "llm", "agentruntime",
      "tools", "mcp", "db", "apis", "eval", "streaming", "render",
    ],
  },
];
