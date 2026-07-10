import { CheckCircle2, Clock } from "lucide-react";

interface KpiCardsProps {
    doneCount: number;
    upcomingCount: number;
}

/** Tarjetas KPI: actividades realizadas y actividades por realizar. */
export function KpiCards({ doneCount, upcomingCount }: KpiCardsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                            Actividades realizadas
                        </p>
                        <p className="text-edu-ink text-[1.4rem] font-bold mt-1">
                            {doneCount}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-edu-control bg-edu-success-bg flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-edu-success" />
                    </div>
                </div>
                <p className="text-edu-ink-400 text-xs m-0">
                    Actividades en las que ya participaste
                </p>
            </div>

            <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                            Actividades por realizar
                        </p>
                        <p className="text-edu-ink text-[1.4rem] font-bold mt-1">
                            {upcomingCount}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-edu-control bg-edu-primary-100 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-edu-primary" />
                    </div>
                </div>
                <p className="text-edu-ink-400 text-xs m-0">
                    Actividades programadas próximamente
                </p>
            </div>
        </div>
    );
}
