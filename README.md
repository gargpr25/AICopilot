# GenAI Architecture Atlas

An interactive, explorable learning platform for the **complete end-to-end architecture of Generative AI systems** — "the Google Maps of GenAI." Instead of a documentation site, it's a zoomable knowledge graph where every concept is interconnected, clickable, and simulatable.

> Answer the question: *"What happens from the moment I type a prompt until the final response appears?"* — visually, at four levels of zoom.

## Features

- **End-to-End Flow** (`/flow`) — animate a request through the whole pipeline across **4 zoom levels** (Simple → Intermediate → Production → Enterprise). Clickable nodes, animated edges, minimap, pan/zoom.
- **The Atlas** (`/atlas`) — a zoomable, interconnected knowledge graph of ~80 concepts. Click any node to highlight its connections; filter by 16 architectural layers.
- **Component Explorer** (`/components`) — **81 component "worlds"**, each with a consistent schema: the "Why" view (what problem it solves, why it can't be skipped, what happens if removed, who calls it, what it calls next), inputs/outputs, request/response, code, advantages/disadvantages, best practices, common mistakes, alternatives, real companies, interview questions, and connected concepts.
- **Playground** (`/playground`) — 6 in-browser simulators (no API keys): Retrieval Lab (BM25 ↔ vector ↔ hybrid slider), Embedding explorer, Chunking simulator, RAG step-through, Agent loop, MCP JSON-RPC explorer.
- **Learning Path** (`/learn`) — 20 modules from *Introduction to GenAI* to *Scaling*.
- **Architecture Library** (`/architectures`) — reverse-engineered ChatGPT, Cursor, GitHub Copilot, Perplexity, NotebookLM, Enterprise RAG.
- **Comparisons, Glossary, Interview Questions, Cheat Sheets, Future Trends.**
- Global glass/dark design, responsive sidebar, ⌘K search across everything.

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + React 19
- TypeScript
- Tailwind CSS 4
- [React Flow](https://reactflow.dev) (`@xyflow/react`) for interactive diagrams
- [Framer Motion](https://www.framer.com/motion/) for animation
- [Lucide](https://lucide.dev) icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build (generates ~123 static pages) |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Content & Data

All content is authored as typed data modules under `src/lib/` — there is **no database**; pages are statically generated from these modules:

| File | Contents |
| --- | --- |
| `src/lib/components-data.ts` | The 81 component definitions (the core schema) |
| `src/lib/graph-data.ts` | Atlas knowledge-graph nodes & edges |
| `src/lib/flow-data.ts` | The 4 flow levels and their nodes |
| `src/lib/modules-data.ts` | The 20 learning modules |
| `src/lib/architectures-data.ts` | Real-world architecture breakdowns |
| `src/lib/reference-data.ts` | Comparisons, glossary, interview questions, cheat sheets |
| `src/lib/sim.ts` | Client-side simulation logic (BM25, cosine, chunking, ranking) |

To extend the site, add entries to the relevant data module — routes and pages pick them up automatically.

## Project Structure

```
src/
  app/            # Next.js App Router pages (flow, atlas, components/[slug], learn/[slug], ...)
  components/     # UI + interactive React Flow canvases, playground simulators, shell, search
  lib/            # Typed content data + helpers
```
