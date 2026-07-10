import { ArrowUp, ArrowDown, GripVertical } from "lucide-react";
import { SECTION_META } from "@/pages/Auth/LandingPage/interfaces/types";
import type { LandingConfig } from "@/pages/Auth/LandingPage/interfaces/types";
import { IconBtn } from "./IconBtn";
import { Switch } from "./Switch";

export function TabOrden({
  config,
  enabledCount,
  dragIdx,
  setDragIdx,
  moveSectionToIndex,
  moveSection,
  toggleSection,
}: {
  config: LandingConfig;
  enabledCount: number;
  dragIdx: number | null;
  setDragIdx: (i: number | null) => void;
  moveSectionToIndex: (from: number, to: number) => void;
  moveSection: (i: number, dir: -1 | 1) => void;
  toggleSection: (i: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-edu-control border border-edu-border-soft bg-edu-subtle p-3">
        <div className="flex items-center justify-between">
          <span className="text-[0.8rem] font-semibold text-edu-ink">Secciones visibles</span>
          <span className="rounded-edu-pill bg-edu-primary-50 px-2.5 py-0.5 text-[0.72rem] font-bold text-edu-primary">
            {enabledCount}/{config.sections.length}
          </span>
        </div>
        <p className="m-0 mt-1 text-[0.72rem] text-edu-ink-400">Activa las secciones que desees. Arrastra o usa las flechas para reordenar.</p>
      </div>
      <div className="flex flex-col gap-1.5">
        {config.sections.map((s, i) => {
          const meta = SECTION_META[s.id];
          const Icon = meta.icon;
          const isDragging = dragIdx === i;
          return (
            <div
              key={s.id}
              onDragEnter={() => {
                if (dragIdx !== null && dragIdx !== i) {
                  moveSectionToIndex(dragIdx, i);
                  setDragIdx(i);
                }
              }}
              onDragOver={(e) => e.preventDefault()}
              onDragEnd={() => setDragIdx(null)}
              className={`flex items-center gap-2 rounded-edu-control border p-2 pl-2.5 transition-colors select-none ${isDragging
                ? "border-edu-primary-200 bg-edu-primary-50 opacity-50"
                : s.enabled
                  ? "border-edu-border bg-edu-surface hover:border-edu-primary-200"
                  : "border-edu-border-soft bg-edu-subtle opacity-70"
                }`}
            >
              <button
                type="button"
                draggable
                onDragStart={(e) => { e.dataTransfer.setDragImage(e.currentTarget, 10, 10); setDragIdx(i); }}
                onDragEnd={() => setDragIdx(null)}
                aria-label="Arrastrar para reordenar"
                title="Arrastrar para reordenar"
                className="flex shrink-0 cursor-grab items-center justify-center border-none bg-transparent p-0.5 text-edu-ink-300 hover:text-edu-ink-500 active:cursor-grabbing"
              >
                <GripVertical className="h-4 w-4" />
              </button>
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-edu-chip ${s.enabled ? "bg-edu-primary-50" : "bg-edu-border-soft"}`}>
                <Icon className={`h-4 w-4 ${s.enabled ? "text-edu-primary" : "text-edu-ink-400"}`} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[0.82rem] font-semibold text-edu-ink">{meta.label}</div>
                <div className="truncate text-[0.68rem] text-edu-ink-400">{meta.description}</div>
              </div>
              <IconBtn onClick={() => moveSection(i, -1)} disabled={i === 0} label="Subir"><ArrowUp className="h-3.5 w-3.5" /></IconBtn>
              <IconBtn onClick={() => moveSection(i, 1)} disabled={i === config.sections.length - 1} label="Bajar"><ArrowDown className="h-3.5 w-3.5" /></IconBtn>
              <Switch on={s.enabled} onClick={() => toggleSection(i)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
