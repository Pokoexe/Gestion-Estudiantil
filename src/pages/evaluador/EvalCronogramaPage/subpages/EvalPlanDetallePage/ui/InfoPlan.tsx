import { MessageSquareWarning } from "lucide-react";
import { TEAL, ESTADO_PILL } from "../functions/useEvalPlanDetalle";
import type { PlanEstado } from "@shared/services/actions/cronograma";
import { ESTADO_LABEL } from "@shared/services/data/cronograma";
import { fmtFechaLarga } from "@shared/services/data/cronograma";

interface Evaluacion {
  fecha: string;
}

interface Props {
  materia: string;
  seccion: string;
  docente: string;
  plantilla: string;
  estado: PlanEstado;
  totalPct: number;
  ordenadas: Evaluacion[];
  evalCount: number;
  onEnRevision: () => void;
}

export function InfoPlan({
  materia,
  seccion,
  docente,
  plantilla,
  estado,
  totalPct,
  ordenadas,
  evalCount,
  onEnRevision,
}: Props) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-edu-border-soft">
        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Información del plan</h3>
      </div>
      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between px-4 py-3 rounded-edu-control bg-edu-subtle">
          <span className="text-[0.72rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">
            Estado
          </span>
          <span
            className={`inline-flex items-center justify-center px-3 py-1 rounded-edu-pill text-[0.8rem] font-semibold ${ESTADO_PILL[estado]}`}
          >
            {ESTADO_LABEL[estado]}
          </span>
        </div>

        {[
          { label: "Materia", value: materia },
          { label: "Sección", value: seccion },
          { label: "Docente", value: docente },
          { label: "Plantilla", value: plantilla },
          { label: "Evaluaciones", value: `${evalCount} evaluaciones` },
          { label: "Ponderación total", value: `${totalPct}%` },
          {
            label: "Primera evaluación",
            value: ordenadas.length ? fmtFechaLarga(ordenadas[0].fecha) : "—",
          },
          {
            label: "Última evaluación",
            value: ordenadas.length ? fmtFechaLarga(ordenadas[ordenadas.length - 1].fecha) : "—",
          },
        ].map((f) => (
          <div key={f.label} className="flex items-start justify-between gap-3">
            <span className="text-[0.72rem] text-edu-ink-400 uppercase tracking-[0.04em] shrink-0">
              {f.label}
            </span>
            <span className="text-[0.875rem] text-edu-ink font-medium text-right">{f.value}</span>
          </div>
        ))}

        <button
          onClick={onEnRevision}
          className="mt-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-edu-control text-sm font-semibold text-white border-none cursor-pointer transition-opacity hover:opacity-90"
          style={{ backgroundColor: TEAL }}
        >
          <MessageSquareWarning className="w-4 h-4" />
          En revisión
        </button>
      </div>
    </div>
  );
}
