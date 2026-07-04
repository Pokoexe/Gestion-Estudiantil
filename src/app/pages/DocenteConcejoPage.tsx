import { useReducer, useState } from "react";
import {
    Scale,
    CheckCircle2,
    XCircle,
    Clock,
    Award,
    X,
    AlertTriangle,
    History,
} from "lucide-react";
import { POSTULACIONES, decidirPostulacion, type Postulacion } from "../data/discusiones";

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function DocenteConcejoPage() {
    const [, forceRender] = useReducer((x) => x + 1, 0);
    const [decision, setDecision] = useState<{ post: Postulacion; tipo: "Aceptada" | "Rechazada" } | null>(null);
    const [obs, setObs] = useState("");

    const pendientes = POSTULACIONES.filter((p) => p.estado === "Pendiente");
    // Historial: estudiantes ya discutidos. No se revela si fueron aceptados o rechazados.
    const historial = POSTULACIONES.filter((p) => p.estado !== "Pendiente");

    const abrirDecision = (post: Postulacion, tipo: "Aceptada" | "Rechazada") => {
        setDecision({ post, tipo });
        setObs("");
    };

    const confirmar = () => {
        if (!decision) return;
        decidirPostulacion(decision.post.id, decision.tipo, obs);
        setDecision(null);
        setObs("");
        forceRender();
    };

    return (
        <div className="flex flex-col gap-5">
            {/* Encabezado */}
            <div>
                <h2 className="m-0 text-edu-ink font-bold text-[1.35rem]">Concejo de Profesores</h2>
                <p className="text-edu-ink-500 text-sm mt-1 m-0">
                    Acepta o rechaza las discusiones de notas de los estudiantes postulados por el evaluador
                </p>
            </div>

            {/* Aviso: hay discusión de notas */}
            {pendientes.length > 0 ? (
                <div className="flex items-center gap-4 px-5 py-4 rounded-edu-card bg-edu-warning-bg border border-edu-border-soft">
                    <div className="w-12 h-12 rounded-edu-control bg-edu-surface flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-6 h-6 text-edu-warning-strong" />
                    </div>
                    <div>
                        <p className="m-0 text-edu-ink font-bold text-[0.95rem]">Hay discusión de notas</p>
                        <p className="m-0 text-edu-ink-700 text-[0.85rem] mt-0.5">
                            {pendientes.length} estudiante{pendientes.length === 1 ? "" : "s"} postulado
                            {pendientes.length === 1 ? "" : "s"} por el evaluador espera
                            {pendientes.length === 1 ? "" : "n"} la decisión del Concejo.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-4 px-5 py-4 rounded-edu-card bg-edu-surface border border-edu-border-soft">
                    <div className="w-12 h-12 rounded-edu-control bg-edu-success-bg flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-6 h-6 text-edu-success" />
                    </div>
                    <div>
                        <p className="m-0 text-edu-ink font-bold text-[0.95rem]">No hay discusiones pendientes</p>
                        <p className="m-0 text-edu-ink-500 text-[0.85rem] mt-0.5">
                            Todas las postulaciones del evaluador ya fueron decididas por el Concejo.
                        </p>
                    </div>
                </div>
            )}

            {/* Postulaciones pendientes de decisión */}
            {pendientes.length > 0 && (
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <Scale className="w-4 h-4 text-edu-primary" />
                        <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Por decidir</h3>
                    </div>
                    {pendientes.map((p) => (
                        <div key={p.id} className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex flex-col gap-3">
                            <div className="flex justify-between items-start gap-3 flex-wrap">
                                <div>
                                    <div className="flex items-center gap-2.5 flex-wrap">
                                        <span className="text-[0.95rem] font-semibold text-edu-ink">{p.estudiante}</span>
                                        <span className="text-[0.8125rem] text-edu-ink-500">{p.materia} · {p.anio}</span>
                                        <span className="inline-flex items-center px-2 py-[2px] rounded-edu-chip text-[0.72rem] font-semibold bg-edu-danger-bg text-edu-danger">
                                            Nota: {p.nota}
                                        </span>
                                    </div>
                                    <p className="text-[0.85rem] text-edu-ink-700 m-0 mt-2 max-w-2xl">{p.motivo}</p>
                                </div>
                                <span className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit shrink-0 bg-edu-warning-bg text-edu-warning">
                                    Pendiente
                                </span>
                            </div>

                            {/* Actividades extracurriculares */}
                            {p.actividades.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {p.actividades.map((a) => (
                                        <span key={a} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-edu-chip text-[0.72rem] font-medium bg-edu-primary-50 text-edu-primary">
                                            <Award className="w-3 h-3" />
                                            {a}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Acciones del concejo */}
                            <div className="flex gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={() => abrirDecision(p, "Aceptada")}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-edu-control text-[0.8125rem] font-semibold text-white bg-edu-primary border-none cursor-pointer transition-colors hover:bg-edu-primary-hover"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Aceptar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => abrirDecision(p, "Rechazada")}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-edu-control text-[0.8125rem] font-semibold border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 cursor-pointer transition-colors hover:bg-edu-subtle"
                                >
                                    <XCircle className="w-4 h-4" />
                                    Rechazar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Historial de estudiantes postulados (sin revelar la decisión) */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                <div className="px-5 py-4 border-b border-edu-border-soft flex items-center gap-2">
                    <History className="w-4 h-4 text-edu-ink-400" />
                    <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Historial de estudiantes postulados</h3>
                </div>

                <div className="grid grid-cols-[1.6fr_1.2fr_1fr_0.7fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                    {["Estudiante", "Materia", "Año", "Nota"].map((h) => (
                        <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
                    ))}
                </div>

                {historial.length === 0 ? (
                    <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">
                        Aún no hay estudiantes discutidos por el Concejo.
                    </div>
                ) : (
                    historial.map((p, i) => (
                        <div
                            key={p.id}
                            className={`grid grid-cols-[1.6fr_1.2fr_1fr_0.7fr] px-5 py-[13px] items-center ${i < historial.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                        >
                            <span className="text-sm text-edu-ink font-medium">{p.estudiante}</span>
                            <span className="text-[0.8125rem] text-edu-ink-500">{p.materia}</span>
                            <span className="text-[0.8125rem] text-edu-ink-500">{p.anio}</span>
                            <span className="text-sm text-edu-ink-700 font-semibold">{p.nota}</span>
                        </div>
                    ))
                )}
            </div>

            {/* Modal: decisión del concejo */}
            {decision && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setDecision(null)}>
                    <div className="bg-edu-surface rounded-edu-card w-full max-w-md shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
                        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-edu-control flex items-center justify-center ${decision.tipo === "Aceptada" ? "bg-edu-success-bg" : "bg-edu-danger-bg"}`}>
                                    {decision.tipo === "Aceptada" ? <CheckCircle2 className="w-4 h-4 text-edu-success" /> : <XCircle className="w-4 h-4 text-edu-danger" />}
                                </div>
                                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">
                                    {decision.tipo === "Aceptada" ? "Aceptar discusión" : "Rechazar discusión"}
                                </h3>
                            </div>
                            <button onClick={() => setDecision(null)} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-5 flex flex-col gap-4">
                            <div className="px-3.5 py-2.5 rounded-edu-control bg-edu-subtle border border-edu-border-soft text-[0.8125rem] text-edu-ink-700">
                                <strong>{decision.post.estudiante}</strong> · {decision.post.materia} · {decision.post.anio} — Nota actual: {decision.post.nota}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-edu-ink-700 text-sm font-medium">Observación del Concejo</label>
                                <textarea
                                    rows={4}
                                    value={obs}
                                    onChange={(e) => setObs(e.target.value)}
                                    placeholder="Fundamenta la decisión del Concejo de Profesores…"
                                    className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full resize-none focus:border-edu-primary"
                                />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button type="button" onClick={() => setDecision(null)} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle">
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmar}
                                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold border-none cursor-pointer transition-opacity hover:opacity-90 ${decision.tipo === "Aceptada" ? "bg-edu-success" : "bg-edu-danger"}`}
                                >
                                    {decision.tipo === "Aceptada" ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
