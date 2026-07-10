import { Clock } from "lucide-react";
import type { PendingEval } from "@shared/services/actions/estudiante";

interface PendingEvalsCardProps {
  pendingEvals: PendingEval[];
  onSelect: (ev: PendingEval) => void;
}

/** Evaluaciones pendientes de la semana: vista móvil (tarjetas) y desktop (tabla). */
export function PendingEvalsCard({ pendingEvals, onSelect }: PendingEvalsCardProps) {
  return (
    <div className="md:col-span-2">
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <div className="px-4 sm:px-5 py-4 border-b border-edu-border-soft flex justify-between items-center gap-2">
          <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">
            Evaluaciones pendientes de la semana
          </h3>
          <span className="text-[0.8rem] text-edu-primary cursor-pointer font-medium shrink-0">
            Ver todas →
          </span>
        </div>
        {/* Móvil */}
        <div className="sm:hidden divide-y divide-edu-border-soft">
          {pendingEvals.map((ev) => (
            <div
              key={ev.id}
              className="px-4 py-3 flex flex-col gap-1.5 cursor-pointer hover:bg-edu-subtle transition-colors"
              onClick={() => onSelect(ev)}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: ev.dot }}
                  />
                  <span className="text-sm text-edu-ink font-semibold truncate">
                    {ev.subject}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold shrink-0 ${ev.status === "late" ? "bg-edu-danger-bg text-edu-danger" : "bg-edu-warning-bg text-edu-warning"}`}
                >
                  {ev.status === "late" ? "Atrasada" : "Próxima"}
                </span>
              </div>
              <span className="text-[0.8125rem] text-edu-ink-700">{ev.type}</span>
              <div className="flex items-center justify-between gap-2 text-edu-ink-500">
                <span className="flex items-center gap-1 text-[0.8125rem]">
                  <Clock className="w-3 h-3 text-edu-ink-400 shrink-0" />
                  {ev.dueDate}
                </span>
                <span className="text-[0.8125rem] font-semibold text-edu-ink-700">
                  {ev.weight}
                </span>
              </div>
            </div>
          ))}
        </div>
        {/* Desktop */}
        <div className="hidden sm:block overflow-x-auto">
          <div className="min-w-[480px]">
            <div className="grid grid-cols-[1fr_1.2fr_1fr_0.5fr_0.8fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
              {["Materia", "Evaluación", "Fecha", "Porcentaje", "Estado"].map((h) => (
                <span
                  key={h}
                  className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]"
                >
                  {h}
                </span>
              ))}
            </div>
            {pendingEvals.map((ev, i) => (
              <div
                key={ev.id}
                onClick={() => onSelect(ev)}
                className={`grid grid-cols-[1fr_1.2fr_1fr_0.5fr_0.8fr] px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle ${i < pendingEvals.length - 1 ? "border-b border-edu-border-soft" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: ev.dot }}
                  />
                  <span className="text-[0.875rem] text-edu-ink font-medium">
                    {ev.subject}
                  </span>
                </div>
                <span className="text-[0.875rem] text-edu-ink-700">
                  {ev.type}
                </span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-edu-ink-400 shrink-0" />
                  <span className="text-[0.8125rem] text-edu-ink-500">
                    {ev.dueDate}
                  </span>
                </div>
                <span className="text-[0.875rem] text-edu-ink-700 font-semibold">
                  {ev.weight}
                </span>
                <span
                  className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${ev.status === "late" ? "bg-edu-danger-bg text-edu-danger" : "bg-edu-warning-bg text-edu-warning"}`}
                >
                  {ev.status === "late" ? "Atrasada" : "Próxima"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
