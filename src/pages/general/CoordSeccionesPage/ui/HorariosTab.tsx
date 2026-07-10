import { Plus, Trash2 } from "lucide-react";
import { accent } from "@themes/tokens";
import type { Bloque } from "@shared/services/actions/coordinador";

interface Props {
    bloques: Bloque[];
    nuevoBloque: { inicio: string; fin: string };
    setNuevoBloque: (v: { inicio: string; fin: string }) => void;
    asignaciones: Record<string, string>;
    DIAS: string[];
    DOCENTES: string[];
    agregarBloque: (e: React.FormEvent) => void;
    eliminarBloque: (id: number) => void;
    setAsignacion: (bloqueId: number, dia: string, docente: string) => void;
}

export function HorariosTab({
    bloques,
    nuevoBloque,
    setNuevoBloque,
    asignaciones,
    DIAS,
    DOCENTES,
    agregarBloque,
    eliminarBloque,
    setAsignacion,
}: Props) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Formato de horarios</h3>
                <span className="text-[0.8rem] text-edu-ink-400 font-medium">{bloques.length} bloques</span>
            </div>
            <div className="px-5 py-4 flex flex-col gap-4">
                {/* Crear separación (bloque horario) */}
                <div>
                    <p className="m-0 mb-2 text-[0.8125rem] text-edu-ink-500">Crea la separación de horas y asigna un docente a cada bloque por día.</p>
                    <form onSubmit={agregarBloque} className="grid grid-cols-2 md:grid-cols-3 items-end gap-4 flex-wrap">
                        <div className="flex flex-col gap-1">
                            <label className="text-[0.7rem] text-edu-ink-400 uppercase tracking-[0.04em] font-semibold">Inicio</label>
                            <input type="time" value={nuevoBloque.inicio} onChange={(e) => setNuevoBloque({ ...nuevoBloque, inicio: e.target.value })} className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-edu-ink outline-none bg-edu-subtle text-[0.875rem] focus:border-edu-primary" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[0.7rem] text-edu-ink-400 uppercase tracking-[0.04em] font-semibold">Fin</label>
                            <input type="time" value={nuevoBloque.fin} onChange={(e) => setNuevoBloque({ ...nuevoBloque, fin: e.target.value })} className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-edu-ink outline-none bg-edu-subtle text-[0.875rem] focus:border-edu-primary" />
                        </div>
                        <button type="submit" className="col-span-2 md:col-span-1 justify-center inline-flex items-center gap-1.5 px-4 py-2 rounded-edu-control text-sm font-semibold cursor-pointer border-none text-white" style={{ backgroundColor: accent.purple.fg }}>
                            <Plus style={{ width: 15, height: 15 }} /> Crear separación
                        </button>
                    </form>
                </div>

                {/* Rejilla de horario */}
                <div className="overflow-x-auto">
                    <div className="min-w-[720px] border border-edu-border-soft rounded-edu-control overflow-hidden">
                        {/* Cabecera de días */}
                        <div className="grid grid-cols-[110px_repeat(5,1fr)] bg-edu-subtle border-b border-edu-border-soft">
                            <span className="px-3 py-2.5 text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">Hora</span>
                            {DIAS.map((d) => (
                                <span key={d} className="px-3 py-2.5 text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em] border-l border-edu-border-soft">{d}</span>
                            ))}
                        </div>
                        {/* Filas por bloque */}
                        {bloques.map((b, i) => (
                            <div key={b.id} className={`grid grid-cols-[110px_repeat(5,1fr)] ${i < bloques.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
                                <div className="px-3 py-2 flex items-center justify-between gap-1">
                                    <span className="text-[0.75rem] text-edu-ink font-semibold">{b.inicio}–{b.fin}</span>
                                    <button onClick={() => eliminarBloque(b.id)} aria-label="Eliminar bloque" className="text-edu-ink-300 hover:text-edu-danger bg-transparent border-none cursor-pointer p-0 flex items-center">
                                        <Trash2 style={{ width: 13, height: 13 }} />
                                    </button>
                                </div>
                                {DIAS.map((d) => {
                                    const key = `${b.id}-${d}`;
                                    return (
                                        <div key={d} className="px-1.5 py-1.5 border-l border-edu-border-soft">
                                            <select
                                                value={asignaciones[key] ?? "Sin asignar"}
                                                onChange={(e) => setAsignacion(b.id, d, e.target.value)}
                                                className="w-full border border-edu-border rounded-edu-chip px-1.5 py-1 text-[0.72rem] text-edu-ink-700 outline-none bg-edu-surface cursor-pointer focus:border-edu-primary"
                                            >
                                                {DOCENTES.map((doc) => (
                                                    <option key={doc} value={doc}>{doc.replace("Prof. ", "")}</option>
                                                ))}
                                            </select>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
