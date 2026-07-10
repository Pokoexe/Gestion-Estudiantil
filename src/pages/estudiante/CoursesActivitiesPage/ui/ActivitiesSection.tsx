import { CalendarDays, Search } from "lucide-react";
import { color } from "@themes/tokens";
import { Pagination } from "@shared/ui/Pagination";
import { type Activity, type ActivityStatus } from "@shared/services/actions/estudiante";
import type { ActivityStatusFilter } from "../interfaces";

const ACTIVITY_META: Record<ActivityStatus, { label: string; cls: string; dot: string }> = {
    completed: { label: "Realizada", cls: "bg-edu-success-bg text-edu-success", dot: color.success },
    upcoming: { label: "Por realizar", cls: "bg-edu-primary-50 text-edu-primary", dot: color.primary },
};

const ACTIVITY_COLS = "grid-cols-[1.8fr_1fr_1.4fr_1fr]";
const ACTIVITY_HEADERS = ["Actividad", "Fecha", "Profesor asignado", "Estado"];

const SELECT_CLS = "w-full md:w-auto border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary";

interface ActivitiesSectionProps {
    activityQuery: string;
    setActivityQuery: (v: string) => void;
    activityStatusFilter: ActivityStatusFilter;
    setActivityStatusFilter: (v: ActivityStatusFilter) => void;
    setActivityPage: (v: number) => void;
    filteredActivities: Activity[];
    pagedActivities: Activity[];
    activityTotalPages: number;
    activityCurrentPage: number;
    onSelectActivity: (a: Activity) => void;
}

/** Pestaña "Actividades": buscador, filtro de estado, tabla y paginación. */
export function ActivitiesSection({
    activityQuery, setActivityQuery,
    activityStatusFilter, setActivityStatusFilter,
    setActivityPage,
    filteredActivities, pagedActivities,
    activityTotalPages, activityCurrentPage,
    onSelectActivity,
}: ActivitiesSectionProps) {
    return (
        <>
            {/* Tabla de actividades */}
            <div>
                <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                    <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">
                        Historial de actividades
                    </h3>
                    <span className="text-[0.8rem] text-edu-ink-400 font-medium">
                        {filteredActivities.length} actividad{filteredActivities.length === 1 ? "" : "es"}
                    </span>
                </div>

                {/* Buscador y filtro */}
                <div className="px-5 py-3 flex gap-2 items-center flex-wrap border-b border-edu-border-soft">
                    <div className="relative flex-1 min-w-[180px]">
                        <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={activityQuery}
                            onChange={(e) => { setActivityQuery(e.target.value); setActivityPage(1); }}
                            placeholder="Buscar actividad o profesor…"
                            className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                        />
                    </div>
                    <select
                        value={activityStatusFilter}
                        onChange={(e) => { setActivityStatusFilter(e.target.value as "todas" | ActivityStatus); setActivityPage(1); }}
                        className={SELECT_CLS}
                    >
                        <option value="todas">Todas</option>
                        <option value="completed">Realizadas</option>
                        <option value="upcoming">Por realizar</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <div className="min-w-[600px]">
                        <div className={`grid ${ACTIVITY_COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                            {ACTIVITY_HEADERS.map((h) => (
                                <span
                                    key={h}
                                    className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]"
                                >
                                    {h}
                                </span>
                            ))}
                        </div>

                        {filteredActivities.length === 0 && (
                            <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">
                                No hay actividades que coincidan con el filtro.
                            </div>
                        )}

                        {pagedActivities.map((a, i) => {
                            const meta = ACTIVITY_META[a.status];
                            return (
                                <div
                                    key={a.id}
                                    onClick={() => onSelectActivity(a)}
                                    className={`grid ${ACTIVITY_COLS} px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle ${i < pagedActivities.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="w-2 h-2 rounded-full shrink-0"
                                            style={{ backgroundColor: meta.dot }}
                                        />
                                        <span className="text-[0.875rem] text-edu-ink font-medium">
                                            {a.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <CalendarDays className="w-3 h-3 text-edu-ink-400 shrink-0" />
                                        <span className="text-[0.8125rem] text-edu-ink-500">{a.date}</span>
                                    </div>
                                    <span className="text-[0.875rem] text-edu-ink-700">{a.teacher}</span>
                                    <span
                                        className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${meta.cls}`}
                                    >
                                        {meta.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {activityTotalPages > 1 && (
                        <div className="px-5 py-4 border-t border-edu-border-soft">
                            <Pagination currentPage={activityCurrentPage} totalPages={activityTotalPages} onPageChange={setActivityPage} />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
