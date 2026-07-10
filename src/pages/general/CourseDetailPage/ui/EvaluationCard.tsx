import { useState } from "react";
import { ChevronDown, ChevronUp, Clock, Download, FileText, FlaskConical, PenLine, Presentation } from "lucide-react";
import { color } from "@themes/tokens";
import { type CourseEvaluation } from "@shared/services/actions/courses";

const TYPE_META: Record<CourseEvaluation["type"], { icon: React.FC<{ style?: React.CSSProperties }>; bg: string; color: string; label: string }> = {
    presentation: { icon: Presentation, bg: color.primary50, color: color.primary, label: "Exposición" },
    exam: { icon: FileText, bg: color.warningBg, color: color.warning, label: "Examen" },
    lab: { icon: FlaskConical, bg: color.successBg, color: color.success, label: "Laboratorio" },
    essay: { icon: PenLine, bg: color.purpleBg, color: color.purple, label: "Ensayo" },
};

const STATUS_META: Record<CourseEvaluation["status"], { bg: string; color: string; label: string }> = {
    pending: { bg: color.warningBg, color: color.warning, label: "Pendiente" },
    submitted: { bg: color.primary100, color: color.primary, label: "Entregada" },
    graded: { bg: color.successBg, color: color.success, label: "Calificada" },
};

export function EvaluationCard({ evaluation, defaultOpen, preview }: { evaluation: CourseEvaluation; defaultOpen: boolean; preview?: boolean }) {
    const [expanded, setExpanded] = useState(defaultOpen);
    const typeMeta = TYPE_META[evaluation.type];
    const statusMeta = STATUS_META[evaluation.status];
    const TypeIcon = typeMeta.icon;

    return (
        <div
            className={`bg-edu-surface rounded-xl overflow-hidden transition-colors ${expanded ? "border-[1.5px] border-edu-primary-200" : "border border-edu-border-soft"}`}
        >
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center gap-3.5 px-[18px] py-4 bg-transparent border-none cursor-pointer text-left"
            >
                <div
                    className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0"
                    style={{ backgroundColor: typeMeta.bg }}
                >
                    <TypeIcon style={{ width: "18px", height: "18px", color: typeMeta.color }} />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[0.9rem] font-semibold text-edu-ink">{evaluation.title}</span>
                        <span
                            className="text-[0.68rem] font-semibold px-2 py-0.5 rounded-edu-pill"
                            style={{ backgroundColor: typeMeta.bg, color: typeMeta.color }}
                        >
                            {typeMeta.label}
                        </span>
                    </div>
                    <div className="flex gap-3 mt-1 flex-wrap">
                        <span className="text-[0.775rem] text-edu-ink-500 flex items-center gap-1">
                            <Clock style={{ width: "11px", height: "11px" }} />
                            {evaluation.dueDate}
                        </span>
                        <span className="text-[0.775rem] text-edu-ink-500">Peso: <strong className="text-edu-ink-700">{evaluation.weight}</strong></span>
                        {!preview && evaluation.status === "graded" && (
                            <span className="text-[0.775rem] text-edu-success font-semibold">
                                Nota: {evaluation.grade}/20
                            </span>
                        )}
                    </div>
                </div>

                {!preview && (
                    <span
                        className="text-[0.7rem] font-semibold px-2.5 py-[3px] rounded-edu-pill shrink-0"
                        style={{ backgroundColor: statusMeta.bg, color: statusMeta.color }}
                    >
                        {statusMeta.label}
                    </span>
                )}

                <div className="text-edu-ink-400 shrink-0">
                    {expanded ? <ChevronUp style={{ width: "16px", height: "16px" }} /> : <ChevronDown style={{ width: "16px", height: "16px" }} />}
                </div>
            </button>

            {expanded && (
                <div className="border-t border-edu-border-soft px-[18px] py-5 bg-edu-tint flex flex-col gap-4">
                    <div>
                        <p className="text-[0.78rem] font-semibold text-edu-ink-500 uppercase tracking-[0.05em] m-0 mb-1.5">
                            Instrucciones
                        </p>
                        <p className="text-sm text-edu-ink-700 leading-[1.65] m-0">
                            {evaluation.description ?? "El docente publicará los detalles de esta evaluación próximamente."}
                        </p>
                    </div>
                    {!preview && (
                        <div className="pt-1">
                            <button className="w-full inline-flex items-center gap-2 px-[18px] py-[9px] rounded-[9px] border-[1.5px] border-edu-success-200 bg-edu-success-bg text-edu-success text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-success-100">
                                <Download style={{ width: "15px", height: "15px" }} />
                                Descargar material
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
