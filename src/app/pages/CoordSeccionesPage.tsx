import { useState } from "react";
import {
    Layers,
    BookOpen,
    Plus,
    X,
    UserCog,
    Trash2,
    Pencil,
    Search,
} from "lucide-react";
import { accent } from "../theme/tokens";
import { Pagination } from "../components/Pagination";
import { ConfirmDialog } from "../components/ConfirmDialog";

const PER_PAGE = 5;

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

type Nivel = "Primaria" | "Liceo";

interface Materia {
    id: number;
    nombre: string;
    nivel: Nivel;
}

interface Bloque {
    id: number;
    inicio: string;
    fin: string;
}

const SECCIONES_INICIALES: Seccion[] = [
    { id: 1, anio: "1.º Año", seccion: "A", cupo: 32, tutor: "Prof. Ana Salazar" },
    { id: 2, anio: "1.º Año", seccion: "B", cupo: 30, tutor: "Prof. José Bracho" },
    { id: 3, anio: "2.º Año", seccion: "A", cupo: 30, tutor: "Prof. Carla Yépez" },
    { id: 4, anio: "2.º Año", seccion: "B", cupo: 29, tutor: "Prof. Luis Rondón" },
    { id: 5, anio: "3.º Año", seccion: "A", cupo: 28, tutor: "Prof. María Herrera" },
    { id: 6, anio: "3.º Año", seccion: "B", cupo: 27, tutor: "Prof. Pedro Uzcátegui" },
    { id: 7, anio: "4.º Año", seccion: "A", cupo: 31, tutor: "Prof. Ana Salazar" },
    { id: 8, anio: "4.º Año", seccion: "B", cupo: 30, tutor: "Prof. José Bracho" },
    { id: 9, anio: "5.º Año", seccion: "A", cupo: 27, tutor: "Prof. Carla Yépez" },
];

const MATERIAS_INICIALES: Materia[] = [
    { id: 1, nombre: "Castellano", nivel: "Liceo" },
    { id: 2, nombre: "Matemática", nivel: "Liceo" },
    { id: 3, nombre: "Ciencias Naturales", nivel: "Primaria" },
    { id: 4, nombre: "Biología", nivel: "Liceo" },
    { id: 5, nombre: "Química", nivel: "Liceo" },
    { id: 6, nombre: "Física", nivel: "Liceo" },
    { id: 7, nombre: "Historia de Venezuela", nivel: "Liceo" },
    { id: 8, nombre: "Geografía", nivel: "Liceo" },
    { id: 9, nombre: "Inglés", nivel: "Liceo" },
    { id: 10, nombre: "Educación Física", nivel: "Primaria" },
    { id: 11, nombre: "Educación Artística", nivel: "Primaria" },
    { id: 12, nombre: "Informática", nivel: "Liceo" },
];

const NIVELES: Nivel[] = ["Primaria", "Liceo"];

const NIVEL_META: Record<Nivel, { cls: string }> = {
    Primaria: { cls: "bg-edu-primary-100 text-edu-primary" },
    Liceo: { cls: "bg-edu-warning-bg text-edu-warning" },
};

const DOCENTES = ["Sin asignar", "Prof. María Herrera", "Prof. Luis Rondón", "Prof. Carla Yépez", "Prof. José Bracho", "Prof. Ana Salazar", "Prof. Pedro Uzcátegui"];

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

const BLOQUES_INICIALES: Bloque[] = [
    { id: 1, inicio: "07:00", fin: "07:45" },
    { id: 2, inicio: "07:45", fin: "08:30" },
    { id: 3, inicio: "08:30", fin: "09:15" },
    { id: 4, inicio: "09:30", fin: "10:15" },
];

const ANIOS = ["1.º Año", "2.º Año", "3.º Año", "4.º Año", "5.º Año"];

const SEC_COLS = "grid-cols-[1fr_0.7fr_0.7fr_1.4fr_0.7fr]";
const SEC_HEADERS = ["Año", "Sección", "Cupo", "Tutor", "Acciones"];

const MAT_COLS = "grid-cols-[0.5fr_2fr_1fr_0.7fr]";
const MAT_HEADERS = ["N.º", "Materia", "Nivel", "Acciones"];

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function CoordSeccionesPage() {
    const [tab, setTab] = useState<Tab>("secciones");

    // Secciones
    const [secciones, setSecciones] = useState<Seccion[]>(SECCIONES_INICIALES);
    const [secModal, setSecModal] = useState<{ mode: "add" | "edit"; id: number | null; anio: string; seccion: string; cupo: string; tutor: string } | null>(null);
    const [confirmDelSec, setConfirmDelSec] = useState<Seccion | null>(null);
    const [secQuery, setSecQuery] = useState("");
    const [secPage, setSecPage] = useState(1);

    // Materias
    const [materias, setMaterias] = useState<Materia[]>(MATERIAS_INICIALES);
    const [matModal, setMatModal] = useState<{ mode: "add" | "edit"; id: number | null; nombre: string; nivel: Nivel } | null>(null);
    const [confirmDelMat, setConfirmDelMat] = useState<Materia | null>(null);
    const [matQuery, setMatQuery] = useState("");
    const [matPage, setMatPage] = useState(1);

    // Horarios
    const [bloques, setBloques] = useState<Bloque[]>(BLOQUES_INICIALES);
    const [nuevoBloque, setNuevoBloque] = useState({ inicio: "", fin: "" });
    // Asignación docente por celda: clave `${bloqueId}-${dia}`
    const [asignaciones, setAsignaciones] = useState<Record<string, string>>({});

    // Filtro y paginación de secciones
    const seccionesVisibles = secciones.filter(
        (s) => !secQuery.trim() || `${s.anio} ${s.seccion} ${s.tutor}`.toLowerCase().includes(secQuery.trim().toLowerCase())
    );
    const totalSecPages = Math.max(1, Math.ceil(seccionesVisibles.length / PER_PAGE));
    const secCurrentPage = Math.min(secPage, totalSecPages);
    const pagedSecciones = seccionesVisibles.slice((secCurrentPage - 1) * PER_PAGE, secCurrentPage * PER_PAGE);

    // Filtro y paginación de materias
    const materiasVisibles = materias.filter(
        (m) => !matQuery.trim() || `${m.nombre} ${m.nivel}`.toLowerCase().includes(matQuery.trim().toLowerCase())
    );
    const totalMatPages = Math.max(1, Math.ceil(materiasVisibles.length / PER_PAGE));
    const matCurrentPage = Math.min(matPage, totalMatPages);
    const pagedMaterias = materiasVisibles.slice((matCurrentPage - 1) * PER_PAGE, matCurrentPage * PER_PAGE);

    const openAddSec = () => setSecModal({ mode: "add", id: null, anio: "1.º Año", seccion: "A", cupo: "30", tutor: "Sin asignar" });
    const openEditSec = (s: Seccion) => setSecModal({ mode: "edit", id: s.id, anio: s.anio, seccion: s.seccion, cupo: String(s.cupo), tutor: s.tutor });

    const guardarSeccion = (e: React.FormEvent) => {
        e.preventDefault();
        if (!secModal) return;
        const datos = {
            anio: secModal.anio,
            seccion: secModal.seccion.trim().toUpperCase() || "A",
            cupo: Number(secModal.cupo) || 30,
            tutor: secModal.tutor,
        };
        if (secModal.mode === "add") {
            setSecciones([...secciones, { id: Date.now(), ...datos }]);
        } else {
            setSecciones((ss) => ss.map((x) => (x.id === secModal.id ? { ...x, ...datos } : x)));
        }
        setSecModal(null);
    };

    const eliminarSeccion = () => {
        if (!confirmDelSec) return;
        setSecciones((ss) => ss.filter((x) => x.id !== confirmDelSec.id));
        setConfirmDelSec(null);
    };

    const openAddMat = () => setMatModal({ mode: "add", id: null, nombre: "", nivel: "Primaria" });
    const openEditMat = (m: Materia) => setMatModal({ mode: "edit", id: m.id, nombre: m.nombre, nivel: m.nivel });

    const guardarMateria = (e: React.FormEvent) => {
        e.preventDefault();
        if (!matModal) return;
        const nombre = matModal.nombre.trim();
        if (!nombre) return;
        if (matModal.mode === "add") {
            setMaterias([...materias, { id: Date.now(), nombre, nivel: matModal.nivel }]);
            setMatQuery("");
            setMatPage(totalMatPages);
        } else {
            setMaterias((ms) => ms.map((x) => (x.id === matModal.id ? { ...x, nombre, nivel: matModal.nivel } : x)));
        }
        setMatModal(null);
    };

    const eliminarMateria = () => {
        if (!confirmDelMat) return;
        setMaterias((ms) => ms.filter((x) => x.id !== confirmDelMat.id));
        setConfirmDelMat(null);
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

    const TABS: { key: Tab; label: string }[] = [
        { key: "secciones", label: "Secciones / Años" },
        { key: "materias", label: "Materias" },
        { key: "horarios", label: "Formato de horarios" },
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
                    const active = tab === t.key;
                    return (
                        <button
                            key={t.key}
                            type="button"
                            onClick={() => setTab(t.key)}
                            className="px-3.5 py-2.5 text-[0.8125rem] font-medium border-b-2 -mb-px cursor-pointer bg-transparent transition-colors"
                            style={active ? { borderColor: accent.purple.fg, color: accent.purple.fg } : { borderColor: "transparent", color: "#6b7280" }}
                        >
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
                        <button onClick={openAddSec} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-edu-control text-[0.8rem] font-semibold cursor-pointer border-none text-white" style={{ backgroundColor: accent.purple.fg }}>
                            <Plus style={{ width: 14, height: 14 }} /> Agregar sección
                        </button>
                    </div>

                    {/* Buscador */}
                    <div className="px-5 py-3 border-b border-edu-border-soft">
                        <div className="relative">
                            <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={secQuery}
                                onChange={(e) => { setSecQuery(e.target.value); setSecPage(1); }}
                                placeholder="Buscar por año, sección o tutor…"
                                className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                            />
                        </div>
                    </div>

                    <div>
                        <div className={`grid ${SEC_COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                            {SEC_HEADERS.map((h, i) => (
                                <span key={i} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
                            ))}
                        </div>
                        {seccionesVisibles.length === 0 ? (
                            <p className="text-[0.8125rem] text-edu-ink-400 m-0 px-5 py-10 text-center">No hay secciones que coincidan con la búsqueda.</p>
                        ) : pagedSecciones.map((s, i) => (
                            <div key={s.id} className={`grid ${SEC_COLS} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < pagedSecciones.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
                                <span className="text-sm text-edu-ink font-semibold">{s.anio}</span>
                                <span className="text-[0.8125rem] text-edu-ink-700">{s.seccion}</span>
                                <span className="text-[0.8125rem] text-edu-ink-500">{s.cupo}</span>
                                <span className="text-[0.8125rem] text-edu-ink-700">{s.tutor}</span>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => openEditSec(s)} aria-label="Modificar sección" className="text-edu-ink-400 hover:text-edu-purple bg-transparent border-none cursor-pointer p-0 flex items-center">
                                        <Pencil style={{ width: 15, height: 15 }} />
                                    </button>
                                    <button onClick={() => setConfirmDelSec(s)} aria-label="Eliminar sección" className="text-edu-ink-400 hover:text-edu-danger bg-transparent border-none cursor-pointer p-0 flex items-center">
                                        <Trash2 style={{ width: 15, height: 15 }} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {totalSecPages > 1 && (
                        <div className="px-5 py-4 border-t border-edu-border-soft">
                            <Pagination currentPage={secCurrentPage} totalPages={totalSecPages} onPageChange={setSecPage} />
                        </div>
                    )}
                </div>
            )}

            {/* --- Tab Materias --- */}
            {tab === "materias" && (
                <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                    <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Materias del plan de estudios</h3>
                        <div className="flex items-center gap-3">
                            <span className="text-[0.8rem] text-edu-ink-400 font-medium">{materiasVisibles.length} materia{materiasVisibles.length === 1 ? "" : "s"}</span>
                            <button onClick={openAddMat} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-edu-control text-[0.8rem] font-semibold cursor-pointer border-none text-white" style={{ backgroundColor: accent.purple.fg }}>
                                <Plus style={{ width: 14, height: 14 }} /> Agregar materia
                            </button>
                        </div>
                    </div>

                    {/* Buscador */}
                    <div className="px-5 py-3 border-b border-edu-border-soft">
                        <div className="relative">
                            <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={matQuery}
                                onChange={(e) => { setMatQuery(e.target.value); setMatPage(1); }}
                                placeholder="Buscar materia…"
                                className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                            />
                        </div>
                    </div>

                    {/* Tabla */}
                    <div>
                        <div className={`grid ${MAT_COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                            {MAT_HEADERS.map((h) => (
                                <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
                            ))}
                        </div>
                        {materiasVisibles.length === 0 ? (
                            <p className="text-[0.8125rem] text-edu-ink-400 m-0 px-5 py-10 text-center">No hay materias que coincidan con la búsqueda.</p>
                        ) : (
                            pagedMaterias.map((m, i) => (
                                <div key={m.id} className={`grid ${MAT_COLS} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < pagedMaterias.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
                                    <span className="text-[0.8125rem] text-edu-ink-500 font-semibold">{(matCurrentPage - 1) * PER_PAGE + i + 1}</span>
                                    <span className="text-sm text-edu-ink font-semibold flex items-center gap-2">
                                        <BookOpen className="text-edu-purple" style={{ width: 15, height: 15 }} />
                                        {m.nombre}
                                    </span>
                                    <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${NIVEL_META[m.nivel].cls}`}>{m.nivel}</span>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => openEditMat(m)} aria-label={`Modificar ${m.nombre}`} className="text-edu-ink-400 hover:text-edu-purple bg-transparent border-none cursor-pointer p-0 flex items-center">
                                            <Pencil style={{ width: 15, height: 15 }} />
                                        </button>
                                        <button onClick={() => setConfirmDelMat(m)} aria-label={`Eliminar ${m.nombre}`} className="text-edu-ink-400 hover:text-edu-danger bg-transparent border-none cursor-pointer p-0 flex items-center">
                                            <Trash2 style={{ width: 15, height: 15 }} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                        {totalMatPages > 1 && (
                            <div className="px-5 py-4 border-t border-edu-border-soft">
                                <Pagination currentPage={matCurrentPage} totalPages={totalMatPages} onPageChange={setMatPage} />
                            </div>
                        )}
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

            {/* Modal agregar / modificar sección */}
            {secModal && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setSecModal(null)}>
                    <div className="bg-edu-surface rounded-edu-card w-full max-w-md shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
                        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: accent.purple.bg }}>
                                    <Layers style={{ width: 16, height: 16, color: accent.purple.fg }} />
                                </div>
                                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">{secModal.mode === "add" ? "Agregar sección" : "Modificar sección"}</h3>
                            </div>
                            <button onClick={() => setSecModal(null)} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={guardarSeccion} className="p-5 flex flex-col gap-4">
                            <div className="flex gap-3">
                                <div className="flex flex-col gap-1.5 flex-1">
                                    <label className="text-edu-ink-700 text-sm font-medium">Año</label>
                                    <select value={secModal.anio} onChange={(e) => setSecModal({ ...secModal, anio: e.target.value })} className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-edu-primary">
                                        {ANIOS.map((a) => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5 w-24">
                                    <label className="text-edu-ink-700 text-sm font-medium">Sección</label>
                                    <input type="text" maxLength={2} value={secModal.seccion} onChange={(e) => setSecModal({ ...secModal, seccion: e.target.value })} className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full uppercase focus:border-edu-primary" />
                                </div>
                                <div className="flex flex-col gap-1.5 w-24">
                                    <label className="text-edu-ink-700 text-sm font-medium">Cupo</label>
                                    <input type="number" min={1} value={secModal.cupo} onChange={(e) => setSecModal({ ...secModal, cupo: e.target.value })} className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-edu-ink-700 text-sm font-medium">Tutor asignado</label>
                                <select value={secModal.tutor} onChange={(e) => setSecModal({ ...secModal, tutor: e.target.value })} className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-edu-primary">
                                    {DOCENTES.map((d) => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-2 justify-end pt-1">
                                <button type="button" onClick={() => setSecModal(null)} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer hover:bg-edu-subtle">Cancelar</button>
                                <button type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold border-none cursor-pointer" style={{ backgroundColor: accent.purple.fg }}>
                                    <UserCog className="w-4 h-4" />
                                    {secModal.mode === "add" ? "Agregar" : "Guardar cambios"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirmación de eliminación de sección */}
            {confirmDelSec && (
                <ConfirmDialog
                    tone="danger"
                    icon={Trash2}
                    title="Eliminar sección"
                    message={<>¿Seguro que deseas eliminar la sección <strong>{confirmDelSec.anio} · {confirmDelSec.seccion}</strong>? Esta acción no se puede deshacer.</>}
                    confirmLabel="Sí, eliminar"
                    onConfirm={eliminarSeccion}
                    onCancel={() => setConfirmDelSec(null)}
                />
            )}

            {/* Modal agregar / modificar materia */}
            {matModal && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setMatModal(null)}>
                    <div className="bg-edu-surface rounded-edu-card w-full max-w-md shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
                        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: accent.purple.bg }}>
                                    <BookOpen style={{ width: 16, height: 16, color: accent.purple.fg }} />
                                </div>
                                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">{matModal.mode === "add" ? "Agregar materia" : "Modificar materia"}</h3>
                            </div>
                            <button onClick={() => setMatModal(null)} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={guardarMateria} className="p-5 flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-edu-ink-700 text-sm font-medium">Nivel</label>
                                <div className="flex gap-2">
                                    {NIVELES.map((n) => (
                                        <button
                                            key={n}
                                            type="button"
                                            onClick={() => setMatModal({ ...matModal, nivel: n })}
                                            className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-edu-control text-[0.8125rem] font-semibold cursor-pointer transition-colors border ${matModal.nivel === n ? "text-white border-transparent" : "bg-edu-surface text-edu-ink-700 border-edu-border hover:bg-edu-subtle"}`}
                                            style={matModal.nivel === n ? { backgroundColor: accent.purple.fg } : undefined}
                                        >
                                            {n}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-edu-ink-700 text-sm font-medium">Nombre de la materia</label>
                                <input type="text" value={matModal.nombre} onChange={(e) => setMatModal({ ...matModal, nombre: e.target.value })} placeholder="Ej. Premilitar" required className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary" />
                            </div>
                            <div className="flex gap-2 justify-end pt-1">
                                <button type="button" onClick={() => setMatModal(null)} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer hover:bg-edu-subtle">Cancelar</button>
                                <button type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold border-none cursor-pointer" style={{ backgroundColor: accent.purple.fg }}>
                                    <BookOpen className="w-4 h-4" />
                                    {matModal.mode === "add" ? "Agregar" : "Guardar cambios"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirmación de eliminación de materia */}
            {confirmDelMat && (
                <ConfirmDialog
                    tone="danger"
                    icon={Trash2}
                    title="Eliminar materia"
                    message={<>¿Seguro que deseas eliminar la materia <strong>{confirmDelMat.nombre}</strong>? Esta acción no se puede deshacer.</>}
                    confirmLabel="Sí, eliminar"
                    onConfirm={eliminarMateria}
                    onCancel={() => setConfirmDelMat(null)}
                />
            )}
        </div>
    );
}
