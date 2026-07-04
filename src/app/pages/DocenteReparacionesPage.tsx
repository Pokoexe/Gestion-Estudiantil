import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Wrench, CheckCircle2, AlertTriangle, X, Pencil, PlusCircle } from "lucide-react";
import { color } from "../theme/tokens";
import { REPARACIONES } from "../data/reparaciones";

export function DocenteReparacionesPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [feedback, setFeedback] = useState<string | null>(
        (location.state as { feedback?: string } | null)?.feedback ?? null,
    );

    const creadas = REPARACIONES.filter((r) => r.status === "creada").length;
    const porCrear = REPARACIONES.filter((r) => r.status === "por_crear").length;

    const BLOCKS = [
        { label: "Total", value: REPARACIONES.length, icon: Wrench, bg: color.primary100, fg: color.primary, hint: "Materias en reparación" },
        { label: "Creadas", value: creadas, icon: CheckCircle2, bg: color.successBg, fg: color.success, hint: "Con plan de recuperación" },
        { label: "Por crear", value: porCrear, icon: AlertTriangle, bg: color.warningBg, fg: color.warningStrong, hint: "Requieren tu atención" },
    ];

    return (
        <div className="flex flex-col gap-5">
            {/* Confirmación */}
            {feedback && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-edu-control text-sm font-medium bg-edu-success-bg text-edu-success">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="flex-1">{feedback}</span>
                    <button onClick={() => setFeedback(null)} aria-label="Cerrar" className="text-edu-success bg-transparent border-none cursor-pointer p-0 flex items-center">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Encabezado */}
            <div>
                <h2 className="m-0 text-edu-ink font-bold text-[1.35rem]">Reparaciones</h2>
                <p className="text-edu-ink-500 text-sm mt-1 m-0">
                    Materias reprobadas: crea y gestiona sus evaluaciones de recuperación
                </p>
            </div>

            {/* Bloques */}
            <div className="grid grid-cols-3 gap-4">
                {BLOCKS.map((s) => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">{s.label}</p>
                                    <p className="text-edu-ink text-[1.4rem] font-bold mt-1">{s.value}</p>
                                </div>
                                <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: s.bg }}>
                                    <Icon className="w-5 h-5" style={{ color: s.fg }} />
                                </div>
                            </div>
                            <p className="text-edu-ink-400 text-xs m-0">{s.hint}</p>
                        </div>
                    );
                })}
            </div>

            {/* Tabla */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                <div className="grid grid-cols-[1.4fr_0.9fr_0.9fr_0.9fr_0.7fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                    {["Materia", "Sección", "Evaluaciones", "Estado", "Acción"].map((h) => (
                        <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
                    ))}
                </div>
                {REPARACIONES.map((r, i) => {
                    const creada = r.status === "creada";
                    return (
                        <div
                            key={r.id}
                            onClick={creada ? () => navigate(`/estudiante/reparacion/${r.courseId}`) : undefined}
                            className={`grid grid-cols-[1.4fr_0.9fr_0.9fr_0.9fr_0.7fr] px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${creada ? "cursor-pointer" : ""} ${i < REPARACIONES.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                        >
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: creada ? color.success : color.warningStrong }} />
                                <span className="text-sm text-edu-ink font-medium">{r.subject}</span>
                            </div>
                            <span className="text-[0.8125rem] text-edu-ink-500">{r.section}</span>
                            <span className="text-sm text-edu-ink-700 font-semibold">{creada ? `${r.count} evaluaciones` : "—"}</span>
                            <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${creada ? "bg-edu-success-bg text-edu-success" : "bg-edu-warning-bg text-edu-warning"}`}>
                                {creada ? "Creada" : "Por crear"}
                            </span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/docente/reparaciones/${r.id}`);
                                }}
                                className="inline-flex items-center gap-1 text-[0.8rem] text-edu-primary font-semibold cursor-pointer w-fit bg-transparent border-none p-0"
                            >
                                {creada ? <Pencil style={{ width: "13px", height: "13px" }} /> : <PlusCircle style={{ width: "13px", height: "13px" }} />}
                                {creada ? "Modificar" : "Crear"}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
