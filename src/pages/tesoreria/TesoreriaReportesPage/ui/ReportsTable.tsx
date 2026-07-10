import { Search, FileText, Pencil } from "lucide-react";
import { Pagination } from "@shared/ui/Pagination";
import type { Report, ReportType, ReportStatus } from "@shared/services/actions/tesoreria";

type Props = {
  query: string;
  setQuery: (v: string) => void;
  typeFilter: "todos" | ReportType;
  setTypeFilter: (v: "todos" | ReportType) => void;
  statusFilter: "todos" | ReportStatus;
  setStatusFilter: (v: "todos" | ReportStatus) => void;
  setPage: (n: number) => void;
  filtered: Report[];
  paged: Report[];
  currentPage: number;
  totalPages: number;
  reportTypes: ReportType[];
  reportStatus: Record<ReportStatus, { label: string; bg: string; fg: string }>;
  onEdit: (r: Report) => void;
  cols: string;
  headers: string[];
};

export function ReportsTable({
  query, setQuery,
  typeFilter, setTypeFilter,
  statusFilter, setStatusFilter,
  setPage,
  filtered, paged,
  currentPage, totalPages,
  reportTypes, reportStatus,
  onEdit, cols, headers,
}: Props) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Reportes ante eventualidades</h3>
        <span className="text-[0.8rem] text-edu-ink-400 font-medium">
          {filtered.length} reporte{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="px-5 py-3 flex gap-2 items-center flex-wrap border-b border-edu-border-soft">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Buscar reporte, tipo o autor…"
            className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value as "todos" | ReportType); setPage(1); }}
          className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
        >
          <option value="todos">Todos los tipos</option>
          {reportTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as "todos" | ReportStatus); setPage(1); }}
          className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
        >
          <option value="todos">Todos los estados</option>
          <option value="abierto">Abierto</option>
          <option value="en_proceso">En proceso</option>
          <option value="cerrado">Cerrado</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[680px]">
          <div className={`grid ${cols} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
            {headers.map((h) => (
              <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
            ))}
          </div>

          {paged.length === 0 && (
            <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">
              No hay reportes que coincidan con el filtro.
            </div>
          )}

          {paged.map((r, i) => {
            const st = reportStatus[r.status];
            return (
              <div
                key={r.id}
                onClick={() => onEdit(r)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onEdit(r)}
                className={`grid ${cols} px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle focus:outline-none focus-visible:bg-edu-subtle ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
              >
                <span className="text-sm text-edu-ink font-medium flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-edu-ink-400 shrink-0" />
                  <span className="truncate">{r.title}</span>
                </span>
                <span className="text-[0.8125rem] text-edu-ink-700">{r.type}</span>
                <span className="text-[0.8125rem] text-edu-ink-500">{r.date}</span>
                <span className="text-[0.8125rem] text-edu-ink-700">{r.author}</span>
                <span className="flex items-center justify-between gap-2">
                  <span
                    className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit"
                    style={{ backgroundColor: st.bg, color: st.fg }}
                  >
                    {st.label}
                  </span>
                  <Pencil className="w-3.5 h-3.5 text-edu-ink-300 shrink-0" />
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="px-5 py-4 border-t border-edu-border-soft">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
