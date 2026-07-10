import { BookOpen, CalendarClock } from "lucide-react";

interface KpiCardsProps {
    totalPendientes: number;
    proximaReparacion: string;
}

/** Tarjetas KPI: total de materias pendientes y próxima fecha de reparación. */
export function KpiCards({ totalPendientes, proximaReparacion }: KpiCardsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                            Materias pendientes
                        </p>
                        <p className="text-edu-ink text-[1.4rem] font-bold mt-1">
                            {totalPendientes}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-edu-control bg-edu-danger-bg flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5 text-edu-danger" />
                    </div>
                </div>
                <p className="text-edu-ink-400 text-xs m-0">
                    Materias reprobadas de años anteriores sin aprobar
                </p>
            </div>

            <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                            Próxima fecha de reparación
                        </p>
                        <p className="text-edu-ink text-[1.4rem] font-bold mt-1">
                            {proximaReparacion}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-edu-control bg-edu-primary-100 flex items-center justify-center shrink-0">
                        <CalendarClock className="w-5 h-5 text-edu-primary" />
                    </div>
                </div>
                <p className="text-edu-ink-400 text-xs m-0">
                    Fecha más cercana de reparación programada
                </p>
            </div>
        </div>
    );
}
