import { Clock, AlertCircle } from "lucide-react";

interface SummaryCardsProps {
  onNextClassClick: () => void;
  onNextEvalClick: () => void;
}

/** Tarjetas de resumen: asistencia general, próxima clase y próxima evaluación. */
export function SummaryCards({ onNextClassClick, onNextEvalClick }: SummaryCardsProps) {
  return (
    <div className="space-y-2">
      {/* Asistencia general */}
      <div className="bg-edu-surface rounded-edu-card p-4 sm:p-5 border border-edu-border-soft flex flex-col gap-2.5">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
              Asistencia general
            </p>
            <p className="text-edu-ink text-[1.4rem] font-bold mt-1">
              92,4 %
            </p>
          </div>
          <div className="w-10 h-10 rounded-edu-control bg-edu-warning-bg flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-edu-warning-strong" />
          </div>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-edu-pill ${i < 18 ? "bg-edu-primary" : "bg-edu-danger-bg"}`}
            />
          ))}
        </div>
        <p className="text-edu-ink-400 text-xs m-0">
          2 inasistencias este lapso · Mínimo exigido: 75 %
        </p>
      </div>

      {/* Próxima clase */}
      <div className="bg-edu-surface rounded-edu-card p-4 sm:p-5 border border-edu-border-soft flex flex-col gap-2.5 cursor-pointer hover:bg-edu-subtle transition-colors" onClick={onNextClassClick}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
              Próxima clase
            </p>
            <p className="text-edu-ink text-[1.1rem] font-bold mt-1">
              Física
            </p>
          </div>
          <div className="w-10 h-10 rounded-edu-control bg-edu-primary-100 flex items-center justify-center">
            <Clock className="w-5 h-5 text-edu-primary" />
          </div>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <span className="bg-edu-primary-50 text-edu-primary text-[0.7rem] font-semibold px-2 py-[3px] rounded-[6px]">
            Hoy · 11:00
          </span>
        </div>
        <p className="text-edu-ink-400 text-xs m-0">
          Prof. Jonny · Comienza en 1 h 20 min
        </p>
      </div>

      {/* Próxima evaluación */}
      <div className="bg-edu-surface rounded-edu-card p-4 sm:p-5 border border-edu-border-soft flex flex-col gap-2.5 cursor-pointer hover:bg-edu-subtle transition-colors" onClick={onNextEvalClick}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
              Próxima evaluación
            </p>
            <p className="text-edu-ink text-[1.1rem] font-bold mt-1">
              Matemática - Examen
            </p>
            <p className="text-edu-ink-400 text-xs m-0">
              Limites y Derivadas
            </p>
          </div>
          <div className="w-10 h-10 rounded-edu-control bg-edu-primary-100 flex items-center justify-center">
            <Clock className="w-5 h-5 text-edu-primary" />
          </div>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <span className="bg-edu-primary-50 text-edu-primary text-[0.7rem] font-semibold px-2 py-[3px] rounded-[6px]">
            Hoy · 12:20
          </span>
        </div>
        <p className="text-edu-ink-400 text-xs m-0">
          Prof. Ramírez · Comienza en 3 h 20 min
        </p>
      </div>
    </div>
  );
}
