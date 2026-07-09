import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
    Search, BookOpen, Users, Clock, CheckCircle2, XCircle, UserSquare2, X,
    CalendarDays, ClipboardList, PlusCircle, ImageIcon,
} from "lucide-react";
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { color, accent } from "../theme/tokens";
import { Pagination } from "../components/Pagination";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useFetch } from "../datos_maquetados";
import {
    getCoordCursos,
    getCoordCursosChart,
    type CoordCurso,
    type CursoStatus,
} from "../datos_maquetados/actions/coordinador";

const PER_PAGE = 6;

const AREAS = [
    { dataKey: "rob", name: "Robótica", color: color.primary },
    { dataKey: "web", name: "Prog. web", color: color.success },
    { dataKey: "ing", name: "Inglés", color: color.purple },
    { dataKey: "mus", name: "Guitarra", color: color.warning },
];

const STATUS_META: Record<CursoStatus, { label: string; bg: string; fg: string }> = {
    creado: { label: "Creado", bg: color.borderSoft, fg: color.ink500 },
    solicitado: { label: "Solicitado", bg: color.primary100, fg: color.primary },
    en_espera: { label: "En espera", bg: color.warningBg, fg: color.warning },
    en_proceso: { label: "En proceso", bg: "#fef3c7", fg: "#d97706" },
    aceptado: { label: "Aceptado", bg: color.successBg, fg: color.success },
    rechazado: { label: "Rechazado", bg: color.dangerBg, fg: color.danger },
};

type PendingAction = { id: number; action: "aceptar" | "rechazar" } | null;

/* ------------------------------------------------------------------ */
/* Tooltip del área chart                                               */
/* ------------------------------------------------------------------ */
function ChartTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-edu-surface border border-edu-border rounded-edu-chip px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
            <div className="text-[0.72rem] font-bold text-edu-ink mb-1">{label}</div>
            {payload.map((p: any) => (
                <div key={p.dataKey} className="flex items-center gap-1.5 text-[0.72rem] text-edu-ink-700">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: p.color }} />
                    {p.name}: <strong>{p.value} est.</strong>
                </div>
            ))}
        </div>
    );
}

export function CoordCursosPage() {
    const navigate = useNavigate();
    const { data: cursosFetched } = useFetch(getCoordCursos, []);
    const { data: CHART_DATA } = useFetch(getCoordCursosChart, []);
    const [cursos, setCursos] = useState<CoordCurso[]>([]);
    useEffect(() => setCursos(cursosFetched), [cursosFetched]);
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"todos" | CursoStatus>("todos");
    const [page, setPage] = useState(1);
    const [selectedCurso, setSelectedCurso] = useState<CoordCurso | null>(null);
    const [pending, setPending] = useState<PendingAction>(null);

    const cursosActivos = cursos.filter((c) => c.status === "aceptado");
    const cursosCreados = cursos.filter((c) => c.status === "creado").length;
    const cursosSolicitud = cursos.filter((c) => c.status === "solicitado").length;
    const cursosEspera = cursos.filter((c) => c.status === "en_espera").length;
    const estudiantesActivos = cursosActivos.reduce((s, c) => s + c.enrolledCount, 0);

    const KPIS = [
        { label: "Cursos creados", value: String(cursosCreados), icon: BookOpen, ac: accent.blue },
        { label: "Cursos solicitados", value: String(cursosSolicitud), icon: ClipboardList, ac: accent.purple },
        { label: "En espera confirmar", value: String(cursosEspera), icon: Clock, ac: { bg: "#fef3c7", fg: "#d97706" } },
        { label: "Estudiantes activos", value: String(estudiantesActivos), icon: Users, ac: accent.green },
    ];

    const filtered = cursos
        .filter((c) => statusFilter === "todos" || c.status === statusFilter)
        .filter((c) => !query.trim() || c.title.toLowerCase().includes(query.trim().toLowerCase()) || c.code.toLowerCase().includes(query.trim().toLowerCase()) || c.profesor.toLowerCase().includes(query.trim().toLowerCase()));

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    const applyAction = (id: number, action: "aceptar" | "rechazar") => {
        setCursos((prev) =>
            prev.map((c) => c.id === id ? { ...c, status: action === "aceptar" ? "aceptado" : "rechazado" } : c)
        );
        if (selectedCurso?.id === id)
            setSelectedCurso((prev) => prev ? { ...prev, status: action === "aceptar" ? "aceptado" : "rechazado" } : null);
        setPending(null);
    };

    const triggerAction = (id: number, action: "aceptar" | "rechazar", e?: React.MouseEvent) => {
        e?.stopPropagation();
        setPending({ id, action });
    };

    return (
        <div className="flex flex-col gap-5">
            {/* Header */}
            {/* <div className="flex justify-between items-center flex-wrap gap-3">
                <div>
                    <h2 className="m-0 text-edu-ink font-bold text-[1.35rem]">Cursos extracurriculares</h2>
                    <p className="text-edu-ink-500 text-sm mt-1 m-0">Gestión y aprobación de solicitudes de cursos</p>
                </div>
                <button
                    onClick={() => navigate("/coordinador/cursos/nuevo")}
                    className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold bg-edu-primary text-white hover:bg-edu-primary-hover border-none cursor-pointer"
                >
                    <PlusCircle className="w-4 h-4" />
                    Crear curso
                </button>
            </div> */}

            {/* Grid superior */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
                {/* Area chart */}
                <div className="lg:col-span-2 bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
                    <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Estudiantes por curso</h3>
                        <span className="text-[0.8rem] text-edu-ink-400 font-medium">Cursos activos · 2026-I</span>
                    </div>
                    <div className="px-3 pt-5 pb-3 flex-1">
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={CHART_DATA} margin={{ top: 6, right: 16, left: -14, bottom: 0 }}>
                                <defs>
                                    {AREAS.map((a) => (
                                        <linearGradient key={a.dataKey} id={`cgrad-${a.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={a.color} stopOpacity={0.25} />
                                            <stop offset="100%" stopColor={a.color} stopOpacity={0.02} />
                                        </linearGradient>
                                    ))}
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={color.borderSoft} vertical={false} />
                                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: color.ink500 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: color.ink400 }} axisLine={false} tickLine={false} width={30} />
                                <Tooltip content={<ChartTooltip />} />
                                <Legend wrapperStyle={{ fontSize: "0.75rem", paddingTop: "10px" }} />
                                {AREAS.map((a) => (
                                    <Area
                                        key={a.dataKey}
                                        type="monotone"
                                        dataKey={a.dataKey}
                                        name={a.name}
                                        stroke={a.color}
                                        strokeWidth={2.5}
                                        fill={`url(#cgrad-${a.dataKey})`}
                                        dot={{ r: 3, fill: a.color, strokeWidth: 0 }}
                                        activeDot={{ r: 5 }}
                                    />
                                ))}
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* KPIs — 2×2 */}
                <div className="grid grid-cols-2 gap-3">
                    {KPIS.map((kpi) => {
                        const Icon = kpi.icon;
                        return (
                            <div key={kpi.label} className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-4 flex flex-col gap-2.5">
                                <div className="flex justify-between items-start">
                                    <p className="text-edu-ink-500 text-[0.7rem] font-medium m-0 uppercase tracking-[0.05em] leading-tight">{kpi.label}</p>
                                    <div className="w-8 h-8 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: kpi.ac.bg }}>
                                        <Icon style={{ width: "16px", height: "16px", color: kpi.ac.fg }} />
                                    </div>
                                </div>
                                <p className="text-[1.4rem] font-bold m-0 text-edu-ink leading-none">{kpi.value}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            <button
                onClick={() => navigate("/coordinador/cursos/nuevo")}
                className="w-full justify-center inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold bg-edu-primary text-white hover:bg-edu-primary-hover border-none cursor-pointer"
            >
                <PlusCircle className="w-4 h-4" />
                Crear curso
            </button>

            {/* Tarjetas de cursos */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                    <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Cursos</h3>
                    <span className="text-[0.8rem] text-edu-ink-400 font-medium">
                        {filtered.length} curso{filtered.length === 1 ? "" : "s"}
                    </span>
                </div>

                <div className="px-5 py-3 flex gap-2 items-center flex-wrap border-b border-edu-border-soft">
                    <div className="relative flex-1 min-w-[180px]">
                        <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                            placeholder="Buscar por nombre, código o profesor…"
                            className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value as typeof statusFilter); setPage(1); }}
                        className="w-full md:w-auto border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
                    >
                        <option value="todos">Todos los estados</option>
                        <option value="creado">Creados</option>
                        <option value="solicitado">Solicitados</option>
                        <option value="en_espera">En espera</option>
                        <option value="en_proceso">En proceso</option>
                        <option value="aceptado">Aceptados</option>
                        <option value="rechazado">Rechazados</option>
                    </select>
                </div>

                <div className="p-5">
                    {filtered.length === 0 ? (
                        <div className="py-10 text-center text-edu-ink-400 text-sm">No hay cursos que coincidan con el filtro.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {paged.map((curso) => {
                                const st = STATUS_META[curso.status];
                                const enProceso = curso.status === "en_proceso";
                                const pct = Math.round((curso.enrolledCount / curso.cupos) * 100);
                                const full = curso.enrolledCount >= curso.cupos;
                                return (
                                    <div
                                        key={curso.id}
                                        onClick={() => setSelectedCurso(curso)}
                                        className="bg-edu-surface rounded-edu-card border border-edu-border-soft flex flex-col overflow-hidden cursor-pointer transition-shadow hover:shadow-md"
                                    >
                                        {/* Imagen / banner */}
                                        {curso.image ? (
                                            <img src={curso.image} alt={curso.title} className="w-full h-32 object-cover" />
                                        ) : (
                                            <div className="w-full h-20 flex items-center justify-center" style={{ backgroundColor: accent.blue.bg }}>
                                                <ImageIcon style={{ width: 28, height: 28, color: accent.blue.fg }} />
                                            </div>
                                        )}

                                        <div className="p-4 flex flex-col gap-3 flex-1">
                                            {/* Título + código */}
                                            <div>
                                                <div className="text-[0.875rem] font-semibold text-edu-ink leading-snug">{curso.title}</div>
                                                <span className="text-[0.72rem] text-edu-ink-400 font-mono">{curso.code}</span>
                                            </div>

                                            {/* Profesor */}
                                            <div className="text-[0.8rem] text-edu-ink-500">{curso.profesor}</div>

                                            {/* Cupos */}
                                            <div>
                                                <div className="flex justify-between items-baseline mb-1.5">
                                                    <span className="inline-flex items-center gap-1 text-[0.78rem] text-edu-ink-500">
                                                        <Users className="w-3.5 h-3.5" /> {curso.enrolledCount} / {curso.cupos} inscritos
                                                    </span>
                                                    <span className={`text-[0.78rem] font-semibold ${full ? "text-edu-danger" : "text-edu-ink-700"}`}>
                                                        {full ? "Cupo lleno" : `${pct} %`}
                                                    </span>
                                                </div>
                                                <div className="h-1.5 bg-edu-border-soft rounded-edu-pill overflow-hidden">
                                                    <div
                                                        className="h-full rounded-edu-pill"
                                                        style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: full ? color.danger : color.primary }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Estado + acciones */}
                                            <div className="flex items-center justify-between pt-1 border-t border-edu-border-soft mt-0.5">
                                                <span
                                                    className="inline-flex items-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold"
                                                    style={{ backgroundColor: st.bg, color: st.fg }}
                                                >
                                                    {st.label}
                                                </span>
                                                {enProceso && (
                                                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                                        <button
                                                            onClick={(e) => triggerAction(curso.id, "aceptar", e)}
                                                            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-edu-control text-[0.72rem] font-semibold border-none cursor-pointer text-white transition-colors hover:brightness-95"
                                                            style={{ backgroundColor: color.success }}
                                                        >
                                                            <CheckCircle2 style={{ width: 11, height: 11 }} />
                                                            Aceptar
                                                        </button>
                                                        <button
                                                            onClick={(e) => triggerAction(curso.id, "rechazar", e)}
                                                            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-edu-control text-[0.72rem] font-semibold border-none cursor-pointer text-white transition-colors hover:brightness-95"
                                                            style={{ backgroundColor: color.danger }}
                                                        >
                                                            <XCircle style={{ width: 11, height: 11 }} />
                                                            Rechazar
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="pt-5 mt-5 border-t border-edu-border-soft">
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
                        </div>
                    )}
                </div>
            </div>

            {/* Modal detalle */}
            {selectedCurso && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setSelectedCurso(null)}>
                    <div
                        className="bg-edu-surface rounded-edu-card w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Imagen del curso */}
                        {selectedCurso.image && (
                            <div className="overflow-hidden rounded-t-edu-card" style={{ height: "180px" }}>
                                <img src={selectedCurso.image} alt={selectedCurso.title} className="w-full h-full object-cover" />
                            </div>
                        )}

                        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-start">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: accent.blue.bg }}>
                                    <BookOpen style={{ width: 17, height: 17, color: accent.blue.fg }} />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem] leading-snug">{selectedCurso.title}</h3>
                                    <span className="text-[0.75rem] text-edu-ink-400 font-mono">{selectedCurso.code}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedCurso(null)}
                                className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700 ml-3 shrink-0"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-5 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[0.8rem] text-edu-ink-500 font-medium">Estado actual</span>
                                <span
                                    className="inline-flex items-center px-2.5 py-1 rounded-edu-pill text-[0.72rem] font-semibold"
                                    style={{ backgroundColor: STATUS_META[selectedCurso.status].bg, color: STATUS_META[selectedCurso.status].fg }}
                                >
                                    {STATUS_META[selectedCurso.status].label}
                                </span>
                            </div>

                            <div>
                                <p className="text-[0.75rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em] m-0 mb-1">Descripción</p>
                                <p className="text-[0.875rem] text-edu-ink-700 m-0 leading-relaxed">{selectedCurso.description}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <InfoField icon={UserSquare2} label="Profesor asignado" value={selectedCurso.profesor} />
                                <InfoField icon={CalendarDays} label="Fecha de inicio" value={selectedCurso.fecha} />
                                <InfoField icon={Clock} label="Horario" value={selectedCurso.schedule} />
                                <InfoField icon={Users} label="Cupos" value={`${selectedCurso.enrolledCount} inscritos / ${selectedCurso.cupos} totales`} />
                            </div>

                            <div>
                                <p className="text-[0.75rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em] m-0 mb-2">Evaluaciones</p>
                                {selectedCurso.evaluaciones.length === 0 ? (
                                    <p className="text-[0.8125rem] text-edu-ink-400 m-0">Sin evaluaciones registradas.</p>
                                ) : (
                                    <ul className="m-0 p-0 list-none flex flex-col gap-1.5">
                                        {selectedCurso.evaluaciones.map((ev, idx) => (
                                            <li key={idx} className="flex items-center gap-2">
                                                <ClipboardList style={{ width: 14, height: 14, color: color.ink400 }} />
                                                <span className="text-[0.8125rem] text-edu-ink-700">{ev}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {selectedCurso.status === "en_proceso" && (
                                <div className="flex gap-2 pt-2 border-t border-edu-border-soft">
                                    <button
                                        onClick={() => triggerAction(selectedCurso.id, "rechazar")}
                                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-edu-control text-sm font-semibold border-none cursor-pointer text-white hover:brightness-95"
                                        style={{ backgroundColor: color.danger }}
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Rechazar solicitud
                                    </button>
                                    <button
                                        onClick={() => triggerAction(selectedCurso.id, "aceptar")}
                                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-edu-control text-sm font-semibold border-none cursor-pointer text-white hover:brightness-95"
                                        style={{ backgroundColor: color.success }}
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        Aceptar solicitud
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ConfirmDialog */}
            {pending && (
                <ConfirmDialog
                    title={pending.action === "aceptar" ? "¿Aceptar este curso?" : "¿Rechazar este curso?"}
                    message={
                        pending.action === "aceptar"
                            ? "El curso quedará activo y el profesor será notificado."
                            : "La solicitud será rechazada. Esta acción puede revertirse."
                    }
                    confirmLabel={pending.action === "aceptar" ? "Sí, aceptar" : "Sí, rechazar"}
                    tone={pending.action === "aceptar" ? "success" : "danger"}
                    icon={pending.action === "aceptar" ? CheckCircle2 : XCircle}
                    onConfirm={() => applyAction(pending.id, pending.action)}
                    onCancel={() => setPending(null)}
                />
            )}
        </div>
    );
}

function InfoField({ icon: Icon, label, value }: { icon: React.FC<any>; label: string; value: string }) {
    return (
        <div className="bg-edu-subtle rounded-edu-control px-3.5 py-2.5 flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
                <Icon style={{ width: 13, height: 13, color: color.ink400 }} />
                <span className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.04em]">{label}</span>
            </div>
            <span className="text-[0.8125rem] text-edu-ink-700 font-medium">{value}</span>
        </div>
    );
}
