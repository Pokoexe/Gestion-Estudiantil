import { CalendarClock, X, Bell, UserCog } from "lucide-react";
import { accent } from "@themes/tokens";
import type { ReunionConvocados } from "@shared/services/actions/coordinador";

type Convocados = ReunionConvocados;

interface Form {
    tema: string;
    fecha: string;
    hora: string;
    convocados: Convocados;
    aviso: boolean;
    observaciones: string;
}

interface CrearReunionModalProps {
    form: Form;
    setForm: React.Dispatch<React.SetStateAction<Form>>;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
}

export function CrearReunionModal({ form, setForm, onSubmit, onClose }: CrearReunionModalProps) {
    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-edu-surface rounded-edu-card w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
                <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: accent.purple.bg }}>
                            <CalendarClock style={{ width: 16, height: 16, color: accent.purple.fg }} />
                        </div>
                        <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Crear reunión</h3>
                    </div>
                    <button onClick={onClose} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <form onSubmit={onSubmit} className="p-5 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-edu-ink-700 text-sm font-medium">Tema de la reunión</label>
                        <input
                            type="text"
                            value={form.tema}
                            onChange={(e) => setForm({ ...form, tema: e.target.value })}
                            placeholder="Ej. Cierre del segundo lapso"
                            required
                            className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary"
                        />
                    </div>
                    <div className="flex gap-3">
                        <div className="flex flex-col gap-1.5 flex-1">
                            <label className="text-edu-ink-700 text-sm font-medium">Fecha</label>
                            <input type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} required className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary" />
                        </div>
                        <div className="flex flex-col gap-1.5 flex-1">
                            <label className="text-edu-ink-700 text-sm font-medium">Hora</label>
                            <input type="time" value={form.hora} onChange={(e) => setForm({ ...form, hora: e.target.value })} required className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-edu-ink-700 text-sm font-medium">A quién se convoca</label>
                        <select value={form.convocados} onChange={(e) => setForm({ ...form, convocados: e.target.value as Convocados })} className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-edu-primary">
                            <option value="Docentes">Docentes</option>
                            <option value="Representantes">Representantes</option>
                            <option value="Ambos">Docentes y representantes</option>
                        </select>
                    </div>
                    <label className="flex items-center justify-between gap-3 px-3.5 py-3 rounded-edu-control bg-edu-subtle cursor-pointer">
                        <span className="flex items-center gap-2 text-[0.8125rem] text-edu-ink-700 font-medium">
                            <Bell className="w-4 h-4 text-edu-primary" />
                            Avisar por notificación
                        </span>
                        <input type="checkbox" checked={form.aviso} onChange={(e) => setForm({ ...form, aviso: e.target.checked })} className="w-4 h-4 cursor-pointer accent-edu-primary" />
                    </label>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-edu-ink-700 text-sm font-medium">Observaciones</label>
                        <textarea value={form.observaciones} onChange={(e) => setForm({ ...form, observaciones: e.target.value })} rows={3} placeholder="Notas para los convocados (opcional)" className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full resize-none focus:border-edu-primary" />
                    </div>
                    <div className="flex gap-2 justify-end pt-1">
                        <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer hover:bg-edu-subtle">Cancelar</button>
                        <button type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold border-none cursor-pointer" style={{ backgroundColor: accent.purple.fg }}>
                            <UserCog className="w-4 h-4" />
                            Convocar reunión
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
