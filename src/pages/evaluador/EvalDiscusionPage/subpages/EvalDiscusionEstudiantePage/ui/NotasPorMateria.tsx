import { FileSpreadsheet, Paperclip } from "lucide-react";
import { notaColor } from "@shared/services/data/boletines";
import { TEAL, ESTADO_META, EVAL_COLS } from "../functions/useEvalDiscusionEstudiante";
import type { EvalNota } from "@shared/services/actions/boletines";
import type { PostEstado } from "@shared/services/actions/discusiones";

interface Postulacion {
  estado: PostEstado;
}

interface Props {
  MATERIAS: string[];
  tab: string;
  notaTab: number;
  evals: EvalNota[];
  postulacionActiva?: Postulacion;
  onTabChange: (m: string) => void;
  onEvalSel: (e: EvalNota) => void;
}

export function NotasPorMateria({
  MATERIAS,
  tab,
  notaTab,
  evals,
  postulacionActiva,
  onTabChange,
  onEvalSel,
}: Props) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-edu-border-soft flex items-center gap-2">
        <FileSpreadsheet className="w-4 h-4 text-edu-ink-400" />
        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Notas por materia</h3>
        <span className="ml-auto text-[0.72rem] text-edu-ink-400 hidden sm:inline">
          Toca una evaluación para ver su archivo adjunto
        </span>
      </div>

      <div className="flex gap-1 px-5 pt-3 border-b border-edu-border-soft overflow-x-auto">
        {MATERIAS.map((m) => {
          const activa = m === tab;
          return (
            <button
              key={m}
              type="button"
              onClick={() => onTabChange(m)}
              className={`px-3.5 py-2 text-[0.8125rem] font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors cursor-pointer bg-transparent ${activa ? "" : "border-transparent text-edu-ink-500 hover:text-edu-ink-700"}`}
              style={activa ? { color: TEAL, borderColor: TEAL } : undefined}
            >
              {m}
            </button>
          );
        })}
      </div>

      <div className="px-5 pt-4 pb-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-[0.9rem] text-edu-ink font-semibold">{tab}</span>
          {postulacionActiva && (
            <span
              className={`inline-flex items-center px-2 py-[2px] rounded-edu-pill text-[0.65rem] font-semibold ${ESTADO_META[postulacionActiva.estado]}`}
            >
              {postulacionActiva.estado === "Pendiente"
                ? "Postulado · Pendiente"
                : postulacionActiva.estado}
            </span>
          )}
        </div>
        <span className="text-[0.8125rem] text-edu-ink-500">
          Definitiva:{" "}
          <strong className={`text-[0.95rem] ${notaColor(notaTab)}`}>{notaTab}</strong>
          <span className="text-edu-ink-400"> / 20</span>
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div
            className={`grid ${EVAL_COLS} px-5 py-2.5 bg-edu-subtle border-y border-edu-border-soft`}
          >
            {["Evaluación", "Tipo", "%", "Nota"].map((h, j) => (
              <span
                key={h}
                className={`text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em] ${j >= 2 ? "text-right" : ""}`}
              >
                {h}
              </span>
            ))}
          </div>
          {evals.map((e, j) => (
            <div
              key={j}
              onClick={() => onEvalSel(e)}
              role="button"
              tabIndex={0}
              onKeyDown={(ev) => (ev.key === "Enter" || ev.key === " ") && onEvalSel(e)}
              className={`grid ${EVAL_COLS} px-5 py-[11px] items-center cursor-pointer transition-colors hover:bg-edu-subtle focus:outline-none focus-visible:bg-edu-subtle ${j < evals.length - 1 ? "border-b border-edu-border-soft" : ""}`}
            >
              <span className="text-[0.875rem] text-edu-ink font-medium inline-flex items-center gap-1.5">
                {e.nombre}
                <Paperclip className="w-3.5 h-3.5 text-edu-ink-300 shrink-0" />
              </span>
              <span className="text-[0.8125rem] text-edu-ink-700">{e.tipo}</span>
              <span className="text-[0.8125rem] text-edu-ink-500 text-right">{e.porcentaje}%</span>
              <span className={`text-[0.9rem] font-bold text-right ${notaColor(e.nota)}`}>
                {e.nota}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
