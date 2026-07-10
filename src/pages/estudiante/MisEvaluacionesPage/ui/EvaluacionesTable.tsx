import { Search, Clock } from "lucide-react";
import { color } from "@themes/tokens";
import { Pagination } from "@shared/ui/Pagination";
import { LapsoFilter } from "@shared/ui/LapsoFilter";
import { type Evaluation, type EvalType } from "@shared/services/actions/estudiante";
import type { SortOrder } from "../interfaces";

const PASS_MARK = 10;
const RISK_MARK = 12;

const TYPE_META: Record<EvalType, { bg: string; color: string; label: string }> = {
    presentation: { bg: color.primary50, color: color.primary, label: "Exposición" },
    exam: { bg: color.warningBg, color: color.warning, label: "Examen" },
    lab: { bg: color.successBg, color: color.success, label: "Laboratorio" },
    essay: { bg: color.purpleBg, color: color.purple, label: "Ensayo" },
};

const daysLabel = (d: number) => (d <= 0 ? "Hoy" : d === 1 ? "Mañana" : `en ${d} días`);
const avgClass = (a: number) => (a < PASS_MARK ? "text-edu-danger" : a < RISK_MARK ? "text-edu-warning" : "text-edu-ink");

const EVAL_COLS = "grid-cols-[1.2fr_1.8fr_1.1fr_0.7fr_1fr]";
const EVAL_HEADERS = ["Materia", "Evaluación", "Fecha", "Peso", "Promedio"];

interface EvaluacionesTableProps {
    filtered: Evaluation[];
    paged: Evaluation[];
    query: string;
    setQuery: (v: string) => void;
    subjectFilter: string;
    setSubjectFilter: (v: string) => void;
    order: SortOrder;
    setOrder: (v: SortOrder) => void;
    subjects: string[];
    currentPage: number;
    totalPages: number;
    setPage: (v: number) => void;
    onSelect: (e: Evaluation) => void;
}

/** Tabla de evaluaciones por hacer: buscador, filtros, orden, filas y paginación. */
export function EvaluacionesTable({
    filtered, paged, query, setQuery, subjectFilter, setSubjectFilter,
    order, setOrder, subjects, currentPage, totalPages, setPage, onSelect,
}: EvaluacionesTableProps) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Evaluaciones por hacer</h3>
                <span className="text-[0.8rem] text-edu-ink-400 font-medium">{filtered.length} evaluaciones</span>
            </div>

            {/* Buscador y filtros */}
            <div className="px-5 py-3 grid md:grid-cols-4 gap-2 items-center border-b border-edu-border-soft">
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
                    className="w-full md:w-auto border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
                >
                    <option value="todas">Todas las materias</option>
                    {subjects.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
                <select
                    value={order}
                    onChange={(e) => { setOrder(e.target.value as SortOrder); setPage(1); }}
                    className="w-full truncate md:w-auto border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
                >
                    <option value="fecha">Por fecha (más cercana)</option>
                    <option value="riesgo">Más cercanas a reprobar</option>
                </select>
                <div className="md:col-span-4 flex justify-end">
                    <LapsoFilter />
                </div>

            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
                <div className="min-w-[680px]">
                    <div className={`grid ${EVAL_COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                        {EVAL_HEADERS.map((h) => (
                            <span
                                key={h}
                                className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]"
                            >
                                {h}
                            </span>
                        ))}
                    </div>
                    {filtered.length === 0 && (
                        <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">
                            No hay evaluaciones que coincidan con el filtro.
                        </div>
                    )}
                    {paged.map((e, i) => {
                        const t = TYPE_META[e.type];
                        const atRisk = e.currentAverage < RISK_MARK;
                        return (
                            <div
                                key={e.id}
                                onClick={() => onSelect(e)}
                                className={`grid ${EVAL_COLS} px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                            >
                                <span className="text-[0.875rem] text-edu-ink font-medium truncate pr-2">{e.subject}</span>
                                <div className="min-w-0 pr-2">
                                    <div className="text-[0.875rem] text-edu-ink-700 truncate">{e.title}</div>
                                    <span
                                        className="inline-flex mt-0.5 text-[0.62rem] font-semibold px-1.5 py-px rounded-edu-pill"
                                        style={{ backgroundColor: t.bg, color: t.color }}
                                    >
                                        {t.label}
                                    </span>
                                </div>
                                <div className="min-w-0 pr-2">
                                    <div className="text-[0.8125rem] text-edu-ink-700">{e.date}</div>
                                    <div className="text-[0.7rem] text-edu-ink-400 flex items-center gap-1">
                                        <Clock className="w-3 h-3 shrink-0" />
                                        {daysLabel(e.daysUntil)}
                                    </div>
                                </div>
                                <span className="text-[0.875rem] text-edu-ink-700 font-semibold">{e.weight}</span>
                                <div className="flex flex-col">
                                    <span className={`text-[0.9rem] font-bold ${avgClass(e.currentAverage)}`}>
                                        {e.currentAverage}
                                        <span className="text-edu-ink-400 font-normal text-[0.75rem]">/20</span>
                                    </span>
                                    {atRisk && (
                                        <span className="text-[0.62rem] text-edu-danger font-medium">En riesgo</span>
                                    )}
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
