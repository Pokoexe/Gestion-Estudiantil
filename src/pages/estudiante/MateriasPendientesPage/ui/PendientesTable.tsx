import { Search, ChevronRight, Wrench } from "lucide-react";
import { color } from "@themes/tokens";
import { Pagination } from "@shared/ui/Pagination";
import type { PendingStatus, PendingSubject } from "@shared/services/actions/estudiante";
import type { StatusFilter } from "../interfaces";

const STATUS_META: Record<PendingStatus, { label: string; cls: string; dot: string }> = {
    reparacion: { label: "En reparación", cls: "bg-edu-primary-50 text-edu-primary", dot: color.primary },
    espera: { label: "En espera", cls: "bg-edu-warning-bg text-edu-warning", dot: color.warningStrong },
};

const FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
    { value: "todas", label: "Todos los estados" },
    { value: "reparacion", label: "En reparación" },
    { value: "espera", label: "En espera" },
];

const COLS = "grid-cols-[1.6fr_1.1fr_1fr_1.4fr_0.8fr]";
const HEADERS = ["Materia", "Año escolar", "Promedio", "Estado", ""];

interface PendientesTableProps {
    rows: PendingSubject[];
    paged: PendingSubject[];
    query: string;
    setQuery: (v: string) => void;
    statusFilter: StatusFilter;
    setStatusFilter: (v: StatusFilter) => void;
    currentPage: number;
    totalPages: number;
    setPage: (v: number) => void;
    onRepairClick: () => void;
}

/** Tabla de materias pendientes: buscador, filtro de estado, filas y paginación. */
export function PendientesTable({
    rows, paged, query, setQuery, statusFilter, setStatusFilter,
    currentPage, totalPages, setPage, onRepairClick,
}: PendientesTableProps) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            {/* Encabezado + buscador */}
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">
                    Materias Pendientes
                </h3>
                <span className="text-[0.8rem] text-edu-ink-400 font-medium">
                    {rows.length} {rows.length === 1 ? "materia" : "materias"}
                </span>
            </div>

            <div className="px-5 py-3 flex gap-2 items-center flex-wrap border-b border-edu-border-soft">
                <div className="relative flex-1  min-w-[180px]">
                    <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                        placeholder="Buscar materia o año escolar…"
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

            {/* Cabecera */}
            <div className="overflow-x-auto">
                <div className="min-w-[640px]">
                    <div className={`grid ${COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                        {HEADERS.map((h, i) => (
                            <span key={i} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">
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
                        return (
                            <div
                                key={s.id}
                                onClick={() => s.status === "reparacion" && onRepairClick()}
                                className={`grid ${COLS} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${s.status === "reparacion" ? "cursor-pointer" : ""} ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: meta.dot }} />
                                    <span className="text-[0.875rem] text-edu-ink font-medium">{s.name}</span>
                                </div>
                                <span className="text-[0.875rem] text-edu-ink-700">{s.year}</span>
                                <span className="text-[0.875rem] font-semibold text-edu-danger">{s.average}</span>
                                <div className="flex flex-col gap-0.5 items-start">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold ${meta.cls}`}>
                                        {s.status === "reparacion" && <Wrench className="w-3 h-3" />}
                                        {meta.label}
                                    </span>
                                    {s.status === "reparacion" && s.repairDate && (
                                        <span className="text-[0.68rem] text-edu-ink-400 pl-0.5">
                                            {s.repairDate}
                                        </span>
                                    )}
                                </div>
                                <div className="flex justify-end">
                                    <ChevronRight className="w-4 h-4 text-edu-ink-300 shrink-0" />
                                </div>
                            </div>
                        );
                    })}
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
