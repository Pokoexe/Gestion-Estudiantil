import { FileSpreadsheet } from "lucide-react";
import { TEAL, TEAL_50, EVAL_COLS } from "../functions/useEvalSabanaEstudiante";
import { notaColor, desglose } from "@shared/services/data/boletines";

interface Props {
  materia: string;
  nota: number;
}

export function MateriaEvalCard({ materia, nota }: Props) {
  const evals = desglose(nota);

  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-edu-control flex items-center justify-center"
            style={{ backgroundColor: TEAL_50 }}
          >
            <FileSpreadsheet className="w-4 h-4" style={{ color: TEAL }} />
          </div>
          <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">{materia}</h3>
        </div>
        <span className="text-[0.8125rem] text-edu-ink-500">
          Definitiva:{" "}
          <strong className={`text-[0.95rem] ${notaColor(nota)}`}>{nota}</strong>
          <span className="text-edu-ink-400"> / 20</span>
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div
            className={`grid ${EVAL_COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}
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
              className={`grid ${EVAL_COLS} px-5 py-[11px] items-center ${j < evals.length - 1 ? "border-b border-edu-border-soft" : ""}`}
            >
              <span className="text-[0.875rem] text-edu-ink font-medium">{e.nombre}</span>
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
