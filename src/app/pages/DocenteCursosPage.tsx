import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, BookOpen, Users, PlusCircle } from "lucide-react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import { color, accent } from "../theme/tokens";
import { Pagination } from "../components/Pagination";
import { useFetch } from "../datos_maquetados";
import {
    getDocenteCursos,
    getCursosInscripciones,
    type CursoStatus,
} from "../datos_maquetados/actions/docente-eval";

const PER_PAGE = 5;

const AREAS = [
    { dataKey: "rob", name: "Robótica",    color: color.primary },
    { dataKey: "web", name: "Prog. web",   color: color.success },
    { dataKey: "fot", name: "Fotografía",  color: color.warning },
];

const STATUS_META: Record<CursoStatus, { label: string; bg: string; fg: string }> = {
    aceptado:  { label: "Aceptado",  bg: color.successBg,  fg: color.success },
    solicitado:{ label: "Solicitado",bg: color.primary100, fg: color.primary },
};

function ChartTooltip({ active, payload, label }: any) {
    if (!active || !payload || !payload.length) return null;
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

export function DocenteCursosPage() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"todos" | CursoStatus>("todos");
    const [page, setPage] = useState(1);

    const { data: DOCENTE_CURSOS, loading } = useFetch(getDocenteCursos, []);
    const { data: CHART_DATA } = useFetch(getCursosInscripciones, []);

    const cursosActivos      = DOCENTE_CURSOS.filter((c) => c.status === "aceptado");
    const estudiantesActivos = cursosActivos.reduce((sum, c) => sum + c.enrolledCount, 0);

    const KPIS = [
        { label: "Estudiantes asignados", value: String(estudiantesActivos), icon: Users,    ac: accent.blue,   hint: "En cursos activos" },
        { label: "Cursos activos",         value: String(cursosActivos.length), icon: BookOpen, ac: accent.purple, hint: "Período 2026-I" },
    ];

    const filtered = DOCENTE_CURSOS
        .filter((c) => statusFilter === "todos" || c.status === statusFilter)
        .filter((c) => !query.trim() || c.title.toLowerCase().includes(query.trim().toLowerCase()) || c.code.toLowerCase().includes(query.trim().toLowerCase()));

    const totalPages  = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paged       = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    if (loading) return <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">Cargando…</div>;

    return (
        <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center flex-wrap gap-3">
                <div>
                    <h2 className="m-0 text-edu-ink font-bold text-[1.35rem]">Mis cursos</h2>
                    <p className="text-edu-ink-500 text-sm mt-1 m-0">Cursos extracurriculares solicitados y aceptados</p>
                </div>
                <button
                    onClick={() => navigate("/docente/cursos/nuevo")}
                    className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold bg-edu-primary text-white hover:bg-edu-primary-hover border-none cursor-pointer"
                >
                    <PlusCircle className="w-4 h-4" />
                    Solicitar curso
                </button>
            </div>

            {/* Grid superior */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
                {/* AreaChart */}
                <div className="lg:col-span-2 bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
                    <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Inscripciones por curso</h3>
                        <span className="text-[0.8rem] text-edu-ink-400 font-medium">Cursos activos · 2026-I</span>
                    </div>
                    <div className="px-3 pt-5 pb-3 flex-1">
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={CHART_DATA} margin={{ top: 6, right: 16, left: -14, bottom: 0 }}>
                                <defs>
                                    {AREAS.map((a) => (
                                        <linearGradient key={a.dataKey} id={`grad-${a.dataKey}`} x1="0" y1="0" x2="0" y2="1">
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
                                        fill={`url(#grad-${a.dataKey})`}
                                        dot={{ r: 3, fill: a.color, strokeWidth: 0 }}
                                        activeDot={{ r: 5 }}
                                    />
                                ))}
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* KPIs */}
                <div className="flex flex-col gap-3">
                    {KPIS.map((kpi) => {
                        const Icon = kpi.icon;
                        return (
                            <div key={kpi.label} className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex flex-col gap-3 flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-edu-ink-500 text-[0.72rem] font-medium m-0 uppercase tracking-[0.05em]">{kpi.label}</p>
                                        <p className="text-[1.5rem] font-bold mt-1.5 m-0 text-edu-ink">{kpi.value}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: kpi.ac.bg }}>
                                        <Icon style={{ width: "20px", height: "20px", color: kpi.ac.fg }} />
                                    </div>
                                </div>
                                <p className="text-edu-ink-400 text-[0.72rem] m-0">{kpi.hint}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Tabla de cursos */}
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
                            placeholder="Buscar por nombre o código…"
                            className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value as typeof statusFilter); setPage(1); }}
                        className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
                    >
                        <option value="todos">Todos los estados</option>
                        <option value="aceptado">Aceptados</option>
                        <option value="solicitado">Solicitados</option>
                    </select>
                </div>
                <div className="overflow-x-auto">
                <div className="min-w-[680px]">
                <div className="grid grid-cols-[1.8fr_0.8fr_1.3fr_0.9fr_0.8fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                    {["Curso", "Código", "Horario", "Inscritos", "Estado"].map((h) => (
                        <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
                    ))}
                </div>
                {filtered.length === 0 && (
                    <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">No hay cursos que coincidan con el filtro.</div>
                )}
                {paged.map((curso, i) => {
                    const st = STATUS_META[curso.status];
                    return (
                        <div
                            key={curso.id}
                            onClick={() => navigate(`/docente/cursos/${curso.id}`)}
                            className={`grid grid-cols-[1.8fr_0.8fr_1.3fr_0.9fr_0.8fr] px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle cursor-pointer ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                        >
                            <span className="text-sm text-edu-ink font-medium">{curso.title}</span>
                            <span className="text-[0.8125rem] text-edu-ink-500 font-mono">{curso.code}</span>
                            <span className="text-[0.8125rem] text-edu-ink-500">{curso.schedule}</span>
                            <span className="text-sm text-edu-ink-700 font-semibold">{curso.enrolledCount} / {curso.totalSpots}</span>
                            <span
                                className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit"
                                style={{ backgroundColor: st.bg, color: st.fg }}
                            >
                                {st.label}
                            </span>
                        </div>
                    );
                })}
                </div>
                </div>
                {totalPages > 1 && (
                    <div className="px-5 py-4 border-t border-edu-border-soft">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
                    </div>
                )}
            </div>
        </div>
    );
}
