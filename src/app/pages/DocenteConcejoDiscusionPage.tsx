import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
    ArrowLeft,
    User,
    Gavel,
    Award,
    FileSpreadsheet,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Info,
    MessageSquare,
} from "lucide-react";
import { POSTULACIONES, decidirPostulacion, type PostEstado } from "../data/discusiones";
import { BOLETINES, MATERIAS, desglose, notaColor, promedio } from "../data/boletines";

const ESTADO_META: Record<PostEstado, string> = {
    Pendiente: "bg-edu-warning-bg text-edu-warning",
    Aceptada: "bg-edu-success-bg text-edu-success",
    Rechazada: "bg-edu-danger-bg text-edu-danger",
};

const EVAL_COLS = "grid-cols-[2fr_1fr_0.7fr_0.7fr]";

/* ------------------------------------------------------------------ */
/* Página de detalle: revisión de una discusión de notas (Concejo)     */
/* ------------------------------------------------------------------ */

export function DocenteConcejoDiscusionPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const post = POSTULACIONES.find((p) => String(p.id) === id);

    const [obs, setObs] = useState(post?.observacion ?? "");
    // Materia cuyas notas se están VISUALIZANDO (no necesariamente la que se discute).
    const [viewMateria, setViewMateria] = useState(post?.materia ?? MATERIAS[0]);
    const [confirm, setConfirm] = useState<"Aceptada" | "Rechazada" | null>(null);

    const volver = () => navigate("/docente/concejo");

    if (!post) {
        return (
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-12 text-center">
                <p className="text-edu-ink-500 text-sm m-0">No se encontró la discusión solicitada.</p>
                <button
                    onClick={volver}
                    className="inline-flex items-center gap-1.5 mt-4 text-[0.8125rem] font-semibold cursor-pointer bg-transparent border-none text-edu-primary"
                >
                    <ArrowLeft className="w-4 h-4" /> Volver al Concejo
                </button>
            </div>
        );
    }

    const boletin = BOLETINES.find((b) => b.student === post.estudiante);
    const pendiente = post.estado === "Pendiente";

    // Materias disponibles en el selector (garantiza incluir la materia en discusión).
    const materias = MATERIAS.includes(post.materia) ? MATERIAS : [post.materia, ...MATERIAS];

    // Nota final de una materia: del boletín si existe; si no, la de la postulación.
    const notaFinalDe = (m: string): number => {
        const idx = MATERIAS.indexOf(m);
        if (boletin && idx >= 0) return boletin.notas[idx];
        return post.nota;
    };

    const viewNota = notaFinalDe(viewMateria);
    const viewEvals = desglose(viewNota);
    const viendoDiscusion = viewMateria === post.materia;

    const confirmarDecision = () => {
        if (!confirm) return;
        decidirPostulacion(post.id, confirm, obs);
        setConfirm(null);
        volver();
    };

    return (
        <div className="flex flex-col gap-5">
            {/* Barra superior */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <button
                    onClick={volver}
                    className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-edu-ink-500 hover:text-edu-ink-700 bg-transparent border-none cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" /> Volver al Concejo
                </button>
                <span className={`inline-flex items-center justify-center px-3 py-1 rounded-edu-pill text-[0.8rem] font-semibold ${ESTADO_META[post.estado]}`}>
                    {post.estado}
                </span>
            </div>

            {/* Cabecera: nombre del estudiante + materia / año / sección */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex items-center gap-4 flex-wrap">
                <div className="w-14 h-14 rounded-full bg-edu-primary-100 flex items-center justify-center shrink-0">
                    <User className="w-7 h-7 text-edu-primary" />
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="text-edu-ink text-[1.35rem] font-bold m-0 leading-tight">{post.estudiante}</h2>
                    <div className="flex items-center gap-2 flex-wrap mt-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-edu-chip text-[0.75rem] font-semibold bg-edu-primary-50 text-edu-primary">
                            <Gavel className="w-3.5 h-3.5" />
                            {post.materia}
                        </span>
                        <span className="text-[0.85rem] text-edu-ink-500">
                            Año y sección: <span className="text-edu-ink-700 font-medium">{post.anio}</span>
                        </span>
                    </div>
                </div>
                {boletin && (
                    <div className="text-right shrink-0">
                        <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Promedio general</div>
                        <div className={`text-[1.6rem] font-bold leading-none mt-1 ${promedio(boletin.notas) >= 10 ? "text-edu-success" : "text-edu-danger"}`}>
                            {promedio(boletin.notas).toFixed(2)}
                        </div>
                    </div>
                )}
            </div>

            {/* Dos columnas: izquierda (motivo + actividades) · derecha (observación + notas) */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.25fr] gap-5 items-start">
                {/* ---------------- Columna izquierda ---------------- */}
                <div className="flex flex-col gap-5">
                    {/* Motivo de la postulación */}
                    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                        <div className="px-5 py-4 border-b border-edu-border-soft flex items-center gap-2">
                            <div className="w-8 h-8 rounded-edu-control bg-edu-primary-50 flex items-center justify-center">
                                <Gavel className="w-4 h-4 text-edu-primary" />
                            </div>
                            <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Caso en discusión</h3>
                        </div>
                        <div className="p-5 flex flex-col gap-3">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[0.8125rem] text-edu-ink-500">Materia:</span>
                                <span className="text-[0.875rem] text-edu-ink font-semibold">{post.materia}</span>
                                <span className="inline-flex items-center px-2 py-[2px] rounded-edu-chip text-[0.72rem] font-semibold bg-edu-danger-bg text-edu-danger">
                                    Nota actual: {post.nota}
                                </span>
                            </div>
                            <div>
                                <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium mb-1">Justificación del evaluador</div>
                                <p className="text-[0.875rem] text-edu-ink-700 leading-[1.55] m-0">{post.motivo}</p>
                            </div>
                        </div>
                    </div>

                    {/* Actividades extracurriculares (abajo a la izquierda) */}
                    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                        <div className="px-5 py-4 border-b border-edu-border-soft flex items-center gap-2">
                            <div className="w-8 h-8 rounded-edu-control bg-edu-primary-50 flex items-center justify-center">
                                <Award className="w-4 h-4 text-edu-primary" />
                            </div>
                            <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Actividades extracurriculares</h3>
                        </div>
                        <div className="p-5">
                            {post.actividades.length > 0 ? (
                                <div className="flex flex-col gap-2">
                                    {post.actividades.map((a) => (
                                        <div key={a} className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-edu-control bg-edu-subtle border border-edu-border-soft">
                                            <Award className="w-4 h-4 text-edu-primary shrink-0" />
                                            <span className="text-[0.8125rem] text-edu-ink-700 font-medium">{a}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-[0.8125rem] text-edu-ink-400 m-0">Sin actividades extracurriculares registradas.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* ---------------- Columna derecha ---------------- */}
                <div className="flex flex-col gap-5">

                    {/* Notas de la materia + selector de materia */}
                    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                        <div className="px-5 py-4 border-b border-edu-border-soft flex items-center justify-between gap-3 flex-wrap">
                            <div className="flex items-center gap-2">
                                <FileSpreadsheet className="w-4 h-4 text-edu-ink-400" />
                                <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Notas de la materia</h3>
                            </div>
                            <select
                                value={viewMateria}
                                onChange={(e) => setViewMateria(e.target.value)}
                                className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-1.5 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
                            >
                                {materias.map((m) => (
                                    <option key={m} value={m}>
                                        {m === post.materia ? `${m} (en discusión)` : m}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Aviso: la decisión afecta SIEMPRE a la materia en discusión */}
                        <div className="mx-5 mt-4 flex items-start gap-2 px-3.5 py-2.5 rounded-edu-control bg-edu-warning-bg text-edu-warning">
                            <Info className="w-4 h-4 shrink-0 mt-px" />
                            <p className="m-0 text-[0.78rem] leading-[1.45]">
                                Aceptar o rechazar modifica únicamente la nota de <strong>{post.materia}</strong>.
                                {" "}Este selector solo cambia las notas que estás visualizando
                                {viendoDiscusion ? "." : <> — ahora ves <strong>{viewMateria}</strong>, no la materia en discusión.</>}
                            </p>
                        </div>

                        {/* Nota definitiva de la materia visualizada */}
                        <div className="px-5 pt-4 pb-3 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-[0.875rem] text-edu-ink font-semibold">{viewMateria}</span>
                                {viendoDiscusion && (
                                    <span className="inline-flex items-center px-2 py-[2px] rounded-edu-pill text-[0.65rem] font-semibold bg-edu-warning-bg text-edu-warning">En discusión</span>
                                )}
                            </div>
                            <span className="text-[0.8125rem] text-edu-ink-500">
                                Definitiva: <strong className={`text-[0.95rem] ${notaColor(viewNota)}`}>{viewNota}</strong>
                                <span className="text-edu-ink-400"> / 20</span>
                            </span>
                        </div>

                        {/* Desglose de evaluaciones */}
                        <div className={`grid ${EVAL_COLS} px-5 py-2.5 bg-edu-subtle border-y border-edu-border-soft`}>
                            {["Evaluación", "Tipo", "%", "Nota"].map((h, j) => (
                                <span key={h} className={`text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em] ${j >= 2 ? "text-right" : ""}`}>{h}</span>
                            ))}
                        </div>
                        {viewEvals.map((e, j) => (
                            <div key={j} className={`grid ${EVAL_COLS} px-5 py-[11px] items-center ${j < viewEvals.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
                                <span className="text-[0.875rem] text-edu-ink font-medium">{e.nombre}</span>
                                <span className="text-[0.8125rem] text-edu-ink-700">{e.tipo}</span>
                                <span className="text-[0.8125rem] text-edu-ink-500 text-right">{e.porcentaje}%</span>
                                <span className={`text-[0.9rem] font-bold text-right ${notaColor(e.nota)}`}>{e.nota}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Dos botones grandes: aceptar o rechazar (con confirmación) */}
            {pendiente ? (
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => setConfirm("Aceptada")}
                        className="inline-flex items-center justify-center gap-2.5 py-4 rounded-edu-card bg-edu-success text-white text-[0.95rem] font-bold border-none cursor-pointer transition-opacity hover:opacity-90 shadow-[0_2px_8px_rgba(22,163,74,0.25)]"
                    >
                        <CheckCircle2 className="w-5 h-5" />
                        Aceptar discusión
                    </button>
                    <button
                        type="button"
                        onClick={() => setConfirm("Rechazada")}
                        className="inline-flex items-center justify-center gap-2.5 py-4 rounded-edu-card bg-edu-danger text-white text-[0.95rem] font-bold border-none cursor-pointer transition-opacity hover:opacity-90 shadow-[0_2px_8px_rgba(220,38,38,0.25)]"
                    >
                        <XCircle className="w-5 h-5" />
                        Rechazar discusión
                    </button>
                </div>
            ) : (
                <div className={`flex items-center gap-2.5 px-5 py-4 rounded-edu-card text-sm font-semibold ${post.estado === "Aceptada" ? "bg-edu-success-bg text-edu-success" : "bg-edu-danger-bg text-edu-danger"}`}>
                    {post.estado === "Aceptada" ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    Esta discusión ya fue {post.estado === "Aceptada" ? "aceptada" : "rechazada"} por el Concejo.
                </div>
            )}

            {/* Modal de confirmación */}
            {confirm && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setConfirm(null)}>
                    <div className="bg-edu-surface rounded-edu-card w-full max-w-md shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
                        <div className="px-5 py-4 border-b border-edu-border-soft flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-edu-control flex items-center justify-center ${confirm === "Aceptada" ? "bg-edu-success-bg" : "bg-edu-danger-bg"}`}>
                                {confirm === "Aceptada" ? <CheckCircle2 className="w-4 h-4 text-edu-success" /> : <XCircle className="w-4 h-4 text-edu-danger" />}
                            </div>
                            <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">
                                {confirm === "Aceptada" ? "Aceptar discusión" : "Rechazar discusión"}
                            </h3>
                        </div>
                        <div className="p-5 flex flex-col gap-3.5">
                            <div className="px-3.5 py-2.5 rounded-edu-control bg-edu-subtle border border-edu-border-soft text-[0.8125rem] text-edu-ink-700">
                                <strong>{post.estudiante}</strong> · {post.materia} · {post.anio} — Nota actual: {post.nota}
                            </div>
                            <div className="flex items-start gap-2 px-3.5 py-2.5 rounded-edu-control bg-edu-warning-bg text-edu-warning">
                                <AlertTriangle className="w-4 h-4 shrink-0 mt-px" />
                                <p className="m-0 text-[0.78rem] leading-[1.45]">
                                    La decisión modifica la nota de <strong>{post.materia}</strong>, no la materia que estás visualizando.
                                </p>
                            </div>
                            {obs.trim() ? (
                                <div>
                                    <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium mb-1">Observación</div>
                                    <p className="text-[0.8125rem] text-edu-ink-700 leading-[1.5] m-0">{obs.trim()}</p>
                                </div>
                            ) : (
                                <p className="text-[0.8rem] text-edu-ink-400 m-0">No registraste una observación; se guardará una nota estándar del Concejo.</p>
                            )}
                            <p className="text-[0.8125rem] text-edu-ink-500 m-0">
                                ¿Confirmas {confirm === "Aceptada" ? "aceptar" : "rechazar"} esta discusión? Esta acción quedará registrada.
                            </p>
                        </div>
                        <div className="px-5 py-3.5 border-t border-edu-border-soft flex gap-2 justify-end">
                            <button
                                type="button"
                                onClick={() => setConfirm(null)}
                                className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={confirmarDecision}
                                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold border-none cursor-pointer transition-opacity hover:opacity-90 ${confirm === "Aceptada" ? "bg-edu-success" : "bg-edu-danger"}`}
                            >
                                {confirm === "Aceptada" ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
