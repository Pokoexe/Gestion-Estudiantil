import { History, Search } from "lucide-react";
import { Pagination } from "@shared/ui/Pagination";
import { COLS, HEADERS } from "../functions/useDocenteConcejo";

/* ------------------------------------------------------------------ */
/* Props                                                               */
/* ------------------------------------------------------------------ */

interface HistorialCardProps {
    query: string;
    setQuery: (v: string) => void;
    setPage: (v: number) => void;
    filtrado: { id: string | number }[];
    historial: { id: string | number }[];
    paged: {
        id: string | number;
        estudiante: string;
        materia: string;
        anio: string | number;
        nota: string | number;
    }[];
    totalPages: number;
    currentPage: number;
}

/* ------------------------------------------------------------------ */
/* Componente                                                          */
/* ------------------------------------------------------------------ */

export function HistorialCard({
    query,
    setQuery,
    setPage,
    filtrado,
    historial,
    paged,
    totalPages,
    currentPage,
}: HistorialCardProps) {
    return (
        /* Historial de estudiantes postulados (buscador + paginación, sin revelar la decisión) */
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-edu-border-soft flex items-center gap-2">
                <History className="w-4 h-4 text-edu-ink-400" />
                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Historial de estudiantes postulados</h3>
                <span className="ml-auto text-[0.8rem] text-edu-ink-400 font-medium">
                    {filtrado.length} registro{filtrado.length === 1 ? "" : "s"}
                </span>
            </div>

            {/* Buscador */}
            <div className="px-5 py-3 border-b border-edu-border-soft">
                <div className="relative">
                    <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                        placeholder="Buscar por estudiante, materia o año…"
                        className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                    />
                </div>
            </div>

            {/* Cabecera de tabla */}
            <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                    <div className={`grid ${COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                        {HEADERS.map((h) => (
                            <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
                        ))}
                    </div>

                    {paged.length === 0 ? (
                        <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">
                            {historial.length === 0
                                ? "Aún no hay estudiantes discutidos por el Concejo."
                                : "No hay registros que coincidan con la búsqueda."}
                        </div>
                    ) : (
                        paged.map((p, i) => (
                            <div
                                key={p.id}
                                className={`grid ${COLS} px-5 py-[13px] items-center ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                            >
                                <span className="text-sm text-edu-ink font-medium">{p.estudiante}</span>
                                <span className="text-[0.8125rem] text-edu-ink-500">{p.materia}</span>
                                <span className="text-[0.8125rem] text-edu-ink-500">{p.anio}</span>
                                <span className="text-sm text-edu-ink-700 font-semibold">{p.nota}</span>
                            </div>
                        ))
                    )}
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
