import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import {
    Users,
    GraduationCap,
    UserSquare2,
    Plus,
    Eye,
    Pencil,
    UserCog,
    Ban,
    X,
    AlertCircle,
    AlertTriangle,
    Search,
    Phone,
    Mail,
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { accent, color } from "../theme/tokens";
import { Pagination } from "../components/Pagination";
import { useFetch } from "../datos_maquetados";
import {
    getPersonasEstudiantes,
    getPersonasDocentes,
    getPersonasPorSeccion,
    type Estudiante,
    type Docente,
    type RepRelacion,
} from "../datos_maquetados/actions/coordinador";

/* ------------------------------------------------------------------ */
/* Tipos y presentación                                                */
/* ------------------------------------------------------------------ */

type Tab = "estudiantes" | "docentes";

/** Colores del donut de secciones (por posición). */
const SECCIONES_FILLS = [color.primary, color.purple, color.success, color.warningStrong, color.danger];

const PER_PAGE = 5;

const getAño = (grado: string) => grado.split(" ").slice(0, 2).join(" ");
const getSeccion = (grado: string) => grado.split(" ").pop() ?? "";

function DonutTooltip({ active, payload }: any) {
    if (!active || !payload || payload.length === 0) return null;
    const p = payload[0];
    return (
        <div className="bg-edu-surface border border-edu-border rounded-edu-chip px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-1.5 text-[0.72rem] text-edu-ink-700">
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: p.payload.fill }} />
                {p.name}: <strong>{p.value}</strong>
            </div>
        </div>
    );
}

const EST_COLS = "grid-cols-[1.3fr_1fr_0.9fr_1.2fr_1fr]";
const EST_HEADERS = ["Nombre", "Cédula", "Año / Sección", "Representante", "Acciones"];
const DOC_COLS = "grid-cols-[1.3fr_1.4fr_1.1fr_0.8fr_1.2fr]";
const DOC_HEADERS = ["Nombre", "Área / Materias", "Secciones", "Estado", "Acciones"];

/* ------------------------------------------------------------------ */
/* Sub-componente: vista detalle del modal                             */
/* ------------------------------------------------------------------ */

function InfoField({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">{label}</div>
            <div className="text-[0.875rem] text-edu-ink font-medium">{value || "—"}</div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function CoordPersonasPage() {
    const { pathname } = useLocation();
    const { data: estudiantesFetched } = useFetch(getPersonasEstudiantes, []);
    const { data: docentesFetched } = useFetch(getPersonasDocentes, []);
    const { data: seccionesRaw } = useFetch(getPersonasPorSeccion, []);
    const [tab, setTab] = useState<Tab>(pathname.endsWith("docentes") ? "docentes" : "estudiantes");
    const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
    useEffect(() => setEstudiantes(estudiantesFetched), [estudiantesFetched]);
    const [docentes, setDocentes] = useState<Docente[]>([]);
    useEffect(() => setDocentes(docentesFetched), [docentesFetched]);

    // Serie del donut: reatacha el color por posición.
    const SECCIONES_DATA = seccionesRaw.map((s, i) => ({ ...s, fill: SECCIONES_FILLS[i % SECCIONES_FILLS.length] }));
    const TOTAL_SECCIONES = SECCIONES_DATA.reduce((n, s) => n + s.estudiantes, 0);

    // Búsqueda y filtros
    const [query, setQuery] = useState("");
    const [añoFilter, setAñoFilter] = useState("todos");
    const [seccionFilter, setSeccionFilter] = useState("todos");
    const [page, setPage] = useState(1);

    // Modal estudiante
    const [estModal, setEstModal] = useState<{ mode: "ver" | "añadir" | "modificar"; data: Estudiante } | null>(null);
    // Modal docente
    const [docModal, setDocModal] = useState<{ mode: "ver" | "modificar" | "asignar"; data: Docente } | null>(null);

    const emptyEst: Estudiante = {
        id: 0, nombre: "", cedula: "", grado: "1.º Año A", fechaNac: "",
        representante: "", repCedula: "", repTelefono: "", repRelacion: "Madre", repEmail: "",
    };

    const toggleDocente = (id: number) =>
        setDocentes((ds) => ds.map((d) => (d.id === id ? { ...d, estado: d.estado === "Activo" ? "Suspendido" : "Activo" } : d)));

    const guardarEstudiante = (e: React.FormEvent) => {
        e.preventDefault();
        if (!estModal) return;
        const d = estModal.data;
        if (estModal.mode === "añadir") {
            setEstudiantes([{ ...d, id: Date.now() }, ...estudiantes]);
        } else if (estModal.mode === "modificar") {
            setEstudiantes((es) => es.map((x) => (x.id === d.id ? d : x)));
        }
        setEstModal(null);
    };

    const guardarDocente = (e: React.FormEvent) => {
        e.preventDefault();
        if (!docModal) return;
        const d = docModal.data;
        setDocentes((ds) => ds.map((x) => (x.id === d.id ? d : x)));
        setDocModal(null);
    };

    // Opciones dinámicas de filtro
    const añosDisponibles = Array.from(new Set(estudiantes.map((s) => getAño(s.grado)))).sort();
    const seccionesDisponibles = Array.from(new Set(estudiantes.map((s) => getSeccion(s.grado)))).sort();

    // Filtrado y paginación
    const filteredEst = estudiantes.filter((s) => {
        if (añoFilter !== "todos" && getAño(s.grado) !== añoFilter) return false;
        if (seccionFilter !== "todos" && getSeccion(s.grado) !== seccionFilter) return false;
        if (query.trim() && !`${s.nombre} ${s.cedula} ${s.representante}`.toLowerCase().includes(query.trim().toLowerCase())) return false;
        return true;
    });
    const totalPages = Math.max(1, Math.ceil(filteredEst.length / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paged = filteredEst.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    const readOnlyDoc = docModal?.mode === "ver";

    return (
        <div className="flex flex-col gap-5">
            {/* Encabezado */}
            <div className="flex justify-between items-center flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: accent.purple.bg }}>
                        <Users style={{ width: 22, height: 22, color: accent.purple.fg }} />
                    </div>
                    <div>
                        <h2 className="m-0 text-edu-ink font-bold text-[1.15rem]">Estudiantes</h2>
                        <p className="m-0 text-edu-ink-500 text-[0.8125rem]">Directorio de estudiantes del plantel</p>
                    </div>
                </div>
                <button onClick={() => setEstModal({ mode: "añadir", data: emptyEst })} className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold cursor-pointer border-none text-white" style={{ backgroundColor: accent.purple.fg }}>
                    <Plus style={{ width: 16, height: 16 }} /> Añadir estudiante
                </button>
            </div>

            {/* Gráfico y tarjetas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                    <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Estudiantes por sección</h3>
                        <span className="text-[0.8rem] text-edu-ink-400 font-medium">Distribución por año</span>
                    </div>
                    <div className="flex items-center gap-6 p-5 max-sm:flex-col">
                        <div className="relative w-[180px] h-[180px] shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={SECCIONES_DATA} dataKey="estudiantes" nameKey="seccion" cx="50%" cy="50%" innerRadius={58} outerRadius={82} paddingAngle={2} stroke="none">
                                        {SECCIONES_DATA.map((s) => (
                                            <Cell key={s.seccion} fill={s.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<DonutTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-[1.5rem] font-bold text-edu-ink leading-none">{TOTAL_SECCIONES}</span>
                                <span className="text-[0.7rem] text-edu-ink-400 font-medium mt-1">estudiantes</span>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col gap-2.5 w-full">
                            {SECCIONES_DATA.map((s) => {
                                const pct = Math.round((s.estudiantes / TOTAL_SECCIONES) * 100);
                                return (
                                    <div key={s.seccion} className="flex items-center gap-2.5">
                                        <span className="w-2.5 h-2.5 rounded-[3px] shrink-0" style={{ backgroundColor: s.fill }} />
                                        <span className="text-[0.8125rem] text-edu-ink-700 flex-1">{s.seccion}</span>
                                        <span className="text-[0.8125rem] text-edu-ink font-semibold">{s.estudiantes}</span>
                                        <span className="text-[0.75rem] text-edu-ink-400 w-9 text-right">{pct} %</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">Asistencia general</p>
                                <p className="text-edu-ink text-[1.4rem] font-bold mt-1">92,4 %</p>
                            </div>
                            <div className="w-10 h-10 rounded-edu-control bg-edu-warning-bg flex items-center justify-center">
                                <AlertCircle className="w-5 h-5 text-edu-warning-strong" />
                            </div>
                        </div>
                        <div className="flex gap-1">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <div key={i} className={`flex-1 h-1.5 rounded-edu-pill ${i < 18 ? "bg-edu-primary" : "bg-edu-danger-bg"}`} />
                            ))}
                        </div>
                        <p className="text-edu-ink-400 text-xs m-0">Los estudiantes han asistido a clases en un +2%</p>
                    </div>

                    <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-edu-ink-500 text-[0.75rem] font-medium m-0 uppercase tracking-[0.05em]">Incidencias</p>
                                <p className="text-edu-ink text-[1.6rem] font-bold mt-1 mb-0">4</p>
                            </div>
                            <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: accent.red.bg }}>
                                <AlertTriangle style={{ width: "20px", height: "20px", color: accent.red.fg }} />
                            </div>
                        </div>
                        <p className="text-edu-ink-400 text-[0.75rem] m-0">3 más que el mes anterior</p>
                    </div>
                </div>
            </div>

            {/* Tabla de estudiantes */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                    <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Estudiantes inscritos</h3>
                    <span className="text-[0.8rem] text-edu-ink-400 font-medium">{filteredEst.length} estudiante{filteredEst.length === 1 ? "" : "s"}</span>
                </div>

                {/* Buscador y filtros */}
                <div className="px-5 py-3 flex gap-2 items-center flex-wrap border-b border-edu-border-soft">
                    <div className="relative flex-1 min-w-[180px]">
                        <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                            placeholder="Buscar nombre, cédula o representante…"
                            className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                        />
                    </div>
                    <select
                        value={añoFilter}
                        onChange={(e) => { setAñoFilter(e.target.value); setPage(1); }}
                        className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
                    >
                        <option value="todos">Todos los años</option>
                        {añosDisponibles.map((a) => (
                            <option key={a} value={a}>{a}</option>
                        ))}
                    </select>
                    <select
                        value={seccionFilter}
                        onChange={(e) => { setSeccionFilter(e.target.value); setPage(1); }}
                        className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
                    >
                        <option value="todos">Todas las secciones</option>
                        {seccionesDisponibles.map((s) => (
                            <option key={s} value={s}>Sección {s}</option>
                        ))}
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <div className="min-w-[680px]">
                    <div className={`grid ${EST_COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                        {EST_HEADERS.map((h) => (
                            <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
                        ))}
                    </div>

                    {filteredEst.length === 0 && (
                        <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">No hay estudiantes que coincidan con el filtro.</div>
                    )}

                    {paged.map((s, i) => (
                        <div key={s.id} className={`grid ${EST_COLS} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
                            <span className="text-sm text-edu-ink font-semibold pr-3">{s.nombre}</span>
                            <span className="text-[0.8125rem] text-edu-ink-500">{s.cedula}</span>
                            <span className="text-[0.8125rem] text-edu-ink-700">{s.grado}</span>
                            <span className="text-[0.8125rem] text-edu-ink-500 pr-3">{s.representante}</span>
                            <div className="flex gap-3">
                                <button onClick={() => setEstModal({ mode: "ver", data: s })} className="inline-flex items-center gap-1 text-[0.75rem] font-semibold text-edu-ink-500 cursor-pointer bg-transparent border-none p-0 hover:text-edu-ink-700">
                                    <Eye style={{ width: 14, height: 14 }} /> Ver
                                </button>
                                <button onClick={() => setEstModal({ mode: "modificar", data: s })} className="inline-flex items-center gap-1 text-[0.75rem] font-semibold cursor-pointer bg-transparent border-none p-0 hover:underline" style={{ color: accent.purple.fg }}>
                                    <Pencil style={{ width: 14, height: 14 }} /> Modificar
                                </button>
                            </div>
                        </div>
                    ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="px-5 py-4 border-t border-edu-border-soft">
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
                        </div>
                    )}
                </div>
            </div>

            {/* Modal estudiante */}
            {estModal && (
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
            )}
        </div>
    );
}
