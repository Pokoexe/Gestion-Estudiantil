import { Clock } from "lucide-react";
import type { Grade } from "@shared/services/actions/estudiante";
import { TYPE_META, PASS_MARK } from "../functions/useDashboard";

interface RecentGradesCardProps {
  recentGrades: Grade[];
  onSelect: (g: Grade) => void;
}

/** Resultados de evaluaciones: vista móvil (tarjetas) y desktop (tabla). */
export function RecentGradesCard({ recentGrades, onSelect }: RecentGradesCardProps) {
  return (
    <div className="md:col-span-2 bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <div className="px-4 sm:px-5 py-4 border-b border-edu-border-soft flex justify-between items-center gap-2">
        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">
          Resultados de evaluaciones
        </h3>
        <span className="text-[0.8rem] text-edu-primary cursor-pointer font-medium shrink-0">
          Ver todas →
        </span>
      </div>
      {/* Móvil */}
      <div className="sm:hidden divide-y divide-edu-border-soft">
        {recentGrades.map((g) => {
          const t = TYPE_META[g.type];
          const passed = g.grade >= PASS_MARK;
          return (
            <div
              key={g.id}
              className="px-4 py-3 flex flex-col gap-1.5 cursor-pointer hover:bg-edu-subtle transition-colors"
              onClick={() => onSelect(g)}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: t.fg }}
                  />
                  <span className="text-sm text-edu-ink font-semibold truncate">
                    {g.subject}
                  </span>
                </div>
                <span className={`text-[0.8125rem] font-bold shrink-0 ${passed ? "text-edu-ink" : "text-edu-danger"}`}>
                  {g.grade}<span className="text-edu-ink-400 font-normal text-xs">/20</span>
                </span>
              </div>
              <span className="text-[0.8125rem] text-edu-ink-700">{g.title}</span>
              <span className="flex items-center gap-1 text-[0.8125rem] text-edu-ink-500">
                <Clock className="w-3 h-3 text-edu-ink-400 shrink-0" />
                {g.date}
              </span>
            </div>
          );
        })}
      </div>
      {/* Desktop */}
      <div className="hidden sm:block overflow-x-auto">
        <div className="min-w-[360px]">
          <div className="grid grid-cols-[1fr_1.4fr_1fr_0.5fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
            {["Materia", "Evaluación", "Fecha", "Nota"].map((h) => (
              <span
                key={h}
                className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]"
              >
                {h}
              </span>
            ))}
          </div>
          {recentGrades.map((g, i) => {
            const t = TYPE_META[g.type];
            const passed = g.grade >= PASS_MARK;
            return (
              <div
                key={g.id}
                onClick={() => onSelect(g)}
                className={`grid grid-cols-[1fr_1.4fr_1fr_0.5fr] px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle ${i < recentGrades.length - 1 ? "border-b border-edu-border-soft" : ""}`}
              >
                <span className="text-[0.875rem] text-edu-ink font-medium truncate pr-2">
                  {g.subject}
                </span>
                <div className="min-w-0 pr-2">
                  <div className="text-[0.875rem] text-edu-ink-700 truncate">{g.title}</div>
                  <span
                    className="inline-flex mt-0.5 text-[0.62rem] font-semibold px-1.5 py-px rounded-edu-pill"
                    style={{ backgroundColor: t.bg, color: t.fg }}
                  >
                    {t.label}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-edu-ink-400 shrink-0" />
                  <span className="text-[0.8125rem] text-edu-ink-500">{g.date}</span>
                </div>
                <span className={`text-[0.9rem] font-bold ${passed ? "text-edu-ink" : "text-edu-danger"}`}>
                  {g.grade}<span className="text-edu-ink-400 font-normal text-[0.75rem]">/20</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
