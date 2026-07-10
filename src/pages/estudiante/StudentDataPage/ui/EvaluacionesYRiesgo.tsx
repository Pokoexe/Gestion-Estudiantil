import {
    CalendarClock,
    Clock,
    TrendingDown,
    AlertTriangle,
} from "lucide-react";
import { color } from "@themes/tokens";
import type {
    ProximaEval,
    MateriaRepro,
    ReproStatus,
    Incidencia,
    Severity,
} from "@shared/services/actions/estudiante";

const REPRO_META: Record<ReproStatus, { label: string; cls: string }> = {
    reprobado: { label: "Reprobado", cls: "bg-edu-danger-bg text-edu-danger" },
    por_reprobar: { label: "Por reprobar", cls: "bg-edu-danger-bg text-edu-danger" },
};

const SEVERITY_DOT: Record<Severity, string> = {
    leve: color.warningStrong,
    grave: color.danger,
    positiva: color.success,
};

interface EvaluacionesYRiesgoProps {
    proximas: ProximaEval[];
    reprobadas: MateriaRepro[];
    incidencias: Incidencia[];
    onSubjectClick: (subjectId: number) => void;
}

/** Próximas evaluaciones y materias en riesgo (reprobadas + incidencias). */
export function EvaluacionesYRiesgo({ proximas, reprobadas, incidencias, onSubjectClick }: EvaluacionesYRiesgoProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Próximas evaluaciones */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
                <div className="px-5 py-3.5 border-b border-edu-border-soft flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <CalendarClock className="w-4 h-4 text-edu-primary" />
                        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Próximas evaluaciones</h3>
                    </div>
                    <span className="text-[0.72rem] text-edu-ink-400 font-medium">{proximas.length} próximas</span>
                </div>
                <div className="flex flex-col">
                    {proximas.map((ev, i) => (
                        <div
                            key={ev.id}
                            onClick={() => onSubjectClick(ev.subjectId)}
                            className={`px-5 py-2.5 flex items-center gap-3 cursor-pointer transition-colors hover:bg-edu-subtle ${i < proximas.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                        >
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: ev.dot }} />
                            <div className="flex-1 min-w-0">
                                <div className="text-[0.85rem] font-medium text-edu-ink truncate">{ev.subject}</div>
                                <div className="text-[0.75rem] text-edu-ink-400 truncate">{ev.type}</div>
                            </div>
                            <span className="text-[0.72rem] text-edu-ink-400 shrink-0 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {ev.date}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Materias reprobadas*/}
                <div>
                    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
                        <div className="px-5 py-3.5 border-b border-edu-border-soft flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <TrendingDown className="w-4 h-4 text-edu-danger" />
                                <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Materias reprobadas</h3>
                            </div>
                            <span className="text-[0.72rem] text-edu-danger font-medium">{reprobadas.length} en riesgo</span>
                        </div>
                        <div className="flex flex-col">
                            {reprobadas.map((m, i) => (
                                <div
                                    key={m.id}
                                    onClick={() => onSubjectClick(m.id)}
                                    className={`px-5 py-2.5 flex items-center gap-2.5 cursor-pointer transition-colors hover:bg-edu-subtle ${i < reprobadas.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                                >
                                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color.danger }} />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[0.85rem] font-medium text-edu-ink truncate">{m.subject}</div>
                                        <div className="text-[0.75rem] text-edu-ink-400 truncate">{m.teacher}</div>
                                    </div>
                                    <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold shrink-0 ${REPRO_META[m.status].cls}`}>
                                        {REPRO_META[m.status].label}
                                    </span>
                                    <span className="text-[0.85rem] font-bold text-edu-danger shrink-0 w-6 text-right">{m.average}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Incidencias */}
                <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
                    <div className="px-5 py-3.5 border-b border-edu-border-soft flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-edu-warning-strong" />
                            <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Incidencias</h3>
                        </div>
                        <span className="text-[0.72rem] text-edu-ink-400 font-medium">{incidencias.length} registros</span>
                    </div>
                    <div className="flex flex-col">
                        {incidencias.map((it, i) => (
                            <div
                                key={it.id}
                                className={`px-5 py-2.5 flex items-center gap-3 ${i < incidencias.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                            >
                                <span
                                    className="w-2 h-2 rounded-full shrink-0"
                                    style={{ backgroundColor: SEVERITY_DOT[it.severity] }}
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="text-[0.85rem] font-medium text-edu-ink truncate">{it.type}</div>
                                    <div className="text-[0.75rem] text-edu-ink-400 truncate">{it.detail}</div>
                                </div>
                                <span className="text-[0.72rem] text-edu-ink-400 shrink-0">{it.date}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
