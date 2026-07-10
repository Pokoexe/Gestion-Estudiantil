import { ShieldAlert, X, FileText, GraduationCap, UserSquare2 } from "lucide-react";
import { accent } from "@themes/tokens";
import type { TipoPersona, Gravedad } from "@shared/services/actions/coordinador";

interface RegistrarIncidenciaModalProps {
    form: {
        persona: string;
        tipo: TipoPersona;
        gravedad: Gravedad;
        descripcion: string;
    };
    setForm: (f: { persona: string; tipo: TipoPersona; gravedad: Gravedad; descripcion: string }) => void;
    gravedades: Gravedad[];
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
}

export function RegistrarIncidenciaModal({ form, setForm, gravedades, onSubmit, onClose }: RegistrarIncidenciaModalProps) {
    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-edu-surface rounded-edu-card w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
                <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: accent.purple.bg }}>
                            <ShieldAlert style={{ width: 16, height: 16, color: accent.purple.fg }} />
                        </div>
                        <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Registrar incidencia</h3>
                    </div>
                    <button onClick={onClose} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <form onSubmit={onSubmit} className="p-5 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-edu-ink-700 text-sm font-medium">Tipo de persona</label>
                        <div className="flex gap-2">
                            {(["Estudiante", "Docente"] as TipoPersona[]).map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setForm({ ...form, tipo: t })}
                                    className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-edu-control text-[0.8125rem] font-semibold cursor-pointer transition-colors border ${form.tipo === t ? "text-white border-transparent" : "bg-edu-surface text-edu-ink-700 border-edu-border hover:bg-edu-subtle"
                                        }`}
                                    style={form.tipo === t ? { backgroundColor: accent.purple.fg } : undefined}
                                >
                                    {t === "Docente" ? <UserSquare2 style={{ width: 15, height: 15 }} /> : <GraduationCap style={{ width: 15, height: 15 }} />}
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-edu-ink-700 text-sm font-medium">Nombre de la persona</label>
                        <input type="text" value={form.persona} onChange={(e) => setForm({ ...form, persona: e.target.value })} placeholder="Nombre y apellido" required className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-edu-ink-700 text-sm font-medium">Gravedad</label>
                        <select value={form.gravedad} onChange={(e) => setForm({ ...form, gravedad: e.target.value as Gravedad })} className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-edu-primary">
                            {gravedades.map((g) => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-edu-ink-700 text-sm font-medium">Descripción del hecho</label>
                        <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} rows={3} required placeholder="Describe lo ocurrido…" className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full resize-none focus:border-edu-primary" />
                    </div>
                    <div className="flex gap-2 justify-end pt-1">
                        <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer hover:bg-edu-subtle">Cancelar</button>
                        <button type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold border-none cursor-pointer" style={{ backgroundColor: accent.purple.fg }}>
                            <FileText className="w-4 h-4" />
                            Registrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
