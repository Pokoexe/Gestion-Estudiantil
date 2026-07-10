import { CheckCircle2, XCircle } from "lucide-react";
import type { PostEstado } from "@shared/services/actions/discusiones";

interface Post {
    estado: PostEstado;
}

interface DecisionButtonsProps {
    post: Post;
    pendiente: boolean;
    onAceptar: () => void;
    onRechazar: () => void;
}

export function DecisionButtons({ post, pendiente, onAceptar, onRechazar }: DecisionButtonsProps) {
    return (
        <>
            {pendiente ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={onAceptar}
                        className="inline-flex items-center justify-center gap-2.5 py-4 rounded-edu-card bg-edu-success text-white text-[0.95rem] font-bold border-none cursor-pointer transition-opacity hover:opacity-90 shadow-[0_2px_8px_rgba(22,163,74,0.25)]"
                    >
                        <CheckCircle2 className="w-5 h-5" />
                        Aceptar discusión
                    </button>
                    <button
                        type="button"
                        onClick={onRechazar}
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
        </>
    );
}
