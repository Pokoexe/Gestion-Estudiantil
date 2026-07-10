import { Clock, CalendarClock, AlertTriangle, ChevronRight } from "lucide-react";
import type { Evaluation } from "@shared/services/actions/estudiante";

const daysLabel = (d: number) => (d <= 0 ? "Hoy" : d === 1 ? "Mañana" : `en ${d} días`);
const WEEK_LABEL = "3 al 10 de julio";

interface SummaryCardsProps {
    lapsoEvals: Evaluation[];
    thisWeek: number;
    nearest: Evaluation;
    mostImportant: Evaluation;
    onSelect: (e: Evaluation) => void;
}

/** Bloques resumen del lapso: cantidad esta semana, la más cercana y la más importante. */
export function SummaryCards({ lapsoEvals, thisWeek, nearest, mostImportant, onSelect }: SummaryCardsProps) {
    // Bloques resumen — por lapso; vacío cuando el lapso no tiene evaluaciones pendientes
    if (lapsoEvals.length === 0) {
        return (
            <div className="bg-edu-surface rounded-edu-card p-8 border border-edu-border-soft text-center">
                <p className="text-edu-ink-500 text-sm m-0">No tienes evaluaciones pendientes en este lapso.</p>
                <p className="text-edu-ink-400 text-xs mt-1 m-0">Cambia de lapso para consultar otras evaluaciones.</p>
            </div>
        );
    }

    return (
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
                onClick={() => onSelect(nearest)}
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
                onClick={() => onSelect(mostImportant)}
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
    );
}
