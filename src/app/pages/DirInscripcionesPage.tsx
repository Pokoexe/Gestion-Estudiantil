import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
    UserPlus,
    Search,
    Receipt,
    CheckCircle2,
    XCircle,
    Users,
    TrendingUp,
    Clock,
    ClipboardList,
    Wallet,
    ChevronRight,
} from "lucide-react";
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
import { BaucheModal } from "../components/BaucheModal";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useFetch } from "../datos_maquetados";
import {
    getInscripciones,
    getInscripcionesChart,
    type Inscripcion,
    type InscripcionEstado,
    type InscripcionTipo,
} from "../datos_maquetados/actions/inscripciones";
import {
    INSCRIPCION_FEE,
    TIPO_META,
    ESTADO_META,
} from "../datos_maquetados/data/inscripciones";

const PER_PAGE = 6;

const COLS = "grid-cols-[1.4fr_1.3fr_0.8fr_1fr_0.9fr]";
const HEADERS = ["Estudiante", "Representante", "Tipo", "Bauche", "Estado"];

const AREAS = [
    { dataKey: "nuevos", name: "Nuevos ingresos", color: color.primary },
    { dataKey: "reinscritos", name: "Reinscritos", color: color.success },
];

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

type PendingAction = { id: number; action: "aceptar" | "rechazar" } | null;

export function DirInscripcionesPage() {
    const navigate = useNavigate();

    const { data: inscripciones } = useFetch(getInscripciones, []);
    const { data: chart } = useFetch(getInscripcionesChart, []);

    const [items, setItems] = useState<Inscripcion[]>([]);
    useEffect(() => setItems(inscripciones.map((x) => ({ ...x }))), [inscripciones]);
    const [query, setQuery] = useState("");
    const [tipoFilter, setTipoFilter] = useState<"todos" | InscripcionTipo>("todos");
    const [estadoFilter, setEstadoFilter] = useState<"todos" | InscripcionEstado>("todos");
    const [page, setPage] = useState(1);
    const [baucheItem, setBaucheItem] = useState<Inscripcion | null>(null);
    const [pending, setPending] = useState<PendingAction>(null);
    const [abiertas, setAbiertas] = useState(true);

    /* ---- Métricas ---- */
    const total = items.length;
    const nuevos = items.filter((x) => x.tipo === "nuevo").length;
    const reinscritos = items.filter((x) => x.tipo === "reinscrito").length;
    const porRevisar = items.filter((x) => x.estado === "revision").length;
    const activas = items.filter((x) => x.estado !== "rechazado").length;

    const KPIS = [
        { label: "Total inscritos", value: String(total), icon: Users, ac: accent.blue },
        { label: "Nuevos ingresos", value: String(nuevos), icon: UserPlus, ac: accent.green },
        { label: "Reinscritos", value: String(reinscritos), icon: TrendingUp, ac: accent.purple },
    ];

    /* ---- Filtrado y paginación ---- */
    const filtered = items
        .filter((x) => tipoFilter === "todos" || x.tipo === tipoFilter)
        .filter((x) => estadoFilter === "todos" || x.estado === estadoFilter)
        .filter((x) => {
            const q = query.trim().toLowerCase();
            if (!q) return true;
            return `${x.estNombre} ${x.estApellido} ${x.repNombre} ${x.repApellido} ${x.bauche} ${x.gradoSolicitado}`
                .toLowerCase()
                .includes(q);
        });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    /* ---- Aceptar / rechazar ---- */
    const applyAction = (id: number, action: "aceptar" | "rechazar") => {
        const estado: InscripcionEstado = action === "aceptar" ? "aceptado" : "rechazado";
        setItems((prev) => prev.map((x) => (x.id === id ? { ...x, estado } : x)));
        // Muta el registro compartido (el mismo array que sirve el endpoint) para
        // que la página de detalle refleje el cambio al navegar.
        const rec = inscripciones.find((r) => r.id === id);
        if (rec) rec.estado = estado;
        setPending(null);
        setBaucheItem(null);
    };

    return (
        <div className="flex flex-col gap-5">
            {/* Encabezado */}
            <div className="flex justify-between items-center flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: accent.amber.bg }}>
                        <UserPlus style={{ width: 22, height: 22, color: accent.amber.fg }} />
                    </div>
                    <div>
                        <h2 className="m-0 text-edu-ink font-bold text-[1.15rem]">Inscripciones</h2>
                        <p className="m-0 text-edu-ink-500 text-[0.8125rem]">Gestión de inscripciones y validación de pagos · Período 2026-2027</p>
                    </div>
                </div>
            </div>

            {/* Banner superior: estado del período + solicitudes activas + valor */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex justify-between items-center flex-wrap gap-5">
                <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-edu-card flex items-center justify-center shrink-0 ${abiertas ? "bg-edu-success-bg" : "bg-edu-subtle"}`}>
                        <ClipboardList className={`w-7 h-7 ${abiertas ? "text-edu-success" : "text-edu-ink-400"}`} />
                    </div>
                    <div>
                        <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">Período de inscripciones</p>
                        <p className={`text-[1.35rem] font-bold mt-0.5 mb-0 ${abiertas ? "text-edu-success" : "text-edu-ink-500"}`}>
                            {abiertas ? "Inscripciones abiertas" : "Inscripciones cerradas"}
                        </p>
                        <p className="text-edu-ink-400 text-[0.8rem] m-0">
                            {abiertas
                                ? "Los representantes pueden inscribir desde el formulario público"
                                : "El formulario público de inscripción está deshabilitado"}
                        </p>
                    </div>
                    {/* Interruptor abrir/cerrar */}
                    <button
                        onClick={() => setAbiertas((a) => !a)}
                        role="switch"
                        aria-checked={abiertas}
                        aria-label="Abrir o cerrar inscripciones"
                        className={`relative w-12 h-7 rounded-edu-pill shrink-0 border-none cursor-pointer transition-colors ${abiertas ? "bg-edu-success" : "bg-edu-ink-300"}`}
                    >
                        <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${abiertas ? "left-6" : "left-1"}`} />
                    </button>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <div className="text-edu-ink-400 text-[0.72rem] uppercase tracking-[0.05em] font-medium">Solicitudes activas</div>
                        <div className="text-edu-ink text-[1.35rem] font-bold leading-tight">{activas}</div>
                        <div className="text-edu-ink-400 text-xs">de {total} inscripciones</div>
                    </div>
                    <div className="w-px h-12 bg-edu-border-soft" />
                    <div className="text-right">
                        <div className="text-edu-ink-400 text-[0.72rem] uppercase tracking-[0.05em] font-medium">Valor de la inscripción</div>
                        <div className="text-[1.35rem] font-bold leading-tight" style={{ color: accent.amber.fg }}>{INSCRIPCION_FEE}</div>
                        <div className="text-edu-ink-400 text-xs inline-flex items-center gap-1 justify-end">
                            <Wallet className="w-3 h-3" /> Cuota única por estudiante
                        </div>
                    </div>
                </div>
            </div>

            {/* Area chart + KPIs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
                <div className="lg:col-span-2 bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
                    <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Nuevos vs. reinscritos</h3>
                        <span className="text-[0.8rem] text-edu-ink-400 font-medium">Acumulado del período</span>
                    </div>
                    <div className="px-3 pt-5 pb-3 flex-1">
                        <ResponsiveContainer width="100%" height={230}>
                            <AreaChart data={chart} margin={{ top: 6, right: 16, left: -14, bottom: 0 }}>
                                <defs>
                                    {AREAS.map((a) => (
                                        <linearGradient key={a.dataKey} id={`igrad-${a.dataKey}`} x1="0" y1="0" x2="0" y2="1">
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
                                        fill={`url(#igrad-${a.dataKey})`}
                                        dot={{ r: 3, fill: a.color, strokeWidth: 0 }}
                                        activeDot={{ r: 5 }}
                                    />
                                ))}
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-1 gap-3">
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

            {/* Tabla */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                    <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Estudiantes inscritos</h3>
                    <span className="text-[0.8rem] text-edu-ink-400 font-medium">
                        {filtered.length} inscripci{filtered.length === 1 ? "ón" : "ones"}
                    </span>
                </div>

                {/* Buscador y filtros */}
                <div className="px-5 py-3 flex gap-2 items-center flex-wrap border-b border-edu-border-soft">
                    <div className="relative flex-1 min-w-[180px]">
                        <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                            placeholder="Buscar por estudiante, representante o bauche…"
                            className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                        />
                    </div>
                    <select
                        value={tipoFilter}
                        onChange={(e) => { setTipoFilter(e.target.value as typeof tipoFilter); setPage(1); }}
                        className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
                    >
                        <option value="todos">Todos los tipos</option>
                        <option value="nuevo">Nuevos ingresos</option>
                        <option value="reinscrito">Reinscritos</option>
                    </select>
                    <select
                        value={estadoFilter}
                        onChange={(e) => { setEstadoFilter(e.target.value as typeof estadoFilter); setPage(1); }}
                        className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
                    >
                        <option value="todos">Todos los estados</option>
                        <option value="revision">En revisión</option>
                        <option value="aceptado">Aceptados</option>
                        <option value="rechazado">Rechazados</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <div className="min-w-[680px]">
                        <div className={`grid ${COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                            {HEADERS.map((h) => (
                                <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
                            ))}
                        </div>

                        {filtered.length === 0 && (
                            <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">No hay inscripciones que coincidan con el filtro.</div>
                        )}

                        {paged.map((item, i) => {
                            const tipo = TIPO_META[item.tipo];
                            const estado = ESTADO_META[item.estado];
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => navigate(`/director/inscripciones/${item.id}`)}
                                    className={`grid ${COLS} px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                                >
                                    <div className="min-w-0 pr-3">
                                        <div className="text-sm text-edu-ink font-semibold truncate">{item.estNombre} {item.estApellido}</div>
                                        <div className="text-[0.75rem] text-edu-ink-400">{item.gradoSolicitado}</div>
                                    </div>
                                    <span className="text-[0.8125rem] text-edu-ink-500 truncate pr-3">{item.repNombre} {item.repApellido}</span>
                                    <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${tipo.cls}`}>
                                        {tipo.label}
                                    </span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setBaucheItem(item); }}
                                        className="inline-flex items-center gap-1.5 text-[0.8125rem] text-edu-primary font-medium bg-transparent border-none cursor-pointer p-0 w-fit hover:underline"
                                    >
                                        <Receipt className="w-3.5 h-3.5 shrink-0" />
                                        {item.bauche}
                                    </button>
                                    <div className="flex items-center justify-between gap-2">
                                        <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${estado.cls}`}>
                                            {estado.label}
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-edu-ink-300 shrink-0" />
                                    </div>
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

            {/* Modal bauche (aceptar / rechazar) */}
            {baucheItem && (
                <BaucheModal
                    rep={`${baucheItem.repNombre} ${baucheItem.repApellido}`}
                    student={`${baucheItem.estNombre} ${baucheItem.estApellido}`}
                    amount={baucheItem.monto}
                    method={baucheItem.metodo}
                    reference={baucheItem.bauche}
                    date={baucheItem.fechaPago}
                    showOptions={baucheItem.estado === "revision"}
                    onClose={() => setBaucheItem(null)}
                    onAccept={() => setPending({ id: baucheItem.id, action: "aceptar" })}
                    onReject={() => setPending({ id: baucheItem.id, action: "rechazar" })}
                />
            )}

            {/* Confirmación de la acción */}
            {pending && (
                <ConfirmDialog
                    title={pending.action === "aceptar" ? "¿Confirmar el pago de esta inscripción?" : "¿Rechazar esta inscripción?"}
                    message={
                        pending.action === "aceptar"
                            ? "La inscripción quedará aceptada y el representante será notificado."
                            : "La inscripción será rechazada. Esta acción puede revertirse."
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
