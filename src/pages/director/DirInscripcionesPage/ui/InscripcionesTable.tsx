import { Search, Receipt, ChevronRight } from "lucide-react";
import { Pagination } from "@shared/ui/Pagination";
import type { Inscripcion, InscripcionEstado, InscripcionTipo } from "@shared/services/actions/inscripciones";

interface TipoMeta {
    label: string;
    cls: string;
}

interface EstadoMeta {
    label: string;
    cls: string;
}

interface InscripcionesTableProps {
    filtered: Inscripcion[];
    paged: Inscripcion[];
    query: string;
    setQuery: (v: string) => void;
    tipoFilter: "todos" | InscripcionTipo;
    setTipoFilter: (v: "todos" | InscripcionTipo) => void;
    estadoFilter: "todos" | InscripcionEstado;
    setEstadoFilter: (v: "todos" | InscripcionEstado) => void;
    setPage: (p: number) => void;
    currentPage: number;
    totalPages: number;
    navigate: (path: string) => void;
    setBaucheItem: (item: Inscripcion | null) => void;
    COLS: string;
    HEADERS: string[];
    TIPO_META: Record<string, TipoMeta>;
    ESTADO_META: Record<string, EstadoMeta>;
}

export function InscripcionesTable({
    filtered,
    paged,
    query,
    setQuery,
    tipoFilter,
    setTipoFilter,
    estadoFilter,
    setEstadoFilter,
    setPage,
    currentPage,
    totalPages,
    navigate,
    setBaucheItem,
    COLS,
    HEADERS,
    TIPO_META,
    ESTADO_META,
}: InscripcionesTableProps) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Estudiantes inscritos</h3>
                <span className="text-[0.8rem] text-edu-ink-400 font-medium">
                    {filtered.length} inscripci{filtered.length === 1 ? "ón" : "ones"}
                </span>
            </div>

            {/* Buscador y filtros */}
            <div className="px-5 py-3 flex gap-2 items-center flex-wrap border-b border-edu-border-soft">
                <div className="relative flex-1 min-w-[180px]">
                    <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                        placeholder="Buscar por estudiante, representante o bauche…"
                        className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                    />
                </div>
                <select
                    value={tipoFilter}
                    onChange={(e) => { setTipoFilter(e.target.value as typeof tipoFilter); setPage(1); }}
                    className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
                >
                    <option value="todos">Todos los tipos</option>
                    <option value="nuevo">Nuevos ingresos</option>
                    <option value="reinscrito">Reinscritos</option>
                </select>
                <select
                    value={estadoFilter}
                    onChange={(e) => { setEstadoFilter(e.target.value as typeof estadoFilter); setPage(1); }}
                    className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
                >
                    <option value="todos">Todos los estados</option>
                    <option value="revision">En revisión</option>
                    <option value="aceptado">Aceptados</option>
                    <option value="rechazado">Rechazados</option>
                </select>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-[680px]">
                    <div className={`grid ${COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                        {HEADERS.map((h) => (
                            <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">No hay inscripciones que coincidan con el filtro.</div>
                    )}

                    {paged.map((item, i) => {
                        const tipo = TIPO_META[item.tipo];
                        const estado = ESTADO_META[item.estado];
                        return (
                            <div
                                key={item.id}
                                onClick={() => navigate(`/director/inscripciones/${item.id}`)}
                                className={`grid ${COLS} px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                            >
                                <div className="min-w-0 pr-3">
                                    <div className="text-sm text-edu-ink font-semibold truncate">{item.estNombre} {item.estApellido}</div>
                                    <div className="text-[0.75rem] text-edu-ink-400">{item.gradoSolicitado}</div>
                                </div>
                                <span className="text-[0.8125rem] text-edu-ink-500 truncate pr-3">{item.repNombre} {item.repApellido}</span>
                                <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${tipo.cls}`}>
                                    {tipo.label}
                                </span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setBaucheItem(item); }}
                                    className="inline-flex items-center gap-1.5 text-[0.8125rem] text-edu-primary font-medium bg-transparent border-none cursor-pointer p-0 w-fit hover:underline"
                                >
                                    <Receipt className="w-3.5 h-3.5 shrink-0" />
                                    {item.bauche}
                                </button>
                                <div className="flex items-center justify-between gap-2">
                                    <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${estado.cls}`}>
                                        {estado.label}
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-edu-ink-300 shrink-0" />
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
