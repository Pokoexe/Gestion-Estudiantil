import { ArrowLeft, User } from "lucide-react";
import { TEAL, TEAL_BG } from "../functions/useEvalDiscusionEstudiante";
import type { Boletin } from "@shared/services/actions/boletines";

interface Props {
  b: Boletin;
  prom: number;
  pos: number;
  listaLength: number;
  onVolver: () => void;
}

export function EstudianteHeader({ b, prom, pos, listaLength, onVolver }: Props) {
  return (
    <>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={onVolver}
          className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-edu-ink-500 hover:text-edu-ink-700 bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Concejo
        </button>
        <span className="text-[0.8rem] text-edu-ink-400 font-medium">
          Estudiante {pos + 1} de {listaLength}
        </span>
      </div>

      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex items-center gap-4 flex-wrap">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: TEAL_BG }}
        >
          <User className="w-7 h-7" style={{ color: TEAL }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-edu-ink text-[1.1rem] font-bold m-0">{b.student}</p>
          <p className="text-edu-ink-500 text-[0.85rem] m-0 mt-0.5">
            {b.anio} · Sección {b.seccion} · {b.cedula}
          </p>
        </div>
        <div className="text-right">
          <div className="text-[0.72rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">
            Promedio general
          </div>
          <div
            className={`text-[1.6rem] font-bold leading-none mt-1 ${prom >= 10 ? "text-edu-success" : "text-edu-danger"}`}
          >
            {prom.toFixed(2)}
          </div>
        </div>
      </div>
    </>
  );
}
