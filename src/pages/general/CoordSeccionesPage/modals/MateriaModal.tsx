import { BookOpen, X } from "lucide-react";
import { accent } from "@themes/tokens";
import type { Nivel } from "@shared/services/actions/coordinador";

interface MatModalState {
    mode: "add" | "edit";
    id: number | null;
    nombre: string;
    nivel: Nivel;
}

interface Props {
    matModal: MatModalState;
    niveles: Nivel[];
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
    onChange: (updated: MatModalState) => void;
}

export function MateriaModal({ matModal, niveles, onSubmit, onClose, onChange }: Props) {
    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-edu-surface rounded-edu-card w-full max-w-md shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
                <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: accent.purple.bg }}>
                            <BookOpen style={{ width: 16, height: 16, color: accent.purple.fg }} />
                        </div>
                        <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">{matModal.mode === "add" ? "Agregar materia" : "Modificar materia"}</h3>
                    </div>
                    <button onClick={onClose} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <form onSubmit={onSubmit} className="p-5 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-edu-ink-700 text-sm font-medium">Nivel</label>
                        <div className="flex gap-2">
                            {niveles.map((n) => (
                                <button
                                    key={n}
                                    type="button"
                                    onClick={() => onChange({ ...matModal, nivel: n })}
                                    className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-edu-control text-[0.8125rem] font-semibold cursor-pointer transition-colors border ${matModal.nivel === n ? "text-white border-transparent" : "bg-edu-surface text-edu-ink-700 border-edu-border hover:bg-edu-subtle"}`}
                                    style={matModal.nivel === n ? { backgroundColor: accent.purple.fg } : undefined}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-edu-ink-700 text-sm font-medium">Nombre de la materia</label>
                        <input type="text" value={matModal.nombre} onChange={(e) => onChange({ ...matModal, nombre: e.target.value })} placeholder="Ej. Premilitar" required className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary" />
                    </div>
                    <div className="flex gap-2 justify-end pt-1">
                        <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer hover:bg-edu-subtle">Cancelar</button>
                        <button type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold border-none cursor-pointer" style={{ backgroundColor: accent.purple.fg }}>
                            <BookOpen className="w-4 h-4" />
                            {matModal.mode === "add" ? "Agregar" : "Guardar cambios"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
