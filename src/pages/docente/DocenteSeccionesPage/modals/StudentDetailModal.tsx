import { X } from "lucide-react";
import type { Estudiante, EvaluacionPlan, EvalTipo } from "../interfaces";

interface Props {
    studentDetail: Estudiante;
    PLAN: EvaluacionPlan[];
    TYPE_META: Record<EvalTipo, { icon: React.FC<{ style?: React.CSSProperties }>; bg: string; color: string; label: string }>;
    notaColor: (n: number) => string;
    onClose: () => void;
}

export function StudentDetailModal({ studentDetail, PLAN, TYPE_META, notaColor, onClose }: Props) {
    return (
        <div
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-edu-surface rounded-edu-card w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-start gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-edu-primary-50 border-2 border-edu-primary-100 flex items-center justify-center text-[0.8rem] font-bold text-edu-primary shrink-0">
                            {studentDetail.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                        </div>
                        <div className="min-w-0">
                            <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem] truncate">{studentDetail.name}</h3>
                            <div className="text-[0.8rem] text-edu-ink-500 mt-0.5">{studentDetail.cedula}</div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Cerrar"
                        className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700 shrink-0"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-5 flex flex-col gap-4">
                    {/* Resumen del estudiante */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-edu-subtle rounded-edu-control px-3 py-2.5">
                            <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Promedio</div>
                            <div className={`text-[1.2rem] font-bold ${notaColor(studentDetail.average)}`}>{studentDetail.average.toFixed(1)}</div>
                        </div>
                        <div className="bg-edu-subtle rounded-edu-control px-3 py-2.5">
                            <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Asistencia</div>
                            <div className={`text-[1.2rem] font-bold ${studentDetail.attendance >= 90 ? "text-edu-success" : "text-edu-warning"}`}>{studentDetail.attendance} %</div>
                        </div>
                        <div className="bg-edu-subtle rounded-edu-control px-3 py-2.5">
                            <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Estado</div>
                            <div className={`text-[1.2rem] font-bold ${studentDetail.average >= 10 ? "text-edu-success" : "text-edu-danger"}`}>
                                {studentDetail.average >= 10 ? "Aprobado" : "Reprobado"}
                            </div>
                        </div>
                    </div>

                    {/* Resultados por evaluación */}
                    <div>
                        <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium mb-2">
                            Resultados por evaluación
                        </div>
                        <div className="rounded-edu-control border border-edu-border-soft overflow-hidden">
                            {PLAN.map((ev, idx) => {
                                const g = studentDetail.grades[idx];
                                const tm = TYPE_META[ev.type];
                                return (
                                    <div
                                        key={ev.id}
                                        className={`flex items-center gap-3 px-3.5 py-2.5 ${idx < PLAN.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                                    >
                                        <div className="w-8 h-8 rounded-edu-chip flex items-center justify-center shrink-0" style={{ backgroundColor: tm.bg }}>
                                            <tm.icon style={{ width: "14px", height: "14px", color: tm.color }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[0.8125rem] text-edu-ink font-medium truncate">{ev.name}</div>
                                            <div className="text-[0.7rem] text-edu-ink-400">{ev.weight}% · {ev.date}</div>
                                        </div>
                                        {g != null ? (
                                            <span className={`text-sm font-bold shrink-0 ${notaColor(g)}`}>
                                                {g.toFixed(1)}<span className="text-edu-ink-400 font-normal text-[0.75rem]">/20</span>
                                            </span>
                                        ) : ev.status === "Pendiente" ? (
                                            <span className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit bg-edu-subtle text-edu-ink-500 shrink-0">
                                                Pendiente
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit bg-edu-warning-bg text-edu-warning shrink-0">
                                                Sin entregar
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
