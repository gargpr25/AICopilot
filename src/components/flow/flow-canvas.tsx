"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { FLOW_LEVELS, FLOW_NODES } from "@/lib/flow-data";
import { CATEGORIES } from "@/lib/categories";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

type FlowNodeData = {
  label: string;
  category: keyof typeof CATEGORIES;
  active: boolean;
  done: boolean;
  onOpen: () => void;
};

function StepNode({ data }: NodeProps) {
  const d = data as unknown as FlowNodeData;
  const color = CATEGORIES[d.category].color;
  return (
    <div
      onClick={d.onOpen}
      className={cn("node-card border transition-all", d.active && "pulse")}
      style={{
        background: d.active ? `${color}2e` : `${color}12`,
        borderColor: d.active ? color : `${color}55`,
        color: "#e8ecf5",
        opacity: d.done || d.active ? 1 : 0.55,
        boxShadow: d.active ? `0 0 24px -4px ${color}` : undefined,
        minWidth: 190,
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full shrink-0" style={{ background: color }} />
        <span className="flex-1">{d.label}</span>
        <Icon name="ChevronRight" size={14} className="opacity-60" />
      </div>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}

const nodeTypes = { step: StepNode };

export function FlowCanvas() {
  const [level, setLevel] = useState(2); // index into FLOW_LEVELS (0..3) -> default Production
  const [playing, setPlaying] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [selected, setSelected] = useState<string | null>(null);

  const levelDef = FLOW_LEVELS[level];
  const nodeIds = levelDef.nodes;

  // play animation
  useEffect(() => {
    if (!playing) return;
    if (activeIdx >= nodeIds.length - 1) {
      const t = setTimeout(() => setPlaying(false), 900);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setActiveIdx((i) => i + 1), 750);
    return () => clearTimeout(t);
  }, [playing, activeIdx, nodeIds.length]);

  function selectLevel(i: number) {
    setLevel(i);
    setActiveIdx(-1);
    setPlaying(false);
    setSelected(null);
  }

  const openNode = useCallback((id: string) => setSelected(id), []);

  const nodes: Node[] = useMemo(
    () =>
      nodeIds.map((id, i) => {
        const def = FLOW_NODES[id];
        return {
          id,
          type: "step",
          position: { x: 0, y: i * 92 },
          data: {
            label: def.label,
            category: def.category,
            active: playing ? i === activeIdx : selected === id,
            done: !playing || i <= activeIdx,
            onOpen: () => openNode(id),
          },
          draggable: true,
        };
      }),
    [nodeIds, activeIdx, playing, selected, openNode],
  );

  const edges: Edge[] = useMemo(
    () =>
      nodeIds.slice(0, -1).map((id, i) => {
        const activeEdge = playing && i < activeIdx;
        const color = CATEGORIES[FLOW_NODES[nodeIds[i + 1]].category].color;
        return {
          id: `${id}-${nodeIds[i + 1]}`,
          source: id,
          target: nodeIds[i + 1],
          type: "smoothstep",
          animated: activeEdge || !playing,
          style: { stroke: activeEdge ? color : "#3a4256", strokeWidth: activeEdge ? 3 : 2 },
        };
      }),
    [nodeIds, activeIdx, playing],
  );

  const selDef = selected ? FLOW_NODES[selected] : null;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
      <div>
        {/* level tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {FLOW_LEVELS.map((l, i) => (
            <button
              key={l.id}
              onClick={() => selectLevel(i)}
              className={cn(
                "rounded-xl px-3.5 py-2 text-sm font-medium transition border",
                i === level ? "bg-white/10 border-accent text-foreground glow" : "border-border bg-white/5 text-muted hover:bg-white/10",
              )}
            >
              <span className="text-accent2 mr-1.5">L{l.id}</span>
              {l.name}
            </button>
          ))}
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => {
                setSelected(null);
                setActiveIdx(-1);
                setPlaying(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-accent to-accent3 px-4 py-2 text-sm font-semibold text-white glow"
            >
              <Icon name={playing ? "Loader" : "Play"} size={15} className={playing ? "animate-spin" : ""} />
              {playing ? "Running…" : "Animate flow"}
            </button>
            <button
              onClick={() => {
                setPlaying(false);
                setActiveIdx(-1);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
            >
              <Icon name="RotateCcw" size={15} />
            </button>
          </div>
        </div>

        <div className="glass rounded-2xl p-3 mb-3">
          <div className="text-sm text-muted">
            <span className="font-semibold text-foreground">Level {levelDef.id} · {levelDef.name}.</span> {levelDef.description}
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-border" style={{ height: "70vh", background: "rgba(5,6,10,0.5)" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            proOptions={{ hideAttribution: true }}
            minZoom={0.2}
            onNodeClick={(_, n) => openNode(n.id)}
          >
            <Background color="#ffffff10" gap={22} />
            <Controls className="!bg-surface !border-border" />
            <MiniMap
              pannable
              zoomable
              nodeColor={(n) => CATEGORIES[(n.data as unknown as FlowNodeData).category]?.color ?? "#7c8cff"}
              maskColor="rgba(5,6,10,0.7)"
              style={{ background: "#0b0e16", border: "1px solid rgba(255,255,255,0.08)" }}
            />
          </ReactFlow>
        </div>
      </div>

      {/* detail panel */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <AnimatePresence mode="wait">
          {selDef ? (
            <motion.div
              key={selDef.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              className="glass-strong rounded-2xl p-5"
            >
              <div className="flex items-start justify-between">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{ background: `${CATEGORIES[selDef.category].color}1a`, color: CATEGORIES[selDef.category].color }}
                >
                  {CATEGORIES[selDef.category].name}
                </span>
                <button onClick={() => setSelected(null)} className="text-muted hover:text-foreground">
                  <Icon name="X" size={18} />
                </button>
              </div>
              <h3 className="mt-3 text-xl font-bold">{selDef.label}</h3>
              <p className="mt-2 text-sm text-muted">{selDef.note}</p>
              {selDef.slug && (
                <Link
                  href={`/components/${selDef.slug}`}
                  className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-accent to-accent3 px-4 py-2.5 text-sm font-semibold text-white glow"
                >
                  Explore this component <Icon name="ArrowUpRight" size={15} />
                </Link>
              )}
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-5 text-sm text-muted">
              <Icon name="MousePointerClick" size={20} className="text-accent2 mb-2" />
              Click any node to inspect it, then dive into its full component page. Hit <span className="text-foreground font-medium">Animate flow</span> to watch a request travel the pipeline.
            </motion.div>
          )}
        </AnimatePresence>

        <div className="glass rounded-2xl p-4 mt-3">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted/70 mb-2">Steps in this level</div>
          <ol className="space-y-1 text-sm">
            {nodeIds.map((id, i) => (
              <li key={id}>
                <button
                  onClick={() => openNode(id)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left transition",
                    selected === id ? "bg-white/10" : "hover:bg-white/5",
                  )}
                >
                  <span className="text-[11px] text-muted w-5">{i + 1}</span>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: CATEGORIES[FLOW_NODES[id].category].color }} />
                  <span className="truncate">{FLOW_NODES[id].label}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
