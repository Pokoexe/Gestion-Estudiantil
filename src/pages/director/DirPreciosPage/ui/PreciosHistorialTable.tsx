import { Search } from "lucide-react";
import { Pagination } from "@shared/ui/Pagination";
import type { EsquemaPrecio, PrecioEstado } from "@shared/services/actions/precios";
import { PRECIO_ESTADO_META } from "@shared/services/data/precios";

interface PreciosHistorialTableProps {
    filtered: EsquemaPrecio[];
    paged: EsquemaPrecio[];
    query: string;
    setQuery: (v: string) => void;
    estadoFilter: "todos" | PrecioEstado;
    setEstadoFilter: (v: "todos" | PrecioEstado) => void;
    page: number;
    setPage: (v: number) => void;
    totalPages: number;
    currentPage: number;
    COLS: string;
    HEADERS: string[];
}

export function PreciosHistorialTable({
    filtered,
    paged,
    query,
    setQuery,
    estadoFilter,
    setEstadoFilter,
    page,
    setPage,
    totalPages,
    currentPage,
    COLS,
    HEADERS,
}: PreciosHistorialTableProps) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Historial de precios</h3>
                <span className="text-[0.8rem] text-edu-ink-400 font-medium">
                    {filtered.length} cuadro{filtered.length === 1 ? "" : "s"} de precios
                </span>
            </div>

            {/* Buscador y filtro */}
            <div className="px-5 py-3 flex gap-2 items-center flex-wrap border-b border-edu-border-soft">
                <div className="relative flex-1 min-w-[180px]">
                    <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                        placeholder="Buscar por período, monto o responsable…"
                        className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                    />
                </div>
                <select
                    value={estadoFilter}
                    onChange={(e) => { setEstadoFilter(e.target.value as typeof estadoFilter); setPage(1); }}
                    className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
                >
                    <option value="todos">Todos los estados</option>
                    <option value="vigente">Vigente</option>
                    <option value="historico">Históricos</option>
                </select>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-[820px]">
                    <div className={`grid ${COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                        {HEADERS.map((h) => (
                            <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">No hay cuadros de precios que coincidan con el filtro.</div>
                    )}

                    {paged.map((item, i) => {
                        const estado = PRECIO_ESTADO_META[item.estado];
                        return (
                            <div
                                key={item.id}
                                className={`grid ${COLS} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                            >
                                <div className="min-w-0 pr-3">
                                    <div className="text-sm text-edu-ink font-semibold truncate">{item.periodo}</div>
                                    <div className="text-[0.75rem] text-edu-ink-400 truncate">{item.registradoPor}</div>
                                </div>
                                <span className="text-[0.8125rem] text-edu-ink-700 font-semibold">{item.mensualidad}</span>
                                <span className="text-[0.8125rem] text-edu-ink-500">{item.morosidad}</span>
                                <span className="text-[0.8125rem] text-edu-ink-500">Día {item.inicioMorosidad}</span>
                                <span className="text-[0.8125rem] text-edu-ink-500">{item.descHermanos}</span>
                                <span className="text-[0.8125rem] text-edu-ink-500">{item.descDocentes}</span>
                                <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${estado.cls}`}>
                                    {estado.label}
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
