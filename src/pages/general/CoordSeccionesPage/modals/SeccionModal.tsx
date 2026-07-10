import { Layers, X, UserCog } from "lucide-react";
import { accent } from "@themes/tokens";

interface SecModalState {
    mode: "add" | "edit";
    id: number | null;
    anio: string;
    seccion: string;
    cupo: string;
    tutor: string;
}

interface Props {
    secModal: SecModalState;
    anios: string[];
    DOCENTES: string[];
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
    onChange: (updated: SecModalState) => void;
}

export function SeccionModal({ secModal, anios, DOCENTES, onSubmit, onClose, onChange }: Props) {
    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-edu-surface rounded-edu-card w-full max-w-md shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
                <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: accent.purple.bg }}>
                            <Layers style={{ width: 16, height: 16, color: accent.purple.fg }} />
                        </div>
                        <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">{secModal.mode === "add" ? "Agregar sección" : "Modificar sección"}</h3>
                    </div>
                    <button onClick={onClose} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <form onSubmit={onSubmit} className="p-5 flex flex-col gap-4">
                    <div className="flex gap-3">
                        <div className="flex flex-col gap-1.5 flex-1">
                            <label className="text-edu-ink-700 text-sm font-medium">Año</label>
                            <select value={secModal.anio} onChange={(e) => onChange({ ...secModal, anio: e.target.value })} className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-edu-primary">
                                {anios.map((a) => <option key={a} value={a}>{a}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5 w-24">
                            <label className="text-edu-ink-700 text-sm font-medium">Sección</label>
                            <input type="text" maxLength={2} value={secModal.seccion} onChange={(e) => onChange({ ...secModal, seccion: e.target.value })} className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full uppercase focus:border-edu-primary" />
                        </div>
                        <div className="flex flex-col gap-1.5 w-24">
                            <label className="text-edu-ink-700 text-sm font-medium">Cupo</label>
                            <input type="number" min={1} value={secModal.cupo} onChange={(e) => onChange({ ...secModal, cupo: e.target.value })} className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-edu-ink-700 text-sm font-medium">Tutor asignado</label>
                        <select value={secModal.tutor} onChange={(e) => onChange({ ...secModal, tutor: e.target.value })} className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-edu-primary">
                            {DOCENTES.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div className="flex gap-2 justify-end pt-1">
                        <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer hover:bg-edu-subtle">Cancelar</button>
                        <button type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold border-none cursor-pointer" style={{ backgroundColor: accent.purple.fg }}>
                            <UserCog className="w-4 h-4" />
                            {secModal.mode === "add" ? "Agregar" : "Guardar cambios"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
