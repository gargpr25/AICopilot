import type { Category, CategoryId } from "./types";

export const CATEGORIES: Record<CategoryId, Category> = {
  frontend: { id: "frontend", name: "Frontend", color: "#60a5fa", blurb: "The user-facing layer: prompt boxes, chat UIs, streaming renderers." },
  backend: { id: "backend", name: "Backend & Gateway", color: "#818cf8", blurb: "API gateways, auth, middleware, rate limiting, orchestration." },
  llm: { id: "llm", name: "LLMs", color: "#a78bfa", blurb: "The models themselves — GPT, Claude, Gemini, Llama, Mistral." },
  inference: { id: "inference", name: "Inference", color: "#c084fc", blurb: "Tokens, sampling, decoding, structured output, reasoning." },
  embeddings: { id: "embeddings", name: "Embeddings", color: "#22d3ee", blurb: "Turning text into vectors and comparing meaning mathematically." },
  vectordb: { id: "vectordb", name: "Vector Databases", color: "#2dd4bf", blurb: "Storage and ANN search over high-dimensional vectors." },
  retrieval: { id: "retrieval", name: "Retrieval", color: "#34d399", blurb: "Finding the right context: BM25, vector, hybrid, re-ranking." },
  rag: { id: "rag", name: "RAG & Ingestion", color: "#4ade80", blurb: "Grounding LLMs in your data: chunking, parsing, context building." },
  agents: { id: "agents", name: "Agents", color: "#f59e0b", blurb: "Planning, reasoning loops, multi-agent systems, reflection." },
  mcp: { id: "mcp", name: "MCP", color: "#fb923c", blurb: "Model Context Protocol — standardized tool + context servers." },
  memory: { id: "memory", name: "Memory", color: "#f472b6", blurb: "Short-term, long-term, semantic and conversational memory." },
  tools: { id: "tools", name: "Tools & Functions", color: "#e879f9", blurb: "Function calling, tool registries, external API access." },
  observability: { id: "observability", name: "Observability", color: "#38bdf8", blurb: "Tracing, metrics, logging and debugging AI systems." },
  security: { id: "security", name: "Security", color: "#fb7185", blurb: "Guardrails, PII, prompt injection, moderation, jailbreaks." },
  scaling: { id: "scaling", name: "Scaling", color: "#facc15", blurb: "Load balancing, GPUs, inference servers, caching, autoscaling." },
  evaluation: { id: "evaluation", name: "Evaluation", color: "#a3e635", blurb: "Measuring quality: faithfulness, groundedness, latency." },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);
