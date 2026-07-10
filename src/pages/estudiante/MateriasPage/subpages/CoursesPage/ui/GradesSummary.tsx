import { color } from "@themes/tokens";

interface GradesSummaryProps {
  gradedCount: number;
  totalAssignments: number;
}

/** Resumen de notas: completadas, promedio ponderado, peso restante y proyección. */
export function GradesSummary({ gradedCount, totalAssignments }: GradesSummaryProps) {
  return (
    <div className="grid grid-cols-2 bg-edu-surface rounded-edu-card border border-edu-border-soft px-[22px] py-4 gap-0">
      {[
        { label: "Completadas", value: `${gradedCount}/${totalAssignments}`, color: color.success },
        { label: "Promedio ponderado", value: "91,5", color: color.primary },
        { label: "Peso restante", value: "65%", color: color.warning },
        { label: "Proyección final", value: "En buen camino", color: color.purple },
      ].map(({ label, value, color: dot }, i, arr) => (
        <div
          key={label}
          className={`flex-1 px-4 py-2.5 flex flex-col gap-1 ${i < arr.length - 1 ? "border-r border-edu-border-soft" : ""}`}
        >
          <div className="text-[0.72rem] text-edu-ink-400 font-medium uppercase tracking-[0.05em]">{label}</div>
          <div className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ backgroundColor: dot }} />
            <span className="text-base font-bold text-edu-ink">{value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
