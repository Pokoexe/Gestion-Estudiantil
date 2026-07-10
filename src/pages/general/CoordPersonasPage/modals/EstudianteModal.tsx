import { GraduationCap, X, Pencil, Plus, Phone, Mail } from "lucide-react";
import { accent } from "@themes/tokens";
import type { Estudiante, RepRelacion } from "@shared/services/actions/coordinador";
import { InfoField } from "../ui/InfoField";

interface EstudianteModalProps {
    estModal: { mode: "ver" | "añadir" | "modificar"; data: Estudiante };
    setEstModal: (v: { mode: "ver" | "añadir" | "modificar"; data: Estudiante } | null) => void;
    guardarEstudiante: (e: React.FormEvent) => void;
}

export function EstudianteModal({ estModal, setEstModal, guardarEstudiante }: EstudianteModalProps) {
    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setEstModal(null)}>
            <div className="bg-edu-surface rounded-edu-card w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
                {/* Encabezado modal */}
                <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: accent.purple.bg }}>
                            <GraduationCap style={{ width: 16, height: 16, color: accent.purple.fg }} />
                        </div>
                        <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem] capitalize">
                            {estModal.mode === "ver" ? "Perfil del estudiante" : estModal.mode === "añadir" ? "Añadir estudiante" : "Modificar estudiante"}
                        </h3>
                    </div>
                    <button onClick={() => setEstModal(null)} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Modo VER — vista detalle */}
                {estModal.mode === "ver" ? (
                    <div className="p-5 flex flex-col gap-5">
                        {/* Avatar + nombre estudiante */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-edu-subtle border border-edu-border flex items-center justify-center text-sm font-bold text-edu-ink-500 shrink-0">
                                {estModal.data.nombre.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                            </div>
                            <div>
                                <div className="text-[0.95rem] text-edu-ink font-bold">{estModal.data.nombre}</div>
                                <div className="text-[0.8rem] text-edu-ink-500">{estModal.data.grado}</div>
                            </div>
                        </div>

                        {/* Datos del estudiante */}
                        <div>
                            <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-semibold mb-2">Datos del estudiante</div>
                            <div className="rounded-edu-control border border-edu-border-soft p-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                                <InfoField label="Cédula" value={estModal.data.cedula} />
                                <InfoField label="Año / Sección" value={estModal.data.grado} />
                                <InfoField label="Fecha de nacimiento" value={estModal.data.fechaNac} />
                            </div>
                        </div>

                        {/* Datos del representante */}
                        <div>
                            <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-semibold mb-2">Datos del representante</div>
                            <div className="rounded-edu-control border border-edu-border-soft p-4 flex flex-col gap-4">
                                {/* Avatar + nombre rep */}
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-edu-subtle border border-edu-border flex items-center justify-center text-xs font-bold text-edu-ink-500 shrink-0">
                                        {estModal.data.representante.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                                    </div>
                                    <div>
                                        <div className="text-[0.875rem] text-edu-ink font-semibold">{estModal.data.representante}</div>
                                        <div className="text-[0.75rem] text-edu-ink-400">{estModal.data.repRelacion}</div>
                                    </div>
                                </div>

                                {/* Campos rep */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 border-t border-edu-border-soft pt-3">
                                    <InfoField label="Cédula" value={estModal.data.repCedula} />
                                    <div>
                                        <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Teléfono</div>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <Phone className="w-3.5 h-3.5 text-edu-ink-400 shrink-0" />
                                            <span className="text-[0.875rem] text-edu-ink font-medium">{estModal.data.repTelefono}</span>
                                        </div>
                                    </div>
                                    {estModal.data.repEmail && (
                                        <div className="sm:col-span-2">
                                            <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Correo electrónico</div>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <Mail className="w-3.5 h-3.5 text-edu-ink-400 shrink-0" />
                                                <span className="text-[0.875rem] text-edu-ink font-medium">{estModal.data.repEmail}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setEstModal(null)} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer hover:bg-edu-subtle">Cerrar</button>
                            <button type="button" onClick={() => setEstModal({ mode: "modificar", data: estModal.data })} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold border-none cursor-pointer" style={{ backgroundColor: accent.purple.fg }}>
                                <Pencil className="w-4 h-4" /> Modificar
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Modo AÑADIR / MODIFICAR — formulario */
                    <form onSubmit={guardarEstudiante} className="p-5 flex flex-col gap-4">
                        {/* Sección estudiante */}
                        <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-semibold">Datos del estudiante</div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-edu-ink-700 text-sm font-medium">Nombre y apellido</label>
                            <input type="text" value={estModal.data.nombre} required onChange={(e) => setEstModal({ ...estModal, data: { ...estModal.data, nombre: e.target.value } })} className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary" />
                        </div>
                        <div className="flex gap-3">
                            <div className="flex flex-col gap-1.5 flex-1">
                                <label className="text-edu-ink-700 text-sm font-medium">Cédula</label>
                                <input type="text" value={estModal.data.cedula} onChange={(e) => setEstModal({ ...estModal, data: { ...estModal.data, cedula: e.target.value } })} placeholder="V-00.000.000" className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary" />
                            </div>
                            <div className="flex flex-col gap-1.5 flex-1">
                                <label className="text-edu-ink-700 text-sm font-medium">Año / Sección</label>
                                <input type="text" value={estModal.data.grado} onChange={(e) => setEstModal({ ...estModal, data: { ...estModal.data, grado: e.target.value } })} placeholder="Ej. 4.º Año B" className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-edu-ink-700 text-sm font-medium">Fecha de nacimiento</label>
                            <input type="text" value={estModal.data.fechaNac} onChange={(e) => setEstModal({ ...estModal, data: { ...estModal.data, fechaNac: e.target.value } })} placeholder="Ej. 15 mar 2011" className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary" />
                        </div>

                        {/* Sección representante */}
                        <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-semibold pt-1 border-t border-edu-border-soft">Datos del representante</div>
                        <div className="flex gap-3">
                            <div className="flex flex-col gap-1.5 flex-1">
                                <label className="text-edu-ink-700 text-sm font-medium">Nombre y apellido</label>
                                <input type="text" value={estModal.data.representante} onChange={(e) => setEstModal({ ...estModal, data: { ...estModal.data, representante: e.target.value } })} className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary" />
                            </div>
                            <div className="flex flex-col gap-1.5 w-36">
                                <label className="text-edu-ink-700 text-sm font-medium">Relación</label>
                                <select value={estModal.data.repRelacion} onChange={(e) => setEstModal({ ...estModal, data: { ...estModal.data, repRelacion: e.target.value as RepRelacion } })} className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-edu-primary">
                                    <option value="Madre">Madre</option>
                                    <option value="Padre">Padre</option>
                                    <option value="Tutor/a">Tutor/a</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex flex-col gap-1.5 flex-1">
                                <label className="text-edu-ink-700 text-sm font-medium">Cédula</label>
                                <input type="text" value={estModal.data.repCedula} onChange={(e) => setEstModal({ ...estModal, data: { ...estModal.data, repCedula: e.target.value } })} placeholder="V-00.000.000" className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary" />
                            </div>
                            <div className="flex flex-col gap-1.5 flex-1">
                                <label className="text-edu-ink-700 text-sm font-medium">Teléfono</label>
                                <input type="text" value={estModal.data.repTelefono} onChange={(e) => setEstModal({ ...estModal, data: { ...estModal.data, repTelefono: e.target.value } })} placeholder="04XX-XXXXXXX" className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-edu-ink-700 text-sm font-medium">Correo electrónico <span className="text-edu-ink-400 font-normal">(opcional)</span></label>
                            <input type="email" value={estModal.data.repEmail} onChange={(e) => setEstModal({ ...estModal, data: { ...estModal.data, repEmail: e.target.value } })} placeholder="correo@ejemplo.com" className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary" />
                        </div>

                        <div className="flex gap-2 justify-end pt-1">
                            <button type="button" onClick={() => setEstModal(null)} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer hover:bg-edu-subtle">Cancelar</button>
                            <button type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold border-none cursor-pointer" style={{ backgroundColor: accent.purple.fg }}>
                                {estModal.mode === "añadir" ? <Plus className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                                {estModal.mode === "añadir" ? "Añadir" : "Guardar cambios"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
