import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { PlusCircle, Pencil, X, CheckCircle2, AlertTriangle } from "lucide-react";
import { color } from "../theme/tokens";
import { PLANS, type PlanEstado } from "../data/plans";

const STATUS_META: Record<PlanEstado, { label: string; bg: string; fg: string }> = {
    approved: { label: "Aprobado", bg: color.successBg, fg: color.success },
    review: { label: "En revisión", bg: color.primary100, fg: color.primary },
    draft: { label: "Borrador", bg: color.subtle, fg: color.ink500 },
    changes: { label: "Cambios solicitados", bg: color.dangerBg, fg: color.danger },
};

export function DocentePlanesPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [feedback, setFeedback] = useState<string | null>(
        (location.state as { feedback?: string } | null)?.feedback ?? null,
    );

    return (
        <div className="flex flex-col gap-5">
            {/* Confirmación */}
            {feedback && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-edu-control text-sm font-medium bg-edu-success-bg text-edu-success">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="flex-1">{feedback}</span>
                    <button
                        onClick={() => setFeedback(null)}
                        aria-label="Cerrar"
                        className="text-edu-success bg-transparent border-none cursor-pointer p-0 flex items-center"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Encabezado */}
            <div className="flex justify-between items-center flex-wrap gap-3">
                <div>
                    <h2 className="m-0 text-edu-ink font-bold text-[1.35rem]">Planes de evaluación</h2>
                    <p className="text-edu-ink-500 text-sm mt-1 m-0">
                        Crea y modifica los planes de tus secciones
                    </p>
                </div>
                <button
                    onClick={() => navigate("/docente/planes/nuevo")}
                    className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold bg-edu-primary text-white hover:bg-edu-primary-hover border-none cursor-pointer"
                >
                    <PlusCircle className="w-4 h-4" />
                    Crear plan de evaluación
                </button>
            </div>

            {/* Tabla de planes */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                <div className="grid grid-cols-[1.4fr_0.8fr_0.9fr_1fr_0.6fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                    {["Materia", "Sección", "Evaluaciones", "Estado", "Acción"].map((h) => (
                        <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">
                            {h}
                        </span>
                    ))}
                </div>
                {PLANS.map((plan, i) => {
                    const st = STATUS_META[plan.status];
                    return (
                        <div
                            key={plan.id}
                            className={`px-5 py-[13px] transition-colors hover:bg-edu-subtle ${i < PLANS.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                        >
                            <div className="grid grid-cols-[1.4fr_0.8fr_0.9fr_1fr_0.6fr] items-center">
                                <span className="text-sm text-edu-ink font-medium">{plan.subject}</span>
                                <span className="text-[0.8125rem] text-edu-ink-500">{plan.section}</span>
                                <span className="text-sm text-edu-ink-700 font-semibold">{plan.count} evaluaciones</span>
                                <span
                                    className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit"
                                    style={{ backgroundColor: st.bg, color: st.fg }}
                                >
                                    {st.label}
                                </span>
                                <button
                                    onClick={() => navigate(`/docente/planes/${plan.id}/editar`)}
                                    className="inline-flex items-center gap-1 text-[0.8rem] text-edu-primary font-semibold cursor-pointer w-fit bg-transparent border-none p-0"
                                >
                                    <Pencil style={{ width: "13px", height: "13px" }} />
                                    Modificar
                                </button>
                            </div>
                            {plan.note && (
                                <div className={`mt-2 flex items-center gap-1.5 text-xs w-fit rounded-edu-chip px-2.5 py-1.5 ${plan.status === "changes" ? "text-edu-danger bg-edu-danger-bg" : "text-edu-ink-500 bg-edu-primary-50"}`}>
                                    <AlertTriangle className="shrink-0" style={{ width: "12px", height: "12px" }} />
                                    {plan.note}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
