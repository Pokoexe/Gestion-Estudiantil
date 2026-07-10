import { PlusCircle, BookOpen, ArrowLeft } from "lucide-react";

interface FormHeaderProps {
    editing: boolean;
    form: { subject: string; section: string };
    onBack: () => void;
}

export function FormHeader({ editing, form, onBack }: FormHeaderProps) {
    return (
        <>
            {/* Volver */}
            <button
                onClick={onBack}
                className="inline-flex items-center gap-1.5 text-edu-ink-500 text-sm font-medium bg-transparent border-none cursor-pointer w-fit hover:text-edu-primary transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Volver a planificación
            </button>

            {/* Encabezado */}
            {editing ? (
                /* En modificar, la materia y sección se muestran en banner azul (no editables) */
                <div className="bg-edu-primary rounded-edu-card px-6 py-[22px] flex justify-between items-center flex-wrap gap-3">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <BookOpen style={{ width: "16px", height: "16px", color: "rgba(255,255,255,0.8)" }} />
                            <span className="text-xs text-[rgba(255,255,255,0.75)] font-medium uppercase tracking-[0.06em]">
                                Modificar planificación · Ciclo escolar 2026-I
                            </span>
                        </div>
                        <h2 className="text-white mb-1.5 text-xl font-bold m-0">{form.subject}</h2>
                        <div className="flex gap-4 flex-wrap">
                            <span className="text-[0.8rem] text-[rgba(255,255,255,0.75)]">{form.section}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-edu-control bg-edu-primary-50 flex items-center justify-center shrink-0">
                        <PlusCircle className="w-5 h-5 text-edu-primary" />
                    </div>
                    <div>
                        <h2 className="m-0 text-edu-ink font-bold text-[1.25rem]">Crear planificación</h2>
                        <p className="text-edu-ink-500 text-sm mt-0.5 m-0">
                            Define las sesiones del lapso y verifica los datos antes de enviarla.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
