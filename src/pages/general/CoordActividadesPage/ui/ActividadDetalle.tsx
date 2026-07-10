import { Trophy, Users, Check, XCircle, UserCheck, MapPin, CalendarDays } from "lucide-react";
import { accent } from "@themes/tokens";
import type { ActividadTabla, EstadoPostulado } from "@shared/services/actions/coordinador";

interface ActividadDetalleProps {
    selected: ActividadTabla;
    DOCENTES: string[];
    ESTADO_META: Record<EstadoPostulado, { cls: string }>;
    asignarDocente: (rowId: number, docente: string) => void;
    setConfirmPost: (v: { rowId: number; postId: number; estado: EstadoPostulado; nombre: string } | null) => void;
}

export function ActividadDetalle({ selected, DOCENTES, ESTADO_META, asignarDocente, setConfirmPost }: ActividadDetalleProps) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-edu-border-soft flex items-center gap-3">
                <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: accent.purple.bg }}>
                    <Trophy style={{ width: 20, height: 20, color: accent.purple.fg }} />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="text-[0.95rem] font-semibold text-edu-ink truncate">{selected.tema}</div>
                    <div className="text-[0.75rem] text-edu-ink-500 mt-0.5">Cupos: {selected.cupos}</div>
                </div>
                <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit shrink-0 ${ESTADO_META[selected.estado].cls}`}>{selected.estado}</span>
            </div>

            {/* Lugar y fecha */}
            <div className="px-5 py-3 border-b border-edu-border-soft flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-[0.8rem] text-edu-ink-500">
                    <MapPin className="text-edu-ink-400 shrink-0" style={{ width: 14, height: 14 }} />
                    {selected.lugar}
                </div>
                <div className="flex items-center gap-2 text-[0.8rem] text-edu-ink-500">
                    <CalendarDays className="text-edu-ink-400 shrink-0" style={{ width: 14, height: 14 }} />
                    {selected.fecha}
                </div>
            </div>

            {/* Asignar docente */}
            <div className="px-5 py-3 border-b border-edu-border-soft flex items-center gap-2">
                <UserCheck className="text-edu-ink-400 shrink-0" style={{ width: 15, height: 15 }} />
                <span className="text-[0.75rem] text-edu-ink-500 shrink-0">Docente:</span>
                <select
                    value={selected.docente}
                    onChange={(e) => asignarDocente(selected.id, e.target.value)}
                    className="border border-edu-border rounded-edu-chip px-2 py-1 text-[0.8rem] text-edu-ink outline-none bg-edu-subtle w-full cursor-pointer focus:border-edu-primary"
                >
                    {(DOCENTES.includes(selected.docente) ? DOCENTES : [selected.docente, ...DOCENTES]).map((d) => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
            </div>

            {/* Postulaciones hechas */}
            <div className="px-5 py-3 flex-1">
                <div className="flex items-center gap-1.5 mb-2 text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">
                    <Users style={{ width: 12, height: 12 }} />
                    Postulaciones hechas ({selected.postulados.length})
                </div>
                {selected.postulados.length === 0 ? (
                    <p className="text-[0.8125rem] text-edu-ink-400 m-0 py-2">Aún no hay estudiantes postulados.</p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {selected.postulados.map((p) => {
                            const st = ESTADO_META[p.estado];
                            return (
                                <div key={p.id} className="flex items-center gap-2">
                                    <div className="min-w-0 flex-1">
                                        <div className="text-[0.8125rem] text-edu-ink font-medium truncate">{p.nombre}</div>
                                        <div className="text-[0.7rem] text-edu-ink-400">{p.seccion}</div>
                                    </div>
                                    {p.estado === "Pendiente" ? (
                                        <div className="flex gap-1.5 shrink-0">
                                            <button
                                                onClick={() => setConfirmPost({ rowId: selected.id, postId: p.id, estado: "Aprobado", nombre: p.nombre })}
                                                aria-label="Aprobar"
                                                className="w-7 h-7 rounded-edu-chip border border-edu-border bg-edu-surface flex items-center justify-center text-edu-success cursor-pointer hover:bg-edu-success-bg hover:border-edu-success"
                                            >
                                                <Check style={{ width: 14, height: 14 }} />
                                            </button>
                                            <button
                                                onClick={() => setConfirmPost({ rowId: selected.id, postId: p.id, estado: "Rechazado", nombre: p.nombre })}
                                                aria-label="Rechazar"
                                                className="w-7 h-7 rounded-edu-chip border border-edu-border bg-edu-surface flex items-center justify-center text-edu-danger cursor-pointer hover:bg-edu-danger-bg hover:border-edu-danger"
                                            >
                                                <XCircle style={{ width: 14, height: 14 }} />
                                            </button>
                                        </div>
                                    ) : (
                                        <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit shrink-0 ${st.cls}`}>{p.estado}</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
