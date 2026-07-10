import { Search, CheckCircle2, XCircle } from "lucide-react";
import { accent } from "@themes/tokens";
import { Pagination } from "@shared/ui/Pagination";
import type { ActividadTabla, EstadoPostulado } from "@shared/services/actions/coordinador";

interface AgendaTableProps {
    filteredCount: number;
    reunionesQuery: string;
    setReunionesQuery: (q: string) => void;
    setReunionesPage: (p: number) => void;
    COLS: string;
    HEADERS: string[];
    ESTADO_META: Record<EstadoPostulado, { cls: string }>;
    paged: ActividadTabla[];
    filteredReuniones: ActividadTabla[];
    selectedId: number | null;
    setSelectedId: (id: number) => void;
    setConfirmAgenda: (v: { id: number; nuevoEstado: EstadoPostulado } | null) => void;
    currentPage: number;
    totalPages: number;
}

export function AgendaTable({
    filteredCount,
    reunionesQuery,
    setReunionesQuery,
    setReunionesPage,
    COLS,
    HEADERS,
    ESTADO_META,
    paged,
    filteredReuniones,
    selectedId,
    setSelectedId,
    setConfirmAgenda,
    currentPage,
    totalPages,
}: AgendaTableProps) {
    return (
        <div className="lg:col-span-2 bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Agenda de actividades</h3>
                <span className="text-[0.8rem] text-edu-ink-400 font-medium">{filteredCount} actividad{filteredCount === 1 ? "" : "es"}</span>
            </div>

            {/* Buscador */}
            <div className="px-5 py-3 border-b border-edu-border-soft">
                <div className="relative">
                    <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={reunionesQuery}
                        onChange={(e) => { setReunionesQuery(e.target.value); setReunionesPage(1); }}
                        placeholder="Buscar por tema, docente o lugar…"
                        className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                    />
                </div>
            </div>

            <div>
                <div className="overflow-x-auto">
                    <div className="min-w-[860px]">
                        <div className={`grid ${COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                            {HEADERS.map((h) => (
                                <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
                            ))}
                        </div>

                        {filteredReuniones.length === 0 && (
                            <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">No hay actividades que coincidan con la búsqueda.</div>
                        )}

                        {paged.map((r, i) => {
                            const st = ESTADO_META[r.estado];
                            const isSel = r.id === selectedId;
                            return (
                                <div
                                    key={r.id}
                                    onClick={() => setSelectedId(r.id)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedId(r.id); } }}
                                    aria-pressed={isSel}
                                    style={isSel ? { boxShadow: `inset 3px 0 0 ${accent.purple.fg}` } : undefined}
                                    className={`grid ${COLS} px-5 py-[13px] items-center cursor-pointer transition-colors ${isSel ? "bg-edu-subtle" : "hover:bg-edu-subtle"} ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                                >
                                    <div className="min-w-0 pr-3">
                                        <div className={`text-sm ${isSel ? "text-edu-primary" : "text-edu-ink"} font-semibold`}>{r.tema}</div>
                                    </div>
                                    <span className="text-[0.8125rem] text-edu-ink-500">{r.docente}</span>
                                    <span className="text-[0.8125rem] text-edu-ink-500">{r.lugar}</span>
                                    <span className="text-[0.8125rem] text-edu-ink-500">{r.cupos}</span>
                                    <span className="text-[0.8125rem] text-edu-ink-500">{r.fecha}</span>
                                    <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${st.cls}`}>{r.estado}</span>
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setConfirmAgenda({ id: r.id, nuevoEstado: "Aprobado" }); }}
                                            aria-label="Aprobar actividad"
                                            className="inline-flex items-center gap-1 text-[0.75rem] font-semibold text-edu-success cursor-pointer bg-transparent border-none p-0 hover:underline"
                                        >
                                            <CheckCircle2 style={{ width: 14, height: 14 }} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setConfirmAgenda({ id: r.id, nuevoEstado: "Rechazado" }); }}
                                            aria-label="Rechazar actividad"
                                            className="inline-flex items-center gap-1 text-[0.75rem] font-semibold text-edu-danger cursor-pointer bg-transparent border-none p-0 hover:underline"
                                        >
                                            <XCircle style={{ width: 14, height: 14 }} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {totalPages > 1 && (
                    <div className="px-5 py-4 border-t border-edu-border-soft">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setReunionesPage} />
                    </div>
                )}
            </div>
        </div>
    );
}
