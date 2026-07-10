import { BookOpen, ArrowLeft } from "lucide-react";
import type { Seccion } from "../interfaces";

interface Props {
    selected: Seccion;
    onBack: () => void;
}

export function SeccionBanner({ selected, onBack }: Props) {
    return (
        <>
            {/* Volver */}
            <button
                onClick={onBack}
                className="inline-flex items-center gap-1.5 text-edu-ink-500 text-sm font-medium bg-transparent border-none cursor-pointer w-fit hover:text-edu-primary transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Volver a secciones
            </button>

            {/* Banner de la sección (estilo CoursePage) */}
            <div className="bg-edu-primary rounded-edu-card px-6 py-[22px] flex justify-between items-center flex-wrap gap-3">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <BookOpen style={{ width: "16px", height: "16px", color: "rgba(255,255,255,0.8)" }} />
                        <span className="text-xs text-[rgba(255,255,255,0.75)] font-medium uppercase tracking-[0.06em]">
                            Sección · Ciclo escolar 2026-I
                        </span>
                    </div>
                    <h2 className="text-white mb-1.5 text-xl font-bold m-0">{selected.subject}</h2>
                    <div className="flex gap-4 flex-wrap">
                        <span className="text-[0.8rem] text-[rgba(255,255,255,0.75)]">{selected.grade}</span>
                        <span className="text-[0.8rem] text-[rgba(255,255,255,0.75)]">{selected.students} estudiantes</span>
                    </div>
                </div>
            </div>
        </>
    );
}
