"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  Handle,
  Position,
  type NodeProps,
} from "@xyflow/react";
import { motion, AnimatePresence } from "framer-motion";
import { GRAPH_NODES, GRAPH_EDGES } from "@/lib/graph-data";
import { CATEGORIES, CATEGORY_LIST } from "@/lib/categories";
import { getComponent } from "@/lib/components-data";
import type { CategoryId } from "@/lib/types";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

type AtlasData = { label: string; category: CategoryId; dim: boolean; highlight: boolean; size: number; onOpen: () => void };

function AtlasNode({ data }: NodeProps) {
  const d = data as unknown as AtlasData;
  const color = CATEGORIES[d.category].color;
  const scale = 0.85 + d.size * 0.18;
  return (
    <div
      onClick={d.onOpen}
      className="node-card border text-center"
      style={{
        background: d.highlight ? `${color}33` : `${color}14`,
        borderColor: d.highlight ? color : `${color}44`,
        color: "#e8ecf5",
        opacity: d.dim ? 0.22 : 1,
        boxShadow: d.highlight ? `0 0 22px -4px ${color}` : undefined,
        fontSize: 11 * scale,
        padding: `${6 * scale}px ${10 * scale}px`,
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      {d.label}
    </div>
  );
}

const nodeTypes = { atlas: AtlasNode };

export function AtlasGraph() {
  const [selected, setSelected] = useState<string | null>(null);
  const [activeCat, setActiveCat] = useState<CategoryId | null>(null);

  const adjacency = useMemo(() => {
    const m: Record<string, Set<string>> = {};
    for (const n of GRAPH_NODES) m[n.id] = new Set();
    for (const e of GRAPH_EDGES) {
      m[e.source]?.add(e.target);
      m[e.target]?.add(e.source);
    }
    return m;
  }, []);

  const neighbors = selected ? adjacency[selected] : null;

  const isDim = useCallback(
    (id: string, cat: CategoryId) => {
      if (selected) return id !== selected && !neighbors?.has(id);
      if (activeCat) return cat !== activeCat;
      return false;
    },
    [selected, neighbors, activeCat],
  );

  const nodes: Node[] = useMemo(
    () =>
      GRAPH_NODES.map((n) => ({
        id: n.id,
        type: "atlas",
        position: { x: n.x, y: n.y },
        data: {
          label: n.label,
          category: n.category,
          size: n.size ?? 1,
          dim: isDim(n.id, n.category),
          highlight: selected === n.id || (!!neighbors && neighbors.has(n.id)),
          onOpen: () => setSelected((s) => (s === n.id ? null : n.id)),
        },
        draggable: true,
      })),
    [isDim, selected, neighbors],
  );

  const edges: Edge[] = useMemo(
    () =>
      GRAPH_EDGES.map((e) => {
        const connected = selected && (e.source === selected || e.target === selected);
        const dim = selected ? !connected : activeCat ? true : false;
        const color = CATEGORIES[GRAPH_NODES.find((n) => n.id === e.target)?.category ?? "backend"].color;
        return {
          id: `${e.source}-${e.target}`,
          source: e.source,
          target: e.target,
          type: "default",
          animated: !!connected,
          style: {
            stroke: connected ? color : "#2a3040",
            strokeWidth: connected ? 2.5 : 1,
            opacity: dim ? 0.15 : connected ? 0.9 : 0.4,
          },
        };
      }),
    [selected, activeCat],
  );

  const comp = selected ? getComponent(selected) : null;
  const selNode = selected ? GRAPH_NODES.find((n) => n.id === selected) : null;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          <button
            onClick={() => {
              setActiveCat(null);
              setSelected(null);
            }}
            className={cn("rounded-full px-3 py-1 text-xs border transition", !activeCat && !selected ? "bg-white/10 border-accent" : "border-border text-muted hover:bg-white/5")}
          >
            All layers
          </button>
          {CATEGORY_LIST.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelected(null);
                setActiveCat((a) => (a === c.id ? null : c.id));
              }}
              className="rounded-full px-2.5 py-1 text-xs border transition"
              style={{
                background: activeCat === c.id ? `${c.color}2e` : "transparent",
                borderColor: activeCat === c.id ? c.color : "rgba(255,255,255,0.08)",
                color: activeCat === c.id ? c.color : "#9aa5b8",
              }}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="rounded-2xl overflow-hidden border border-border" style={{ height: "74vh", background: "rgba(5,6,10,0.5)" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.1 }}
            minZoom={0.15}
            maxZoom={2.5}
            proOptions={{ hideAttribution: true }}
            onPaneClick={() => setSelected(null)}
          >
            <Background color="#ffffff10" gap={26} />
            <Controls className="!bg-surface !border-border" />
            <MiniMap
              pannable
              zoomable
              nodeColor={(n) => CATEGORIES[(n.data as unknown as AtlasData).category]?.color ?? "#7c8cff"}
              maskColor="rgba(5,6,10,0.7)"
              style={{ background: "#0b0e16", border: "1px solid rgba(255,255,255,0.08)" }}
            />
          </ReactFlow>
        </div>
        <p className="mt-2 text-xs text-muted">
          Scroll to zoom · drag to pan · drag nodes to rearrange · click a node to highlight its connections.
        </p>
      </div>

      <div className="lg:sticky lg:top-20 lg:self-start">
        <AnimatePresence mode="wait">
          {selNode ? (
            <motion.div key={selNode.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-strong rounded-2xl p-5">
              <div className="flex items-start justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ background: `${CATEGORIES[selNode.category].color}1a`, color: CATEGORIES[selNode.category].color }}>
                  {CATEGORIES[selNode.category].name}
                </span>
                <button onClick={() => setSelected(null)} className="text-muted hover:text-foreground">
                  <Icon name="X" size={18} />
                </button>
              </div>
              <h3 className="mt-3 text-xl font-bold">{comp?.name ?? selNode.label}</h3>
              {comp && <p className="mt-2 text-sm text-muted">{comp.tagline}</p>}
              <div className="mt-3 text-xs text-muted">
                <span className="font-semibold text-foreground/80">Connects to:</span>{" "}
                {[...(neighbors ?? [])].slice(0, 8).map((n) => GRAPH_NODES.find((g) => g.id === n)?.label).filter(Boolean).join(" · ")}
              </div>
              {comp && (
                <Link href={`/components/${comp.slug}`} className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-accent to-accent3 px-4 py-2.5 text-sm font-semibold text-white glow">
                  Enter this world <Icon name="ArrowUpRight" size={15} />
                </Link>
              )}
            </motion.div>
          ) : (
            <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-5 text-sm text-muted">
              <Icon name="Waypoints" size={20} className="text-accent2 mb-2" />
              This is the whole GenAI ecosystem on one canvas. Filter by layer, or click any concept to trace how it connects to everything else — then zoom into its world.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
