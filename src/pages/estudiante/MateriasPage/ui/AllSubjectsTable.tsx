import { ChevronRight, Search } from "lucide-react";
import { Pagination } from "@shared/ui/Pagination";
import type { Subject, SubjectStatus } from "@shared/services/actions/estudiante";

const STATUS_META: Record<SubjectStatus, { label: string; cls: string }> = {
    aprobado: { label: "Aprobado", cls: "bg-edu-success-bg text-edu-success" },
    reprobado: { label: "Reprobado", cls: "bg-edu-danger-bg text-edu-danger" },
    por_reprobar: { label: "Por reprobar", cls: "bg-edu-warning-bg text-edu-warning" },
};

const SUBJECT_COLS = "grid-cols-[1.4fr_1.3fr_1fr_1fr_1.1fr_1fr]";
const SUBJECT_HEADERS = ["Materia", "Profesor", "Evaluaciones", "Asistencia", "Estado", "Promedio"];

interface AllSubjectsTableProps {
    filteredSubjects: Subject[];
    pagedSubjects: Subject[];
    query: string;
    setQuery: (v: string) => void;
    currentPage: number;
    totalPages: number;
    setPage: (v: number) => void;
    goToSubject: (id: number) => void;
}

/** Tabla de todas las materias: buscador, filas paginadas y paginación. */
export function AllSubjectsTable({
    filteredSubjects, pagedSubjects, query, setQuery,
    currentPage, totalPages, setPage, goToSubject,
}: AllSubjectsTableProps) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">
                    Todas las materias
                </h3>
                <span className="text-[0.8rem] text-edu-ink-400 font-medium">
                    {filteredSubjects.length} materias
                </span>
            </div>
            <div className="px-5 py-3 border-b border-edu-border-soft">
                <div className="relative">
                    <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                        placeholder="Buscar materia o profesor…"
                        className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <div className="min-w-[720px]">
                    <div className={`grid ${SUBJECT_COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                        {SUBJECT_HEADERS.map((h) => (
                            <span
                                key={h}
                                className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]"
                            >
                                {h}
                            </span>
                        ))}
                    </div>
                    {filteredSubjects.length === 0 && (
                        <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">
                            No hay materias que coincidan con la búsqueda.
                        </div>
                    )}
                    {pagedSubjects.map((s, i) => {
                        const st = STATUS_META[s.status];
                        return (
                            <div
                                key={s.id}
                                onClick={() => goToSubject(s.id)}
                                className={`grid ${SUBJECT_COLS} px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle ${i < pagedSubjects.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                            >
                                <div className="flex items-center gap-2">
                                    <span
                                        className="w-2 h-2 rounded-full shrink-0"
                                        style={{ backgroundColor: s.dot }}
                                    />
                                    <span className="text-[0.875rem] text-edu-ink font-medium">
                                        {s.name}
                                    </span>
                                </div>
                                <span className="text-[0.875rem] text-edu-ink-700">
                                    {s.teacher}
                                </span>
                                <span className="text-[0.875rem] text-edu-ink-700">
                                    {s.evaluations}
                                </span>
                                <span className="text-[0.875rem] text-edu-ink-700">
                                    {s.attendance}
                                </span>
                                <span
                                    className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${st.cls}`}
                                >
                                    {st.label}
                                </span>
                                <div className="flex items-center justify-between gap-1">
                                    <span className="text-[0.875rem] text-edu-ink font-semibold">
                                        {s.average}
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
