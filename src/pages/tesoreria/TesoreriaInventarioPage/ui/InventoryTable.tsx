import { Search, Pencil, ArrowDownRight } from "lucide-react";
import { Pagination } from "@shared/ui/Pagination";
import type { ItemStatus, InvItem } from "@shared/services/actions/tesoreria";

type Props = {
  query: string;
  setQuery: (v: string) => void;
  catFilter: string;
  setCatFilter: (v: string) => void;
  statusFilter: "todos" | ItemStatus;
  setStatusFilter: (v: "todos" | ItemStatus) => void;
  setPage: (n: number) => void;
  filtered: InvItem[];
  paged: InvItem[];
  currentPage: number;
  totalPages: number;
  categories: string[];
  invStatus: Record<ItemStatus, { label: string; bg: string; fg: string }>;
  onEdit: (it: InvItem) => void;
  onDiscount: (it: InvItem) => void;
  money: (n: number) => string;
  cols: string;
  headers: string[];
};

export function InventoryTable({
  query, setQuery,
  catFilter, setCatFilter,
  statusFilter, setStatusFilter,
  setPage,
  filtered, paged,
  currentPage, totalPages,
  categories, invStatus,
  onEdit, onDiscount,
  money, cols, headers,
}: Props) {
  return (
    <div className="lg:col-span-2 bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Inventario de la institución</h3>
        <span className="text-[0.8rem] text-edu-ink-400 font-medium">
          {filtered.length} artículo{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="px-5 py-3 flex gap-2 items-center flex-wrap border-b border-edu-border-soft">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Buscar artículo o categoría…"
            className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
          />
        </div>
        <select
          value={catFilter}
          onChange={(e) => { setCatFilter(e.target.value); setPage(1); }}
          className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
        >
          <option value="todas">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as "todos" | ItemStatus); setPage(1); }}
          className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
        >
          <option value="todos">Todos los estados</option>
          <option value="ok">Suficiente</option>
          <option value="low">Bajo</option>
          <option value="out">Agotado</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[860px]">
          <div className={`grid ${cols} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
            {headers.map((h) => (
              <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
            ))}
          </div>

          {paged.length === 0 && (
            <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">
              No hay artículos que coincidan con el filtro.
            </div>
          )}

          {paged.map((it, i) => {
            const st = invStatus[it.status];
            return (
              <div
                key={it.id}
                className={`grid ${cols} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
              >
                <span className="text-sm text-edu-ink font-medium">{it.name}</span>
                <span className="text-[0.8125rem] text-edu-ink-700">{it.category}</span>
                <span className="text-sm text-edu-ink-700 font-semibold">{it.qty.toLocaleString("es-ES")}</span>
                <span className="text-[0.8125rem] text-edu-ink-500">$ {money(it.unit)}</span>
                <span className="text-sm text-edu-ink font-bold">$ {money(it.qty * it.unit)}</span>
                <span
                  className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit"
                  style={{ backgroundColor: st.bg, color: st.fg }}
                >
                  {st.label}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onEdit(it)}
                    aria-label="Modificar"
                    title="Modificar"
                    className="w-8 h-8 rounded-edu-chip border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-500 flex items-center justify-center cursor-pointer transition-colors hover:border-edu-primary-200 hover:text-edu-primary"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDiscount(it)}
                    disabled={it.qty <= 0}
                    aria-label="Descontar"
                    title="Descontar"
                    className="w-8 h-8 rounded-edu-chip border-none bg-edu-warning-bg text-edu-warning flex items-center justify-center cursor-pointer transition-colors hover:brightness-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  </button>
                </div>
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
