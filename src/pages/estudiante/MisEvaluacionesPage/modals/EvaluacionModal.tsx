import {
    X,
    Clock,
    AlertTriangle,
    Download,
    ListChecks,
    Presentation,
    FileText,
    FlaskConical,
    PenLine,
} from "lucide-react";
import { color } from "@themes/tokens";
import { type Evaluation, type EvalType } from "@shared/services/actions/estudiante";

const PASS_MARK = 10;
const RISK_MARK = 12;

const TYPE_META: Record<EvalType, { icon: React.FC<{ style?: React.CSSProperties }>; bg: string; color: string; label: string }> = {
    presentation: { icon: Presentation, bg: color.primary50, color: color.primary, label: "Exposición" },
    exam: { icon: FileText, bg: color.warningBg, color: color.warning, label: "Examen" },
    lab: { icon: FlaskConical, bg: color.successBg, color: color.success, label: "Laboratorio" },
    essay: { icon: PenLine, bg: color.purpleBg, color: color.purple, label: "Ensayo" },
};

const daysLabel = (d: number) => (d <= 0 ? "Hoy" : d === 1 ? "Mañana" : `en ${d} días`);
const avgClass = (a: number) => (a < PASS_MARK ? "text-edu-danger" : a < RISK_MARK ? "text-edu-warning" : "text-edu-ink");

interface EvaluacionModalProps {
    selected: Evaluation;
    onClose: () => void;
}

/** Modal con la información completa de la evaluación seleccionada. */
export function EvaluacionModal({ selected, onClose }: EvaluacionModalProps) {
    return (
        <div
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-edu-surface rounded-edu-card w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
                onClick={(e) => e.stopPropagation()}
            >
                {(() => {
                    const t = TYPE_META[selected.type];
                    const TypeIcon = t.icon;
                    const atRisk = selected.currentAverage < RISK_MARK;
                    return (
                        <>
                            {/* Encabezado */}
                            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-start gap-3">
                                <div className="flex items-start gap-3 min-w-0">
                                    <div
                                        className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: t.bg }}
                                    >
                                        <TypeIcon style={{ width: "18px", height: "18px", color: t.color }} />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem] leading-snug">{selected.title}</h3>
                                        <div className="text-[0.8rem] text-edu-ink-500 mt-0.5">{selected.subject}</div>
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
                                {/* Cuenta regresiva */}
                                <div className="flex items-center justify-between px-4 py-3 rounded-edu-control bg-edu-subtle">
                                    <div>
                                        <div className="text-[0.72rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Fecha</div>
                                        <div className="text-[1.1rem] font-bold text-edu-ink leading-none mt-0.5">{selected.date}</div>
                                    </div>
                                    <span className="inline-flex items-center gap-1.5 bg-edu-primary-50 text-edu-primary text-[0.8rem] font-semibold px-3 py-1.5 rounded-edu-pill">
                                        <Clock className="w-3.5 h-3.5" />
                                        {daysLabel(selected.daysUntil)}
                                    </span>
                                </div>

                                {/* Datos */}
                                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                    {[
                                        { label: "Tipo", value: t.label },
                                        { label: "Docente", value: selected.teacher },
                                        { label: "Peso", value: selected.weight },
                                    ].map((d) => (
                                        <div key={d.label}>
                                            <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">{d.label}</div>
                                            <div className="text-[0.875rem] text-edu-ink font-medium">{d.value}</div>
                                        </div>
                                    ))}
                                    <div>
                                        <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Promedio actual</div>
                                        <div className={`text-[0.875rem] font-bold ${avgClass(selected.currentAverage)}`}>
                                            {selected.currentAverage}/20
                                        </div>
                                    </div>
                                </div>

                                {/* Aviso de riesgo */}
                                {atRisk && (
                                    <div className="flex items-start gap-2 px-3.5 py-3 rounded-edu-control bg-edu-danger-bg text-edu-danger text-[0.8125rem] leading-[1.5]">
                                        <AlertTriangle className="w-4 h-4 shrink-0 mt-px" />
                                        <span>
                                            Esta materia tiene promedio {selected.currentAverage}/20. Aprobar esta
                                            evaluación es clave para <strong>evitar la reparación</strong>.
                                        </span>
                                    </div>
                                )}

                                {/* Descripción */}
                                <div>
                                    <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium mb-1">Descripción</div>
                                    <p className="text-sm text-edu-ink-700 leading-[1.6] m-0">{selected.description}</p>
                                </div>

                                {/* Temas */}
                                {selected.topics && selected.topics.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <ListChecks className="w-3.5 h-3.5 text-edu-primary" />
                                            <span className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">
                                                Temas ({selected.topics.length})
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            {selected.topics.map((topic) => (
                                                <div
                                                    key={topic.id}
                                                    className="flex items-start gap-2.5 px-3.5 py-2 bg-edu-primary-50 rounded-edu-chip border border-edu-primary-100"
                                                >
                                                    <div className="w-[20px] h-[20px] rounded-full bg-edu-primary text-white flex items-center justify-center text-[0.68rem] font-bold shrink-0">
                                                        {topic.id}
                                                    </div>
                                                    <span className="text-[0.8125rem] text-[#1e3a5f] leading-[1.5]">{topic.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Material adjunto */}
                                {selected.guide && (
                                    <div className="flex items-center gap-3 p-3 rounded-edu-control border border-edu-border-soft bg-edu-subtle">
                                        <div className="w-10 h-10 rounded-edu-chip bg-edu-primary-50 flex items-center justify-center shrink-0">
                                            <FileText className="w-5 h-5 text-edu-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-edu-ink truncate">{selected.guide}</div>
                                            <div className="text-xs text-edu-ink-400">Material de apoyo</div>
                                        </div>
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-edu-control border-[1.5px] border-edu-primary-200 bg-edu-primary-50 text-edu-primary text-[0.8125rem] font-semibold cursor-pointer transition-colors hover:bg-edu-primary-100 shrink-0"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                            Descargar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    );
                })()}
            </div>
        </div>
    );
}
