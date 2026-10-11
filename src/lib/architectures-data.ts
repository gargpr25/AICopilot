import type { Architecture } from "./types";

export const ARCHITECTURES: Architecture[] = [
  {
    slug: "chatgpt",
    name: "ChatGPT",
    vendor: "OpenAI",
    tagline: "General-purpose conversational assistant at massive scale.",
    overview:
      "ChatGPT is built on a multi-tenant, stateless inference layer backed by a persistent conversation store. Each request loads prior turns from a Redis-backed store, appends the new message, builds a final prompt, and streams tokens back via SSE. The key architectural bet is that a single frontier model with tool access (browsing, code interpreter, file search) beats a pipeline of specialized models — complexity lives in the model, not the graph.",
    steps: [
      {
        label: "User",
        slug: "prompt-box",
        detail:
          "The browser sends the message over HTTPS to a regional edge PoP. WebSocket fallback is used only for older clients; the main path is HTTP/2 to avoid per-request TLS overhead. The frontend immediately renders an optimistic skeleton so perceived latency is lower than actual TTFT.",
      },
      {
        label: "Edge / Gateway",
        slug: "api-gateway",
        detail:
          "The edge layer handles auth (JWT validation against a user-service), rate limiting per user tier (free / Plus / Team / Enterprise with different RPM caps), and geo-routing to the nearest inference region. Abuse filtering — blocklists, velocity checks — runs here before any GPU time is spent.",
      },
      {
        label: "Conversation Store",
        slug: "conversation-memory",
        detail:
          "Prior turns are loaded from a durable store (likely Postgres + a Redis cache layer). Older turns can be progressively summarized to stay within the context window — this is why very long conversations sometimes feel like GPT 'forgot' early details. Memory (the opt-in feature) augments this with vector search over past sessions.",
      },
      {
        label: "Tools / Retrieval",
        slug: "tool-calling",
        detail:
          "If the model emits a tool call (browsing, code interpreter, DALL-E, file search), the request pauses, the tool executes in a sandboxed container, and the result is injected as a tool message before generation resumes. Code interpreter runs in an isolated gVisor sandbox with no network access. This back-and-forth can happen multiple times in one turn.",
      },
      {
        label: "GPT model",
        slug: "llm",
        detail:
          "The selected model (GPT-4o for most users, o-series for reasoning tasks) runs on OpenAI's internal inference cluster. GPT-4o uses a unified architecture for text/vision/audio — no separate modality pipelines. Speculative decoding and continuous batching are almost certainly used to maximize GPU utilization across thousands of concurrent requests.",
      },
      {
        label: "Streaming",
        slug: "streaming",
        detail:
          "Tokens are streamed via Server-Sent Events. The frontend renders markdown incrementally using a streaming parser so bold/code formatting appears as it generates, not after. The `X-Accel-Buffering: no` header disables proxy buffering. On tool calls, a 'thinking' animation plays while the tool runs — this is not actual chain-of-thought but a UI affordance hiding latency.",
      },
    ],
    highlights: [
      "Single frontier model + tools beats a pipeline of specialized models for most tasks",
      "Stateless inference + external conversation store allows horizontal scaling with no session affinity",
      "Tool sandboxing (gVisor + no network) lets code interpreter run untrusted code safely",
      "Progressive conversation summarization handles unbounded session length without truncation errors",
      "Streaming markdown parser renders formatted output incrementally, not as a post-processing step",
    ],
    stack: ["GPT-4o / o-series", "Tool calling", "Redis conversation cache", "SSE streaming", "gVisor sandboxing"],
    keyDecisions: [
      "Put complexity in the model, not the orchestration graph — simpler ops, but you're locked to OpenAI quality",
      "Persist conversations server-side (vs. client-side) — enables cross-device sync but raises data-retention risk",
      "Stream from token 1 — requires the frontend to handle partial markdown, but dramatically improves perceived speed",
      "Rate-limit at the edge before GPU allocation — protects inference cost but means rate-limited users see no model response at all",
    ],
    tradeoffs: [
      "Single-vendor model dependency: if GPT-4o degrades or prices rise, the entire product is affected",
      "Server-side conversation storage is a privacy and compliance surface — enterprise customers need data residency controls",
      "Tool calls break streaming mid-response, causing visible 'pauses' that users attribute to slowness",
      "Progressive summarization loses exact early-turn details — fine for casual use, problematic for long technical sessions",
    ],
    scaleNotes:
      "OpenAI serves hundreds of millions of requests per day. The architecture achieves this through stateless inference pods (auto-scale by request volume), request batching on the GPU (continuous batching), and geographic distribution. The bottleneck is GPU memory bandwidth during KV-cache attention, not compute — which is why GPT-4o's architectural efficiency (smaller than GPT-4) is critical for cost.",
    lessonsLearned: [
      "Perceived latency matters more than actual latency — streaming + skeleton UI can mask 2-3s TTFT",
      "Tool access turns a language model into an agent without building a separate agent framework",
      "The free tier is a distribution moat, not just charity — it trains the model on diverse real-world usage patterns",
    ],
  },
  {
    slug: "cursor",
    name: "Cursor",
    vendor: "Anysphere",
    tagline: "AI code editor with deep codebase context and multi-file agentic edits.",
    overview:
      "Cursor's core insight is that code assistance quality is limited by context quality, not model quality. It embeds the entire repository locally on first open, runs retrieval on every keypress, and assembles a context window that mixes retrieved code, open files, cursor position, and diagnostic errors. Agentic edits (Composer) add a ReAct loop on top: the model can read files, run terminal commands, and apply diffs in an iterative cycle. MCP makes external tools first-class in that loop.",
    steps: [
      {
        label: "IDE",
        slug: "prompt-box",
        detail:
          "The editor captures the user's intent — inline Tab completions triggered on pause, or an explicit Composer/Chat prompt. For Tab, the trigger is a pause >150ms; Cursor pre-fetches a completion speculatively so it's ready before the user explicitly requests it. The current file, cursor line, and a snippet of surrounding code are always included as minimal context.",
      },
      {
        label: "Codebase Indexing",
        slug: "embeddings",
        detail:
          "On repo open, Cursor indexes every file with an embedding model (ada-002 or equivalent) and stores vectors in a local SQLite-backed vector index (~/.cursor/). The index is incremental — only changed files are re-embedded on subsequent opens. Large repos (>10k files) use chunking by function/class boundaries rather than fixed token windows to preserve semantic units.",
      },
      {
        label: "Retriever",
        slug: "retrieval",
        detail:
          "At query time, a hybrid retriever runs: vector search over the local index plus BM25 over file names and symbol names. The retriever understands import graphs — if you ask about a function, it also fetches its transitive imports. Results are re-ranked by recency (recently-opened files score higher) and relevance. The context window is filled greedily: most relevant chunks first, up to the model's limit.",
      },
      {
        label: "MCP",
        slug: "mcp",
        detail:
          "MCP (Model Context Protocol) servers expose filesystem, terminal, git history, and external documentation as structured tools the model can call. Each MCP server is a local process communicating over JSON-RPC. This is how Cursor can run `npm test`, read a git blame, or fetch a library's docs without hardcoding those capabilities — the model discovers available tools from the MCP manifest.",
      },
      {
        label: "LLM",
        slug: "llm",
        detail:
          "The assembled prompt — system instructions, retrieved code chunks, conversation history, current file — goes to Claude 3.5 Sonnet or GPT-4o (user's choice). For Tab completions, a smaller/faster model (likely a fine-tuned 7B) is used to hit <100ms latency. The model outputs either a completion or a structured diff (for Composer multi-file edits) — not free-form prose.",
      },
      {
        label: "Edit Code",
        slug: "tool-calling",
        detail:
          "Composer applies diffs via the Language Server Protocol — edits show as ghost text first, then applied on accept. Multi-file edits are batched: the model emits all diffs in one response, and Cursor applies them transactionally (all or nothing). If the model makes a mistake (compilation error, test failure), the agent loop catches it via terminal MCP, feeds the error back, and generates a corrective edit.",
      },
    ],
    highlights: [
      "Local embedding index means retrieval has no API cost and works offline",
      "Import graph traversal retrieves transitive dependencies, not just the file you're editing",
      "Speculative pre-fetch for Tab completions hides generation latency behind typing pauses",
      "MCP turns arbitrary external tools into model-callable functions without any Cursor code changes",
      "Structured diff output (not prose) enables transactional multi-file edits with rollback",
    ],
    stack: ["Claude 3.5 Sonnet / GPT-4o", "Local SQLite vector index", "ada-002 embeddings", "MCP (JSON-RPC)", "LSP diff application"],
    keyDecisions: [
      "Local index (vs. server-side RAG) — trades setup time for privacy, offline support, and zero retrieval latency",
      "Import-graph-aware retrieval — significantly better context than naive chunk retrieval for code",
      "Smaller fine-tuned model for Tab completions — <100ms latency is more important than quality for inline suggestions",
      "MCP as the tool protocol — open standard means the ecosystem of tools grows without Cursor-specific integrations",
    ],
    tradeoffs: [
      "Local index takes 2-5 minutes for large repos and consumes 500MB-2GB of disk — bad first-run experience",
      "Context window still limits how much of a large codebase fits — long-range dependencies across 50+ files are often missed",
      "Multi-model choice (Claude vs GPT) means Cursor has no control over model behavior — breaking changes from providers propagate directly",
      "Agentic Composer is slow (each tool call adds a round trip) — simpler single-shot completions are faster for small edits",
    ],
    scaleNotes:
      "Cursor is primarily a client-side product — the heavy lifting (embedding, retrieval, index management) runs locally. The server-side inference is stateless and scales like any LLM API. The real scaling constraint is the local index: on monorepos with 100k+ files, the initial embedding pass takes 20+ minutes and the index exceeds 5GB. Cursor mitigates this with .cursorignore (mirrors .gitignore) and by skipping binary/generated files.",
    lessonsLearned: [
      "Context quality is the dominant factor in code AI quality — better retrieval beats a bigger model",
      "Developers accept 2-minute setup overhead for privacy (local index) that they'd refuse for a web product",
      "Structured output (diff format) is more reliable than asking the model to emit prose edits — parseable means automatable",
    ],
  },
  {
    slug: "github-copilot",
    name: "GitHub Copilot",
    vendor: "GitHub / Microsoft",
    tagline: "Inline code completion with fill-in-the-middle prompting and repo-aware context.",
    overview:
      "Copilot's architecture is optimized for one thing: latency. Completions must feel instantaneous or developers reject them. The key technique is fill-in-the-middle (FIM) prompting — the model sees the code before AND after the cursor, generating only the missing middle. Context assembly is lightweight: current file + nearest open tabs, no full repo embedding. GitHub Copilot Chat (separate product) adds a heavier retrieval stack on top of the same model.",
    steps: [
      {
        label: "Editor",
        slug: "prompt-box",
        detail:
          "The VS Code / JetBrains extension triggers on every keystroke pause (debounced ~100ms). The trigger is the cursor position — not an explicit user action. The extension also watches for 'acceptance signals' (Tab key) and 'rejection signals' (continuing to type) to train a local telemetry model that personalizes trigger timing per developer.",
      },
      {
        label: "Context Gathering",
        slug: "context-builder",
        detail:
          "The extension assembles context without any server round-trip: prefix (everything before cursor, up to ~2000 tokens), suffix (everything after cursor, ~500 tokens for FIM), the current file's language and path, and 'neighboring files' — the 3-5 most recently opened tabs that share the same language. No embedding or search; this is heuristic window packing.",
      },
      {
        label: "Retriever",
        slug: "retrieval",
        detail:
          "For the standard inline completion path, retrieval is minimal — just the neighboring files heuristic. GitHub Copilot Enterprise adds a heavier path: BM25 search over the organization's repositories, pulling function signatures and docstrings as 'snippets'. This runs server-side and adds ~200ms, which is why it's behind an Enterprise flag — the latency budget is tight.",
      },
      {
        label: "Prompt Builder",
        slug: "prompt-assembly",
        detail:
          "The prompt is structured as a fill-in-the-middle template: `<PRE> {prefix} <SUF> {suffix} <MID>`. The model is fine-tuned to generate only the `<MID>` portion. Language-specific tokens (file path, language tag) are prepended. Neighboring file snippets are inserted between PRE and SUF, trimmed to fit the token budget. The entire assembly runs client-side in <5ms.",
      },
      {
        label: "LLM",
        slug: "llm",
        detail:
          "The completion model is Codex-class — a code-specialized model derived from GPT-3 architecture, fine-tuned on billions of lines of public code. For inline completions, this smaller model (~7B parameters) is used over GPT-4 because P50 latency of <300ms requires a model that fits on fewer GPUs. The model runs on Microsoft Azure (GitHub's parent), with inference optimized via ONNX/TensorRT and continuous batching.",
      },
      {
        label: "Completion",
        slug: "streaming",
        detail:
          "The completion streams back token-by-token and renders as 'ghost text' (dimmed inline text). The extension shows only the first line initially; pressing Tab accepts the full multi-line suggestion. If the developer types a character that conflicts with the ghost text, it's immediately discarded — no wait for cancellation. Multiple completions are requested in parallel (top-3) and the highest-ranked is shown.",
      },
    ],
    highlights: [
      "FIM prompting lets the model see code before AND after the cursor — dramatically better than prefix-only autocomplete",
      "Client-side context assembly (no search round-trip) keeps P50 latency under 300ms",
      "Smaller fine-tuned model over GPT-4 — latency beats quality for inline completions",
      "Multi-suggestion prefetch (top-3 in parallel) hides ranking latency behind rendering",
      "Acceptance/rejection telemetry personalizes trigger timing per developer over time",
    ],
    stack: ["Codex-class model (~7B)", "FIM prompting", "Azure inference (ONNX/TensorRT)", "Neighboring-file heuristic", "Ghost text LSP"],
    keyDecisions: [
      "FIM over prefix-only prompting — requires fine-tuning but makes completions context-bidirectional",
      "Client-side context assembly — adds no server latency but means retrieval quality is bounded by open tabs",
      "Small model for inline, GPT-4 for Chat — explicit quality/latency split by use case",
      "No local index — simpler distribution (no setup) but weaker repo-wide context than Cursor",
    ],
    tradeoffs: [
      "Heuristic neighboring-file context misses relevant code that isn't in open tabs — deep codebase understanding requires explicit file opening",
      "No semantic understanding of imports means the model can suggest non-existent APIs from wrong library versions",
      "FIM fine-tuning creates model lock-in — can't swap to a general-purpose model without quality regression",
      "Ghost text UX only works well for single-function completions; multi-file refactors require Copilot Chat (different product)",
    ],
    scaleNotes:
      "GitHub Copilot serves 2M+ paying developers. The inline completion path processes millions of requests per minute. Microsoft's Azure inference infrastructure handles this via continuous batching (packing multiple completion requests into one GPU forward pass). The tight latency SLA (P95 < 500ms) requires regional inference colocated with GitHub's edge PoPs.",
    lessonsLearned: [
      "Latency is the primary adoption driver for inline tools — a 1s completion is nearly as bad as no completion",
      "FIM fine-tuning is one of the highest-ROI investments in code AI — the quality gap over prefix-only is large",
      "Acceptance rate (not just usage) is the right metric — a tool that's accepted 30% of the time is more valuable than one used 100% of the time",
    ],
  },
  {
    slug: "perplexity",
    name: "Perplexity",
    vendor: "Perplexity AI",
    tagline: "Answer engine that searches the live web and cites every claim to a source.",
    overview:
      "Perplexity replaces parametric memory with live retrieval. The key insight: for factual questions, it's better to fetch fresh web content than to trust the model's training data. The architecture is: query → web search → crawl + clean → re-rank → synthesize with citations. The model is deliberately kept small for the synthesis step because retrieved context provides the facts — the model's job is coherent prose, not knowledge recall.",
    steps: [
      {
        label: "Question",
        slug: "prompt-box",
        detail:
          "The user's question goes through query understanding: entity extraction, intent classification (factual lookup vs. conversational vs. code), and query rewriting. For follow-up questions, the query is expanded with conversation context — 'who is his wife?' becomes 'who is [previously mentioned person]'s wife?' This rewriting happens before any search to maximize retrieval precision.",
      },
      {
        label: "Search Engine",
        slug: "external-apis",
        detail:
          "Perplexity calls multiple search index APIs (Bing, their own Sonar index, and specialized indices for news/academic) in parallel. The Sonar index is a fresh crawl of ~1T pages updated hourly — this is what enables answers about events from hours ago. Query fanout (multiple reformulations of the same question) increases recall at the cost of latency.",
      },
      {
        label: "Crawler / Fetch",
        slug: "document-parsing",
        detail:
          "For top-ranked URLs, Perplexity fetches and parses the live page — not a cached version. HTML is cleaned with Trafilatura or equivalent: boilerplate removal, ad stripping, table normalization. JavaScript-heavy sites are rendered via headless Chrome. The fetched content is chunked and the most relevant paragraphs are extracted by keyword overlap with the query.",
      },
      {
        label: "Retriever + Rerank",
        slug: "reranking",
        detail:
          "Chunks from all crawled pages are scored against the query with a cross-encoder re-ranker (similar to Cohere Rerank or a fine-tuned BERT). The top-K chunks (typically 8-12) are selected for the synthesis context. Each chunk is tagged with its source URL — this tag persists into the final answer as the citation anchor. Re-ranking quality is critical: wrong source selection corrupts the answer.",
      },
      {
        label: "LLM",
        slug: "llm",
        detail:
          "A fine-tuned Llama or Mistral variant synthesizes an answer from the retrieved chunks. The model is prompted to: (1) answer only from provided sources, (2) embed citation markers [1][2] inline, (3) hedge when sources conflict. Grounding is enforced by instruction, not by RAG architecture — the model can technically hallucinate, but the fine-tuning and prompt make it unlikely for the cited portions.",
      },
      {
        label: "Citations",
        slug: "context-builder",
        detail:
          "After generation, citation markers are linked to source URLs and rendered as numbered footnotes. The UI shows a 'Sources' sidebar with page titles, favicons, and URLs. Clicking a source opens it. This citation transparency is a deliberate UX choice to differentiate from a chatbot — the user can verify every claim rather than trusting the model's authority.",
      },
    ],
    highlights: [
      "Live web search means answers reflect events from hours ago, not training data cutoffs",
      "Citation-first rendering makes every factual claim verifiable — changes the trust model vs. a chatbot",
      "Query rewriting expands single questions into multiple search variants to increase recall",
      "Small synthesis model is intentional — retrieved context provides facts, model provides coherence",
      "Re-ranker is the quality bottleneck: the synthesis is only as good as the selected passages",
    ],
    stack: ["Sonar live index", "Bing / Sonar search", "Trafilatura HTML cleaning", "Cross-encoder re-ranker", "Fine-tuned Llama synthesis"],
    keyDecisions: [
      "Live crawl (vs. cached search snippets) — fresher content but 2-4x more latency and infrastructure cost",
      "Citation markers in-generation (vs. post-hoc attribution) — more reliable but requires model fine-tuning",
      "Small synthesis model (vs. GPT-4) — cost reduction; the model doesn't need world knowledge when context provides it",
      "Parallel multi-source search — increases recall but creates answer reconciliation challenges when sources conflict",
    ],
    tradeoffs: [
      "Live crawl adds 1-3s latency over a pure LLM chat — acceptable for factual queries, frustrating for conversational use",
      "Citation quality degrades for paywalled or JS-heavy sites that can't be cleanly crawled",
      "Conflict resolution between sources is done by the model, not by authority ranking — can produce confident wrong answers when fringe sources outrank authoritative ones",
      "No persistent user context — every session starts cold, which is intentional (privacy) but limits personalization",
    ],
    scaleNotes:
      "Perplexity's scale challenge is the pipeline width: each query fans out to 5-10 web fetches in parallel. At high QPS, this means tens of thousands of outbound HTTP requests per second. They likely cache crawled pages aggressively (popular domains are pre-crawled and cached, not fetched live). The synthesis LLM is the cheapest part of the stack — the real cost is the live web infrastructure.",
    lessonsLearned: [
      "Citation UI changed user behavior: people use Perplexity for research tasks they'd previously use Google for, not just chatbot tasks",
      "Query rewriting is underrated — the quality gap between naive search and rewritten search is larger than the gap between small and large synthesis models",
      "Freshness beats depth for a large class of queries: people accept shallower answers if they're from today",
    ],
  },
  {
    slug: "notebooklm",
    name: "NotebookLM",
    vendor: "Google",
    tagline: "Source-grounded assistant that refuses to answer from outside your uploaded documents.",
    overview:
      "NotebookLM's defining constraint is grounding: it only answers from your uploaded sources, and it says so explicitly when a question falls outside them. This is implemented at the prompt level — the model is instructed to cite only provided sources and decline out-of-scope questions — not at the architecture level. The technical moat is Gemini's long context (2M tokens), which allows NotebookLM to load entire documents in-context rather than relying on chunking and retrieval for most queries.",
    steps: [
      {
        label: "Upload Docs",
        slug: "document-parsing",
        detail:
          "NotebookLM accepts PDFs, Google Docs/Slides, YouTube URLs, web URLs, and plain text. PDFs are processed with Google's Document AI (OCR + layout detection for tables and figures). YouTube transcripts are fetched via the captions API — the audio itself isn't transcribed, just the captions. Each source is stored with its metadata (title, URL, page numbers) for citation generation.",
      },
      {
        label: "Chunk + Embed",
        slug: "chunking",
        detail:
          "Sources are chunked at semantic boundaries (paragraphs for text, slides for presentations) and embedded with Google's text-embedding-004. Chunk metadata includes page number, source title, and a parent-chunk ID for hierarchical retrieval. For short notebooks (<50k tokens total), chunking may be skipped entirely — the full source fits in Gemini's context window.",
      },
      {
        label: "Vector Store",
        slug: "vector-database",
        detail:
          "Embeddings are stored in a user-scoped vector index (likely Vertex AI Vector Search or Spanner-based). The index is per-notebook, not global — documents in one notebook aren't searchable from another. This isolation is both a privacy feature and a scoping feature: answers come from your specific set of sources, not a shared corpus.",
      },
      {
        label: "Retriever",
        slug: "retrieval",
        detail:
          "For short notebooks, NotebookLM bypasses retrieval entirely and loads all source chunks into Gemini's context window — no approximation, no missed passages. For longer notebooks, a hybrid retriever (vector + BM25 keyword) selects the top-K chunks. The citation UI then highlights which specific passages the answer drew from, allowing the user to verify grounding.",
      },
      {
        label: "Gemini",
        slug: "gemini",
        detail:
          "Gemini 1.5 Pro (now Gemini 2.0) provides the synthesis, with a 1M–2M token context window as the key capability. The model is prompted with a strict grounding instruction: answer only from provided sources, cite every claim with source+page, and explicitly decline questions the sources don't cover. The Audio Overview feature uses Gemini to script a podcast-style dialogue summarizing the sources, then synthesizes it with Google's TTS.",
      },
      {
        label: "Cited Answer",
        slug: "context-builder",
        detail:
          "Every claim in the answer is linked to a specific passage in the source via inline citation markers. Clicking a citation jumps to the highlighted passage in the source viewer panel. This isn't post-hoc attribution — the citations are generated inline by the model as part of the response, not added by a separate attribution step. The user can see exactly which sentence in which document drove each claim.",
      },
    ],
    highlights: [
      "Gemini's 2M-token context window often eliminates chunking — the whole notebook loads in-context",
      "Grounding refusal ('sources don't cover this') is a product feature, not a bug — it builds user trust",
      "Per-notebook vector isolation prevents cross-contamination between document sets",
      "Audio Overview generates a podcast-format summary — highest engagement feature for commuters and listeners",
      "Inline citation markers are generated by the model, not attributed after the fact",
    ],
    stack: ["Gemini 2.0 (2M context)", "Google Document AI (OCR)", "text-embedding-004", "Vertex AI Vector Search", "Google TTS (Audio Overview)"],
    keyDecisions: [
      "Grounding-only by prompt instruction — simpler than RAG-enforced grounding but depends on model compliance; Gemini's instruction-following makes this reliable",
      "Per-user, per-notebook index isolation — privacy-preserving but prevents knowledge sharing across notebooks",
      "Long context first, retrieval fallback — prioritize quality (no missed passages) over cost efficiency",
      "Audio Overview as a differentiated format — no other note-taking tool offered audio summaries; drove significant press and adoption",
    ],
    tradeoffs: [
      "Grounding constraint frustrates users who want general knowledge augmented by their docs — 'what's the background on this topic?' is out of scope",
      "Long-context load is expensive: loading 1M tokens per query at Gemini's pricing costs more than retrieval-based alternatives",
      "No cross-notebook search — information siloed by notebook, which mirrors user mental models but complicates multi-project research",
      "Grounding is prompt-enforced: a sufficiently adversarial prompt can bypass it — not a security boundary",
    ],
    scaleNotes:
      "NotebookLM's per-query cost is dominated by context window size, not retrieval. At 1M tokens per query, Gemini input costs alone are significant. Google likely subsidizes this for strategic reasons (AI product differentiation) and relies on usage patterns — most queries are short, not full-context loads. The Audio Overview feature is batch-processed, not real-time, which amortizes TTS costs.",
    lessonsLearned: [
      "Explicit refusal ('I can't answer that from your sources') increases user trust over hallucinating an answer",
      "Audio format taps a completely different use case (commuting, listening) that text-only tools can't address",
      "Per-notebook scoping reduces the retrieval precision problem — smaller corpus means fewer false retrievals",
    ],
  },
  {
    slug: "enterprise-rag",
    name: "Enterprise RAG",
    vendor: "Reference architecture",
    tagline: "Secure, access-controlled, auditable assistant over internal knowledge bases.",
    overview:
      "Enterprise RAG solves problems that consumer RAG ignores: access control (employees should only see documents they're authorized to see), auditability (compliance needs to know what the model cited), freshness (documents change; the index must stay current), and multi-tenancy (different teams, different corpora). The architecture adds ACL enforcement, metadata filtering, hybrid search, and an evaluation pipeline on top of a standard RAG stack — each layer addresses a specific enterprise requirement.",
    steps: [
      {
        label: "Documents",
        slug: "document-parsing",
        detail:
          "Ingestion connectors pull from SharePoint, Google Drive, Confluence, Notion, and S3. Each connector handles incremental sync (new/modified/deleted documents) rather than full re-index — full re-index of a 500k-document corpus takes hours. Documents are deduplicated by content hash. ACLs (user groups who can access each document) are extracted at ingest time and stored alongside the content.",
      },
      {
        label: "Extraction / OCR",
        slug: "document-parsing",
        detail:
          "Raw documents go through extraction: PDFs via Azure Document Intelligence or AWS Textract (handles scanned documents and complex layouts), HTML via Trafilatura, Office files via Apache Tika. Tables are extracted as structured data, not flattened text — this matters for financial reports where cell values must be preserved. Extracted content is normalized to plain text + structured metadata (title, author, date, department, ACL groups).",
      },
      {
        label: "Chunk + Embed",
        slug: "chunking",
        detail:
          "Chunking strategy is content-aware: code uses function boundaries, legal docs use clause boundaries, general text uses paragraph + sliding window. ACL metadata is copied to every chunk derived from the document — not just stored at the document level. This is critical: chunk-level ACL enforcement prevents a user from getting a snippet of a restricted document through retrieval. Embeddings are generated with the same model used at query time (embedding drift breaks recall).",
      },
      {
        label: "Vector DB",
        slug: "vector-database",
        detail:
          "The vector store must support metadata filtering — not all vector databases do this well. Production deployments commonly use Pinecone (managed), Weaviate, or pgvector (if already on Postgres). The index is partitioned by tenant/department to allow independent scaling and to simplify ACL enforcement (a tenant's query only touches their partition). Soft deletes are used so document removal propagates to the index without full re-index.",
      },
      {
        label: "Hybrid Retrieve + Rerank",
        slug: "hybrid-search",
        detail:
          "At query time, the user's identity is resolved to a set of ACL groups, and a metadata filter is applied before retrieval — the vector search never returns documents the user isn't authorized to see. Hybrid search (BM25 + dense vectors) is run in parallel and merged with Reciprocal Rank Fusion (RRF). A cross-encoder re-ranker (Cohere Rerank or a fine-tuned BERT) re-scores the merged top-30 to produce top-10 for context. ACL filtering at the vector layer, not the application layer, prevents data leakage even if application logic has bugs.",
      },
      {
        label: "Grounding",
        slug: "grounding",
        detail:
          "The LLM is prompted with a strict grounding contract: answer only from provided passages, cite each claim with document title + chunk ID, and decline questions the retrieved context doesn't support. The grounding prompt is versioned and stored alongside generated answers for audit. Some implementations run a second 'faithfulness check' pass — a smaller model checks whether the generated answer is supported by the retrieved chunks, flagging potential hallucinations before they reach the user.",
      },
      {
        label: "LLM",
        slug: "llm",
        detail:
          "The generation model is typically GPT-4o, Claude 3.5 Sonnet, or an on-premises model (Llama 3.1 70B via vLLM) when data sovereignty requires it. The choice is driven by legal/compliance constraints as much as capability. On-prem deployment avoids data leaving the enterprise perimeter but requires GPU infrastructure. Hybrid: use an external API for non-sensitive queries, on-prem for documents classified above a threshold.",
      },
    ],
    highlights: [
      "ACL enforcement at the chunk level (not application level) — a vector search physically cannot return unauthorized documents",
      "Incremental connector sync — large corpora stay fresh without full re-index",
      "Faithfulness checker — a second model pass flags hallucinations before they reach the user",
      "Versioned grounding prompts — compliance can reconstruct exactly what the model was instructed to do for any historical query",
      "Hybrid search (BM25 + vectors + cross-encoder rerank) consistently outperforms pure vector search for enterprise queries",
    ],
    stack: ["Azure Document Intelligence / Textract", "pgvector / Pinecone / Weaviate", "Cohere Rerank", "GPT-4o / Claude / on-prem Llama", "OpenTelemetry + LangSmith"],
    keyDecisions: [
      "ACL filtering at vector DB layer vs. application layer — DB-layer filtering is defense-in-depth; app-layer filtering alone has been exploited in real systems",
      "Hybrid search (BM25 + dense) over pure vector — BM25 handles exact product names and codes that vector search misses",
      "Chunk-level ACL propagation vs. document-level — chunk-level is more complex but prevents data leakage through partial retrieval",
      "On-prem LLM option for sensitive tiers — necessary for regulated industries (healthcare, finance, defense) where data residency is non-negotiable",
    ],
    tradeoffs: [
      "ACL metadata on every chunk means index size grows proportionally to document ACL complexity",
      "Cross-encoder reranker adds 200-400ms latency — acceptable for knowledge worker queries, not for real-time applications",
      "On-prem LLM is 3-5x more expensive per token than API access when accounting for GPU infrastructure, ops, and upgrade cycles",
      "Faithfulness checking doubles LLM call cost — many deployments skip it and rely on grounding prompts alone",
      "Incremental sync connectors are complex to maintain — change detection differs by source system (SharePoint webhooks, Drive polling, Confluence event streams)",
    ],
    scaleNotes:
      "At 500k documents, the embedding index is ~2GB (1536-dim float32 × 500k chunks). This fits in memory for fast ANN search. At 10M chunks, you need IVF or HNSW indexing with quantization — and the accuracy/speed trade-off becomes a tuning problem. The query path bottleneck is the cross-encoder reranker (O(n) per-chunk inference) — this is why retrieval returns 30 candidates but the reranker only sees 30 (not 1000).",
    lessonsLearned: [
      "ACL bugs are the #1 enterprise RAG incident — enforce at the data layer, test with adversarial users who should NOT see certain documents",
      "Evaluation is not optional — production RAG systems drift silently (embedding model updates, connector changes) without a continuous eval pipeline",
      "Chunking strategy has more impact on retrieval quality than vector model choice — invest in domain-specific chunking before upgrading models",
    ],
  },
];

export const ARCHITECTURE_MAP: Record<string, Architecture> = Object.fromEntries(
  ARCHITECTURES.map((a) => [a.slug, a]),
);
