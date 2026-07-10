import { Search, Phone, Bell, Check } from "lucide-react";
import { color } from "@themes/tokens";
import { Pagination } from "@shared/ui/Pagination";
import type { Representative } from "@shared/services/actions/tesoreria";

type Props = {
  query: string;
  setQuery: (v: string) => void;
  statusFilter: "todos" | "solvente" | "mora";
  setStatusFilter: (v: "todos" | "solvente" | "mora") => void;
  setPage: (n: number) => void;
  filtered: Representative[];
  paged: Representative[];
  currentPage: number;
  totalPages: number;
  notified: Record<number, boolean>;
  onSelect: (r: Representative) => void;
  onNotify: (r: Representative) => void;
  money: (n: number) => string;
  monthsBadge: (m: number) => { bg: string; fg: string };
  cols: string;
  headers: string[];
};

export function RepresentativesTable({
  query, setQuery,
  statusFilter, setStatusFilter,
  setPage,
  filtered, paged,
  currentPage, totalPages,
  notified, onSelect, onNotify,
  money, monthsBadge,
  cols, headers,
}: Props) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Solvencia de representantes</h3>
        <span className="text-[0.8rem] text-edu-ink-400 font-medium">
          {filtered.length} representante{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="px-5 py-3 flex gap-2 items-center flex-wrap border-b border-edu-border-soft">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Buscar representante o estudiante…"
            className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as "todos" | "solvente" | "mora"); setPage(1); }}
          className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
        >
          <option value="todos">Todos</option>
          <option value="solvente">Solventes</option>
          <option value="mora">En mora</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[760px]">
          <div className={`grid ${cols} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
            {headers.map((h) => (
              <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
            ))}
          </div>

          {paged.length === 0 && (
            <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">
              No hay representantes que coincidan con el filtro.
            </div>
          )}

          {paged.map((r, i) => {
            const solvent = r.months === 0;
            const badge = monthsBadge(r.months);
            const isNotified = notified[r.id];
            return (
              <div
                key={r.id}
                onClick={() => onSelect(r)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(r)}
                className={`grid ${cols} px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle focus:outline-none focus-visible:bg-edu-subtle ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-[34px] h-[34px] rounded-full bg-edu-subtle border border-edu-border flex items-center justify-center text-xs font-bold text-edu-ink-500 shrink-0">
                    {r.rep.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <span className="text-sm text-edu-ink font-medium">{r.rep}</span>
                </div>
                <span className="text-[0.8125rem] text-edu-ink-700">{r.students}</span>
                {solvent ? (
                  <span className="inline-flex items-center justify-center px-3 py-[3px] rounded-edu-pill text-[0.72rem] font-semibold w-fit bg-edu-success-bg text-edu-success">Al día</span>
                ) : (
                  <span className="inline-flex items-center justify-center px-3 py-[3px] rounded-edu-pill text-[0.72rem] font-semibold w-fit" style={{ backgroundColor: badge.bg, color: badge.fg }}>
                    {r.months} {r.months === 1 ? "mes" : "meses"}
                  </span>
                )}
                {solvent ? (
                  <span className="text-[0.8125rem] text-edu-ink-400">—</span>
                ) : (
                  <span className="text-sm text-edu-danger font-bold">{money(r.amount)} {r.currency}</span>
                )}
                <span className="text-[0.8125rem] text-edu-ink-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-edu-ink-400 shrink-0" />
                  {r.phone}
                </span>
                {solvent ? (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-edu-chip text-[0.775rem] font-semibold w-fit bg-edu-success-bg text-edu-success">
                    <Check style={{ width: "13px", height: "13px" }} />
                    Solvente
                  </span>
                ) : isNotified ? (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-edu-chip text-[0.775rem] font-semibold w-fit bg-edu-success-bg text-edu-success">
                    <Check style={{ width: "13px", height: "13px" }} />
                    Notificado
                  </span>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); onNotify(r); }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-edu-chip border-none text-white text-[0.775rem] font-semibold cursor-pointer w-fit transition-colors hover:brightness-95"
                    style={{ backgroundColor: color.whatsapp }}
                  >
                    <Bell style={{ width: "13px", height: "13px" }} />
                    Enviar notificación
                  </button>
                )}
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
