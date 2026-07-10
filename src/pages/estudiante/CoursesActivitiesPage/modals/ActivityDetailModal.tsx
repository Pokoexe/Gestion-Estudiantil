import { Trophy, X } from "lucide-react";
import { color } from "@themes/tokens";
import { type Activity, type ActivityStatus } from "@shared/services/actions/estudiante";

const ACTIVITY_META: Record<ActivityStatus, { label: string; cls: string; dot: string }> = {
    completed: { label: "Realizada", cls: "bg-edu-success-bg text-edu-success", dot: color.success },
    upcoming: { label: "Por realizar", cls: "bg-edu-primary-50 text-edu-primary", dot: color.primary },
};

interface ActivityDetailModalProps {
    activity: Activity;
    onClose: () => void;
}

/** Modal de detalle de una actividad extracurricular. */
export function ActivityDetailModal({ activity, onClose }: ActivityDetailModalProps) {
    const meta = ACTIVITY_META[activity.status];
    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-edu-surface rounded-edu-card w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
                {/* Encabezado */}
                <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-start gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0 bg-edu-primary-100">
                            <Trophy style={{ width: 18, height: 18 }} className="text-edu-primary" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem] leading-snug">{activity.name}</h3>
                            <div className="text-[0.8rem] text-edu-ink-500 mt-0.5">Actividad extracurricular</div>
                        </div>
                    </div>
                    <button onClick={onClose} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700 shrink-0">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-5 flex flex-col gap-4">

                    {/* Datos */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <div>
                            <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Fecha</div>
                            <div className="text-[0.875rem] text-edu-ink font-medium">{activity.date}</div>
                        </div>
                        <div>
                            <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Lugar</div>
                            <div className="text-[0.875rem] text-edu-ink font-medium">{activity.lugar}</div>
                        </div>
                        <div className="">
                            <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Docente asignado</div>
                            <div className="text-[0.875rem] text-edu-ink font-medium">{activity.teacher}</div>
                        </div>


                        <div className="">
                            <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Estado</div>
                            <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-edu-pill text-[0.8rem] font-semibold ${meta.cls}`}>
                                {meta.label}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
