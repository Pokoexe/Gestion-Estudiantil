import { BookOpen, ChevronRight } from "lucide-react";
import type { Seccion } from "../interfaces";

interface Props {
    SECCIONES: Seccion[];
    onOpen: (sec: Seccion) => void;
    notaColor: (n: number) => string;
}

export function SeccionesList({ SECCIONES, onOpen, notaColor }: Props) {
    return (
        <div className="flex flex-col gap-5">
            {/* <div>
                    <h2 className="m-0 text-edu-ink font-bold text-[1.35rem]">Mis secciones</h2>
                    <p className="text-edu-ink-500 text-sm mt-1 m-0">
                        Secciones asignadas para el ciclo escolar 2026-I
                    </p>
                </div> */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {SECCIONES.map((sec) => (
                    <button
                        key={sec.id}
                        onClick={() => onOpen(sec)}
                        className="text-left bg-edu-surface border border-edu-border-soft rounded-edu-card p-5 flex flex-col gap-4 cursor-pointer transition-colors hover:border-edu-primary-200"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="w-11 h-11 rounded-edu-control flex items-center justify-center shrink-0"
                                style={{ backgroundColor: sec.accent }}
                            >
                                <BookOpen className="text-edu-ink-700" style={{ width: "20px", height: "20px" }} />
                            </div>
                            <div className="min-w-0">
                                <div className="text-[0.95rem] font-semibold text-edu-ink">{sec.subject}</div>
                                <div className="text-[0.8rem] text-edu-ink-500 mt-[1px]">{sec.grade}</div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <div className="flex-1 bg-edu-subtle rounded-edu-chip px-2.5 py-2">
                                <div className="text-[0.65rem] text-edu-ink-400 font-semibold uppercase tracking-[0.04em]">Estudiantes</div>
                                <div className="text-[0.95rem] font-bold mt-0.5 text-edu-ink">{sec.students}</div>
                            </div>
                            <div className="flex-1 bg-edu-subtle rounded-edu-chip px-2.5 py-2">
                                <div className="text-[0.65rem] text-edu-ink-400 font-semibold uppercase tracking-[0.04em]">Asistencia</div>
                                <div className={`text-[0.95rem] font-bold mt-0.5 ${sec.attendance >= 90 ? "text-edu-success" : "text-edu-warning"}`}>{sec.attendance} %</div>
                            </div>
                            <div className="flex-1 bg-edu-subtle rounded-edu-chip px-2.5 py-2">
                                <div className="text-[0.65rem] text-edu-ink-400 font-semibold uppercase tracking-[0.04em]">Promedio</div>
                                <div className={`text-[0.95rem] font-bold mt-0.5 ${notaColor(sec.average)}`}>{sec.average.toFixed(1)}</div>
                            </div>
                        </div>

                        <span className="inline-flex items-center gap-1 text-[0.8rem] text-edu-primary font-semibold">
                            Ver detalle
                            <ChevronRight style={{ width: "14px", height: "14px" }} />
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
