import {
    BarChart2,
    TrendingUp,
    TrendingDown,
    CalendarCheck,
    ChevronRight,
} from "lucide-react";
import type { Stat } from "../interfaces";

const STATS: Stat[] = [
    { label: "Promedio de notas", value: "16,8", hint: "sobre 20 · buen rendimiento", icon: BarChart2, iconBg: "bg-edu-primary-100", iconFg: "text-edu-primary" },
    { label: "Promedio mayor de materia", value: "19", hint: "Física · Prof. Torres", icon: TrendingUp, iconBg: "bg-edu-success-bg", iconFg: "text-edu-success", subjectId: 1 },
    { label: "Promedio menor de materia", value: "8", hint: "Inglés · Prof. Collins", icon: TrendingDown, iconBg: "bg-edu-danger-bg", iconFg: "text-edu-danger", subjectId: 8 },
    { label: "Asistencia promedio", value: "92,4 %", hint: "2 inasistencias este lapso", icon: CalendarCheck, iconBg: "bg-edu-warning-bg", iconFg: "text-edu-warning-strong" },
];

interface StatsGridProps {
    onSubjectClick: (subjectId: number) => void;
}

/** Indicadores generales del estudiante en tarjetas (algunas enlazan a la materia). */
export function StatsGrid({ onSubjectClick }: StatsGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((s) => {
                const Icon = s.icon;
                const clickable = s.subjectId !== undefined;
                const content = (
                    <>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                                    {s.label}
                                </p>
                                <p className="text-edu-ink text-[1.4rem] font-bold mt-1">{s.value}</p>
                            </div>
                            <div className={`w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0 ${s.iconBg}`}>
                                <Icon className={`w-5 h-5 ${s.iconFg}`} />
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-1">
                            <p className="text-edu-ink-400 text-xs m-0 truncate">{s.hint}</p>
                            {clickable && <ChevronRight className="w-3.5 h-3.5 text-edu-ink-300 shrink-0" />}
                        </div>
                    </>
                );
                return clickable ? (
                    <button
                        key={s.label}
                        onClick={() => onSubjectClick(s.subjectId!)}
                        className="text-left bg-edu-surface rounded-edu-card p-4 border border-edu-border-soft flex flex-col gap-2 cursor-pointer transition-colors hover:border-edu-primary-200"
                    >
                        {content}
                    </button>
                ) : (
                    <div
                        key={s.label}
                        className="bg-edu-surface rounded-edu-card p-4 border border-edu-border-soft flex flex-col gap-2"
                    >
                        {content}
                    </div>
                );
            })}
        </div>
    );
}
