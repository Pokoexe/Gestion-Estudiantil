import { useState } from "react";
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
} from "lucide-react";
import { accent } from "../theme/tokens";

/* ------------------------------------------------------------------ */
/* Tipos y datos ficticios                                             */
/* ------------------------------------------------------------------ */

type Tab = "estudiantes" | "docentes";
type EstadoDocente = "Activo" | "Suspendido";

interface Estudiante {
    id: number;
    nombre: string;
    cedula: string;
    grado: string;
    representante: string;
}

interface Docente {
    id: number;
    nombre: string;
    area: string;
    secciones: string;
    estado: EstadoDocente;
}

const ESTUDIANTES_INICIALES: Estudiante[] = [
    { id: 1, nombre: "Valeria Contreras", cedula: "V-31.245.678", grado: "3.º Año A", representante: "Josefina Contreras" },
    { id: 2, nombre: "Daniel Peña", cedula: "V-32.108.945", grado: "2.º Año B", representante: "Ramón Peña" },
    { id: 3, nombre: "Isabella Moreno", cedula: "V-30.987.221", grado: "4.º Año C", representante: "Carmen Moreno" },
    { id: 4, nombre: "Carlos Guédez", cedula: "V-29.845.117", grado: "5.º Año A", representante: "Luisa Guédez" },
    { id: 5, nombre: "Andrea Villalba", cedula: "V-31.677.402", grado: "5.º Año B", representante: "Óscar Villalba" },
    { id: 6, nombre: "Jesús Colmenares", cedula: "V-32.554.890", grado: "4.º Año A", representante: "Yajaira Colmenares" },
];

const DOCENTES_INICIALES: Docente[] = [
    { id: 1, nombre: "Prof. María Herrera", area: "Ciencias Naturales, Biología", secciones: "4.º B · 5.º A", estado: "Activo" },
    { id: 2, nombre: "Prof. Luis Rondón", area: "Educación Física", secciones: "3.º A · 3.º B · 4.º C", estado: "Activo" },
    { id: 3, nombre: "Prof. Carla Yépez", area: "Castellano, Literatura", secciones: "5.º A · 2.º A", estado: "Activo" },
    { id: 4, nombre: "Prof. José Bracho", area: "Matemática", secciones: "4.º C · 2.º B", estado: "Suspendido" },
    { id: 5, nombre: "Prof. Pedro Uzcátegui", area: "Química, Física", secciones: "5.º B", estado: "Activo" },
];

const EST_COLS = "grid-cols-[1.3fr_1fr_0.9fr_1.2fr_1fr]";
const EST_HEADERS = ["Nombre", "Cédula", "Año / Sección", "Representante", "Acciones"];
const DOC_COLS = "grid-cols-[1.3fr_1.4fr_1.1fr_0.8fr_1.2fr]";
const DOC_HEADERS = ["Nombre", "Área / Materias", "Secciones", "Estado", "Acciones"];

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function CoordPersonasPage() {
    const [tab, setTab] = useState<Tab>("estudiantes");
    const [estudiantes, setEstudiantes] = useState<Estudiante[]>(ESTUDIANTES_INICIALES);
    const [docentes, setDocentes] = useState<Docente[]>(DOCENTES_INICIALES);

    // Modal estudiante (ver / añadir / modificar)
    const [estModal, setEstModal] = useState<{ mode: "ver" | "añadir" | "modificar"; data: Estudiante } | null>(null);
    // Modal docente (ver / modificar / asignar)
    const [docModal, setDocModal] = useState<{ mode: "ver" | "modificar" | "asignar"; data: Docente } | null>(null);

    const emptyEst: Estudiante = { id: 0, nombre: "", cedula: "", grado: "1.º Año A", representante: "" };

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

    const readOnlyEst = estModal?.mode === "ver";
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
                        <h2 className="m-0 text-edu-ink font-bold text-[1.15rem]">Personas</h2>
                        <p className="m-0 text-edu-ink-500 text-[0.8125rem]">Directorio de estudiantes y docentes del plantel</p>
                    </div>
                </div>
                {tab === "estudiantes" && (
                    <button onClick={() => setEstModal({ mode: "añadir", data: emptyEst })} className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold cursor-pointer border-none text-white" style={{ backgroundColor: accent.purple.fg }}>
                        <Plus style={{ width: 16, height: 16 }} /> Añadir estudiante
                    </button>
                )}
            </div>

            {/* Pestañas */}
            <div className="flex gap-1 border-b border-edu-border-soft">
                {([
                    { key: "estudiantes" as Tab, label: "Estudiantes", icon: GraduationCap },
                    { key: "docentes" as Tab, label: "Docentes", icon: UserSquare2 },
                ]).map((t) => {
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

            {/* --- Tab Estudiantes --- */}
            {tab === "estudiantes" && (
                <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                    <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Estudiantes inscritos</h3>
                        <span className="text-[0.8rem] text-edu-ink-400 font-medium">{estudiantes.length} estudiantes</span>
                    </div>
                    <div>
                        <div className={`grid ${EST_COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                            {EST_HEADERS.map((h) => (
                                <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
                            ))}
                        </div>
                        {estudiantes.map((s, i) => (
                            <div key={s.id} className={`grid ${EST_COLS} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < estudiantes.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
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
                </div>
            )}

            {/* --- Tab Docentes --- */}
            {tab === "docentes" && (
                <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                    <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Docentes del plantel</h3>
                        <span className="text-[0.8rem] text-edu-ink-400 font-medium">{docentes.length} docentes</span>
                    </div>
                    <div>
                        <div className={`grid ${DOC_COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                            {DOC_HEADERS.map((h) => (
                                <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
                            ))}
                        </div>
                        {docentes.map((d, i) => (
                            <div key={d.id} className={`grid ${DOC_COLS} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < docentes.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
                                <span className="text-sm text-edu-ink font-semibold pr-3">{d.nombre}</span>
                                <span className="text-[0.8125rem] text-edu-ink-700 pr-3">{d.area}</span>
                                <span className="text-[0.8125rem] text-edu-ink-500">{d.secciones}</span>
                                <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${d.estado === "Activo" ? "bg-edu-success-bg text-edu-success" : "bg-edu-danger-bg text-edu-danger"}`}>{d.estado}</span>
                                <div className="flex gap-2.5 flex-wrap">
                                    <button onClick={() => setDocModal({ mode: "ver", data: d })} className="inline-flex items-center gap-1 text-[0.75rem] font-semibold text-edu-ink-500 cursor-pointer bg-transparent border-none p-0 hover:text-edu-ink-700">
                                        <Eye style={{ width: 14, height: 14 }} /> Ver
                                    </button>
                                    <button onClick={() => setDocModal({ mode: "asignar", data: d })} className="inline-flex items-center gap-1 text-[0.75rem] font-semibold cursor-pointer bg-transparent border-none p-0 hover:underline" style={{ color: accent.purple.fg }}>
                                        <UserCog style={{ width: 14, height: 14 }} /> Asignar
                                    </button>
                                    <button onClick={() => toggleDocente(d.id)} className={`inline-flex items-center gap-1 text-[0.75rem] font-semibold cursor-pointer bg-transparent border-none p-0 hover:underline ${d.estado === "Activo" ? "text-edu-danger" : "text-edu-success"}`}>
                                        <Ban style={{ width: 14, height: 14 }} /> {d.estado === "Activo" ? "Cancelar" : "Reactivar"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal estudiante */}
            {estModal && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setEstModal(null)}>
                    <div className="bg-edu-surface rounded-edu-card w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
                        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: accent.purple.bg }}>
                                    <GraduationCap style={{ width: 16, height: 16, color: accent.purple.fg }} />
                                </div>
                                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem] capitalize">{estModal.mode} estudiante</h3>
                            </div>
                            <button onClick={() => setEstModal(null)} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={guardarEstudiante} className="p-5 flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-edu-ink-700 text-sm font-medium">Nombre y apellido</label>
                                <input type="text" value={estModal.data.nombre} readOnly={readOnlyEst} required onChange={(e) => setEstModal({ ...estModal, data: { ...estModal.data, nombre: e.target.value } })} className={`border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary ${readOnlyEst ? "cursor-default text-edu-ink-500" : ""}`} />
                            </div>
                            <div className="flex gap-3">
                                <div className="flex flex-col gap-1.5 flex-1">
                                    <label className="text-edu-ink-700 text-sm font-medium">Cédula</label>
                                    <input type="text" value={estModal.data.cedula} readOnly={readOnlyEst} onChange={(e) => setEstModal({ ...estModal, data: { ...estModal.data, cedula: e.target.value } })} placeholder="V-00.000.000" className={`border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary ${readOnlyEst ? "cursor-default text-edu-ink-500" : ""}`} />
                                </div>
                                <div className="flex flex-col gap-1.5 flex-1">
                                    <label className="text-edu-ink-700 text-sm font-medium">Año / Sección</label>
                                    <input type="text" value={estModal.data.grado} readOnly={readOnlyEst} onChange={(e) => setEstModal({ ...estModal, data: { ...estModal.data, grado: e.target.value } })} placeholder="Ej. 4.º Año B" className={`border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary ${readOnlyEst ? "cursor-default text-edu-ink-500" : ""}`} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-edu-ink-700 text-sm font-medium">Representante</label>
                                <input type="text" value={estModal.data.representante} readOnly={readOnlyEst} onChange={(e) => setEstModal({ ...estModal, data: { ...estModal.data, representante: e.target.value } })} className={`border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary ${readOnlyEst ? "cursor-default text-edu-ink-500" : ""}`} />
                            </div>
                            <div className="flex gap-2 justify-end pt-1">
                                <button type="button" onClick={() => setEstModal(null)} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer hover:bg-edu-subtle">Cerrar</button>
                                {!readOnlyEst && (
                                    <button type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold border-none cursor-pointer" style={{ backgroundColor: accent.purple.fg }}>
                                        {estModal.mode === "añadir" ? <Plus className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                                        {estModal.mode === "añadir" ? "Añadir" : "Guardar cambios"}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal docente */}
            {docModal && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setDocModal(null)}>
                    <div className="bg-edu-surface rounded-edu-card w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
                        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: accent.purple.bg }}>
                                    <UserSquare2 style={{ width: 16, height: 16, color: accent.purple.fg }} />
                                </div>
                                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem] capitalize">{docModal.mode === "asignar" ? "Asignar secciones" : `${docModal.mode} docente`}</h3>
                            </div>
                            <button onClick={() => setDocModal(null)} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={guardarDocente} className="p-5 flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-edu-ink-700 text-sm font-medium">Nombre del docente</label>
                                <input type="text" value={docModal.data.nombre} readOnly={readOnlyDoc || docModal.mode === "asignar"} onChange={(e) => setDocModal({ ...docModal, data: { ...docModal.data, nombre: e.target.value } })} className={`border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary ${readOnlyDoc || docModal.mode === "asignar" ? "cursor-default text-edu-ink-500" : ""}`} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-edu-ink-700 text-sm font-medium">Área / Materias</label>
                                <input type="text" value={docModal.data.area} readOnly={readOnlyDoc || docModal.mode === "asignar"} onChange={(e) => setDocModal({ ...docModal, data: { ...docModal.data, area: e.target.value } })} className={`border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary ${readOnlyDoc || docModal.mode === "asignar" ? "cursor-default text-edu-ink-500" : ""}`} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-edu-ink-700 text-sm font-medium">Secciones asignadas</label>
                                <input type="text" value={docModal.data.secciones} readOnly={readOnlyDoc} onChange={(e) => setDocModal({ ...docModal, data: { ...docModal.data, secciones: e.target.value } })} placeholder="Ej. 4.º B · 5.º A" className={`border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary ${readOnlyDoc ? "cursor-default text-edu-ink-500" : ""}`} />
                            </div>
                            <div className="flex gap-2 justify-end pt-1">
                                <button type="button" onClick={() => setDocModal(null)} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer hover:bg-edu-subtle">Cerrar</button>
                                {!readOnlyDoc && (
                                    <button type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold border-none cursor-pointer" style={{ backgroundColor: accent.purple.fg }}>
                                        <UserCog className="w-4 h-4" />
                                        Guardar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
