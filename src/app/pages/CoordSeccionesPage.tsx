import { useState } from "react";
import {
    Layers,
    BookOpen,
    CalendarRange,
    Plus,
    X,
    UserCog,
    Trash2,
} from "lucide-react";
import { accent } from "../theme/tokens";

/* ------------------------------------------------------------------ */
/* Tipos y datos ficticios                                             */
/* ------------------------------------------------------------------ */

type Tab = "secciones" | "materias" | "horarios";

interface Seccion {
    id: number;
    anio: string;
    seccion: string;
    cupo: number;
    tutor: string;
}

interface Bloque {
    id: number;
    inicio: string;
    fin: string;
}

const SECCIONES_INICIALES: Seccion[] = [
    { id: 1, anio: "1.º Año", seccion: "A", cupo: 32, tutor: "Prof. Ana Salazar" },
    { id: 2, anio: "2.º Año", seccion: "B", cupo: 30, tutor: "Prof. José Bracho" },
    { id: 3, anio: "3.º Año", seccion: "A", cupo: 28, tutor: "Prof. Carla Yépez" },
    { id: 4, anio: "4.º Año", seccion: "B", cupo: 31, tutor: "Prof. María Herrera" },
    { id: 5, anio: "5.º Año", seccion: "A", cupo: 27, tutor: "Prof. Pedro Uzcátegui" },
];

const MATERIAS_INICIALES = [
    "Castellano", "Matemática", "Ciencias Naturales", "Biología", "Química", "Física",
    "Historia de Venezuela", "Geografía", "Inglés", "Educación Física", "Educación Artística", "Informática",
];

const DOCENTES = ["Sin asignar", "Prof. María Herrera", "Prof. Luis Rondón", "Prof. Carla Yépez", "Prof. José Bracho", "Prof. Ana Salazar", "Prof. Pedro Uzcátegui"];

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

const BLOQUES_INICIALES: Bloque[] = [
    { id: 1, inicio: "07:00", fin: "07:45" },
    { id: 2, inicio: "07:45", fin: "08:30" },
    { id: 3, inicio: "08:30", fin: "09:15" },
    { id: 4, inicio: "09:30", fin: "10:15" },
];

const ANIOS = ["1.º Año", "2.º Año", "3.º Año", "4.º Año", "5.º Año"];

const SEC_COLS = "grid-cols-[1fr_0.7fr_0.7fr_1.4fr_0.5fr]";
const SEC_HEADERS = ["Año", "Sección", "Cupo", "Tutor", ""];

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function CoordSeccionesPage() {
    const [tab, setTab] = useState<Tab>("secciones");

    // Secciones
    const [secciones, setSecciones] = useState<Seccion[]>(SECCIONES_INICIALES);
    const [showSecModal, setShowSecModal] = useState(false);
    const [secForm, setSecForm] = useState({ anio: "1.º Año", seccion: "A", cupo: "30", tutor: "Sin asignar" });

    // Materias
    const [materias, setMaterias] = useState<string[]>(MATERIAS_INICIALES);
    const [nuevaMateria, setNuevaMateria] = useState("");

    // Horarios
    const [bloques, setBloques] = useState<Bloque[]>(BLOQUES_INICIALES);
    const [nuevoBloque, setNuevoBloque] = useState({ inicio: "", fin: "" });
    // Asignación docente por celda: clave `${bloqueId}-${dia}`
    const [asignaciones, setAsignaciones] = useState<Record<string, string>>({});

    const agregarSeccion = (e: React.FormEvent) => {
        e.preventDefault();
        setSecciones([...secciones, { id: Date.now(), anio: secForm.anio, seccion: secForm.seccion.trim().toUpperCase() || "A", cupo: Number(secForm.cupo) || 30, tutor: secForm.tutor }]);
        setShowSecModal(false);
    };

    const agregarMateria = (e: React.FormEvent) => {
        e.preventDefault();
        const m = nuevaMateria.trim();
        if (!m) return;
        setMaterias([...materias, m]);
        setNuevaMateria("");
    };

    const agregarBloque = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nuevoBloque.inicio || !nuevoBloque.fin) return;
        setBloques([...bloques, { id: Date.now(), inicio: nuevoBloque.inicio, fin: nuevoBloque.fin }]);
        setNuevoBloque({ inicio: "", fin: "" });
    };

    const eliminarBloque = (id: number) => setBloques((bs) => bs.filter((b) => b.id !== id));

    const setAsignacion = (bloqueId: number, dia: string, docente: string) =>
        setAsignaciones((a) => ({ ...a, [`${bloqueId}-${dia}`]: docente }));

    const TABS: { key: Tab; label: string; icon: React.FC<{ style?: React.CSSProperties }> }[] = [
        { key: "secciones", label: "Secciones / Años", icon: Layers },
        { key: "materias", label: "Materias", icon: BookOpen },
        { key: "horarios", label: "Formato de horarios", icon: CalendarRange },
    ];

    return (
        <div className="flex flex-col gap-5">
            {/* Encabezado */}
            <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: accent.purple.bg }}>
                    <Layers style={{ width: 22, height: 22, color: accent.purple.fg }} />
                </div>
                <div>
                    <h2 className="m-0 text-edu-ink font-bold text-[1.15rem]">Gestión académica</h2>
                    <p className="m-0 text-edu-ink-500 text-[0.8125rem]">Secciones, materias y estructura de horarios del plantel</p>
                </div>
            </div>

            {/* Pestañas */}
            <div className="flex gap-1 border-b border-edu-border-soft">
                {TABS.map((t) => {
                    const Icon = t.icon;
                    const active = tab === t.key;
                    return (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 text-[0.8125rem] font-semibold border-b-2 -mb-px cursor-pointer bg-transparent transition-colors"
                            style={active ? { borderColor: accent.purple.fg, color: accent.purple.fg } : { borderColor: "transparent", color: "#6b7280" }}
                        >
                            <Icon style={{ width: 15, height: 15 }} />
                            {t.label}
                        </button>
                    );
                })}
            </div>

            {/* --- Tab Secciones --- */}
            {tab === "secciones" && (
                <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                    <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Secciones registradas</h3>
                        <button onClick={() => { setSecForm({ anio: "1.º Año", seccion: "A", cupo: "30", tutor: "Sin asignar" }); setShowSecModal(true); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-edu-control text-[0.8rem] font-semibold cursor-pointer border-none text-white" style={{ backgroundColor: accent.purple.fg }}>
                            <Plus style={{ width: 14, height: 14 }} /> Agregar sección
                        </button>
                    </div>
                    <div>
                        <div className={`grid ${SEC_COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                            {SEC_HEADERS.map((h, i) => (
                                <span key={i} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
                            ))}
                        </div>
                        {secciones.map((s, i) => (
                            <div key={s.id} className={`grid ${SEC_COLS} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < secciones.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
                                <span className="text-sm text-edu-ink font-semibold">{s.anio}</span>
                                <span className="text-[0.8125rem] text-edu-ink-700">{s.seccion}</span>
                                <span className="text-[0.8125rem] text-edu-ink-500">{s.cupo}</span>
                                <span className="text-[0.8125rem] text-edu-ink-700">{s.tutor}</span>
                                <button onClick={() => setSecciones((ss) => ss.filter((x) => x.id !== s.id))} aria-label="Eliminar" className="text-edu-ink-400 hover:text-edu-danger bg-transparent border-none cursor-pointer p-0 flex items-center justify-self-start">
                                    <Trash2 style={{ width: 15, height: 15 }} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- Tab Materias --- */}
            {tab === "materias" && (
                <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                    <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Materias del plan de estudios</h3>
                        <span className="text-[0.8rem] text-edu-ink-400 font-medium">{materias.length} materias</span>
                    </div>
                    <div className="px-5 py-4">
                        <form onSubmit={agregarMateria} className="flex gap-2 mb-4">
                            <input type="text" value={nuevaMateria} onChange={(e) => setNuevaMateria(e.target.value)} placeholder="Nombre de la materia (ej. Premilitar)" className="flex-1 border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] focus:border-edu-primary" />
                            <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-edu-control text-sm font-semibold cursor-pointer border-none text-white" style={{ backgroundColor: accent.purple.fg }}>
                                <Plus style={{ width: 16, height: 16 }} /> Agregar
                            </button>
                        </form>
                        <div className="flex flex-wrap gap-2">
                            {materias.map((m) => (
                                <span key={m} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-edu-pill text-[0.8125rem] font-medium bg-edu-subtle border border-edu-border-soft text-edu-ink-700">
                                    <BookOpen className="text-edu-purple" style={{ width: 13, height: 13 }} />
                                    {m}
                                    <button onClick={() => setMaterias((ms) => ms.filter((x) => x !== m))} aria-label={`Eliminar ${m}`} className="text-edu-ink-400 hover:text-edu-danger bg-transparent border-none cursor-pointer p-0 flex items-center">
                                        <X style={{ width: 13, height: 13 }} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* --- Tab Formato de horarios --- */}
            {tab === "horarios" && (
                <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                    <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Formato de horarios</h3>
                        <span className="text-[0.8rem] text-edu-ink-400 font-medium">{bloques.length} bloques</span>
                    </div>
                    <div className="px-5 py-4 flex flex-col gap-4">
                        {/* Crear separación (bloque horario) */}
                        <div>
                            <p className="m-0 mb-2 text-[0.8125rem] text-edu-ink-500">Crea la separación de horas y asigna un docente a cada bloque por día.</p>
                            <form onSubmit={agregarBloque} className="flex items-end gap-2 flex-wrap">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[0.7rem] text-edu-ink-400 uppercase tracking-[0.04em] font-semibold">Inicio</label>
                                    <input type="time" value={nuevoBloque.inicio} onChange={(e) => setNuevoBloque({ ...nuevoBloque, inicio: e.target.value })} className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-edu-ink outline-none bg-edu-subtle text-[0.875rem] focus:border-edu-primary" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[0.7rem] text-edu-ink-400 uppercase tracking-[0.04em] font-semibold">Fin</label>
                                    <input type="time" value={nuevoBloque.fin} onChange={(e) => setNuevoBloque({ ...nuevoBloque, fin: e.target.value })} className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-edu-ink outline-none bg-edu-subtle text-[0.875rem] focus:border-edu-primary" />
                                </div>
                                <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-edu-control text-sm font-semibold cursor-pointer border-none text-white" style={{ backgroundColor: accent.purple.fg }}>
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
            )}

            {/* Modal agregar sección */}
            {showSecModal && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowSecModal(false)}>
                    <div className="bg-edu-surface rounded-edu-card w-full max-w-md shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
                        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: accent.purple.bg }}>
                                    <Layers style={{ width: 16, height: 16, color: accent.purple.fg }} />
                                </div>
                                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Agregar sección</h3>
                            </div>
                            <button onClick={() => setShowSecModal(false)} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={agregarSeccion} className="p-5 flex flex-col gap-4">
                            <div className="flex gap-3">
                                <div className="flex flex-col gap-1.5 flex-1">
                                    <label className="text-edu-ink-700 text-sm font-medium">Año</label>
                                    <select value={secForm.anio} onChange={(e) => setSecForm({ ...secForm, anio: e.target.value })} className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-edu-primary">
                                        {ANIOS.map((a) => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5 w-24">
                                    <label className="text-edu-ink-700 text-sm font-medium">Sección</label>
                                    <input type="text" maxLength={2} value={secForm.seccion} onChange={(e) => setSecForm({ ...secForm, seccion: e.target.value })} className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full uppercase focus:border-edu-primary" />
                                </div>
                                <div className="flex flex-col gap-1.5 w-24">
                                    <label className="text-edu-ink-700 text-sm font-medium">Cupo</label>
                                    <input type="number" min={1} value={secForm.cupo} onChange={(e) => setSecForm({ ...secForm, cupo: e.target.value })} className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-edu-ink-700 text-sm font-medium">Tutor asignado</label>
                                <select value={secForm.tutor} onChange={(e) => setSecForm({ ...secForm, tutor: e.target.value })} className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-edu-primary">
                                    {DOCENTES.map((d) => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-2 justify-end pt-1">
                                <button type="button" onClick={() => setShowSecModal(false)} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer hover:bg-edu-subtle">Cancelar</button>
                                <button type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold border-none cursor-pointer" style={{ backgroundColor: accent.purple.fg }}>
                                    <UserCog className="w-4 h-4" />
                                    Agregar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
