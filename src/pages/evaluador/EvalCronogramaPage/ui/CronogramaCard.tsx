import { CalendarClock, Pencil } from "lucide-react";
import { TEAL, TEAL_50, TEAL_BG } from "../functions/useEvalCronograma";
import type { LapsoState } from "../functions/useEvalCronograma";
import { fmtFecha, fmtFechaLarga } from "@shared/services/data/cronograma";

interface Props {
  lapso: LapsoState;
  progreso: number;
  onModificar: () => void;
}

export function CronogramaCard({ lapso, progreso, onModificar }: Props) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center gap-3">
        <div>
          <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">
            Cronograma de evaluación
          </h3>
          <p className="mt-0.5 mb-0 text-edu-ink-400 text-[0.775rem]">Lapso académico en curso</p>
        </div>
        <button
          onClick={onModificar}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-edu-control text-[0.8125rem] font-semibold text-white border-none cursor-pointer transition-opacity hover:opacity-90"
          style={{ backgroundColor: TEAL }}
        >
          <Pencil className="w-3.5 h-3.5" />
          Modificar
        </button>
      </div>

      <div className="p-5 flex flex-col gap-[18px]">
        <div className="flex justify-between items-start flex-wrap gap-2.5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[1.1rem] font-bold text-edu-ink">{lapso.nombre}</span>
              <span
                className="inline-flex items-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold"
                style={{ backgroundColor: TEAL_BG, color: TEAL }}
              >
                En curso
              </span>
            </div>
            <p className="mt-1 mb-0 text-[0.8rem] text-edu-ink-500">
              Cierre del lapso:{" "}
              <strong className="text-edu-ink-700">{fmtFechaLarga(lapso.cierre)}</strong>
            </p>
          </div>
          <div className="text-right">
            <div className="text-[1.4rem] font-bold" style={{ color: TEAL }}>
              {progreso} %
            </div>
            <div className="text-[0.72rem] text-edu-ink-400">del lapso transcurrido</div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="h-2.5 bg-edu-border-soft rounded-edu-pill overflow-hidden">
            <div
              className="h-full rounded-edu-pill"
              style={{ width: `${progreso}%`, backgroundColor: TEAL }}
            />
          </div>
          <div className="flex justify-between text-[0.7rem] text-edu-ink-400">
            <span>{fmtFecha(lapso.inicio)}</span>
            <span>Hoy</span>
            <span>{fmtFecha(lapso.cierre)}</span>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div
            className="flex-1 min-w-[150px] rounded-edu-chip px-3.5 py-3 flex items-center gap-2.5"
            style={{ backgroundColor: TEAL_50 }}
          >
            <CalendarClock style={{ width: "18px", height: "18px", color: TEAL, flexShrink: 0 }} />
            <div>
              <div className="text-[0.72rem] text-edu-ink-500 font-medium">Separación mínima</div>
              <div className="text-[0.9rem] text-edu-ink font-bold">
                {lapso.min} días entre evaluaciones
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-[150px] bg-edu-warning-bg rounded-edu-chip px-3.5 py-3 flex items-center gap-2.5">
            <CalendarClock
              className="text-edu-warning"
              style={{ width: "18px", height: "18px", flexShrink: 0 }}
            />
            <div>
              <div className="text-[0.72rem] text-edu-ink-500 font-medium">Separación máxima</div>
              <div className="text-[0.9rem] text-edu-ink font-bold">
                {lapso.max} días entre evaluaciones
              </div>
            </div>
          </div>
        </div>
        <p className="m-0 text-[0.775rem] text-edu-ink-400">
          Regla vigente: Mín. {lapso.min} días · Máx. {lapso.max} días entre evaluaciones.
        </p>
      </div>
    </div>
  );
}
