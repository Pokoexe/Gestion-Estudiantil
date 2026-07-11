import { X, Clock, ListChecks, FileText, Download } from "lucide-react";
import type { EvaluacionPlan, Seccion, EvalEstado, EvalTipo } from "../interfaces";

interface Props {
    evalDetail: EvaluacionPlan;
    selected: Seccion;
    TYPE_META: Record<EvalTipo, { icon: React.FC<{ style?: React.CSSProperties }>; bg: string; color: string; label: string }>;
    EVAL_STATUS: Record<EvalEstado, { bg: string; fg: string }>;
    onClose: () => void;
}

export function EvalDetailModal({ evalDetail, selected, TYPE_META, EVAL_STATUS, onClose }: Props) {
    const tm = TYPE_META[evalDetail.type];
    const st = EVAL_STATUS[evalDetail.status];
    const TypeIcon = tm.icon;

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
                    <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: tm.bg }}>
                            <TypeIcon style={{ width: "18px", height: "18px", color: tm.color }} />
                        </div>
                        <div className="min-w-0">
                            <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem] leading-snug">{evalDetail.name}</h3>
                            <div className="text-[0.8rem] text-edu-ink-500 mt-0.5">{selected.subject} · {selected.grade}</div>
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
                    <div className="flex items-center justify-between px-4 py-3 rounded-edu-control bg-edu-subtle">
                        <div>
                            <div className="text-[0.72rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Fecha</div>
                            <div className="text-[1.1rem] font-bold text-edu-ink leading-none mt-0.5">{evalDetail.date}</div>
                        </div>
                        <span className="inline-flex items-center gap-1.5 bg-edu-primary-50 text-edu-primary text-[0.8rem] font-semibold px-3 py-1.5 rounded-edu-pill">
                            <Clock className="w-3.5 h-3.5" />
                            {evalDetail.horario}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                        {[
                            { label: "Tipo", value: tm.label },
                            { label: "Peso", value: `${evalDetail.weight}%` },
                            { label: "Docente", value: "Prof. Alejandro Morales" },
                        ].map((d) => (
                            <div key={d.label}>
                                <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">{d.label}</div>
                                <div className="text-[0.875rem] text-edu-ink font-medium">{d.value}</div>
                            </div>
                        ))}
                        <div>
                            <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Estado</div>
                            <span
                                className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit mt-0.5"
                                style={{ backgroundColor: st.bg, color: st.fg }}
                            >
                                {evalDetail.status}
                            </span>
                        </div>
                    </div>

                    <div>
                        <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium mb-1">Descripción</div>
                        <p className="text-sm text-edu-ink-700 leading-[1.6] m-0">{evalDetail.description}</p>
                    </div>

                    {evalDetail.topics && evalDetail.topics.length > 0 && (
                        <div>
                            <div className="flex items-center gap-1.5 mb-2">
                                <ListChecks className="w-3.5 h-3.5 text-edu-primary" />
                                <span className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">
                                    Temas ({evalDetail.topics.length})
                                </span>
                            </div>
                            <div className="flex flex-col gap-2">
                                {evalDetail.topics.map((topic, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-start gap-2.5 px-3.5 py-2 bg-edu-primary-50 rounded-edu-chip border border-edu-primary-100"
                                    >
                                        <div className="w-[20px] h-[20px] rounded-full bg-edu-primary text-white flex items-center justify-center text-[0.68rem] font-bold shrink-0">
                                            {idx + 1}
                                        </div>
                                        <span className="text-[0.8125rem] text-[#1e3a5f] leading-[1.5]">{topic}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {evalDetail.material && (
                        <div className="flex items-center gap-3 p-3 rounded-edu-control border border-edu-border-soft bg-edu-subtle">
                            <div className="w-10 h-10 rounded-edu-chip bg-edu-primary-50 flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5 text-edu-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-edu-ink truncate">{evalDetail.material}</div>
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
            </div>
        </div>
    );
}
