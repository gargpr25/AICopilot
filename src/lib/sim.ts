// Lightweight, dependency-free simulations so the playground works entirely client-side.

export const CORPUS: { id: string; title: string; text: string }[] = [
  { id: "vacation", title: "PTO Policy", text: "Full-time employees accrue 20 vacation days per year plus 10 public holidays. Unused vacation days roll over up to a maximum of 5 days into the next year." },
  { id: "remote", title: "Remote Work", text: "Employees may work remotely up to 3 days per week. Fully remote arrangements require manager and HR approval and a home office stipend of $500." },
  { id: "expenses", title: "Expense Reimbursement", text: "Submit expense reports within 30 days. Meals are reimbursed up to $75 per day during travel. Receipts are required for any expense over $25." },
  { id: "parental", title: "Parental Leave", text: "New parents receive 16 weeks of paid parental leave. Leave must begin within 12 months of the birth or adoption of a child." },
  { id: "security", title: "Security Policy", text: "All laptops must use full-disk encryption and multi-factor authentication. Report lost devices to IT security within 24 hours. Never share your password." },
  { id: "healthcare", title: "Health Benefits", text: "The company covers 90% of medical premiums and 100% of dental and vision. Open enrollment happens every November for the following plan year." },
  { id: "onboarding", title: "Onboarding", text: "New hires complete orientation in their first week, set up accounts via SSO, and are assigned an onboarding buddy for the first 30 days." },
  { id: "review", title: "Performance Reviews", text: "Performance reviews occur twice a year, in June and December. Ratings inform promotions and annual compensation adjustments." },
  { id: "training", title: "Learning Budget", text: "Each employee has an annual learning budget of $1500 for courses, books, and conferences related to their role." },
  { id: "equipment", title: "Equipment", text: "Engineers receive a laptop, external monitor, and peripherals. Equipment refresh happens every three years or when a device fails." },
];

const STOP = new Set(["the", "a", "an", "of", "to", "and", "or", "in", "on", "for", "is", "are", "how", "many", "do", "i", "my", "what", "per", "up", "with", "into"]);

export function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t && !STOP.has(t));
}

// --- Fake but deterministic embedding: hashed bag-of-words into N dims, L2 normalized ---
export function fakeEmbed(text: string, dims = 24): number[] {
  const v = new Array(dims).fill(0);
  for (const tok of tokenize(text)) {
    let h = 0;
    for (let i = 0; i < tok.length; i++) h = (h * 31 + tok.charCodeAt(i)) >>> 0;
    v[h % dims] += 1;
    v[(h >> 3) % dims] += 0.5; // spread for a little semantic overlap
  }
  const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
  return v.map((x) => x / norm);
}

export function cosine(a: number[], b: number[]): number {
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
  return dot; // vectors are normalized
}

// --- BM25 over the corpus ---
function bm25Scores(query: string, k1 = 1.5, b = 0.75): Record<string, number> {
  const docs = CORPUS.map((d) => ({ id: d.id, toks: tokenize(d.text + " " + d.title) }));
  const N = docs.length;
  const avgdl = docs.reduce((s, d) => s + d.toks.length, 0) / N;
  const df: Record<string, number> = {};
  for (const d of docs) for (const t of new Set(d.toks)) df[t] = (df[t] || 0) + 1;
  const qToks = tokenize(query);
  const scores: Record<string, number> = {};
  for (const d of docs) {
    let score = 0;
    const tf: Record<string, number> = {};
    for (const t of d.toks) tf[t] = (tf[t] || 0) + 1;
    for (const q of qToks) {
      if (!tf[q]) continue;
      const idf = Math.log(1 + (N - (df[q] || 0) + 0.5) / ((df[q] || 0) + 0.5));
      const f = tf[q];
      score += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * d.toks.length) / avgdl)));
    }
    scores[d.id] = score;
  }
  return scores;
}

export interface RankedDoc {
  id: string;
  title: string;
  text: string;
  bm25: number;
  vector: number;
  hybrid: number;
}

function normalize(scores: Record<string, number>): Record<string, number> {
  const vals = Object.values(scores);
  const max = Math.max(...vals, 0.0001);
  const min = Math.min(...vals, 0);
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(scores)) out[k] = max === min ? 0 : (v - min) / (max - min);
  return out;
}

export function rankAll(query: string, alpha = 0.5): RankedDoc[] {
  const bm = normalize(bm25Scores(query));
  const qv = fakeEmbed(query);
  const vec: Record<string, number> = {};
  for (const d of CORPUS) vec[d.id] = cosine(qv, fakeEmbed(d.text + " " + d.title));
  const vecN = normalize(vec);
  return CORPUS.map((d) => {
    const b = bm[d.id] ?? 0;
    const v = vecN[d.id] ?? 0;
    return { id: d.id, title: d.title, text: d.text, bm25: b, vector: v, hybrid: alpha * v + (1 - alpha) * b };
  });
}

// --- Chunking ---
export function chunkText(text: string, size: number, overlap: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const step = Math.max(1, size - overlap);
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += step) {
    chunks.push(words.slice(i, i + size).join(" "));
    if (i + size >= words.length) break;
  }
  return chunks;
}

export const SAMPLE_DOC =
  "Retrieval-augmented generation grounds a language model in external knowledge. First, documents are parsed and cleaned. Next, they are split into chunks that fit the embedding model. Each chunk is embedded into a vector and stored in a vector database with its metadata. At query time, the user question is embedded and the nearest chunks are retrieved. A re-ranker reorders the candidates by relevance. Finally, the top chunks are assembled into the prompt and the model generates a grounded, cited answer.";
