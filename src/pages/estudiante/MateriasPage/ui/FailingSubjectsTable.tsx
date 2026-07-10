import { ChevronRight } from "lucide-react";
import { color } from "@themes/tokens";
import type { Subject, SubjectStatus } from "@shared/services/actions/estudiante";

const STATUS_META: Record<SubjectStatus, { label: string; cls: string }> = {
    aprobado: { label: "Aprobado", cls: "bg-edu-success-bg text-edu-success" },
    reprobado: { label: "Reprobado", cls: "bg-edu-danger-bg text-edu-danger" },
    por_reprobar: { label: "Por reprobar", cls: "bg-edu-warning-bg text-edu-warning" },
};

const SUBJECT_COLS_FAILS = "grid-cols-[1.4fr_1fr_1fr]";
const SUBJECT_HEADERS_FAILS = ["Materia", "Promedio", "Estado"];

interface FailingSubjectsTableProps {
    failing: Subject[];
    goToSubject: (id: number) => void;
}

/** Tabla de materias reprobadas / en riesgo. */
export function FailingSubjectsTable({ failing, goToSubject }: FailingSubjectsTableProps) {
    return (
        <div>
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                    <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">
                        Materias reprobadas
                    </h3>
                    <span className="text-[0.8rem] text-edu-danger font-medium">
                        {failing.length} en riesgo
                    </span>
                </div>
                <div>
                    <div className={`grid ${SUBJECT_COLS_FAILS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                        {SUBJECT_HEADERS_FAILS.map((h) => (
                            <span
                                key={h}
                                className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]"
                            >
                                {h}
                            </span>
                        ))}
                    </div>
                    {failing.map((s, i) => (
                        <div
                            key={s.id}
                            onClick={() => goToSubject(s.id)}
                            className={`grid ${SUBJECT_COLS_FAILS} px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle ${i < failing.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                        >
                            <div className="flex items-center gap-2">
                                <span
                                    className="w-2 h-2 rounded-full shrink-0"
                                    style={{ backgroundColor: color.danger }}
                                />
                                <span className="text-[0.875rem] text-edu-ink font-medium">
                                    {s.name}
                                </span>
                            </div>
                            <span className="text-[0.875rem] text-edu-danger font-semibold">
                                {s.average}
                            </span>

                            <div className="flex items-center justify-between gap-1">
                                <span className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit bg-edu-danger-bg text-edu-danger">
                                    {STATUS_META[s.status].label}
                                </span>
                                <ChevronRight className="w-4 h-4 text-edu-danger/50 shrink-0" />
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
