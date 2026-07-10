import { User } from "lucide-react";
import { TEAL, TEAL_BG } from "../functions/useEvalSabanaEstudiante";
import type { Boletin } from "@shared/services/actions/boletines";
import { LapsoFilter } from "@shared/ui/LapsoFilter";

interface Props {
  b: Boletin;
  prom: number;
  onVolver: () => void;
}

export function ResumenEstudiante({ b, prom, onVolver }: Props) {
  return (
    <>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={onVolver}
          className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-edu-ink-500 hover:text-edu-ink-700 bg-transparent border-none cursor-pointer"
          style={{ color: TEAL }}
        >
          ← Volver a boletines
        </button>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <h2 className="m-0 text-edu-ink font-bold text-[1.2rem]">Sábana de notas</h2>
            <p className="m-0 mt-0.5 text-edu-ink-500 text-[0.85rem]">
              Todas las evaluaciones de todas las materias
            </p>
          </div>
          <LapsoFilter />
        </div>
      </div>

      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: TEAL_BG }}
          >
            <User className="w-6 h-6" style={{ color: TEAL }} />
          </div>
          <div>
            <div className="text-edu-ink font-bold text-[1rem]">{b.student}</div>
            <div className="text-edu-ink-500 text-[0.85rem]">
              {b.anio} · Sección {b.seccion} · {b.cedula}
            </div>
            <div className="text-edu-ink-400 text-[0.78rem] mt-0.5">
              Representante: {b.representante}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[0.72rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">
            Promedio general
          </div>
          <div
            className={`text-[1.8rem] font-bold leading-none mt-1 ${prom >= 10 ? "text-edu-success" : "text-edu-danger"}`}
          >
            {prom.toFixed(2)}
          </div>
        </div>
      </div>
    </>
  );
}
