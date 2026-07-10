import { Bell, ChevronRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Props                                                               */
/* ------------------------------------------------------------------ */

interface DiscusionActivaBannerProps {
    activa: {
        id: string | number;
        estudiante: string;
        materia: string;
        anio: string | number;
    };
    onNavigate: (id: string | number) => void;
}

/* ------------------------------------------------------------------ */
/* Componente                                                          */
/* ------------------------------------------------------------------ */

export function DiscusionActivaBanner({ activa, onNavigate }: DiscusionActivaBannerProps) {
    return (
        /* Notificación: hay una discusión de notas en curso (clic → detalle) */
        <button
            type="button"
            onClick={() => onNavigate(activa.id)}
            className="w-full text-left flex items-center gap-3.5 px-4 py-4 rounded-edu-card bg-edu-primary-50 border border-edu-primary-200 cursor-pointer transition-colors hover:bg-edu-primary-100"
        >
            <div className="relative w-11 h-11 rounded-edu-control bg-edu-primary flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-edu-danger-strong border-2 border-edu-primary-50" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="m-0 text-[0.95rem] font-bold text-edu-ink">Tienes una discusión de notas en curso</p>
                <p className="m-0 text-[0.8125rem] text-edu-ink-700 mt-0.5 truncate">
                    {activa.estudiante} · {activa.materia} · {activa.anio} — toca para revisar y decidir.
                </p>
            </div>
            <ChevronRight className="w-5 h-5 text-edu-primary shrink-0" />
        </button>
    );
}
