import React from "react";
import type { AttStat } from "../interfaces";
import { SectionCard } from "./SectionCard";

export function AttendanceSummaryCard({ attStats }: { attStats: AttStat[] }) {
  return (
    <SectionCard title="Resumen de asistencia" hint="Miércoles 1 jul 2026">
      <div className="p-4 flex flex-col gap-3 flex-1">
        {attStats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="flex items-center gap-3.5 bg-edu-subtle rounded-edu-control px-4 py-3 border border-edu-border-soft">
              <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: s.ac.bg }}>
                <Icon style={{ width: "20px", height: "20px", color: s.ac.fg }} />
              </div>
              <div>
                <div className="text-[1.3rem] font-bold text-edu-ink leading-none">{s.value}</div>
                <div className="text-[0.78rem] text-edu-ink-500 mt-1">{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
