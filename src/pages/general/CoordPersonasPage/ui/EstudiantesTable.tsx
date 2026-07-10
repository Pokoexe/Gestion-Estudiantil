import { Eye, Pencil, Search } from "lucide-react";
import { accent } from "@themes/tokens";
import { Pagination } from "@shared/ui/Pagination";
import type { Estudiante } from "@shared/services/actions/coordinador";

interface EstudiantesTableProps {
    filteredEst: Estudiante[];
    paged: Estudiante[];
    query: string;
    setQuery: (v: string) => void;
    añoFilter: string;
    setAñoFilter: (v: string) => void;
    seccionFilter: string;
    setSeccionFilter: (v: string) => void;
    añosDisponibles: string[];
    seccionesDisponibles: string[];
    setPage: (p: number) => void;
    currentPage: number;
    totalPages: number;
    EST_COLS: string;
    EST_HEADERS: string[];
    onVer: (s: Estudiante) => void;
    onModificar: (s: Estudiante) => void;
}

export function EstudiantesTable({
    filteredEst,
    paged,
    query,
    setQuery,
    añoFilter,
    setAñoFilter,
    seccionFilter,
    setSeccionFilter,
    añosDisponibles,
    seccionesDisponibles,
    setPage,
    currentPage,
    totalPages,
    EST_COLS,
    EST_HEADERS,
    onVer,
    onModificar,
}: EstudiantesTableProps) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Estudiantes inscritos</h3>
                <span className="text-[0.8rem] text-edu-ink-400 font-medium">{filteredEst.length} estudiante{filteredEst.length === 1 ? "" : "s"}</span>
            </div>

            {/* Buscador y filtros */}
            <div className="px-5 py-3 flex gap-2 items-center flex-wrap border-b border-edu-border-soft">
                <div className="relative flex-1 min-w-[180px]">
                    <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                        placeholder="Buscar nombre, cédula o representante…"
                        className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                    />
                </div>
                <select
                    value={añoFilter}
                    onChange={(e) => { setAñoFilter(e.target.value); setPage(1); }}
                    className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
                >
                    <option value="todos">Todos los años</option>
                    {añosDisponibles.map((a) => (
                        <option key={a} value={a}>{a}</option>
                    ))}
                </select>
                <select
                    value={seccionFilter}
                    onChange={(e) => { setSeccionFilter(e.target.value); setPage(1); }}
                    className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
                >
                    <option value="todos">Todas las secciones</option>
                    {seccionesDisponibles.map((s) => (
                        <option key={s} value={s}>Sección {s}</option>
                    ))}
                </select>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-[680px]">
                    <div className={`grid ${EST_COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                        {EST_HEADERS.map((h) => (
                            <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
                        ))}
                    </div>

                    {filteredEst.length === 0 && (
                        <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">No hay estudiantes que coincidan con el filtro.</div>
                    )}

                    {paged.map((s, i) => (
                        <div key={s.id} className={`grid ${EST_COLS} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
                            <span className="text-sm text-edu-ink font-semibold pr-3">{s.nombre}</span>
                            <span className="text-[0.8125rem] text-edu-ink-500">{s.cedula}</span>
                            <span className="text-[0.8125rem] text-edu-ink-700">{s.grado}</span>
                            <span className="text-[0.8125rem] text-edu-ink-500 pr-3">{s.representante}</span>
                            <div className="flex gap-3">
                                <button onClick={() => onVer(s)} className="inline-flex items-center gap-1 text-[0.75rem] font-semibold text-edu-ink-500 cursor-pointer bg-transparent border-none p-0 hover:text-edu-ink-700">
                                    <Eye style={{ width: 14, height: 14 }} /> Ver
                                </button>
                                <button onClick={() => onModificar(s)} className="inline-flex items-center gap-1 text-[0.75rem] font-semibold cursor-pointer bg-transparent border-none p-0 hover:underline" style={{ color: accent.purple.fg }}>
                                    <Pencil style={{ width: 14, height: 14 }} /> Modificar
                                </button>
                            </div>
                        </div>
                    ))}
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
