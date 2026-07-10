import { Search, ChevronRight } from "lucide-react";
import { Pagination } from "@shared/ui/Pagination";
import { COLS, HEADERS, studentStatus } from "../functions/useEvalReparaciones";
import type { StudentRow } from "@shared/services/actions/evaluador-discusion";

interface Props {
  rows: StudentRow[];
  paged: StudentRow[];
  totalPages: number;
  currentPage: number;
  query: string;
  onQuery: (q: string) => void;
  onPage: (p: number) => void;
  onSelect: (s: StudentRow) => void;
}

export function EstudiantesTable({ rows, paged, totalPages, currentPage, query, onQuery, onPage, onSelect }: Props) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Estudiantes en riesgo</h3>
        <span className="text-[0.8rem] text-edu-ink-400 font-medium">{rows.length} estudiantes</span>
      </div>
      <div className="px-5 py-3 border-b border-edu-border-soft">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Buscar estudiante o cédula…"
            className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-teal-600"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[760px]">
          <div className={`grid ${COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
            {HEADERS.map((h) => (
              <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
            ))}
          </div>
          {rows.length === 0 && (
            <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">
              No hay estudiantes que coincidan con la búsqueda.
            </div>
          )}
          {paged.map((s, i) => {
            const repCount = s.materias.filter((m) => m.status === "reprobada").length;
            const penCount = s.materias.filter((m) => m.status === "pendiente").length;
            const st = studentStatus(s);
            return (
              <div
                key={s.id}
                onClick={() => onSelect(s)}
                className={`grid ${COLS} px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
              >
                <div>
                  <div className="text-[0.875rem] text-edu-ink font-medium">{s.name}</div>
                  <div className="text-[0.75rem] text-edu-ink-400 mt-0.5">{s.cedula}</div>
                </div>
                <span className="text-[0.875rem] text-edu-ink-700">{s.anio} {s.seccion}</span>
                <span className={`text-[0.875rem] font-semibold ${repCount > 0 ? "text-edu-danger" : "text-edu-ink-400"}`}>{repCount}</span>
                <span className={`text-[0.875rem] font-semibold ${penCount > 0 ? "text-edu-warning" : "text-edu-ink-400"}`}>{penCount}</span>
                <span className={`inline-flex items-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${st.cls}`}>{st.label}</span>
                <div className="flex justify-end">
                  <ChevronRight className="w-4 h-4 text-edu-ink-300" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {totalPages > 1 && (
        <div className="px-5 py-4 border-t border-edu-border-soft">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPage} />
        </div>
      )}
    </div>
  );
}
