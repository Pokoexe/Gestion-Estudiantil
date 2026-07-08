import { useState } from "react";
import {
    Tag,
    Search,
    CreditCard,
    AlertTriangle,
    CalendarClock,
    Percent,
    Users,
    GraduationCap,
} from "lucide-react";
import { accent } from "../theme/tokens";
import { Pagination } from "../components/Pagination";
import { useFetch } from "../datos_maquetados";
import { getPreciosHistorial, type PrecioEstado } from "../datos_maquetados/actions/precios";
import { PRECIO_ESTADO_META } from "../datos_maquetados/data/precios";

const PER_PAGE = 6;

const COLS = "grid-cols-[1fr_1fr_1fr_0.9fr_1fr_1fr_0.9fr]";
const HEADERS = [
    "Período",
    "Mensualidad",
    "Morosidad",
    "Inicio mora",
    "Desc. hermanos",
    "Desc. docentes",
    "Estado",
];

export function DirPreciosPage() {
    const { data: historial, loading } = useFetch(getPreciosHistorial, []);

    const [query, setQuery] = useState("");
    const [estadoFilter, setEstadoFilter] = useState<"todos" | PrecioEstado>("todos");
    const [page, setPage] = useState(1);

    if (loading)
        return (
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">
                Cargando…
            </div>
        );

    /* ---- Cuadro de precios vigente (alimenta los KPIs) ---- */
    const vigente = historial.find((p) => p.estado === "vigente") ?? historial[0];

    const KPIS = [
        {
            label: "Mensualidad",
            value: vigente.mensualidad,
            hint: "Cuota mensual por estudiante",
            icon: CreditCard,
            ac: accent.blue,
        },
        {
            label: "Cobro por morosidad",
            value: vigente.morosidad,
            hint: "Recargo por pago tardío",
            icon: AlertTriangle,
            ac: accent.amber,
        },
        {
            label: "Inicio de morosidad",
            value: `Día ${vigente.inicioMorosidad}`,
            hint: "Se cobra recargo desde este día",
            icon: CalendarClock,
            ac: accent.red,
        },
        {
            label: "Descuentos",
            value: `${vigente.descHermanos} / ${vigente.descDocentes}`,
            hint: "Hermanos · Hijos de docentes",
            icon: Percent,
            ac: accent.purple,
        },
    ];

    /* ---- Filtrado y paginación ---- */
    const filtered = historial
        .filter((x) => estadoFilter === "todos" || x.estado === estadoFilter)
        .filter((x) => {
            const q = query.trim().toLowerCase();
            if (!q) return true;
            return `${x.periodo} ${x.mensualidad} ${x.morosidad} ${x.descHermanos} ${x.descDocentes} ${x.registradoPor}`
                .toLowerCase()
                .includes(q);
        });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    return (
        <div className="flex flex-col gap-5">
            {/* Encabezado */}
            <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: accent.amber.bg }}>
                    <Tag style={{ width: 22, height: 22, color: accent.amber.fg }} />
                </div>
                <div>
                    <h2 className="m-0 text-edu-ink font-bold text-[1.15rem]">Precios</h2>
                    <p className="m-0 text-edu-ink-500 text-[0.8125rem]">
                        Mensualidad, morosidad y descuentos de la institución · Período {vigente.periodo}
                    </p>
                </div>
            </div>

            {/* KPIs del cuadro de precios vigente */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                            <p className="text-edu-ink-400 text-[0.7rem] m-0">{kpi.hint}</p>
                        </div>
                    );
                })}
            </div>

            {/* Tabla de historial de precios */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                    <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Historial de precios</h3>
                    <span className="text-[0.8rem] text-edu-ink-400 font-medium">
                        {filtered.length} cuadro{filtered.length === 1 ? "" : "s"} de precios
                    </span>
                </div>

                {/* Buscador y filtro */}
                <div className="px-5 py-3 flex gap-2 items-center flex-wrap border-b border-edu-border-soft">
                    <div className="relative flex-1 min-w-[180px]">
                        <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                            placeholder="Buscar por período, monto o responsable…"
                            className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                        />
                    </div>
                    <select
                        value={estadoFilter}
                        onChange={(e) => { setEstadoFilter(e.target.value as typeof estadoFilter); setPage(1); }}
                        className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
                    >
                        <option value="todos">Todos los estados</option>
                        <option value="vigente">Vigente</option>
                        <option value="historico">Históricos</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <div className="min-w-[820px]">
                        <div className={`grid ${COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                            {HEADERS.map((h) => (
                                <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
                            ))}
                        </div>

                        {filtered.length === 0 && (
                            <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">No hay cuadros de precios que coincidan con el filtro.</div>
                        )}

                        {paged.map((item, i) => {
                            const estado = PRECIO_ESTADO_META[item.estado];
                            return (
                                <div
                                    key={item.id}
                                    className={`grid ${COLS} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                                >
                                    <div className="min-w-0 pr-3">
                                        <div className="text-sm text-edu-ink font-semibold truncate">{item.periodo}</div>
                                        <div className="text-[0.75rem] text-edu-ink-400 truncate">{item.registradoPor}</div>
                                    </div>
                                    <span className="text-[0.8125rem] text-edu-ink-700 font-semibold">{item.mensualidad}</span>
                                    <span className="text-[0.8125rem] text-edu-ink-500">{item.morosidad}</span>
                                    <span className="text-[0.8125rem] text-edu-ink-500">Día {item.inicioMorosidad}</span>
                                    <span className="text-[0.8125rem] text-edu-ink-500">{item.descHermanos}</span>
                                    <span className="text-[0.8125rem] text-edu-ink-500">{item.descDocentes}</span>
                                    <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${estado.cls}`}>
                                        {estado.label}
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
