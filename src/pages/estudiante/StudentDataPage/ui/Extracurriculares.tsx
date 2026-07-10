import { Star, Book } from "lucide-react";
import type { Actividad } from "@shared/services/actions/estudiante";

interface ExtracurricularesProps {
    actividades: Actividad[];
}

/** Cursos y actividades extracurriculares (máx. 5 ítems c/u). */
export function Extracurriculares({ actividades }: ExtracurricularesProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cursos extracurriculares */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
                <div className="px-5 py-3.5 border-b border-edu-border-soft flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Book className="w-4 h-4 text-edu-success" />
                        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Cursos extracurriculares</h3>
                    </div>
                    <span className="text-[0.72rem] text-edu-ink-400 font-medium">{actividades.length} participaciones</span>
                </div>
                <div className="flex flex-col">
                    {actividades.map((a, i) => (
                        <div
                            key={a.id}
                            className={`px-5 py-2.5 flex items-center gap-3 ${i < actividades.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                        >
                            <div className="w-7 h-7 rounded-edu-chip bg-edu-primary-50 flex items-center justify-center shrink-0">
                                <Book className="w-3.5 h-3.5 text-edu-success" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-[0.85rem] font-medium text-edu-ink truncate">{a.name}</div>
                                <div className="text-[0.75rem] text-edu-ink-400 truncate">{a.detail}</div>
                            </div>
                            <span className="text-[0.72rem] text-edu-ink-400 shrink-0">{a.date}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actividades extracurriculares */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
                <div className="px-5 py-3.5 border-b border-edu-border-soft flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-edu-primary" />
                        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Actividades extracurriculares</h3>
                    </div>
                    <span className="text-[0.72rem] text-edu-ink-400 font-medium">{actividades.length} participaciones</span>
                </div>
                <div className="flex flex-col">
                    {actividades.map((a, i) => (
                        <div
                            key={a.id}
                            className={`px-5 py-2.5 flex items-center gap-3 ${i < actividades.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                        >
                            <div className="w-7 h-7 rounded-edu-chip bg-edu-primary-50 flex items-center justify-center shrink-0">
                                <Star className="w-3.5 h-3.5 text-edu-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-[0.85rem] font-medium text-edu-ink truncate">{a.name}</div>
                                <div className="text-[0.75rem] text-edu-ink-400 truncate">{a.detail}</div>
                            </div>
                            <span className="text-[0.72rem] text-edu-ink-400 shrink-0">{a.date}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
