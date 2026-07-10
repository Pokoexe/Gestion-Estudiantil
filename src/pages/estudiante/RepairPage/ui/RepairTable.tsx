import { Search, ChevronRight } from "lucide-react";
import { color } from "@themes/tokens";
import { Pagination } from "@shared/ui/Pagination";
import type { RepairSubjectRow, RepairStatus } from "@shared/services/actions/estudiante";
import type { StatusFilter } from "../interfaces";

const STATUS_META: Record<RepairStatus, { label: string; cls: string; dot: string }> = {
    reprobado: { label: "Reprobado", cls: "bg-edu-danger-bg text-edu-danger", dot: color.danger },
    reparando: { label: "En reparación", cls: "bg-edu-primary-50 text-edu-primary", dot: color.primary },
    pendiente: { label: "Pendiente", cls: "bg-edu-warning-bg text-edu-warning", dot: color.warningStrong },
};

export const TABS: { key: "todas" | "pendientes" | "reprobadas" | "reparacion"; label: string; statuses: RepairStatus[] }[] = [
    { key: "todas", label: "Todas", statuses: ["reprobado", "reparando", "pendiente"] },
    { key: "pendientes", label: "Materias pendientes", statuses: ["pendiente"] },
    { key: "reprobadas", label: "Reprobadas", statuses: ["reprobado"] },
    { key: "reparacion", label: "En reparación", statuses: ["reparando"] },
];

const FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
    { value: "todas", label: "Todas" },
    { value: "reprobado", label: "Reprobadas" },
    { value: "pendiente", label: "Pendientes" },
    { value: "reparando", label: "En reparación" },
];

const REPAIR_COLS = "grid-cols-[1.6fr_1.3fr_1fr_1.3fr_0.9fr]";
const REPAIR_HEADERS = ["Materia", "Profesor", "Ev. reprobadas", "Estado", "Promedio"];

interface RepairTableProps {
    tab: "todas" | "pendientes" | "reprobadas" | "reparacion";
    changeTab: (key: "todas" | "pendientes" | "reprobadas" | "reparacion") => void;
    query: string;
    setQuery: (v: string) => void;
    statusFilter: StatusFilter;
    setStatusFilter: (v: StatusFilter) => void;
    rows: RepairSubjectRow[];
    paged: RepairSubjectRow[];
    currentPage: number;
    totalPages: number;
    setPage: (v: number) => void;
    goToSubject: (s: RepairSubjectRow) => void;
}

/** Tabla de reparación: pestañas, buscador, filtro de estado, filas y paginación. */
export function RepairTable({
    tab, changeTab, query, setQuery, statusFilter, setStatusFilter,
    rows, paged, currentPage, totalPages, setPage, goToSubject,
}: RepairTableProps) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            {/* Pestañas */}
            <div className="px-5 pt-3 border-b border-edu-border-soft">
                <div className="flex justify-center md:justify-start gap-1 flex-wrap">
                    {TABS.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => changeTab(t.key)}
                            className={`px-3.5 py-2.5 text-[0.8125rem] font-medium border-b-2 -mb-px transition-colors cursor-pointer bg-transparent ${tab === t.key
                                ? "border-edu-primary text-edu-primary"
                                : "border-transparent text-edu-ink-500 hover:text-edu-ink-700"
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Buscador + Select */}
            <div className="px-5 py-3 flex gap-2 items-center flex-wrap border-b border-edu-border-soft">
                <div className="relative flex-1 min-w-[180px]">
                    <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                        placeholder="Buscar materia…"
                        className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value as StatusFilter); setPage(1); }}
                    className="w-full md:w-auto border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
                >
                    {FILTER_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>
            </div>

            {/* Tabla */}
            <div>
                <div className="overflow-x-auto">
                    <div className="min-w-[680px]">
                        <div className={`grid ${REPAIR_COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                            {REPAIR_HEADERS.map((h) => (
                                <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">
                                    {h}
                                </span>
                            ))}
                        </div>

                        {rows.length === 0 && (
                            <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">
                                No hay materias que coincidan con el filtro.
                            </div>
                        )}

                        {paged.map((s, i) => {
                            const meta = STATUS_META[s.status];
                            const avgClass =
                                s.status === "reprobado"
                                    ? "text-edu-danger"
                                    : s.status === "pendiente"
                                        ? "text-edu-warning"
                                        : "text-edu-ink";
                            return (
                                <div
                                    key={s.id}
                                    onClick={() => goToSubject(s)}
                                    className={`grid ${REPAIR_COLS} px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: meta.dot }} />
                                        <span className="text-[0.875rem] text-edu-ink font-medium">{s.name}</span>
                                    </div>
                                    <span className="text-[0.875rem] text-edu-ink-700">{s.teacher}</span>
                                    <span className="text-[0.875rem] text-edu-ink-700">{s.failedEvals}</span>
                                    <div className="flex flex-col gap-0.5 items-start">
                                        <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${meta.cls}`}>
                                            {meta.label}
                                        </span>
                                        {s.status === "reparando" && (
                                            <span className="text-[0.68rem] text-edu-ink-400">
                                                Etapa {s.stage} de {s.totalStages}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between gap-1">
                                        <span className={`text-[0.875rem] font-semibold ${avgClass}`}>{s.average}</span>
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
        </div>
    );
}
