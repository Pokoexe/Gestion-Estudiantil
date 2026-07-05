import { useState } from "react";
import {
    Trophy,
    Music,
    FlaskConical,
    Dumbbell,
    Palette,
    Users,
    Check,
    XCircle,
    PlusCircle,
    X,
    UserCheck,
    CheckCircle2,
    Clock,
    Search,
} from "lucide-react";
import { accent } from "../theme/tokens";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Pagination } from "../components/Pagination";

/* ------------------------------------------------------------------ */
/* Tipos y datos ficticios                                             */
/* ------------------------------------------------------------------ */

type TipoActividad = "Cultural" | "Deportiva" | "Científica" | "Artística";
type EstadoPostulado = "Pendiente" | "Aprobado" | "Rechazado";

interface ActividadTabla {
    docente: string;
    tema: string;
    id: number;
    fecha: string;
    cupos: string;
    lugar: string;
    estado: EstadoPostulado;
}

interface Postulado {
    id: number;
    nombre: string;
    seccion: string;
    estado: EstadoPostulado;
}

interface Actividad {
    id: number;
    nombre: string;
    tipo: TipoActividad;
    docente: string;
    cupo: number;
    postulados: Postulado[];
}

const DOCENTES = ["Sin asignar", "Prof. María Herrera", "Prof. Luis Rondón", "Prof. Carla Yépez", "Prof. José Bracho", "Prof. Ana Salazar"];
const COLS = "grid-cols-[1.7fr_1.5fr_1.5fr_0.5fr_1fr_1fr_1fr]";
const HEADERS = ["Tema", "Docente", "Lugar", "Cupo", "Fecha", "Estado", "Acciones"];
const REUNIONES_PER_PAGE = 5;

const TIPO_META: Record<TipoActividad, { icon: React.FC<{ style?: React.CSSProperties }>; ac: { bg: string; fg: string } }> = {
    Cultural: { icon: Music, ac: accent.purple },
    Deportiva: { icon: Dumbbell, ac: accent.blue },
    Científica: { icon: FlaskConical, ac: accent.green },
    Artística: { icon: Palette, ac: accent.amber },
};

const ACTIVIDADES_INICIALES: Actividad[] = [
    {
        id: 1, nombre: "Danzas Tradicionales", tipo: "Cultural", docente: "Prof. María Herrera", cupo: 25,
        postulados: [
            { id: 11, nombre: "Valeria Contreras", seccion: "3.º Año A", estado: "Aprobado" },
            { id: 12, nombre: "Daniel Peña", seccion: "2.º Año B", estado: "Pendiente" },
            { id: 13, nombre: "Isabella Moreno", seccion: "4.º Año C", estado: "Pendiente" },
        ],
    },
];

const ESTADO_META: Record<EstadoPostulado, { cls: string }> = {
    Pendiente: { cls: "bg-edu-warning-bg text-edu-warning" },
    Aprobado: { cls: "bg-edu-success-bg text-edu-success" },
    Rechazado: { cls: "bg-edu-danger-bg text-edu-danger" },
};

const REUNIONES_INICIALES: ActividadTabla[] = [
    { id: 1, tema: "Torneo de ajedrez", lugar: "Tariba", cupos: "1/25", fecha: "10 jul 2026", docente: "Prof. José", estado: "Pendiente" },
    { id: 2, tema: "Torneo de ajedrez", lugar: "Tariba", cupos: "1/25", fecha: "10 jul 2026", docente: "Prof. José", estado: "Pendiente" },
    { id: 3, tema: "Torneo de ajedrez", lugar: "Tariba", cupos: "1/25", fecha: "10 jul 2026", docente: "Prof. José", estado: "Pendiente" },
    { id: 4, tema: "Torneo de ajedrez", lugar: "Tariba", cupos: "1/25", fecha: "10 jul 2026", docente: "Prof. José", estado: "Pendiente" },
    { id: 5, tema: "Torneo de ajedrez", lugar: "Tariba", cupos: "1/25", fecha: "10 jul 2026", docente: "Prof. José", estado: "Pendiente" },
    { id: 6, tema: "Torneo de ajedrez", lugar: "Tariba", cupos: "1/25", fecha: "10 jul 2026", docente: "Prof. José", estado: "Pendiente" },
];

const TIPOS: TipoActividad[] = ["Cultural", "Deportiva", "Científica", "Artística"];

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function CoordActividadesPage() {
    const [actividades, setActividades] = useState<Actividad[]>(ACTIVIDADES_INICIALES);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ nombre: "", tipo: "Cultural" as TipoActividad, docente: "Sin asignar", cupo: "20" });
    const [reuniones, setReuniones] = useState<ActividadTabla[]>(REUNIONES_INICIALES);

    // Buscador y paginación de la agenda
    const [reunionesQuery, setReunionesQuery] = useState("");
    const [reunionesPage, setReunionesPage] = useState(1);

    // Confirmación de postulados
    const [confirmPost, setConfirmPost] = useState<{ actId: number; postId: number; estado: EstadoPostulado; nombre: string } | null>(null);

    // Confirmación de acciones en la agenda (check / X)
    const [confirmAgenda, setConfirmAgenda] = useState<{ id: number; nuevoEstado: EstadoPostulado } | null>(null);

    const filteredReuniones = reuniones.filter((r) =>
        !reunionesQuery.trim() ||
        `${r.tema} ${r.docente} ${r.lugar}`.toLowerCase().includes(reunionesQuery.trim().toLowerCase()),
    );
    const reunionesTotalPages = Math.max(1, Math.ceil(filteredReuniones.length / REUNIONES_PER_PAGE));
    const reunionesCurrentPage = Math.min(reunionesPage, reunionesTotalPages);
    const pagedReuniones = filteredReuniones.slice((reunionesCurrentPage - 1) * REUNIONES_PER_PAGE, reunionesCurrentPage * REUNIONES_PER_PAGE);

    const asignarDocente = (actId: number, docente: string) =>
        setActividades((as) => as.map((a) => (a.id === actId ? { ...a, docente } : a)));

    const revisarPostulado = (actId: number, postId: number, estado: EstadoPostulado) =>
        setActividades((as) =>
            as.map((a) =>
                a.id === actId ? { ...a, postulados: a.postulados.map((p) => (p.id === postId ? { ...p, estado } : p)) } : a
            )
        );

    const aplicarAgenda = (id: number, nuevoEstado: EstadoPostulado) =>
        setReuniones((rs) => rs.map((r) => (r.id === id ? { ...r, estado: nuevoEstado } : r)));

    const openModal = () => {
        setForm({ nombre: "", tipo: "Cultural", docente: "Sin asignar", cupo: "20" });
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const nueva: Actividad = {
            id: Date.now(),
            nombre: form.nombre.trim() || "Actividad sin nombre",
            tipo: form.tipo,
            docente: form.docente,
            cupo: Number(form.cupo) || 20,
            postulados: [],
        };
        setActividades([nueva, ...actividades]);
        setShowModal(false);
    };

    return (
        <div className="flex flex-col gap-5">
            {/* Encabezado */}
            <div className="flex justify-between items-center flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: accent.purple.bg }}>
                        <Trophy style={{ width: 22, height: 22, color: accent.purple.fg }} />
                    </div>
                    <div>
                        <h2 className="m-0 text-edu-ink font-bold text-[1.15rem]">Actividades</h2>
                        <p className="m-0 text-edu-ink-500 text-[0.8125rem]">Actividades académicas y culturales del colegio</p>
                    </div>
                </div>
                <button onClick={openModal} className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold cursor-pointer border-none text-white" style={{ backgroundColor: accent.purple.fg }}>
                    <PlusCircle style={{ width: 16, height: 16 }} />
                    Crear actividad
                </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {/* Tabla de reuniones */}
                <div className="col-span-2 bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                    <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Agenda de actividades</h3>
                        <span className="text-[0.8rem] text-edu-ink-400 font-medium">{filteredReuniones.length} actividad{filteredReuniones.length === 1 ? "" : "es"}</span>
                    </div>

                    {/* Buscador */}
                    <div className="px-5 py-3 border-b border-edu-border-soft">
                        <div className="relative">
                            <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={reunionesQuery}
                                onChange={(e) => { setReunionesQuery(e.target.value); setReunionesPage(1); }}
                                placeholder="Buscar por tema, docente o lugar…"
                                className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                            />
                        </div>
                    </div>

                    <div>
                        <div className={`grid ${COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                            {HEADERS.map((h) => (
                                <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
                            ))}
                        </div>

                        {filteredReuniones.length === 0 && (
                            <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">No hay actividades que coincidan con la búsqueda.</div>
                        )}

                        {pagedReuniones.map((r, i) => {
                            const st = ESTADO_META[r.estado];
                            return (
                                <div key={r.id} className={`grid ${COLS} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < pagedReuniones.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
                                    <div className="min-w-0 pr-3">
                                        <div className="text-sm text-edu-ink font-semibold">{r.tema}</div>
                                    </div>
                                    <span className="text-[0.8125rem] text-edu-ink-500">{r.docente}</span>
                                    <span className="text-[0.8125rem] text-edu-ink-500">{r.lugar}</span>
                                    <span className="text-[0.8125rem] text-edu-ink-500">{r.cupos}</span>
                                    <span className="text-[0.8125rem] text-edu-ink-500">{r.fecha}</span>
                                    <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${st.cls}`}>{r.estado}</span>
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => setConfirmAgenda({ id: r.id, nuevoEstado: "Aprobado" })}
                                            className="inline-flex items-center gap-1 text-[0.75rem] font-semibold text-edu-success cursor-pointer bg-transparent border-none p-0 hover:underline"
                                        >
                                            <CheckCircle2 style={{ width: 14, height: 14 }} />
                                        </button>
                                        <button
                                            onClick={() => setConfirmAgenda({ id: r.id, nuevoEstado: "Rechazado" })}
                                            className="inline-flex items-center gap-1 text-[0.75rem] font-semibold text-edu-danger cursor-pointer bg-transparent border-none p-0 hover:underline"
                                        >
                                            <XCircle style={{ width: 14, height: 14 }} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {reunionesTotalPages > 1 && (
                            <div className="px-5 py-4 border-t border-edu-border-soft">
                                <Pagination currentPage={reunionesCurrentPage} totalPages={reunionesTotalPages} onPageChange={setReunionesPage} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Tarjetas de actividades con postulados */}
                {actividades.map((act) => {
                    const meta = TIPO_META[act.tipo];
                    const Icon = meta.icon;
                    const aprobados = act.postulados.filter((p) => p.estado === "Aprobado").length;
                    return (
                        <div key={act.id} className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
                            <div className="px-5 py-4 border-b border-edu-border-soft flex items-center gap-3">
                                <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: meta.ac.bg }}>
                                    <Icon style={{ width: 20, height: 20, color: meta.ac.fg }} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-[0.95rem] font-semibold text-edu-ink truncate">{act.nombre}</div>
                                    <div className="text-[0.75rem] text-edu-ink-500 mt-0.5">{act.tipo}</div>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className="text-[0.7rem] text-edu-ink-400 uppercase tracking-[0.04em] font-semibold">Cupos</div>
                                    <div className="text-[0.95rem] font-bold text-edu-ink">{aprobados} / {act.cupo}</div>
                                </div>
                            </div>

                            {/* Asignar docente */}
                            <div className="px-5 py-3 border-b border-edu-border-soft flex items-center gap-2">
                                <UserCheck className="text-edu-ink-400 shrink-0" style={{ width: 15, height: 15 }} />
                                <span className="text-[0.75rem] text-edu-ink-500 shrink-0">Docente:</span>
                                <select
                                    value={act.docente}
                                    onChange={(e) => asignarDocente(act.id, e.target.value)}
                                    className="border border-edu-border rounded-edu-chip px-2 py-1 text-[0.8rem] text-edu-ink outline-none bg-edu-subtle w-full cursor-pointer focus:border-edu-primary"
                                >
                                    {DOCENTES.map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Postulados */}
                            <div className="px-5 py-3 flex-1">
                                <div className="flex items-center gap-1.5 mb-2 text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">
                                    <Users style={{ width: 12, height: 12 }} />
                                    Postulados ({act.postulados.length})
                                </div>
                                {act.postulados.length === 0 ? (
                                    <p className="text-[0.8125rem] text-edu-ink-400 m-0 py-2">Aún no hay estudiantes postulados.</p>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        {act.postulados.map((p) => {
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
                                                                onClick={() => setConfirmPost({ actId: act.id, postId: p.id, estado: "Aprobado", nombre: p.nombre })}
                                                                aria-label="Aprobar"
                                                                className="w-7 h-7 rounded-edu-chip border border-edu-border bg-edu-surface flex items-center justify-center text-edu-success cursor-pointer hover:bg-edu-success-bg hover:border-edu-success"
                                                            >
                                                                <Check style={{ width: 14, height: 14 }} />
                                                            </button>
                                                            <button
                                                                onClick={() => setConfirmPost({ actId: act.id, postId: p.id, estado: "Rechazado", nombre: p.nombre })}
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
                })}
            </div>

            {/* Modal crear actividad */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-edu-surface rounded-edu-card w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
                        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: accent.purple.bg }}>
                                    <Trophy style={{ width: 16, height: 16, color: accent.purple.fg }} />
                                </div>
                                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Crear actividad</h3>
                            </div>
                            <button onClick={() => setShowModal(false)} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-edu-ink-700 text-sm font-medium">Nombre de la actividad</label>
                                <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej. Club de Ajedrez" required className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary" />
                            </div>
                            <div className="flex gap-3">
                                <div className="flex flex-col gap-1.5 flex-1">
                                    <label className="text-edu-ink-700 text-sm font-medium">Tipo</label>
                                    <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value as TipoActividad })} className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-edu-primary">
                                        {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
                                    </select>
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
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer hover:bg-edu-subtle">Cancelar</button>
                                <button type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold border-none cursor-pointer" style={{ backgroundColor: accent.purple.fg }}>
                                    <PlusCircle className="w-4 h-4" />
                                    Crear actividad
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirmación: aprobar / rechazar postulado */}
            {confirmPost && (
                <ConfirmDialog
                    title={confirmPost.estado === "Aprobado" ? "Aprobar postulación" : "Rechazar postulación"}
                    message={
                        <>
                            ¿Confirmas {confirmPost.estado === "Aprobado" ? "la aprobación" : "el rechazo"} de la postulación de{" "}
                            <span className="font-semibold text-edu-ink">{confirmPost.nombre}</span>?
                        </>
                    }
                    confirmLabel={confirmPost.estado === "Aprobado" ? "Aprobar" : "Rechazar"}
                    tone={confirmPost.estado === "Aprobado" ? "success" : "danger"}
                    icon={confirmPost.estado === "Aprobado" ? CheckCircle2 : XCircle}
                    onConfirm={() => {
                        revisarPostulado(confirmPost.actId, confirmPost.postId, confirmPost.estado);
                        setConfirmPost(null);
                    }}
                    onCancel={() => setConfirmPost(null)}
                />
            )}

            {/* Confirmación: aprobar / rechazar ítem de agenda */}
            {confirmAgenda && (
                <ConfirmDialog
                    title={confirmAgenda.nuevoEstado === "Aprobado" ? "Aprobar actividad" : "Rechazar actividad"}
                    message={
                        <>
                            ¿Confirmas {confirmAgenda.nuevoEstado === "Aprobado" ? "la aprobación" : "el rechazo"} de esta actividad de la agenda?
                        </>
                    }
                    confirmLabel={confirmAgenda.nuevoEstado === "Aprobado" ? "Aprobar" : "Rechazar"}
                    tone={confirmAgenda.nuevoEstado === "Aprobado" ? "success" : "danger"}
                    icon={confirmAgenda.nuevoEstado === "Aprobado" ? CheckCircle2 : XCircle}
                    onConfirm={() => {
                        aplicarAgenda(confirmAgenda.id, confirmAgenda.nuevoEstado);
                        setConfirmAgenda(null);
                    }}
                    onCancel={() => setConfirmAgenda(null)}
                />
            )}
        </div>
    );
}
