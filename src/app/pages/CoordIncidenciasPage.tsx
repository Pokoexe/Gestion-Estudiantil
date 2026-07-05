import { useState } from "react";
import {
    ShieldAlert,
    GraduationCap,
    UserSquare2,
    PlusCircle,
    X,
    FileText,
    Settings2,
    Search,
} from "lucide-react";
import { accent } from "../theme/tokens";
import { Pagination } from "../components/Pagination";

const PER_PAGE = 5;

/* ------------------------------------------------------------------ */
/* Tipos y datos ficticios                                             */
/* ------------------------------------------------------------------ */

type TipoPersona = "Docente" | "Estudiante" | "Formato";
type Gravedad = "Leve" | "Moderada" | "Grave";

interface Incidencia {
    id: number;
    persona: string;
    tipo: TipoPersona;
    gravedad: Gravedad;
    fecha: string;
    descripcion: string;
}

const INCIDENCIAS_INICIALES: Incidencia[] = [
    { id: 1, persona: "Andrés Villalobos", tipo: "Estudiante", gravedad: "Moderada", fecha: "2 jul 2026", descripcion: "Se retiró del aula sin autorización durante la clase de Matemática." },
    { id: 2, persona: "Prof. Luis Rondón", tipo: "Docente", gravedad: "Leve", fecha: "1 jul 2026", descripcion: "Entrega tardía del consolidado de notas del segundo lapso." },
    { id: 3, persona: "Mariangel Ochoa", tipo: "Estudiante", gravedad: "Grave", fecha: "29 jun 2026", descripcion: "Riña con otra estudiante en el receso; se citó a los representantes." },
    { id: 4, persona: "Prof. Pedro Uzcátegui", tipo: "Docente", gravedad: "Moderada", fecha: "27 jun 2026", descripcion: "Inasistencia sin justificativo a la reunión de departamento." },
    { id: 5, persona: "Kevin Graterol", tipo: "Estudiante", gravedad: "Leve", fecha: "25 jun 2026", descripcion: "Uso del teléfono celular durante la evaluación de Biología." },
    { id: 6, persona: "Daniela Sánchez", tipo: "Estudiante", gravedad: "Moderada", fecha: "24 jun 2026", descripcion: "Llegada tarde reiterada a la primera hora de clase." },
    { id: 7, persona: "Prof. Carla Yépez", tipo: "Docente", gravedad: "Leve", fecha: "22 jun 2026", descripcion: "No registró la asistencia en el sistema durante la semana." },
    { id: 8, persona: "Josué Ramírez", tipo: "Estudiante", gravedad: "Grave", fecha: "20 jun 2026", descripcion: "Daño intencional al mobiliario del laboratorio de Física." },
];

const GRAVEDAD_META: Record<Gravedad, { cls: string }> = {
    Leve: { cls: "bg-edu-primary-100 text-edu-primary" },
    Moderada: { cls: "bg-edu-warning-bg text-edu-warning" },
    Grave: { cls: "bg-edu-danger-bg text-edu-danger" },
};

const GRAVEDADES: Gravedad[] = ["Leve", "Moderada", "Grave"];

const CAMPOS_FORMATO = [
    "Nombre y apellido de la persona",
    "Cédula / código de estudiante",
    "Tipo (docente / estudiante)",
    "Año y sección (si aplica)",
    "Fecha y hora del hecho",
    "Gravedad de la incidencia",
    "Descripción detallada del hecho",
    "Medida o acción tomada",
    "Responsable del registro",
];

const COLS = "grid-cols-[1.2fr_0.9fr_0.9fr_0.8fr_1.9fr]";
const HEADERS = ["Persona", "Tipo", "Gravedad", "Fecha", "Descripción"];

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function CoordIncidenciasPage() {
    const [incidencias, setIncidencias] = useState<Incidencia[]>(INCIDENCIAS_INICIALES);
    const [filtro, setFiltro] = useState<"Todos" | TipoPersona>("Todos");
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        persona: "",
        tipo: "Estudiante" as TipoPersona,
        gravedad: "Leve" as Gravedad,
        descripcion: "",
    });

    const visibles = incidencias
        .filter((i) => filtro === "Todos" || i.tipo === filtro)
        .filter((i) => !query.trim() || `${i.persona} ${i.tipo} ${i.descripcion}`.toLowerCase().includes(query.trim().toLowerCase()));

    const totalPages = Math.max(1, Math.ceil(visibles.length / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const pagedVisibles = visibles.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    const openModal = () => {
        setForm({ persona: "", tipo: "Estudiante", gravedad: "Leve", descripcion: "" });
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const nueva: Incidencia = {
            id: Date.now(),
            persona: form.persona.trim() || "Sin nombre",
            tipo: form.tipo,
            gravedad: form.gravedad,
            fecha: new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }),
            descripcion: form.descripcion.trim() || "Sin descripción.",
        };
        setIncidencias([nueva, ...incidencias]);
        setShowModal(false);
    };

    return (
        <div className="flex flex-col gap-5">
            {/* Encabezado */}
            <div className="flex justify-between items-center flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: accent.purple.bg }}>
                        <ShieldAlert style={{ width: 22, height: 22, color: accent.purple.fg }} />
                    </div>
                    <div>
                        <h2 className="m-0 text-edu-ink font-bold text-[1.15rem]">Incidencias</h2>
                        <p className="m-0 text-edu-ink-500 text-[0.8125rem]">Registra incidencias de docentes y estudiantes</p>
                    </div>
                </div>
                <button onClick={openModal} className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold cursor-pointer border-none text-white" style={{ backgroundColor: accent.purple.fg }}>
                    <PlusCircle style={{ width: 16, height: 16 }} />
                    Registrar incidencia
                </button>
            </div>

            {/* Filtro por tipo de persona */}
            <div className="flex gap-1 border-b border-edu-border-soft">
                {(["Todos", "Docente", "Estudiante", "Formato"] as const).map((f) => {
                    const active = filtro === f;
                    return (
                        <button
                            key={f}
                            type="button"
                            onClick={() => { setFiltro(f); setPage(1); }}
                            className="px-3.5 py-2.5 text-[0.8125rem] font-medium border-b-2 -mb-px cursor-pointer bg-transparent transition-colors"
                            style={active ? { borderColor: accent.purple.fg, color: accent.purple.fg } : { borderColor: "transparent", color: "#6b7280" }}
                        >
                            {f === "Todos" || f === "Formato" ? f : f + "s"}
                        </button>
                    );
                })}
            </div>


            {
                filtro === "Formato" ?
                    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Settings2 className="text-edu-purple" style={{ width: 16, height: 16 }} />
                                <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Formato de incidencias</h3>
                            </div>
                            <span className="text-[0.8rem] font-medium cursor-pointer" style={{ color: accent.purple.fg }}>Editar campos →</span>
                        </div>
                        <div className="px-5 py-4">
                            <p className="m-0 mb-3 text-[0.8125rem] text-edu-ink-500">Campos que se incluyen al registrar una incidencia. Puedes activarlos o desactivarlos según la política del plantel.</p>
                            <div className="grid grid-cols-3 gap-2.5">
                                {CAMPOS_FORMATO.map((campo) => (
                                    <label key={campo} className="flex items-center gap-2 px-3 py-2 rounded-edu-control bg-edu-subtle border border-edu-border-soft cursor-pointer">
                                        <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer accent-edu-purple" />
                                        <span className="text-[0.8rem] text-edu-ink-700">{campo}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    :
                    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                            <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Registro de incidencias</h3>
                            <span className="text-[0.8rem] text-edu-ink-400 font-medium">{visibles.length} incidencia{visibles.length === 1 ? "" : "s"}</span>
                        </div>

                        {/* Buscador */}
                        <div className="px-5 py-3 border-b border-edu-border-soft">
                            <div className="relative">
                                <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                                    placeholder="Buscar por persona, tipo o descripción…"
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
                            {visibles.length === 0 ? (
                                <p className="text-[0.8125rem] text-edu-ink-400 m-0 px-5 py-10 text-center">No hay incidencias que coincidan con la búsqueda.</p>
                            ) : (
                                pagedVisibles.map((inc, i) => {
                                    const st = GRAVEDAD_META[inc.gravedad];
                                    return (
                                        <div key={inc.id} className={`grid ${COLS} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < pagedVisibles.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
                                            <span className="text-sm text-edu-ink font-semibold pr-3">{inc.persona}</span>
                                            <span className="text-[0.8125rem] text-edu-ink-700 flex items-center gap-1.5">
                                                {inc.tipo === "Docente" ? <UserSquare2 className="text-edu-ink-400" style={{ width: 13, height: 13 }} /> : <GraduationCap className="text-edu-ink-400" style={{ width: 13, height: 13 }} />}
                                                {inc.tipo}
                                            </span>
                                            <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${st.cls}`}>{inc.gravedad}</span>
                                            <span className="text-[0.8125rem] text-edu-ink-500">{inc.fecha}</span>
                                            <span className="text-[0.8125rem] text-edu-ink-500 pr-3">{inc.descripcion}</span>
                                        </div>
                                    );
                                })
                            )}
                            {totalPages > 1 && (
                                <div className="px-5 py-4 border-t border-edu-border-soft">
                                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
                                </div>
                            )}
                        </div>
                    </div>
            }



            {/* Modal registrar incidencia */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-edu-surface rounded-edu-card w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
                        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: accent.purple.bg }}>
                                    <ShieldAlert style={{ width: 16, height: 16, color: accent.purple.fg }} />
                                </div>
                                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Registrar incidencia</h3>
                            </div>
                            <button onClick={() => setShowModal(false)} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-edu-ink-700 text-sm font-medium">Tipo de persona</label>
                                <div className="flex gap-2">
                                    {(["Estudiante", "Docente"] as TipoPersona[]).map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setForm({ ...form, tipo: t })}
                                            className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-edu-control text-[0.8125rem] font-semibold cursor-pointer transition-colors border ${form.tipo === t ? "text-white border-transparent" : "bg-edu-surface text-edu-ink-700 border-edu-border hover:bg-edu-subtle"
                                                }`}
                                            style={form.tipo === t ? { backgroundColor: accent.purple.fg } : undefined}
                                        >
                                            {t === "Docente" ? <UserSquare2 style={{ width: 15, height: 15 }} /> : <GraduationCap style={{ width: 15, height: 15 }} />}
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-edu-ink-700 text-sm font-medium">Nombre de la persona</label>
                                <input type="text" value={form.persona} onChange={(e) => setForm({ ...form, persona: e.target.value })} placeholder="Nombre y apellido" required className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-edu-ink-700 text-sm font-medium">Gravedad</label>
                                <select value={form.gravedad} onChange={(e) => setForm({ ...form, gravedad: e.target.value as Gravedad })} className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-edu-primary">
                                    {GRAVEDADES.map((g) => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-edu-ink-700 text-sm font-medium">Descripción del hecho</label>
                                <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} rows={3} required placeholder="Describe lo ocurrido…" className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full resize-none focus:border-edu-primary" />
                            </div>
                            <div className="flex gap-2 justify-end pt-1">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer hover:bg-edu-subtle">Cancelar</button>
                                <button type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold border-none cursor-pointer" style={{ backgroundColor: accent.purple.fg }}>
                                    <FileText className="w-4 h-4" />
                                    Registrar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
