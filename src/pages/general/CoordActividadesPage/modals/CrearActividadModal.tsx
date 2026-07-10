import { Trophy, PlusCircle, X } from "lucide-react";
import { accent } from "@themes/tokens";

interface CrearActividadModalProps {
    form: { nombre: string; lugar: string; docente: string; cupo: string };
    setForm: (f: { nombre: string; lugar: string; docente: string; cupo: string }) => void;
    DOCENTES: string[];
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
}

export function CrearActividadModal({ form, setForm, DOCENTES, onSubmit, onClose }: CrearActividadModalProps) {
    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-edu-surface rounded-edu-card w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
                <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: accent.purple.bg }}>
                            <Trophy style={{ width: 16, height: 16, color: accent.purple.fg }} />
                        </div>
                        <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Crear actividad</h3>
                    </div>
                    <button onClick={onClose} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <form onSubmit={onSubmit} className="p-5 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-edu-ink-700 text-sm font-medium">Nombre de la actividad</label>
                        <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej. Club de Ajedrez" required className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary" />
                    </div>
                    <div className="flex gap-3">
                        <div className="flex flex-col gap-1.5 flex-1">
                            <label className="text-edu-ink-700 text-sm font-medium">Lugar</label>
                            <input type="text" value={form.lugar} onChange={(e) => setForm({ ...form, lugar: e.target.value })} placeholder="Ej. Auditorio" className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary" />
                        </div>
                        <div className="flex flex-col gap-1.5 w-28">
                            <label className="text-edu-ink-700 text-sm font-medium">Cupo</label>
                            <input type="number" min={1} value={form.cupo} onChange={(e) => setForm({ ...form, cupo: e.target.value })} className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-edu-ink-700 text-sm font-medium">Docente asignado</label>
                        <select value={form.docente} onChange={(e) => setForm({ ...form, docente: e.target.value })} className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-edu-primary">
                            {DOCENTES.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div className="flex gap-2 justify-end pt-1">
                        <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer hover:bg-edu-subtle">Cancelar</button>
                        <button type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold border-none cursor-pointer" style={{ backgroundColor: accent.purple.fg }}>
                            <PlusCircle className="w-4 h-4" />
                            Crear actividad
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
