import { User, Gavel } from "lucide-react";
import { promedio } from "@shared/services/data/boletines";

interface Boletin {
    student: string;
    notas: number[];
}

interface Post {
    estudiante: string;
    materia: string;
    anio: string;
}

interface EstudianteHeaderProps {
    post: Post;
    boletin: Boletin | undefined;
}

export function EstudianteHeader({ post, boletin }: EstudianteHeaderProps) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex items-center gap-4 flex-wrap md:flex-nowrap">
            {/* Avatar / Icono */}
            <div className="w-14 h-14 rounded-full bg-edu-primary-100 flex items-center justify-center shrink-0">
                <User className="w-7 h-7 text-edu-primary" />
            </div>

            {/* Información Principal */}
            <div className="flex-1 min-w-0">
                <h2 className="text-edu-ink text-[1.35rem] font-bold m-0 leading-tight">{post.estudiante}</h2>
                <div className="flex items-center gap-2 flex-wrap mt-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-edu-chip text-[0.75rem] font-semibold bg-edu-primary-50 text-edu-primary">
                        <Gavel className="w-3.5 h-3.5" />
                        {post.materia}
                    </span>

                    {/* Año y sección: VERSIÓN ESCRITORIO (Se oculta en móviles) */}
                    <span className="hidden md:inline-flex text-[0.85rem] text-edu-ink-500">
                        Año y sección: <span className="text-edu-ink-700 font-medium">{post.anio}</span>
                    </span>
                </div>
            </div>

            {/* Año y sección: VERSIÓN MÓVIL (Toma el lugar del promedio arriba a la derecha) */}
            <div className="md:hidden text-right shrink-0">
                <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Año y sección</div>
                <div className="text-[1.15rem] font-bold text-edu-ink-700 mt-0.5">{post.anio}</div>
            </div>

            {boletin && (
                < div className="w-full md:w-auto flex md:block justify-between items-center md:text-right shrink-0 mt-3 md:mt-0 pt-3 md:pt-0 border-t border-edu-border-soft md:border-t-0">
                    <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Promedio general</div>
                    <div className={`text-[1.6rem] font-bold leading-none md:mt-1 ${promedio(boletin.notas) >= 10 ? "text-edu-success" : "text-edu-danger"}`}>
                        {promedio(boletin.notas).toFixed(2)}
                    </div>
                </div>
            )}
        </div>
    );
}
