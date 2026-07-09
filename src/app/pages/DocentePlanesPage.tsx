import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { PlusCircle, Pencil, X, CheckCircle2, AlertTriangle, Search } from "lucide-react";
import { color } from "../theme/tokens";
import { PlanStats } from "../components/PlanStats";
import { LAPSO } from "../datos_maquetados/data/plans";
import { useFetch } from "../datos_maquetados";
import { getPlanes, type Plan, type PlanEstado } from "../datos_maquetados/actions/plans";
import { Pagination } from "../components/Pagination";
import { LapsoFilter } from "../components/LapsoFilter";
import { useLapso } from "../context/LapsoContext";
import { CURRENT_LAPSO_ID } from "../datos_maquetados/data/lapsos";

const PER_PAGE = 5;

const STATUS_META: Record<PlanEstado, { label: string; bg: string; fg: string }> = {
    approved: { label: "Aprobado", bg: color.successBg, fg: color.success },
    review: { label: "En revisión", bg: color.primary100, fg: color.primary },
    draft: { label: "Borrador", bg: color.subtle, fg: color.ink500 },
    changes: { label: "Cambios solicitados", bg: color.dangerBg, fg: color.danger },
};

function PlanReviewModal({ plan, onClose }: { plan: Plan; onClose: () => void }) {
    const rows = plan.evaluations ?? [];
    const totalWeight = rows.reduce((a, r) => a + (parseFloat(r.weight) || 0), 0);
    const seleccionOk = !!plan.subject && !!plan.section;
    const evalsComplete = rows.every((r) => r.content.trim() && r.weight && r.date);
    const weightOk = totalWeight === 100;
    const datesInRange = rows.every((r) => !r.date || (r.date >= LAPSO.start && r.date <= LAPSO.end));
    const sortedDates = rows.map((r) => r.date).filter(Boolean).sort();
    let spacingOk = true;
    for (let i = 1; i < sortedDates.length; i++) {
        const diff = (new Date(sortedDates[i]).getTime() - new Date(sortedDates[i - 1]).getTime()) / 86_400_000;
        if (diff < LAPSO.minDays || diff > LAPSO.maxDays) spacingOk = false;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={onClose}
        >
            <div
                className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex flex-col gap-4 w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-xl mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between">
                    <h3 className="text-edu-ink font-bold text-base m-0">Datos del plan</h3>
                    <button
                        onClick={onClose}
                        className="text-edu-ink-400 hover:text-edu-ink bg-transparent border-none cursor-pointer p-0 flex items-center"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="rounded-edu-control border border-edu-border-soft p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Materia</div>
                        <div className="text-[0.875rem] text-edu-ink font-medium">{plan.subject || "—"}</div>
                    </div>
                    <div>
                        <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Sección</div>
                        <div className="text-[0.875rem] text-edu-ink font-medium">{plan.section || "—"}</div>
                    </div>
                </div>

                {rows.length > 0 ? (
                    <div className="rounded-edu-control border border-edu-border-soft overflow-hidden">
                        <div className="overflow-x-auto">
                            <div className="min-w-[680px]">
                                <div className="grid grid-cols-[0.4fr_1.6fr_0.5fr_1fr_0.7fr] px-3 py-2 bg-edu-subtle border-b border-edu-border-soft">
                                    {["#", "Evaluación", "%", "Fecha", "Archivos"].map((h, idx) => (
                                        <span key={idx} className="text-[0.65rem] font-semibold text-edu-ink-400 uppercase tracking-[0.04em]">
                                            {h}
                                        </span>
                                    ))}
                                </div>
                                {rows.map((r, i) => (
                                    <div
                                        key={r.id}
                                        className={`grid grid-cols-[0.4fr_1.6fr_0.5fr_1fr_0.7fr] px-3 py-2 items-center ${i < rows.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                                    >
                                        <span className="text-[0.8rem] text-edu-ink-500 font-semibold">{i + 1}</span>
                                        <span className="text-[0.8rem] text-edu-ink font-medium truncate pr-2">
                                            {r.content || <span className="text-edu-danger">Sin nombre</span>}
                                        </span>
                                        <span className="text-[0.8rem] text-edu-ink-700 font-semibold">{r.weight || "—"} %</span>
                                        <span className="text-[0.78rem] text-edu-ink-500">{r.date || "—"}</span>
                                        <span className="text-[0.78rem] text-edu-ink-500">{r.files.length} archivo(s)</span>
                                    </div>
                                ))}
                                <div className="px-3 py-2 bg-edu-subtle border-t border-edu-border-soft flex justify-between text-[0.8125rem]">
                                    <span className="text-edu-ink-500">Ponderación total</span>
                                    <span className={`font-semibold ${weightOk ? "text-edu-success" : "text-edu-warning"}`}>{totalWeight} %</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-edu-ink-400 text-sm py-4 border border-edu-border-soft rounded-edu-control">
                        Sin evaluaciones registradas
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    {[
                        { ok: seleccionOk, text: "Materia y sección seleccionadas" },
                        { ok: evalsComplete, text: "Todas las evaluaciones tienen nombre, ponderación y fecha" },
                        { ok: weightOk, text: `La ponderación total es 100 % (actual: ${totalWeight} %)` },
                        { ok: datesInRange, text: "Las fechas están dentro del lapso" },
                        { ok: spacingOk, text: `Entre evaluaciones hay entre ${LAPSO.minDays} y ${LAPSO.maxDays} días` },
                    ].map((c, i) => (
                        <div key={i} className="flex items-center gap-2 text-[0.8125rem]">
                            {c.ok ? (
                                <CheckCircle2 className="w-4 h-4 text-edu-success shrink-0" />
                            ) : (
                                <AlertTriangle className="w-4 h-4 text-edu-warning shrink-0" />
                            )}
                            <span className={c.ok ? "text-edu-ink-700" : "text-edu-warning"}>{c.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function DocentePlanesPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [feedback, setFeedback] = useState<string | null>(
        (location.state as { feedback?: string } | null)?.feedback ?? null,
    );

    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"todos" | PlanEstado>("todos");
    const [page, setPage] = useState(1);

    const { data: plans } = useFetch(getPlanes, []);
    const { selectedId } = useLapso();
    const lapsoPlans = plans.filter((p) => (p.lapso ?? CURRENT_LAPSO_ID) === selectedId);

    const subidos = lapsoPlans.filter((p) => p.status !== "draft").length;
    const porRevisar = lapsoPlans.filter((p) => p.status === "review").length;
    const aprobados = lapsoPlans.filter((p) => p.status === "approved").length;

    const filteredPlans = lapsoPlans
        .filter((p) => statusFilter === "todos" || p.status === statusFilter)
        .filter((p) => !query.trim() || `${p.subject} ${p.section}`.toLowerCase().includes(query.trim().toLowerCase()));
    const totalPages = Math.max(1, Math.ceil(filteredPlans.length / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paged = filteredPlans.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    return (
        <div className="flex flex-col gap-5">
            {/* Confirmación */}
            {feedback && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-edu-control text-sm font-medium bg-edu-success-bg text-edu-success">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="flex-1">{feedback}</span>
                    <button
                        onClick={() => setFeedback(null)}
                        aria-label="Cerrar"
                        className="text-edu-success bg-transparent border-none cursor-pointer p-0 flex items-center"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Bloques de resumen */}
            <PlanStats subidos={subidos} porRevisar={porRevisar} aprobados={aprobados} />

            <button
                onClick={() => navigate("/docente/planes/nuevo")}
                className="justify-center inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold bg-edu-primary text-white hover:bg-edu-primary-hover border-none cursor-pointer"
            >
                <PlusCircle className="w-4 h-4" />
                Crear plan de evaluación
            </button>

            {/* Tabla de planes */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                    <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Planes de evaluación</h3>
                    <span className="text-[0.8rem] text-edu-ink-400 font-medium">{filteredPlans.length} plan{filteredPlans.length === 1 ? "" : "es"}</span>
                </div>
                <div className="px-5 py-3 grid md:grid-cols-3 gap-2 items-center flex-wrap border-b border-edu-border-soft">
                    <div className="md:col-span-2 relative flex-1 min-w-[180px]">
                        <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                            placeholder="Buscar por materia o sección…"
                            className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value as "todos" | PlanEstado); setPage(1); }}
                        className="w-full md:w-auto border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
                    >
                        <option value="todos">Todos los estados</option>
                        <option value="approved">Aprobados</option>
                        <option value="review">En revisión</option>
                        <option value="draft">Borradores</option>
                        <option value="changes">Cambios solicitados</option>
                    </select>

                    <div className="md:col-span-3 flex justify-end">
                        <LapsoFilter />
                    </div>

                </div>
                <div className="overflow-x-auto">
                    <div className="min-w-[680px]">
                        <div className="grid grid-cols-[1.4fr_0.8fr_0.9fr_1fr_0.6fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                            {["Materia", "Sección", "Evaluaciones", "Estado", "Acción"].map((h) => (
                                <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">
                                    {h}
                                </span>
                            ))}
                        </div>
                        {filteredPlans.length === 0 && (
                            <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">No hay planes que coincidan con el filtro.</div>
                        )}
                        {paged.map((plan, i) => {
                            const st = STATUS_META[plan.status];
                            return (
                                <div
                                    key={plan.id}
                                    onClick={() => setSelectedPlan(plan)}
                                    className={`px-5 py-[13px] transition-colors hover:bg-edu-subtle cursor-pointer ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                                >
                                    <div className="grid grid-cols-[1.4fr_0.8fr_0.9fr_1fr_0.6fr] items-center">
                                        <span className="text-sm text-edu-ink font-medium">{plan.subject}</span>
                                        <span className="text-[0.8125rem] text-edu-ink-500">{plan.section}</span>
                                        <span className="text-sm text-edu-ink-700 font-semibold">{plan.count} evaluaciones</span>
                                        <span
                                            className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit"
                                            style={{ backgroundColor: st.bg, color: st.fg }}
                                        >
                                            {st.label}
                                        </span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); navigate(`/docente/planes/${plan.id}/editar`); }}
                                            className="inline-flex items-center gap-1 text-[0.8rem] text-edu-primary font-semibold cursor-pointer w-fit bg-transparent border-none p-0"
                                        >
                                            <Pencil style={{ width: "13px", height: "13px" }} />
                                            Modificar
                                        </button>
                                    </div>
                                    {plan.note && (
                                        <div className={`mt-2 flex items-center gap-1.5 text-xs w-fit rounded-edu-chip px-2.5 py-1.5 ${plan.status === "changes" ? "text-edu-danger bg-edu-danger-bg" : "text-edu-ink-500 bg-edu-primary-50"}`}>
                                            <AlertTriangle className="shrink-0" style={{ width: "12px", height: "12px" }} />
                                            {plan.note}
                                        </div>
                                    )}
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

            {selectedPlan && (
                <PlanReviewModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
            )}
        </div>
    );
}
