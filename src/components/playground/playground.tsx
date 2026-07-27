"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";
import { rankAll, fakeEmbed, chunkText, SAMPLE_DOC, CORPUS } from "@/lib/sim";

const TABS = [
  { id: "retrieval", label: "Retrieval Lab", icon: "SlidersHorizontal" },
  { id: "embedding", label: "Embeddings", icon: "Grid3x3" },
  { id: "chunking", label: "Chunking", icon: "Scissors" },
  { id: "rag", label: "RAG", icon: "Database" },
  { id: "agent", label: "Agent", icon: "Bot" },
  { id: "mcp", label: "MCP", icon: "Plug" },
];

function Bar({ value, color, label }: { value: number; color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-14 text-[11px] text-muted shrink-0">{label}</span>
      <div className="h-2 flex-1 rounded-full bg-white/5 overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ background: color }} animate={{ width: `${Math.round(value * 100)}%` }} transition={{ duration: 0.4 }} />
      </div>
      <span className="w-9 text-right text-[11px] font-mono text-muted">{value.toFixed(2)}</span>
    </div>
  );
}

/* ---------------- Retrieval Lab ---------------- */
function RetrievalLab() {
  const [q, setQ] = useState("how many vacation days do I have?");
  const [alpha, setAlpha] = useState(0.5);
  const ranked = useMemo(() => rankAll(q, alpha).sort((a, b) => b.hybrid - a.hybrid), [q, alpha]);
  const topBm = [...ranked].sort((a, b) => b.bm25 - a.bm25)[0];
  const topVec = [...ranked].sort((a, b) => b.vector - a.vector)[0];

  return (
    <div className="space-y-4">
      <input value={q} onChange={(e) => setQ(e.target.value)} className="w-full rounded-xl border border-border bg-white/5 px-4 py-3 text-sm outline-none focus:border-accent" placeholder="Ask a question…" />
      <div className="glass rounded-xl p-4">
        <div className="flex items-center justify-between text-xs text-muted mb-2">
          <span className="font-medium text-accent2">Keyword (BM25)</span>
          <span>Fusion weight α = {alpha.toFixed(2)}</span>
          <span className="font-medium" style={{ color: "#a78bfa" }}>Semantic (Vector)</span>
        </div>
        <input type="range" min={0} max={1} step={0.05} value={alpha} onChange={(e) => setAlpha(parseFloat(e.target.value))} className="w-full accent-[#7c8cff]" />
        <div className="mt-2 text-xs text-muted">
          Hybrid score = α·vector + (1−α)·BM25. Slide to see how the ranking shifts between lexical and semantic. Top BM25: <span className="text-foreground">{topBm.title}</span> · Top Vector: <span className="text-foreground">{topVec.title}</span>
        </div>
      </div>
      <div className="space-y-2">
        {ranked.slice(0, 6).map((d, i) => (
          <div key={d.id} className="glass rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs font-bold">{i + 1}</span>
              <span className="font-medium text-sm">{d.title}</span>
            </div>
            <p className="text-xs text-muted mb-2 line-clamp-2">{d.text}</p>
            <div className="space-y-1">
              <Bar value={d.bm25} color="#22d3ee" label="BM25" />
              <Bar value={d.vector} color="#a78bfa" label="Vector" />
              <Bar value={d.hybrid} color="#34d399" label="Hybrid" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Embedding Explorer ---------------- */
function EmbeddingExplorer() {
  const [text, setText] = useState("paid time off and vacation");
  const vec = useMemo(() => fakeEmbed(text), [text]);
  const neighbors = useMemo(() => {
    const qv = fakeEmbed(text);
    return CORPUS.map((d) => {
      const dv = fakeEmbed(d.text + " " + d.title);
      let dot = 0;
      for (let i = 0; i < qv.length; i++) dot += qv[i] * dv[i];
      return { title: d.title, score: dot };
    })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [text]);

  return (
    <div className="space-y-4">
      <input value={text} onChange={(e) => setText(e.target.value)} className="w-full rounded-xl border border-border bg-white/5 px-4 py-3 text-sm outline-none focus:border-accent" placeholder="Type text to embed…" />
      <div className="glass rounded-xl p-4">
        <div className="text-xs text-muted mb-2">Embedding vector (24 dims, simulated & normalized)</div>
        <div className="flex items-end gap-0.5 h-24">
          {vec.map((v, i) => (
            <motion.div key={i} className="flex-1 rounded-t bg-gradient-to-t from-accent/40 to-accent2" animate={{ height: `${Math.max(4, v * 220)}%` }} transition={{ duration: 0.3 }} style={{ maxHeight: "100%" }} />
          ))}
        </div>
        <div className="mt-2 font-mono text-[10px] text-muted truncate">[{vec.slice(0, 8).map((v) => v.toFixed(2)).join(", ")}, …]</div>
      </div>
      <div className="glass rounded-xl p-4">
        <div className="text-xs text-muted mb-2">Nearest neighbors in the corpus (cosine similarity)</div>
        <div className="space-y-1.5">
          {neighbors.map((n) => (
            <Bar key={n.title} value={n.score} color="#22d3ee" label={n.title.split(" ")[0]} />
          ))}
        </div>
      </div>
      <p className="text-xs text-muted">Note: a real system uses a trained embedding model (e.g. text-embedding-3) producing 1536+ dims. This uses a hashed bag-of-words to demonstrate the concept locally.</p>
    </div>
  );
}

/* ---------------- Chunking Simulator ---------------- */
function ChunkingSimulator() {
  const [text, setText] = useState(SAMPLE_DOC);
  const [size, setSize] = useState(20);
  const [overlap, setOverlap] = useState(5);
  const chunks = useMemo(() => chunkText(text, size, overlap), [text, size, overlap]);
  const colors = ["#7c8cff", "#22d3ee", "#34d399", "#f472b6", "#fb923c", "#a78bfa"];

  return (
    <div className="space-y-4">
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} className="w-full rounded-xl border border-border bg-white/5 px-4 py-3 text-sm outline-none focus:border-accent resize-none" />
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="glass rounded-xl p-4">
          <div className="flex justify-between text-xs mb-1"><span className="text-muted">Chunk size</span><span className="font-mono">{size} words</span></div>
          <input type="range" min={5} max={60} value={size} onChange={(e) => setSize(+e.target.value)} className="w-full accent-[#7c8cff]" />
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex justify-between text-xs mb-1"><span className="text-muted">Overlap</span><span className="font-mono">{overlap} words</span></div>
          <input type="range" min={0} max={Math.max(0, size - 1)} value={Math.min(overlap, size - 1)} onChange={(e) => setOverlap(+e.target.value)} className="w-full accent-[#22d3ee]" />
        </div>
      </div>
      <div className="text-xs text-muted">{chunks.length} chunks → {chunks.length} vectors to embed & store. Smaller chunks = higher precision but more vectors + calls.</div>
      <div className="space-y-2">
        {chunks.map((ch, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border p-3 text-sm" style={{ borderColor: `${colors[i % colors.length]}55`, background: `${colors[i % colors.length]}12` }}>
            <div className="text-[10px] font-mono mb-1" style={{ color: colors[i % colors.length] }}>chunk_{i + 1} · {ch.split(" ").length} words</div>
            {ch}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- RAG Simulator ---------------- */
const RAG_STEPS = ["Embed query", "Vector search", "Re-rank", "Build context", "LLM generates"];
function RagSimulator() {
  const [q, setQ] = useState("how many vacation days do I have?");
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const ranked = useMemo(() => rankAll(q, 0.5).sort((a, b) => b.hybrid - a.hybrid).slice(0, 3), [q]);

  useEffect(() => {
    if (!running) return;
    if (step >= RAG_STEPS.length - 1) {
      const t = setTimeout(() => setRunning(false), 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), 700);
    return () => clearTimeout(t);
  }, [running, step]);

  const answer = ranked[0]?.id === "vacation"
    ? "You accrue 20 vacation days per year, plus 10 public holidays. Up to 5 unused days roll over. [PTO Policy]"
    : `Based on the retrieved context: ${ranked[0]?.text ?? ""} [${ranked[0]?.title}]`;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} className="flex-1 rounded-xl border border-border bg-white/5 px-4 py-3 text-sm outline-none focus:border-accent" />
        <button onClick={() => { setStep(0); setRunning(true); }} className="rounded-xl bg-gradient-to-r from-accent to-accent3 px-4 text-sm font-semibold text-white glow inline-flex items-center gap-1.5">
          <Icon name="Play" size={15} /> Run
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {RAG_STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn("rounded-lg border px-3 py-1.5 text-xs transition", i <= step ? "border-accent bg-accent/20 text-foreground" : "border-border bg-white/5 text-muted")}>{s}</div>
            {i < RAG_STEPS.length - 1 && <Icon name="ChevronRight" size={14} className={i < step ? "text-accent2" : "text-muted"} />}
          </div>
        ))}
      </div>
      <AnimatePresence>
        {step >= 1 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass rounded-xl p-4">
            <div className="text-xs text-muted mb-2">Retrieved & re-ranked chunks</div>
            <div className="space-y-2">
              {ranked.map((d) => (
                <div key={d.id} className="rounded-lg border border-border bg-white/5 p-2.5 text-xs">
                  <span className="text-accent2 font-medium">[{d.title}]</span> {d.text}
                  <span className="ml-2 font-mono text-muted">score {d.hybrid.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {step >= RAG_STEPS.length - 1 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-xl p-4 border border-accent/40">
            <div className="flex items-center gap-2 text-xs text-accent2 mb-1"><Icon name="Sparkles" size={14} /> Grounded answer</div>
            <p className="text-sm">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Agent Simulator ---------------- */
const AGENT_SCENARIOS: Record<string, { thought: string; action: string; obs: string }[]> = {
  "Book me a flight to Paris next Friday": [
    { thought: "I need the user's location and the date of next Friday.", action: "calendar.getDate('next Friday')", obs: "2026-07-31" },
    { thought: "Search flights from the user's home airport to Paris.", action: "flights.search(from='SFO', to='CDG', date='2026-07-31')", obs: "3 options, cheapest $612 (AF083)" },
    { thought: "Check the weather to advise on packing.", action: "weather.forecast(city='Paris', date='2026-07-31')", obs: "18°C, light rain" },
    { thought: "Present the best option and ask for confirmation before booking.", action: "respond()", obs: "Done" },
  ],
  "Summarize my unread emails and flag urgent ones": [
    { thought: "Fetch unread emails from the inbox.", action: "email.list(unread=true)", obs: "12 unread messages" },
    { thought: "Classify each email by urgency.", action: "llm.classify(messages)", obs: "2 urgent, 3 important, 7 low" },
    { thought: "Draft a concise summary grouped by urgency.", action: "summarize()", obs: "Summary ready" },
    { thought: "Return the summary with urgent items flagged.", action: "respond()", obs: "Done" },
  ],
};

function AgentSimulator() {
  const goals = Object.keys(AGENT_SCENARIOS);
  const [goal, setGoal] = useState(goals[0]);
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const steps = AGENT_SCENARIOS[goal];

  useEffect(() => {
    if (!running) return;
    if (step >= steps.length - 1) {
      const t = setTimeout(() => setRunning(false), 300);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), 1100);
    return () => clearTimeout(t);
  }, [running, step, steps.length]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {goals.map((g) => (
          <button key={g} onClick={() => { setGoal(g); setStep(-1); setRunning(false); }} className={cn("rounded-xl border px-3 py-2 text-xs transition", goal === g ? "border-accent bg-accent/20" : "border-border bg-white/5 text-muted hover:bg-white/10")}>{g}</button>
        ))}
      </div>
      <button onClick={() => { setStep(0); setRunning(true); }} className="rounded-xl bg-gradient-to-r from-accent to-accent3 px-4 py-2 text-sm font-semibold text-white glow inline-flex items-center gap-1.5">
        <Icon name="Play" size={15} /> Run agent loop
      </button>
      <div className="space-y-2">
        {steps.map((s, i) => (
          <motion.div key={i} initial={false} animate={{ opacity: i <= step ? 1 : 0.3 }} className="glass rounded-xl p-3">
            <div className="flex items-center gap-2 text-xs text-warn mb-1"><Icon name="Brain" size={13} /> Reason</div>
            <p className="text-sm mb-2">{s.thought}</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-lg bg-black/40 px-2 py-1 font-mono text-accent2">→ {s.action}</span>
              {i <= step && <span className="rounded-lg bg-ok/15 px-2 py-1 font-mono text-ok">obs: {s.obs}</span>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- MCP Explorer ---------------- */
const MCP_TOOLS = [
  { name: "Filesystem", method: "read_file", args: { path: "README.md" } },
  { name: "GitHub", method: "create_issue", args: { repo: "acme/app", title: "Bug: 500 on login" } },
  { name: "Postgres", method: "query", args: { sql: "SELECT count(*) FROM users" } },
  { name: "Slack", method: "post_message", args: { channel: "#eng", text: "Deploy complete" } },
  { name: "Browser", method: "navigate", args: { url: "https://example.com" } },
];
function McpExplorer() {
  const [tool, setTool] = useState(MCP_TOOLS[0]);
  const req = { jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: tool.method, arguments: tool.args } };
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="rounded-lg border border-border bg-white/5 px-3 py-2">Cursor / Claude</span>
        <Icon name="ArrowRight" size={16} className="text-muted" />
        <span className="rounded-lg border border-accent/50 bg-accent/15 px-3 py-2">MCP Client</span>
        <Icon name="ArrowRight" size={16} className="text-muted" />
        <span className="rounded-lg border border-accent3/50 bg-accent3/15 px-3 py-2">MCP Server</span>
        <Icon name="ArrowRight" size={16} className="text-muted" />
        <span className="rounded-lg border border-border bg-white/5 px-3 py-2">{tool.name}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {MCP_TOOLS.map((t) => (
          <button key={t.name} onClick={() => setTool(t)} className={cn("rounded-xl border px-3 py-2 text-xs transition", tool.name === t.name ? "border-accent bg-accent/20" : "border-border bg-white/5 text-muted hover:bg-white/10")}>{t.name}</button>
        ))}
      </div>
      <div className="rounded-xl border border-border bg-black/40 p-4">
        <div className="text-[11px] text-muted mb-2 font-mono">JSON-RPC request over MCP</div>
        <pre className="overflow-x-auto text-[12px] font-mono text-foreground/90">{JSON.stringify(req, null, 2)}</pre>
      </div>
      <p className="text-xs text-muted">One protocol, any tool. The same MCP client can talk to a filesystem, a database, GitHub, or a browser — no bespoke integration per app.</p>
    </div>
  );
}

export function Playground() {
  const [tab, setTab] = useState("retrieval");
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-5">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={cn("inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium border transition", tab === t.id ? "bg-white/10 border-accent glow" : "border-border bg-white/5 text-muted hover:bg-white/10")}>
            <Icon name={t.icon} size={15} /> {t.label}
          </button>
        ))}
      </div>
      <div className="glass rounded-2xl p-5">
        {tab === "retrieval" && <RetrievalLab />}
        {tab === "embedding" && <EmbeddingExplorer />}
        {tab === "chunking" && <ChunkingSimulator />}
        {tab === "rag" && <RagSimulator />}
        {tab === "agent" && <AgentSimulator />}
        {tab === "mcp" && <McpExplorer />}
      </div>
    </div>
  );
}
