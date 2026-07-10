import { ArrowLeft } from "lucide-react";
import type { PostEstado } from "@shared/services/actions/discusiones";
import { ESTADO_META } from "../functions/useDocenteConcejoDiscusion";

interface DiscusionTopbarProps {
    estado: PostEstado;
    onVolver: () => void;
}

export function DiscusionTopbar({ estado, onVolver }: DiscusionTopbarProps) {
    return (
        <div className="flex items-center justify-between gap-4 flex-wrap">
            <button
                onClick={onVolver}
                className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-edu-ink-500 hover:text-edu-ink-700 bg-transparent border-none cursor-pointer"
            >
                <ArrowLeft className="w-4 h-4" /> Volver al Concejo
            </button>
            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-edu-pill text-[0.8rem] font-semibold ${ESTADO_META[estado]}`}>
                {estado}
            </span>
        </div>
    );
}
