import { Pencil, AlertTriangle, Search } from "lucide-react";
import { type PlanifEstado } from "@shared/services/actions/planificaciones";
import { Pagination } from "@shared/ui/Pagination";
import { STATUS_META } from "../functions/useDocentePlanificacion";

interface Planificacion {
    id: string | number;
    subject: string;
    section: string;
    count: number;
    status: PlanifEstado;
    note?: string;
}

interface PlanificacionesTableProps {
    filteredPlanif: Planificacion[];
    paged: Planificacion[];
    currentPage: number;
    totalPages: number;
    query: string;
    statusFilter: "todos" | PlanifEstado;
    onQueryChange: (value: string) => void;
    onStatusFilterChange: (value: "todos" | PlanifEstado) => void;
    onPageChange: (page: number) => void;
    onEdit: (id: string | number) => void;
}

export function PlanificacionesTable({
    filteredPlanif,
    paged,
    currentPage,
    totalPages,
    query,
    statusFilter,
    onQueryChange,
    onStatusFilterChange,
    onPageChange,
    onEdit,
}: PlanificacionesTableProps) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Planificaciones</h3>
                <span className="text-[0.8rem] text-edu-ink-400 font-medium">{filteredPlanif.length} planificación{filteredPlanif.length === 1 ? "" : "es"}</span>
            </div>
            <div className="px-5 py-3 flex gap-2 items-center flex-wrap border-b border-edu-border-soft">
                <div className="relative flex-1 min-w-[180px]">
                    <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => { onQueryChange(e.target.value); onPageChange(1); }}
                        placeholder="Buscar por materia o sección…"
                        className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => { onStatusFilterChange(e.target.value as "todos" | PlanifEstado); onPageChange(1); }}
                    className="w-full md:w-auto border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
                >
                    <option value="todos">Todos los estados</option>
                    <option value="approved">Aprobadas</option>
                    <option value="review">En revisión</option>
                    <option value="draft">Borradores</option>
                    <option value="changes">Cambios solicitados</option>
                </select>
            </div>
            <div className="overflow-x-auto">
                <div className="min-w-[680px]">
                    <div className="grid grid-cols-[1.4fr_0.8fr_0.9fr_1fr_0.6fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                        {["Materia", "Sección", "Sesiones", "Estado", "Acción"].map((h) => (
                            <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">
                                {h}
                            </span>
                        ))}
                    </div>
                    {filteredPlanif.length === 0 && (
                        <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">No hay planificaciones que coincidan con el filtro.</div>
                    )}
                    {paged.map((planif, i) => {
                        const st = STATUS_META[planif.status];
                        return (
                            <div
                                key={planif.id}
                                className={`px-5 py-[13px] transition-colors hover:bg-edu-subtle ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                            >
                                <div className="grid grid-cols-[1.4fr_0.8fr_0.9fr_1fr_0.6fr] items-center">
                                    <span className="text-sm text-edu-ink font-medium">{planif.subject}</span>
                                    <span className="text-[0.8125rem] text-edu-ink-500">{planif.section}</span>
                                    <span className="text-sm text-edu-ink-700 font-semibold">{planif.count} sesiones</span>
                                    <span
                                        className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit"
                                        style={{ backgroundColor: st.bg, color: st.fg }}
                                    >
                                        {st.label}
                                    </span>
                                    <button
                                        onClick={() => onEdit(planif.id)}
                                        className="inline-flex items-center gap-1 text-[0.8rem] text-edu-primary font-semibold cursor-pointer w-fit bg-transparent border-none p-0"
                                    >
                                        <Pencil style={{ width: "13px", height: "13px" }} />
                                        Modificar
                                    </button>
                                </div>
                                {planif.note && (
                                    <div className={`mt-2 flex items-center gap-1.5 text-xs w-fit rounded-edu-chip px-2.5 py-1.5 ${planif.status === "changes" ? "text-edu-danger bg-edu-danger-bg" : "text-edu-ink-500 bg-edu-primary-50"}`}>
                                        <AlertTriangle className="shrink-0" style={{ width: "12px", height: "12px" }} />
                                        {planif.note}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            {totalPages > 1 && (
                <div className="px-5 py-4 border-t border-edu-border-soft">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
                </div>
            )}
        </div>
    );
}
