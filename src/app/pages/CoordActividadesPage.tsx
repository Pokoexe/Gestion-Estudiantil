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
} from "lucide-react";
import { accent } from "../theme/tokens";

/* ------------------------------------------------------------------ */
/* Tipos y datos ficticios                                             */
/* ------------------------------------------------------------------ */

type TipoActividad = "Cultural" | "Deportiva" | "Científica" | "Artística";
type EstadoPostulado = "Pendiente" | "Aprobado" | "Rechazado";

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
    {
        id: 2, nombre: "Selección de Fútbol", tipo: "Deportiva", docente: "Prof. Luis Rondón", cupo: 22,
        postulados: [
            { id: 21, nombre: "Carlos Guédez", seccion: "5.º Año A", estado: "Aprobado" },
            { id: 22, nombre: "Miguel Aponte", seccion: "4.º Año B", estado: "Pendiente" },
        ],
    },
    {
        id: 3, nombre: "Club de Ciencias", tipo: "Científica", docente: "Sin asignar", cupo: 18,
        postulados: [
            { id: 31, nombre: "Andrea Villalba", seccion: "5.º Año B", estado: "Pendiente" },
            { id: 32, nombre: "Sofía Marcano", seccion: "3.º Año C", estado: "Pendiente" },
            { id: 33, nombre: "Jesús Colmenares", seccion: "4.º Año A", estado: "Pendiente" },
        ],
    },
    {
        id: 4, nombre: "Taller de Teatro", tipo: "Artística", docente: "Prof. Carla Yépez", cupo: 20,
        postulados: [
            { id: 41, nombre: "Gabriela Ríos", seccion: "2.º Año A", estado: "Aprobado" },
        ],
    },
];

const ESTADO_META: Record<EstadoPostulado, { cls: string }> = {
    Pendiente: { cls: "bg-edu-warning-bg text-edu-warning" },
    Aprobado: { cls: "bg-edu-success-bg text-edu-success" },
    Rechazado: { cls: "bg-edu-danger-bg text-edu-danger" },
};

const TIPOS: TipoActividad[] = ["Cultural", "Deportiva", "Científica", "Artística"];

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function CoordActividadesPage() {
    const [actividades, setActividades] = useState<Actividad[]>(ACTIVIDADES_INICIALES);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ nombre: "", tipo: "Cultural" as TipoActividad, docente: "Sin asignar", cupo: "20" });

    const asignarDocente = (actId: number, docente: string) =>
        setActividades((as) => as.map((a) => (a.id === actId ? { ...a, docente } : a)));

    const revisarPostulado = (actId: number, postId: number, estado: EstadoPostulado) =>
        setActividades((as) =>
            as.map((a) =>
                a.id === actId ? { ...a, postulados: a.postulados.map((p) => (p.id === postId ? { ...p, estado } : p)) } : a
            )
        );

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

            {/* Tarjetas de actividades */}
            <div className="grid grid-cols-2 gap-4">
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
                                                            <button onClick={() => revisarPostulado(act.id, p.id, "Aprobado")} aria-label="Aprobar" className="w-7 h-7 rounded-edu-chip border border-edu-border bg-edu-surface flex items-center justify-center text-edu-success cursor-pointer hover:bg-edu-success-bg hover:border-edu-success">
                                                                <Check style={{ width: 14, height: 14 }} />
                                                            </button>
                                                            <button onClick={() => revisarPostulado(act.id, p.id, "Rechazado")} aria-label="Rechazar" className="w-7 h-7 rounded-edu-chip border border-edu-border bg-edu-surface flex items-center justify-center text-edu-danger cursor-pointer hover:bg-edu-danger-bg hover:border-edu-danger">
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
        </div>
    );
}
