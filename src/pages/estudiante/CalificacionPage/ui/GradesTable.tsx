import { Search } from "lucide-react";
import { Pagination } from "@shared/ui/Pagination";
import { LapsoFilter } from "@shared/ui/LapsoFilter";
import type { Grade } from "@shared/services/actions/estudiante";
import type { StatusFilter } from "../interfaces";
import { PASS_MARK } from "../functions/useCalificaciones";
import { TYPE_META } from "./typeMeta";

const GRADE_COLS = "grid-cols-[1.2fr_1.7fr_1fr_0.7fr_1fr]";
const GRADE_HEADERS = ["Materia", "Evaluación", "Fecha", "Nota", "Estado"];

interface GradesTableProps {
    filtered: Grade[];
    paged: Grade[];
    query: string;
    setQuery: (v: string) => void;
    subjectFilter: string;
    setSubjectFilter: (v: string) => void;
    subjects: string[];
    statusFilter: StatusFilter;
    setStatusFilter: (v: StatusFilter) => void;
    currentPage: number;
    totalPages: number;
    setPage: (v: number) => void;
    onSelect: (g: Grade) => void;
}

/** Tabla de evaluaciones: buscador, filtros de materia/estado/lapso, filas y paginación. */
export function GradesTable({
    filtered, paged, query, setQuery, subjectFilter, setSubjectFilter, subjects,
    statusFilter, setStatusFilter, currentPage, totalPages, setPage, onSelect,
}: GradesTableProps) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Evaluaciones realizadas</h3>
                <span className="text-[0.8rem] text-edu-ink-400 font-medium">{filtered.length} evaluaciones</span>
            </div>

            {/* Buscador y filtros */}
            <div className="grid md:grid-cols-4 px-5 py-3 gap-2 items-center border-b border-edu-border-soft">
                <div className="md:col-span-2 relative flex-1 min-w-[180px]">
                    <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                        placeholder="Buscar evaluación o materia…"
                        className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                    />
                </div>
                <select
                    value={subjectFilter}
                    onChange={(e) => { setSubjectFilter(e.target.value); setPage(1); }}
                    className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
                >
                    <option value="todas">Todas las materias</option>
                    {subjects.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value as StatusFilter); setPage(1); }}
                    className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
                >
                    <option value="todos">Todos los estados</option>
                    <option value="aprobada">Aprobadas</option>
                    <option value="reprobada">Reprobadas</option>
                </select>

                <div className="md:col-span-4 flex justify-end">
                    <LapsoFilter />
                </div>

            </div>

            <div className="overflow-x-auto">
                <div className="min-w-[640px]">
                    <div className={`grid ${GRADE_COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                        {GRADE_HEADERS.map((h) => (
                            <span
                                key={h}
                                className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]"
                            >
                                {h}
                            </span>
                        ))}
                    </div>
                    {paged.length === 0 && (
                        <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">
                            No hay evaluaciones que coincidan con el filtro.
                        </div>
                    )}
                    {paged.map((g, i) => {
                        const t = TYPE_META[g.type];
                        const passed = g.grade >= PASS_MARK;
                        return (
                            <div
                                key={g.id}
                                onClick={() => onSelect(g)}
                                className={`grid ${GRADE_COLS} px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                            >
                                <span className="text-[0.875rem] text-edu-ink font-medium truncate pr-2">{g.subject}</span>
                                <div className="min-w-0 pr-2">
                                    <div className="text-[0.875rem] text-edu-ink-700 truncate">{g.title}</div>
                                    <span
                                        className="inline-flex mt-0.5 text-[0.62rem] font-semibold px-1.5 py-px rounded-edu-pill"
                                        style={{ backgroundColor: t.bg, color: t.color }}
                                    >
                                        {t.label}
                                    </span>
                                </div>
                                <span className="text-[0.8125rem] text-edu-ink-500">{g.date}</span>
                                <span className={`text-[0.9rem] font-bold ${passed ? "text-edu-ink" : "text-edu-danger"}`}>
                                    {g.grade}
                                    <span className="text-edu-ink-400 font-normal text-[0.75rem]">/20</span>
                                </span>
                                <span
                                    className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${passed ? "bg-edu-success-bg text-edu-success" : "bg-edu-danger-bg text-edu-danger"}`}
                                >
                                    {passed ? "Aprobada" : "Reprobada"}
                                </span>
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
