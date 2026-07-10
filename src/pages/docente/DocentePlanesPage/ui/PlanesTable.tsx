import { Search, Pencil, AlertTriangle } from "lucide-react";
import { type Plan, type PlanEstado } from "@shared/services/actions/plans";
import { Pagination } from "@shared/ui/Pagination";
import { LapsoFilter } from "@shared/ui/LapsoFilter";
import type { NavigateFunction } from "react-router";

interface PlanesTableProps {
    filteredPlans: Plan[];
    paged: Plan[];
    query: string;
    setQuery: (v: string) => void;
    statusFilter: "todos" | PlanEstado;
    setStatusFilter: (v: "todos" | PlanEstado) => void;
    currentPage: number;
    totalPages: number;
    setPage: (p: number) => void;
    onSelect: (plan: Plan) => void;
    navigate: NavigateFunction;
    STATUS_META: Record<PlanEstado, { label: string; bg: string; fg: string }>;
}

export function PlanesTable({
    filteredPlans,
    paged,
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    currentPage,
    totalPages,
    setPage,
    onSelect,
    navigate,
    STATUS_META,
}: PlanesTableProps) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Planes de evaluación</h3>
                <span className="text-[0.8rem] text-edu-ink-400 font-medium">{filteredPlans.length} plan{filteredPlans.length === 1 ? "" : "es"}</span>
            </div>
            <div className="px-5 py-3 grid md:grid-cols-3 gap-2 items-center flex-wrap border-b border-edu-border-soft">
                <div className="md:col-span-2 relative flex-1 min-w-[180px]">
                    <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                        placeholder="Buscar por materia o sección…"
                        className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value as "todos" | PlanEstado); setPage(1); }}
                    className="w-full md:w-auto border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
                >
                    <option value="todos">Todos los estados</option>
                    <option value="approved">Aprobados</option>
                    <option value="review">En revisión</option>
                    <option value="draft">Borradores</option>
                    <option value="changes">Cambios solicitados</option>
                </select>

                <div className="md:col-span-3 flex justify-end">
                    <LapsoFilter />
                </div>

            </div>
            <div className="overflow-x-auto">
                <div className="min-w-[680px]">
                    <div className="grid grid-cols-[1.4fr_0.8fr_0.9fr_1fr_0.6fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                        {["Materia", "Sección", "Evaluaciones", "Estado", "Acción"].map((h) => (
                            <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">
                                {h}
                            </span>
                        ))}
                    </div>
                    {filteredPlans.length === 0 && (
                        <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">No hay planes que coincidan con el filtro.</div>
                    )}
                    {paged.map((plan, i) => {
                        const st = STATUS_META[plan.status];
                        return (
                            <div
                                key={plan.id}
                                onClick={() => onSelect(plan)}
                                className={`px-5 py-[13px] transition-colors hover:bg-edu-subtle cursor-pointer ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                            >
                                <div className="grid grid-cols-[1.4fr_0.8fr_0.9fr_1fr_0.6fr] items-center">
                                    <span className="text-sm text-edu-ink font-medium">{plan.subject}</span>
                                    <span className="text-[0.8125rem] text-edu-ink-500">{plan.section}</span>
                                    <span className="text-sm text-edu-ink-700 font-semibold">{plan.count} evaluaciones</span>
                                    <span
                                        className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit"
                                        style={{ backgroundColor: st.bg, color: st.fg }}
                                    >
                                        {st.label}
                                    </span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); navigate(`/docente/planes/${plan.id}/editar`); }}
                                        className="inline-flex items-center gap-1 text-[0.8rem] text-edu-primary font-semibold cursor-pointer w-fit bg-transparent border-none p-0"
                                    >
                                        <Pencil style={{ width: "13px", height: "13px" }} />
                                        Modificar
                                    </button>
                                </div>
                                {plan.note && (
                                    <div className={`mt-2 flex items-center gap-1.5 text-xs w-fit rounded-edu-chip px-2.5 py-1.5 ${plan.status === "changes" ? "text-edu-danger bg-edu-danger-bg" : "text-edu-ink-500 bg-edu-primary-50"}`}>
                                        <AlertTriangle className="shrink-0" style={{ width: "12px", height: "12px" }} />
                                        {plan.note}
                                    </div>
                                )}
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
