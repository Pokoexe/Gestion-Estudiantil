import { GraduationCap, UserSquare2, Search } from "lucide-react";
import { Pagination } from "@shared/ui/Pagination";
import type { Incidencia, Gravedad } from "@shared/services/actions/coordinador";

interface IncidenciasTableProps {
    visibles: Incidencia[];
    paged: Incidencia[];
    query: string;
    setQuery: (q: string) => void;
    setPage: (p: number) => void;
    currentPage: number;
    totalPages: number;
    COLS: string;
    HEADERS: string[];
    GRAVEDAD_META: Record<Gravedad, { cls: string }>;
}

export function IncidenciasTable({
    visibles,
    paged,
    query,
    setQuery,
    setPage,
    currentPage,
    totalPages,
    COLS,
    HEADERS,
    GRAVEDAD_META,
}: IncidenciasTableProps) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Registro de incidencias</h3>
                <span className="text-[0.8rem] text-edu-ink-400 font-medium">{visibles.length} incidencia{visibles.length === 1 ? "" : "s"}</span>
            </div>

            {/* Buscador */}
            <div className="px-5 py-3 border-b border-edu-border-soft">
                <div className="relative">
                    <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                        placeholder="Buscar por persona, tipo o descripción…"
                        className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                    />
                </div>
            </div>

            <div>
                <div className="overflow-x-auto">
                    <div className="min-w-[680px]">
                        <div className={`grid ${COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                            {HEADERS.map((h) => (
                                <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
                            ))}
                        </div>
                        {visibles.length === 0 ? (
                            <p className="text-[0.8125rem] text-edu-ink-400 m-0 px-5 py-10 text-center">No hay incidencias que coincidan con la búsqueda.</p>
                        ) : (
                            paged.map((inc, i) => {
                                const st = GRAVEDAD_META[inc.gravedad];
                                return (
                                    <div key={inc.id} className={`grid ${COLS} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
                                        <span className="text-sm text-edu-ink font-semibold pr-3">{inc.persona}</span>
                                        <span className="text-[0.8125rem] text-edu-ink-700 flex items-center gap-1.5">
                                            {inc.tipo === "Docente" ? <UserSquare2 className="text-edu-ink-400" style={{ width: 13, height: 13 }} /> : <GraduationCap className="text-edu-ink-400" style={{ width: 13, height: 13 }} />}
                                            {inc.tipo}
                                        </span>
                                        <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${st.cls}`}>{inc.gravedad}</span>
                                        <span className="text-[0.8125rem] text-edu-ink-500">{inc.fecha}</span>
                                        <span className="text-[0.8125rem] text-edu-ink-500 pr-3">{inc.descripcion}</span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
                {totalPages > 1 && (
                    <div className="px-5 py-4 border-t border-edu-border-soft">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
                    </div>
                )}
            </div>
        </div>
    );
}
