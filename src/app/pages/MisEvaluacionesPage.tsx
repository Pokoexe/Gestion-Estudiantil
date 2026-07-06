import { useState } from "react";
import {
    X,
    Search,
    Clock,
    CalendarClock,
    AlertTriangle,
    ChevronRight,
    Download,
    ListChecks,
    Presentation,
    FileText,
    FlaskConical,
    PenLine,
} from "lucide-react";
import { color } from "../theme/tokens";
import { Pagination } from "../components/Pagination";
import { LapsoFilter } from "../components/LapsoFilter";
import { useLapso } from "../context/LapsoContext";
import { useFetch } from "../datos_maquetados";
import { getEvaluaciones, type Evaluation, type EvalType } from "../datos_maquetados/actions/estudiante";

const PER_PAGE = 5;

const PASS_MARK = 10;
const RISK_MARK = 12;

const TYPE_META: Record<EvalType, { icon: React.FC<{ style?: React.CSSProperties }>; bg: string; color: string; label: string }> = {
    presentation: { icon: Presentation, bg: color.primary50, color: color.primary, label: "Exposición" },
    exam: { icon: FileText, bg: color.warningBg, color: color.warning, label: "Examen" },
    lab: { icon: FlaskConical, bg: color.successBg, color: color.success, label: "Laboratorio" },
    essay: { icon: PenLine, bg: color.purpleBg, color: color.purple, label: "Ensayo" },
};

const daysLabel = (d: number) => (d <= 0 ? "Hoy" : d === 1 ? "Mañana" : `en ${d} días`);
const WEEK_LABEL = "3 al 10 de julio";
const avgClass = (a: number) => (a < PASS_MARK ? "text-edu-danger" : a < RISK_MARK ? "text-edu-warning" : "text-edu-ink");

const EVAL_COLS = "grid-cols-[1.2fr_1.8fr_1.1fr_0.7fr_1fr]";
const EVAL_HEADERS = ["Materia", "Evaluación", "Fecha", "Peso", "Promedio"];

export function MisEvaluacionesPage() {
    const [selected, setSelected] = useState<Evaluation | null>(null);
    const [query, setQuery] = useState("");
    const [subjectFilter, setSubjectFilter] = useState("todas");
    const [order, setOrder] = useState<"fecha" | "riesgo">("fecha");
    const [page, setPage] = useState(1);

    const { selectedId } = useLapso();
    const { data: evaluations } = useFetch(getEvaluaciones, []);
    const lapsoEvals = evaluations.filter((e) => e.lapso === selectedId);

    const thisWeek = lapsoEvals.filter((e) => e.daysUntil <= 7).length;
    const nearest = [...lapsoEvals].sort((a, b) => a.daysUntil - b.daysUntil)[0];
    const atRiskEvals = lapsoEvals.filter((e) => e.currentAverage < RISK_MARK);
    const mostImportant = (atRiskEvals.length ? atRiskEvals : lapsoEvals)
        .slice()
        .sort((a, b) => a.currentAverage - b.currentAverage || a.daysUntil - b.daysUntil)[0];

    const subjects = Array.from(new Set(lapsoEvals.map((e) => e.subject)));

    const filtered = lapsoEvals.filter((e) => {
        if (subjectFilter !== "todas" && e.subject !== subjectFilter) return false;
        if (query.trim() && !`${e.title} ${e.subject}`.toLowerCase().includes(query.trim().toLowerCase())) return false;
        return true;
    }).sort((a, b) =>
        order === "riesgo"
            ? a.currentAverage - b.currentAverage || a.daysUntil - b.daysUntil
            : a.daysUntil - b.daysUntil,
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    return (
        <>
            {/* Bloques resumen — por lapso; vacío cuando el lapso no tiene evaluaciones pendientes */}
            {lapsoEvals.length === 0 ? (
                <div className="bg-edu-surface rounded-edu-card p-8 border border-edu-border-soft text-center">
                    <p className="text-edu-ink-500 text-sm m-0">No tienes evaluaciones pendientes en este lapso.</p>
                    <p className="text-edu-ink-400 text-xs mt-1 m-0">Cambia de lapso para consultar otras evaluaciones.</p>
                </div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Cantidad esta semana */}
                <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                                Evaluaciones esta semana
                            </p>
                            <p className="text-edu-ink text-[1.4rem] font-bold mt-1">{thisWeek}</p>
                        </div>
                        <div className="w-10 h-10 rounded-edu-control bg-edu-primary-100 flex items-center justify-center shrink-0">
                            <CalendarClock className="w-5 h-5 text-edu-primary" />
                        </div>
                    </div>
                    <p className="text-edu-ink-400 text-xs m-0">En los próximos 7 días</p>
                    <div className="flex items-center justify-between gap-2 mt-auto">
                        <span className="inline-flex items-center gap-1.5 bg-edu-primary-50 text-edu-primary text-[0.72rem] font-semibold px-2.5 py-[3px] rounded-edu-pill">
                            <CalendarClock className="w-3.5 h-3.5 shrink-0" />
                            {WEEK_LABEL}
                        </span>
                    </div>
                </div>

                {/* La más cercana */}
                <button
                    onClick={() => setSelected(nearest)}
                    className="text-left bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5 cursor-pointer transition-colors hover:border-edu-primary-200"
                >
                    <div className="flex justify-between items-start">
                        <div className="min-w-0">
                            <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                                La más cercana
                            </p>
                            <p className="text-edu-ink text-[1.1rem] font-bold mt-1 truncate">{nearest.subject}</p>
                        </div>
                        <div className="w-10 h-10 rounded-edu-control bg-edu-primary-100 flex items-center justify-center shrink-0">
                            <Clock className="w-5 h-5 text-edu-primary" />
                        </div>
                    </div>
                    <p className="text-edu-ink-400 text-xs m-0 truncate">{nearest.title}</p>
                    <div className="flex items-center justify-between gap-2 mt-auto">
                        <span className="bg-edu-primary-50 text-edu-primary text-[0.72rem] font-semibold px-2.5 py-[3px] rounded-edu-pill">
                            {daysLabel(nearest.daysUntil)} · {nearest.date}
                        </span>
                        <ChevronRight className="w-4 h-4 text-edu-ink-300 shrink-0" />
                    </div>
                </button>

                {/* La más importante — evitar reparación */}
                <button
                    onClick={() => setSelected(mostImportant)}
                    className="text-left bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5 cursor-pointer transition-colors hover:border-edu-danger"
                >
                    <div className="flex justify-between items-start">
                        <div className="min-w-0">
                            <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                                Más importante por hacer
                            </p>
                            <p className="text-edu-ink text-[1.1rem] font-bold mt-1 truncate">{mostImportant.subject}</p>
                        </div>
                        <div className="w-10 h-10 rounded-edu-control bg-edu-danger-bg flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-5 h-5 text-edu-danger" />
                        </div>
                    </div>
                    <p className="text-edu-ink-400 text-xs m-0 truncate">{mostImportant.title}</p>
                    <div className="flex items-center justify-between gap-2 mt-auto">
                        <span className="bg-edu-danger-bg text-edu-danger text-[0.72rem] font-semibold px-2.5 py-[3px] rounded-edu-pill">
                            Evita reparación · {mostImportant.currentAverage}/20
                        </span>
                        <ChevronRight className="w-4 h-4 text-edu-ink-300 shrink-0" />
                    </div>
                </button>
            </div>
            )}

            {/* Tabla de evaluaciones */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                    <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Evaluaciones por hacer</h3>
                    <span className="text-[0.8rem] text-edu-ink-400 font-medium">{filtered.length} evaluaciones</span>
                </div>

                {/* Buscador y filtros */}
                <div className="px-5 py-3 flex gap-2 items-center flex-wrap border-b border-edu-border-soft">
                    <LapsoFilter />
                    <div className="relative flex-1 min-w-[180px]">
                        <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                            placeholder="Buscar evaluación o materia…"
                            className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                        />
                    </div>
                    <select
                        value={subjectFilter}
                        onChange={(e) => { setSubjectFilter(e.target.value); setPage(1); }}
                        className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
                    >
                        <option value="todas">Todas las materias</option>
                        {subjects.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    <select
                        value={order}
                        onChange={(e) => { setOrder(e.target.value as "fecha" | "riesgo"); setPage(1); }}
                        className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
                    >
                        <option value="fecha">Por fecha (más cercana)</option>
                        <option value="riesgo">Más cercanas a reprobar</option>
                    </select>
                </div>

                {/* Tabla */}
                <div className="overflow-x-auto">
                    <div className="min-w-[680px]">
                    <div className={`grid ${EVAL_COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                        {EVAL_HEADERS.map((h) => (
                            <span
                                key={h}
                                className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]"
                            >
                                {h}
                            </span>
                        ))}
                    </div>
                    {filtered.length === 0 && (
                        <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">
                            No hay evaluaciones que coincidan con el filtro.
                        </div>
                    )}
                    {paged.map((e, i) => {
                        const t = TYPE_META[e.type];
                        const atRisk = e.currentAverage < RISK_MARK;
                        return (
                            <div
                                key={e.id}
                                onClick={() => setSelected(e)}
                                className={`grid ${EVAL_COLS} px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                            >
                                <span className="text-[0.875rem] text-edu-ink font-medium truncate pr-2">{e.subject}</span>
                                <div className="min-w-0 pr-2">
                                    <div className="text-[0.875rem] text-edu-ink-700 truncate">{e.title}</div>
                                    <span
                                        className="inline-flex mt-0.5 text-[0.62rem] font-semibold px-1.5 py-px rounded-edu-pill"
                                        style={{ backgroundColor: t.bg, color: t.color }}
                                    >
                                        {t.label}
                                    </span>
                                </div>
                                <div className="min-w-0 pr-2">
                                    <div className="text-[0.8125rem] text-edu-ink-700">{e.date}</div>
                                    <div className="text-[0.7rem] text-edu-ink-400 flex items-center gap-1">
                                        <Clock className="w-3 h-3 shrink-0" />
                                        {daysLabel(e.daysUntil)}
                                    </div>
                                </div>
                                <span className="text-[0.875rem] text-edu-ink-700 font-semibold">{e.weight}</span>
                                <div className="flex flex-col">
                                    <span className={`text-[0.9rem] font-bold ${avgClass(e.currentAverage)}`}>
                                        {e.currentAverage}
                                        <span className="text-edu-ink-400 font-normal text-[0.75rem]">/20</span>
                                    </span>
                                    {atRisk && (
                                        <span className="text-[0.62rem] text-edu-danger font-medium">En riesgo</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    </div>
                    {totalPages > 1 && (
                        <div className="px-5 py-4 border-t border-edu-border-soft">
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
                        </div>
                    )}
                </div>
            </div>

            {/* Modal con la información de la evaluación */}
            {selected && (
                <div
                    className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
                    onClick={() => setSelected(null)}
                >
                    <div
                        className="bg-edu-surface rounded-edu-card w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {(() => {
                            const t = TYPE_META[selected.type];
                            const TypeIcon = t.icon;
                            const atRisk = selected.currentAverage < RISK_MARK;
                            return (
                                <>
                                    {/* Encabezado */}
                                    <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-start gap-3">
                                        <div className="flex items-start gap-3 min-w-0">
                                            <div
                                                className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0"
                                                style={{ backgroundColor: t.bg }}
                                            >
                                                <TypeIcon style={{ width: "18px", height: "18px", color: t.color }} />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem] leading-snug">{selected.title}</h3>
                                                <div className="text-[0.8rem] text-edu-ink-500 mt-0.5">{selected.subject}</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelected(null)}
                                            aria-label="Cerrar"
                                            className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700 shrink-0"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="p-5 flex flex-col gap-4">
                                        {/* Cuenta regresiva */}
                                        <div className="flex items-center justify-between px-4 py-3 rounded-edu-control bg-edu-subtle">
                                            <div>
                                                <div className="text-[0.72rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Fecha</div>
                                                <div className="text-[1.1rem] font-bold text-edu-ink leading-none mt-0.5">{selected.date}</div>
                                            </div>
                                            <span className="inline-flex items-center gap-1.5 bg-edu-primary-50 text-edu-primary text-[0.8rem] font-semibold px-3 py-1.5 rounded-edu-pill">
                                                <Clock className="w-3.5 h-3.5" />
                                                {daysLabel(selected.daysUntil)}
                                            </span>
                                        </div>

                                        {/* Datos */}
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                            {[
                                                { label: "Tipo", value: t.label },
                                                { label: "Docente", value: selected.teacher },
                                                { label: "Peso", value: selected.weight },
                                            ].map((d) => (
                                                <div key={d.label}>
                                                    <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">{d.label}</div>
                                                    <div className="text-[0.875rem] text-edu-ink font-medium">{d.value}</div>
                                                </div>
                                            ))}
                                            <div>
                                                <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Promedio actual</div>
                                                <div className={`text-[0.875rem] font-bold ${avgClass(selected.currentAverage)}`}>
                                                    {selected.currentAverage}/20
                                                </div>
                                            </div>
                                        </div>

                                        {/* Aviso de riesgo */}
                                        {atRisk && (
                                            <div className="flex items-start gap-2 px-3.5 py-3 rounded-edu-control bg-edu-danger-bg text-edu-danger text-[0.8125rem] leading-[1.5]">
                                                <AlertTriangle className="w-4 h-4 shrink-0 mt-px" />
                                                <span>
                                                    Esta materia tiene promedio {selected.currentAverage}/20. Aprobar esta
                                                    evaluación es clave para <strong>evitar la reparación</strong>.
                                                </span>
                                            </div>
                                        )}

                                        {/* Descripción */}
                                        <div>
                                            <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium mb-1">Descripción</div>
                                            <p className="text-sm text-edu-ink-700 leading-[1.6] m-0">{selected.description}</p>
                                        </div>

                                        {/* Temas */}
                                        {selected.topics && selected.topics.length > 0 && (
                                            <div>
                                                <div className="flex items-center gap-1.5 mb-2">
                                                    <ListChecks className="w-3.5 h-3.5 text-edu-primary" />
                                                    <span className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">
                                                        Temas ({selected.topics.length})
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    {selected.topics.map((topic) => (
                                                        <div
                                                            key={topic.id}
                                                            className="flex items-start gap-2.5 px-3.5 py-2 bg-edu-primary-50 rounded-edu-chip border border-edu-primary-100"
                                                        >
                                                            <div className="w-[20px] h-[20px] rounded-full bg-edu-primary text-white flex items-center justify-center text-[0.68rem] font-bold shrink-0">
                                                                {topic.id}
                                                            </div>
                                                            <span className="text-[0.8125rem] text-[#1e3a5f] leading-[1.5]">{topic.text}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Material adjunto */}
                                        {selected.guide && (
                                            <div className="flex items-center gap-3 p-3 rounded-edu-control border border-edu-border-soft bg-edu-subtle">
                                                <div className="w-10 h-10 rounded-edu-chip bg-edu-primary-50 flex items-center justify-center shrink-0">
                                                    <FileText className="w-5 h-5 text-edu-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-edu-ink truncate">{selected.guide}</div>
                                                    <div className="text-xs text-edu-ink-400">Material de apoyo</div>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-edu-control border-[1.5px] border-edu-primary-200 bg-edu-primary-50 text-edu-primary text-[0.8125rem] font-semibold cursor-pointer transition-colors hover:bg-edu-primary-100 shrink-0"
                                                >
                                                    <Download className="w-3.5 h-3.5" />
                                                    Descargar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>
            )}
        </>
    );
}
