import { Search } from "lucide-react";
import { Pagination } from "@shared/ui/Pagination";
import { LapsoFilter } from "@shared/ui/LapsoFilter";
import { TYPE_META, TABS, COLS, HEADERS } from "../functions/useDocenteRevisiones";
import type { Revision, RevType, RevEstado } from "../interfaces";

interface RevisionesCardProps {
    tab: "todos" | RevType;
    setTab: (t: "todos" | RevType) => void;
    query: string;
    setQuery: (q: string) => void;
    estadoFilter: "todos" | RevEstado;
    setEstadoFilter: (e: "todos" | RevEstado) => void;
    setPage: (p: number) => void;
    filtered: Revision[];
    paged: Revision[];
    totalPages: number;
    currentPage: number;
    openItem: (r: Revision) => void;
}

export function RevisionesCard({
    tab,
    setTab,
    query,
    setQuery,
    estadoFilter,
    setEstadoFilter,
    setPage,
    filtered,
    paged,
    totalPages,
    currentPage,
    openItem,
}: RevisionesCardProps) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Revisiones</h3>
                <span className="text-[0.8rem] text-edu-ink-400 font-medium">{filtered.length} plan{filtered.length === 1 ? "" : "es"}</span>
            </div>

            {/* Tabs */}
            <div className="px-5 pt-3 border-b border-edu-border-soft flex gap-1 justify-center md:justify-start flex-wrap">
                {TABS.map((t) => {
                    const active = tab === t.key;
                    return (
                        <button
                            key={t.key}
                            type="button"
                            onClick={() => { setTab(t.key); setPage(1); }}
                            className={`px-3.5 py-2.5 text-[0.8125rem] font-medium border-b-2 -mb-px transition-colors cursor-pointer bg-transparent ${active ? "border-edu-primary text-edu-primary" : "border-transparent text-edu-ink-500 hover:text-edu-ink-700"}`}
                        >
                            {t.label}
                        </button>
                    );
                })}
            </div>

            {/* Buscador + filtro estado */}
            <div className="grid md:grid-cols-4 px-5 py-3 gap-2 items-center border-b border-edu-border-soft">
                <div className="md:col-span-3 relative flex-1 min-w-[180px]">
                    <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                        placeholder="Buscar por título, materia o sección…"
                        className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                    />
                </div>
                <select
                    value={estadoFilter}
                    onChange={(e) => { setEstadoFilter(e.target.value as "todos" | RevEstado); setPage(1); }}
                    className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
                >
                    <option value="todos">Todos los estados</option>
                    <option value="Por revisar">Por revisar</option>
                    <option value="Cambios enviados">Cambios enviados</option>
                </select>

                <div className="md:col-span-4 flex justify-end">
                    <LapsoFilter />
                </div>
            </div>

            {/* Cabecera de tabla */}
            <div className="overflow-x-auto">
                <div className="min-w-[760px]">
                    <div className={`grid ${COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                        {HEADERS.map((h) => (
                            <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
                        ))}
                    </div>

                    {/* Filas */}
                    {filtered.length === 0 ? (
                        <div className="px-5 py-10 text-center text-sm text-edu-ink-400">No hay revisiones que coincidan con el filtro.</div>
                    ) : (
                        paged.map((r, i) => {
                            const m = TYPE_META[r.type];
                            const Icon = m.icon;
                            const redirige = r.type === "planificacion" || r.type === "plan";
                            return (
                                <div
                                    key={r.id}
                                    onClick={() => openItem(r)}
                                    className={`grid ${COLS} px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                                >
                                    <span
                                        className="inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit"
                                        style={{ backgroundColor: m.bg, color: m.fg }}
                                    >
                                        <Icon style={{ width: "12px", height: "12px" }} />
                                        {m.badge}
                                    </span>
                                    <div className="min-w-0 pr-2">
                                        <div className="text-sm text-edu-ink font-medium truncate">{r.title}</div>
                                        <div className="text-[0.72rem] text-edu-ink-400 truncate">{r.materia}</div>
                                    </div>
                                    <span className="text-[0.8125rem] text-edu-ink-500">{r.seccion}</span>
                                    <span className="text-[0.8125rem] text-edu-ink-500">{r.fecha}</span>
                                    <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${r.estado === "Cambios enviados" ? "bg-edu-success-bg text-edu-success" : "bg-edu-warning-bg text-edu-warning"}`}>
                                        {r.estado}
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-[0.8rem] text-edu-primary font-semibold">
                                        {redirige ? "Modificar" : "Subir cambio"}
                                    </span>
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
