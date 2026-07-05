import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { PlusCircle, Pencil, X, CheckCircle2, AlertTriangle, Search } from "lucide-react";
import { color } from "../theme/tokens";
import { PlanStats } from "../components/PlanStats";
import { PLANIFICACIONES, type PlanifEstado } from "../data/planificaciones";
import { Pagination } from "../components/Pagination";

const PER_PAGE = 5;

const STATUS_META: Record<PlanifEstado, { label: string; bg: string; fg: string }> = {
    approved: { label: "Aprobada", bg: color.successBg, fg: color.success },
    review: { label: "En revisión", bg: color.primary100, fg: color.primary },
    draft: { label: "Borrador", bg: color.subtle, fg: color.ink500 },
    changes: { label: "Cambios solicitados", bg: color.dangerBg, fg: color.danger },
};

export function DocentePlanificacionPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [feedback, setFeedback] = useState<string | null>(
        (location.state as { feedback?: string } | null)?.feedback ?? null,
    );

    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"todos" | PlanifEstado>("todos");
    const [page, setPage] = useState(1);

    const subidos = PLANIFICACIONES.filter((p) => p.status !== "draft").length;
    const porRevisar = PLANIFICACIONES.filter((p) => p.status === "review").length;
    const aprobados = PLANIFICACIONES.filter((p) => p.status === "approved").length;

    const filteredPlanif = PLANIFICACIONES
        .filter((p) => statusFilter === "todos" || p.status === statusFilter)
        .filter((p) => !query.trim() || `${p.subject} ${p.section}`.toLowerCase().includes(query.trim().toLowerCase()));
    const totalPages = Math.max(1, Math.ceil(filteredPlanif.length / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paged = filteredPlanif.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

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

            {/* Encabezado */}
            <div className="flex justify-between items-center flex-wrap gap-3">
                <div>
                    <h2 className="m-0 text-edu-ink font-bold text-[1.35rem]">Planificación</h2>
                    <p className="text-edu-ink-500 text-sm mt-1 m-0">
                        Crea y modifica las planificaciones de tus secciones
                    </p>
                </div>
                <button
                    onClick={() => navigate("/docente/planificacion/nuevo")}
                    className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold bg-edu-primary text-white hover:bg-edu-primary-hover border-none cursor-pointer"
                >
                    <PlusCircle className="w-4 h-4" />
                    Crear planificación
                </button>
            </div>

            {/* Bloques de resumen */}
            <PlanStats subidos={subidos} porRevisar={porRevisar} aprobados={aprobados} />

            {/* Tabla de planificaciones */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                    <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Planificaciones</h3>
                    <span className="text-[0.8rem] text-edu-ink-400 font-medium">{filteredPlanif.length} planificación{filteredPlanif.length === 1 ? "" : "es"}</span>
                </div>
                <div className="px-5 py-3 flex gap-2 items-center flex-wrap border-b border-edu-border-soft">
                    <div className="relative flex-1 min-w-[180px]">
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
                        onChange={(e) => { setStatusFilter(e.target.value as "todos" | PlanifEstado); setPage(1); }}
                        className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
                    >
                        <option value="todos">Todos los estados</option>
                        <option value="approved">Aprobadas</option>
                        <option value="review">En revisión</option>
                        <option value="draft">Borradores</option>
                        <option value="changes">Cambios solicitados</option>
                    </select>
                </div>
                <div className="grid grid-cols-[1.4fr_0.8fr_0.9fr_1fr_0.6fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                    {["Materia", "Sección", "Sesiones", "Estado", "Acción"].map((h) => (
                        <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">
                            {h}
                        </span>
                    ))}
                </div>
                {filteredPlanif.length === 0 && (
                    <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">No hay planificaciones que coincidan con el filtro.</div>
                )}
                {paged.map((planif, i) => {
                    const st = STATUS_META[planif.status];
                    return (
                        <div
                            key={planif.id}
                            className={`px-5 py-[13px] transition-colors hover:bg-edu-subtle ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                        >
                            <div className="grid grid-cols-[1.4fr_0.8fr_0.9fr_1fr_0.6fr] items-center">
                                <span className="text-sm text-edu-ink font-medium">{planif.subject}</span>
                                <span className="text-[0.8125rem] text-edu-ink-500">{planif.section}</span>
                                <span className="text-sm text-edu-ink-700 font-semibold">{planif.count} sesiones</span>
                                <span
                                    className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit"
                                    style={{ backgroundColor: st.bg, color: st.fg }}
                                >
                                    {st.label}
                                </span>
                                <button
                                    onClick={() => navigate(`/docente/planificacion/${planif.id}/editar`)}
                                    className="inline-flex items-center gap-1 text-[0.8rem] text-edu-primary font-semibold cursor-pointer w-fit bg-transparent border-none p-0"
                                >
                                    <Pencil style={{ width: "13px", height: "13px" }} />
                                    Modificar
                                </button>
                            </div>
                            {planif.note && (
                                <div className={`mt-2 flex items-center gap-1.5 text-xs w-fit rounded-edu-chip px-2.5 py-1.5 ${planif.status === "changes" ? "text-edu-danger bg-edu-danger-bg" : "text-edu-ink-500 bg-edu-primary-50"}`}>
                                    <AlertTriangle className="shrink-0" style={{ width: "12px", height: "12px" }} />
                                    {planif.note}
                                </div>
                            )}
                        </div>
                    );
                })}
                {totalPages > 1 && (
                    <div className="px-5 py-4 border-t border-edu-border-soft">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
                    </div>
                )}
            </div>
        </div>
    );
}
