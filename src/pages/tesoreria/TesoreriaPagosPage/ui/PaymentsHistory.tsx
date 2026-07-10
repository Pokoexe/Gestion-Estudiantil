import { Search } from "lucide-react";
import { Pagination } from "@shared/ui/Pagination";
import type { Payment, Method, PayStatus } from "@shared/services/actions/tesoreria";

type Props = {
  query: string;
  setQuery: (v: string) => void;
  methodFilter: "todos" | Method;
  setMethodFilter: (v: "todos" | Method) => void;
  statusFilter: "todos" | PayStatus;
  setStatusFilter: (v: "todos" | PayStatus) => void;
  setPage: (n: number) => void;
  filtered: Payment[];
  pageItems: Payment[];
  safePage: number;
  totalPages: number;
  statusMeta: Record<PayStatus, { label: string; cls: string }>;
  cols: string;
  headers: string[];
  money: (n: number) => string;
};

export function PaymentsHistory({
  query, setQuery,
  methodFilter, setMethodFilter,
  statusFilter, setStatusFilter,
  setPage,
  filtered, pageItems,
  safePage, totalPages,
  statusMeta, cols, headers, money,
}: Props) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Historial de pagos</h3>
        <span className="text-[0.8rem] text-edu-ink-400 font-medium">
          {filtered.length} pago{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="px-5 py-3 flex gap-2 items-center flex-wrap border-b border-edu-border-soft">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Buscar representante o concepto…"
            className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
          />
        </div>
        <select
          value={methodFilter}
          onChange={(e) => { setMethodFilter(e.target.value as "todos" | Method); setPage(1); }}
          className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
        >
          <option value="todos">Todos los métodos</option>
          <option value="Efectivo">Efectivo</option>
          <option value="Transferencia">Transferencia</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as "todos" | PayStatus); setPage(1); }}
          className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
        >
          <option value="todos">Todos los estados</option>
          <option value="confirmed">Confirmado</option>
          <option value="review">En revisión</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[860px]">
          <div className={`grid ${cols} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
            {headers.map((h) => (
              <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
            ))}
          </div>
          {pageItems.length === 0 && (
            <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">
              No hay pagos que coincidan con el filtro.
            </div>
          )}
          {pageItems.map((p, i) => {
            const st = statusMeta[p.status];
            return (
              <div
                key={p.id}
                className={`grid ${cols} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < pageItems.length - 1 ? "border-b border-edu-border-soft" : ""}`}
              >
                <span className="text-sm text-edu-ink font-medium">{p.rep}</span>
                <span className="text-[0.8125rem] text-edu-ink-700">{p.student}</span>
                <span className="text-sm text-edu-ink font-bold">{money(p.amount)}</span>
                <span className="text-[0.8125rem] text-edu-ink-700">{p.currency}</span>
                <span className="text-[0.8125rem] text-edu-ink-500">{p.date}</span>
                <span className="text-[0.8125rem] text-edu-ink-700">{p.method}</span>
                <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${st.cls}`}>
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      {totalPages > 1 && (
        <div className="px-5 py-4 border-t border-edu-border-soft">
          <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
