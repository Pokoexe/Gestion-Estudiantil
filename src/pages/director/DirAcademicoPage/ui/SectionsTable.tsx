import React from "react";
import { color } from "@themes/tokens";
import { SectionCard } from "./SectionCard";
import { Th } from "./Th";

export function SectionsTable({
  sections,
  onRowClick,
}: {
  sections: any[];
  onRowClick: () => void;
}) {
  return (
    <SectionCard title="Secciones por año" hint="24 secciones activas">
      <div className="overflow-x-auto">
        <div className="min-w-[680px]">
          <div className="grid grid-cols-[1fr_1fr_0.8fr_0.9fr_1fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
            {["Año", "Secciones", "Estudiantes", "Promedio", "Asistencia"].map((h) => (
              <Th key={h}>{h}</Th>
            ))}
          </div>
          {sections.map((r, i) => (
            <div
              key={r.year}
              onClick={onRowClick}
              className={`grid grid-cols-[1fr_1fr_0.8fr_0.9fr_1fr] px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle cursor-pointer ${i < sections.length - 1 ? "border-b border-edu-border-soft" : ""}`}
            >
              <span className="text-sm text-edu-ink font-semibold">{r.year}</span>
              <span className="text-[0.8125rem] text-edu-ink-500">{r.section}</span>
              <span className="text-sm text-edu-ink-700">{r.students}</span>
              <span className={`text-sm font-semibold ${r.average >= 15 ? "text-edu-ink" : "text-edu-warning"}`}>{r.average.toLocaleString("es-ES")}</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-edu-border-soft rounded-edu-pill overflow-hidden">
                  <div className="h-full rounded-edu-pill" style={{ width: `${r.attendance}%`, backgroundColor: r.attendance >= 90 ? color.success : color.warning }} />
                </div>
                <span className="text-[0.8rem] text-edu-ink-700 font-medium">{r.attendance} %</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
