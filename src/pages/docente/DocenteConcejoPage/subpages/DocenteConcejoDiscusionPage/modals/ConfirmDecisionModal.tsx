import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface Post {
    estudiante: string;
    materia: string;
    anio: string;
    nota: number;
}

interface ConfirmDecisionModalProps {
    confirm: "Aceptada" | "Rechazada";
    post: Post;
    obs: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDecisionModal({ confirm, post, obs, onConfirm, onCancel }: ConfirmDecisionModalProps) {
    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onCancel}>
            <div className="bg-edu-surface rounded-edu-card w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
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
                        onClick={onCancel}
                        className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold border-none cursor-pointer transition-opacity hover:opacity-90 ${confirm === "Aceptada" ? "bg-edu-success" : "bg-edu-danger"}`}
                    >
                        {confirm === "Aceptada" ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}
