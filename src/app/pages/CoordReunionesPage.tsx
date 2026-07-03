import { useState } from "react";
import {
    CalendarClock,
    Users,
    CheckCircle2,
    XCircle,
    PlusCircle,
    X,
    Bell,
    Clock,
    CalendarCheck,
    UserCog,
} from "lucide-react";
import { accent } from "../theme/tokens";

/* ------------------------------------------------------------------ */
/* Tipos y datos ficticios                                             */
/* ------------------------------------------------------------------ */

type Estado = "Programada" | "Realizada" | "Cancelada";
type Convocados = "Docentes" | "Representantes" | "Ambos";

interface Reunion {
    id: number;
    tema: string;
    fecha: string;
    hora: string;
    convocados: Convocados;
    estado: Estado;
    observaciones?: string;
}

const REUNIONES_INICIALES: Reunion[] = [
    { id: 1, tema: "Cierre del segundo lapso", fecha: "10 jul 2026", hora: "08:00", convocados: "Docentes", estado: "Programada", observaciones: "Traer consolidado de notas por sección." },
    { id: 2, tema: "Entrega de boletines 4.º Año", fecha: "12 jul 2026", hora: "14:00", convocados: "Representantes", estado: "Programada" },
    { id: 3, tema: "Planificación del acto de graduación", fecha: "28 jun 2026", hora: "10:30", convocados: "Ambos", estado: "Realizada", observaciones: "Se conformó la comisión de logística." },
    { id: 4, tema: "Revisión de convivencia escolar", fecha: "20 jun 2026", hora: "09:00", convocados: "Docentes", estado: "Realizada" },
    { id: 5, tema: "Feria científica anual", fecha: "5 jun 2026", hora: "11:00", convocados: "Ambos", estado: "Cancelada", observaciones: "Reprogramada por lluvias." },
];

const ESTADO_META: Record<Estado, { cls: string }> = {
    Programada: { cls: "bg-edu-primary-100 text-edu-primary" },
    Realizada: { cls: "bg-edu-success-bg text-edu-success" },
    Cancelada: { cls: "bg-edu-danger-bg text-edu-danger" },
};

const COLS = "grid-cols-[1.7fr_0.9fr_0.6fr_1fr_0.9fr_1fr]";
const HEADERS = ["Tema", "Fecha", "Hora", "Convocados", "Estado", "Acciones"];

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function CoordReunionesPage() {
    const [reuniones, setReuniones] = useState<Reunion[]>(REUNIONES_INICIALES);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        tema: "",
        fecha: "",
        hora: "",
        convocados: "Docentes" as Convocados,
        aviso: true,
        observaciones: "",
    });

    const cambiarEstado = (id: number, estado: Estado) =>
        setReuniones((rs) => rs.map((r) => (r.id === id ? { ...r, estado } : r)));

    const totalProgramadas = reuniones.filter((r) => r.estado === "Programada").length;
    const totalRealizadas = reuniones.filter((r) => r.estado === "Realizada").length;

    const openModal = () => {
        setForm({ tema: "", fecha: "", hora: "", convocados: "Docentes", aviso: true, observaciones: "" });
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fechaTexto = form.fecha
            ? new Date(form.fecha + "T00:00").toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })
            : "Por definir";
        const nueva: Reunion = {
            id: Date.now(),
            tema: form.tema.trim() || "Reunión sin título",
            fecha: fechaTexto,
            hora: form.hora || "—",
            convocados: form.convocados,
            estado: "Programada",
            observaciones: form.observaciones.trim() || undefined,
        };
        setReuniones([nueva, ...reuniones]);
        setShowModal(false);
    };

    const kpis = [
        { label: "Programadas", value: totalProgramadas, icon: CalendarClock, ac: accent.purple },
        { label: "Realizadas", value: totalRealizadas, icon: CalendarCheck, ac: accent.green },
        { label: "Total en agenda", value: reuniones.length, icon: Users, ac: accent.blue },
    ];

    return (
        <div className="flex flex-col gap-5">
            {/* Encabezado */}
            <div className="flex justify-between items-center flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: accent.purple.bg }}>
                        <CalendarClock style={{ width: 22, height: 22, color: accent.purple.fg }} />
                    </div>
                    <div>
                        <h2 className="m-0 text-edu-ink font-bold text-[1.15rem]">Reuniones</h2>
                        <p className="m-0 text-edu-ink-500 text-[0.8125rem]">Convoca y gestiona reuniones con docentes y representantes</p>
                    </div>
                </div>
                <button
                    onClick={openModal}
                    className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold cursor-pointer transition-colors border-none text-white"
                    style={{ backgroundColor: accent.purple.fg }}
                >
                    <PlusCircle style={{ width: 16, height: 16 }} />
                    Crear reunión
                </button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-3 gap-4">
                {kpis.map((kpi) => {
                    const Icon = kpi.icon;
                    return (
                        <div key={kpi.label} className="bg-edu-surface rounded-edu-card p-5 flex justify-between items-start border border-edu-border-soft">
                            <div>
                                <p className="text-edu-ink-500 text-[0.75rem] font-medium m-0 uppercase tracking-[0.05em]">{kpi.label}</p>
                                <p className="text-[1.6rem] font-bold mt-1.5 m-0 text-edu-ink">{kpi.value}</p>
                            </div>
                            <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: kpi.ac.bg }}>
                                <Icon style={{ width: 20, height: 20, color: kpi.ac.fg }} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Tabla de reuniones */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                    <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Agenda de reuniones</h3>
                    <span className="text-[0.8rem] text-edu-ink-400 font-medium">{reuniones.length} reuniones</span>
                </div>
                <div>
                    <div className={`grid ${COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                        {HEADERS.map((h) => (
                            <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
                        ))}
                    </div>
                    {reuniones.map((r, i) => {
                        const st = ESTADO_META[r.estado];
                        const editable = r.estado === "Programada";
                        return (
                            <div key={r.id} className={`grid ${COLS} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < reuniones.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
                                <div className="min-w-0 pr-3">
                                    <div className="text-sm text-edu-ink font-semibold">{r.tema}</div>
                                    {r.observaciones && <div className="text-[0.75rem] text-edu-ink-400 mt-0.5 truncate">{r.observaciones}</div>}
                                </div>
                                <span className="text-[0.8125rem] text-edu-ink-500">{r.fecha}</span>
                                <span className="text-[0.8125rem] text-edu-ink-500 flex items-center gap-1">
                                    <Clock className="text-edu-ink-400" style={{ width: 12, height: 12 }} />
                                    {r.hora}
                                </span>
                                <span className="text-[0.8125rem] text-edu-ink-700">{r.convocados}</span>
                                <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${st.cls}`}>{r.estado}</span>
                                <div className="flex gap-2">
                                    {editable ? (
                                        <>
                                            <button
                                                onClick={() => cambiarEstado(r.id, "Realizada")}
                                                className="inline-flex items-center gap-1 text-[0.75rem] font-semibold text-edu-success cursor-pointer bg-transparent border-none p-0 hover:underline"
                                            >
                                                <CheckCircle2 style={{ width: 14, height: 14 }} /> Realizada
                                            </button>
                                            <button
                                                onClick={() => cambiarEstado(r.id, "Cancelada")}
                                                className="inline-flex items-center gap-1 text-[0.75rem] font-semibold text-edu-danger cursor-pointer bg-transparent border-none p-0 hover:underline"
                                            >
                                                <XCircle style={{ width: 14, height: 14 }} /> Cancelar
                                            </button>
                                        </>
                                    ) : (
                                        <span className="text-[0.75rem] text-edu-ink-400">Sin acciones</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal crear reunión */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-edu-surface rounded-edu-card w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
                        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: accent.purple.bg }}>
                                    <CalendarClock style={{ width: 16, height: 16, color: accent.purple.fg }} />
                                </div>
                                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Crear reunión</h3>
                            </div>
                            <button onClick={() => setShowModal(false)} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
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
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer hover:bg-edu-subtle">Cancelar</button>
                                <button type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold border-none cursor-pointer" style={{ backgroundColor: accent.purple.fg }}>
                                    <UserCog className="w-4 h-4" />
                                    Convocar reunión
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
