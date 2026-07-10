import { Search, UserPlus } from "lucide-react";
import { Pagination } from "@shared/ui/Pagination";
import { type Actividad } from "@shared/services/actions/docente-eval";
import { TIPO_META, TABLE_COLS, TABLE_HEADERS, fmtFecha } from "../functions/useDocentePostulaciones";

interface ActividadesTableProps {
    filtered: Actividad[];
    paged: Actividad[];
    currentPage: number;
    totalPages: number;
    query: string;
    setQuery: (v: string) => void;
    setPage: (v: number) => void;
    openDetalle: (id: number) => void;
    abrirPostular: (act: Actividad) => void;
}

export function ActividadesTable({
    filtered,
    paged,
    currentPage,
    totalPages,
    query,
    setQuery,
    setPage,
    openDetalle,
    abrirPostular,
}: ActividadesTableProps) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-edu-border-soft flex items-center justify-between gap-3">
                <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Actividades asignadas</h3>
                <span className="text-[0.8rem] text-edu-ink-400 font-medium">
                    {filtered.length} actividad{filtered.length === 1 ? "" : "es"}
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
                        placeholder="Buscar por nombre, tipo o lugar…"
                        className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                    />
                </div>
            </div>

            {/* Cabecera de columnas */}
            <div className="overflow-x-auto">
                <div className="min-w-[760px]">
                    <div className={`grid ${TABLE_COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                        {TABLE_HEADERS.map((h) => (
                            <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
                        ))}
                    </div>

                    {/* Filas */}
                    {filtered.length === 0 ? (
                        <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">
                            No hay actividades que coincidan con la búsqueda.
                        </div>
                    ) : (
                        paged.map((act, i) => {
                            const meta = TIPO_META[act.tipo];
                            const Icon = meta.icon;
                            const aprobados = act.postulados.filter((p) => p.estado === "Aprobado").length;
                            return (
                                <div
                                    key={act.id}
                                    onClick={() => openDetalle(act.id)}
                                    className={`grid ${TABLE_COLS} px-5 py-[13px] items-center cursor-pointer hover:bg-edu-subtle transition-colors ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                                >
                                    {/* Título */}
                                    <div className="flex items-center gap-2.5 min-w-0 pr-3">
                                        <div className="w-7 h-7 rounded-edu-chip flex items-center justify-center shrink-0" style={{ backgroundColor: meta.ac.bg }}>
                                            <Icon style={{ width: 14, height: 14, color: meta.ac.fg }} />
                                        </div>
                                        <span className="text-sm text-edu-ink font-semibold truncate">{act.nombre}</span>
                                    </div>
                                    {/* Tipo */}
                                    <span className="inline-flex items-center px-2 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit" style={{ backgroundColor: meta.ac.bg, color: meta.ac.fg }}>
                                        {act.tipo}
                                    </span>
                                    {/* Fecha */}
                                    <span className="text-[0.8125rem] text-edu-ink-500">{fmtFecha(act.fecha)}</span>
                                    {/* Lugar */}
                                    <span className="text-[0.8125rem] text-edu-ink-500 truncate pr-2">{act.lugar}</span>
                                    {/* Cupos */}
                                    <span className={`text-[0.8125rem] font-semibold ${aprobados >= act.cupo ? "text-edu-danger" : "text-edu-ink"}`}>
                                        {aprobados}/{act.cupo}
                                    </span>
                                    {/* Postular */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); abrirPostular(act); }}
                                        disabled={aprobados >= act.cupo}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-edu-control text-[0.8rem] font-semibold text-white border-none cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                                        style={{ backgroundColor: meta.ac.fg }}
                                    >
                                        <UserPlus style={{ width: 13, height: 13 }} />
                                        Postular
                                    </button>
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
    );
}
