import { FileText } from "lucide-react";
import { TEAL, TEAL_50, PREVIEW_COLS } from "../functions/useEvalPlanDetalle";
import { fmtFecha } from "@shared/services/data/cronograma";

interface Evaluacion {
  fecha: string;
  evaluacion: string;
  tipo: string;
  porcentaje: number;
}

interface Props {
  materia: string;
  seccion: string;
  docente: string;
  plantilla: string;
  ordenadas: Evaluacion[];
  totalPct: number;
}

export function PreviewPlan({ materia, seccion, docente, plantilla, ordenadas, totalPct }: Props) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-edu-border-soft flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-edu-control flex items-center justify-center"
          style={{ backgroundColor: TEAL_50 }}
        >
          <FileText className="w-4 h-4" style={{ color: TEAL }} />
        </div>
        <div>
          <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Previsualización</h3>
          <p className="mt-0.5 mb-0 text-edu-ink-400 text-[0.775rem]">
            Según la plantilla: {plantilla}
          </p>
        </div>
      </div>

      <div className="p-6 bg-edu-subtle">
        <div className="mx-auto max-w-[640px] bg-edu-surface rounded-edu-card border border-edu-border-soft shadow-[0_6px_20px_rgba(0,0,0,0.06)] p-6">
          <div className="text-center border-b border-edu-border-soft pb-4">
            <h4 className="m-0 text-edu-ink font-bold text-[1rem]">Plan de evaluación</h4>
            <p className="m-0 mt-1 text-[0.85rem] text-edu-ink-700 font-medium">
              {materia} · {seccion}
            </p>
            <p className="m-0 text-[0.78rem] text-edu-ink-400">{docente}</p>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <div
                className={`grid ${PREVIEW_COLS} px-2 py-2 mt-4 bg-edu-subtle rounded-edu-chip text-[0.68rem] font-semibold text-edu-ink-400 uppercase tracking-[0.04em]`}
              >
                <span>Fecha</span>
                <span>Evaluación</span>
                <span>Tipo</span>
                <span className="text-right">%</span>
              </div>
              {ordenadas.map((e, i) => (
                <div
                  key={i}
                  className={`grid ${PREVIEW_COLS} px-2 py-2.5 items-center border-b border-edu-border-soft text-[0.8125rem]`}
                >
                  <span className="text-edu-ink-500">{fmtFecha(e.fecha)}</span>
                  <span className="text-edu-ink font-medium">{e.evaluacion}</span>
                  <span className="text-edu-ink-700">{e.tipo}</span>
                  <span className="text-right text-edu-ink font-semibold">{e.porcentaje}%</span>
                </div>
              ))}
              <div className={`grid ${PREVIEW_COLS} px-2 py-2.5 items-center text-[0.8125rem] font-bold`}>
                <span />
                <span />
                <span className="text-right text-edu-ink-500">Total</span>
                <span className={`text-right ${totalPct === 100 ? "text-edu-success" : "text-edu-danger"}`}>
                  {totalPct}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
