import { Award, TrendingDown, AlertCircle } from "lucide-react";
import type { Subject } from "@shared/services/actions/estudiante";

interface StatsCardsProps {
    best: Subject | undefined;
    worst: Subject | undefined;
    goToSubject: (id: number) => void;
}

/** Tarjetas KPI: asistencia promedio, materia con mejor promedio y materia con peor promedio. */
export function StatsCards({ best, worst, goToSubject }: StatsCardsProps) {
    return (
        <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Asistencia promedio */}
            <div className="col-span-1 sm:col-span-2 bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                            Promedio de Asistencia
                        </p>
                        <p className="text-edu-ink text-[1.4rem] font-bold mt-1">
                            92,4 %
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-edu-control bg-edu-warning-bg flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-edu-warning-strong" />
                    </div>
                </div>
                <div className="flex gap-1">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div
                            key={i}
                            className={`flex-1 h-1.5 rounded-edu-pill ${i < 18 ? "bg-edu-primary" : "bg-edu-danger-bg"}`}
                        />
                    ))}
                </div>
                <p className="text-edu-ink-400 text-xs m-0">
                    2 inasistencias este lapso · Mínimo exigido: 75 %
                </p>
            </div>

            {/* Materia con más promedio */}
            <button type="button" onClick={() => best && goToSubject(best.id)} className="text-left bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5 cursor-pointer transition-colors hover:border-edu-primary-200">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                            Materia con más promedio
                        </p>
                        <p className="text-edu-ink text-[1.1rem] font-bold mt-1">
                            {best?.name}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-edu-control bg-edu-success-bg flex items-center justify-center shrink-0">
                        <Award className="w-5 h-5 text-edu-success" />
                    </div>
                </div>
                <p className="text-edu-ink-700 text-[0.8rem] m-0">
                    Eres el estudiante n.º {best?.rank} de la materia
                </p>
                <div className="flex items-center justify-between gap-2 mt-auto">
                    <p className="text-edu-ink-400 text-xs m-0">
                        {best?.teacher}
                    </p>
                    <span className="font-semibold text-[0.8rem] px-2.5 py-[3px] rounded-[6px] text-white bg-edu-success shrink-0">
                        Promedio de {best?.average}
                    </span>
                </div>
            </button>

            {/* Materia con peor promedio */}
            <button type="button" onClick={() => worst && goToSubject(worst.id)} className="text-left bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5 cursor-pointer transition-colors hover:border-edu-primary-200">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                            Materia con peor promedio
                        </p>
                        <p className="text-edu-ink text-[1.1rem] font-bold mt-1">
                            {worst?.name}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-edu-control bg-edu-danger-bg flex items-center justify-center shrink-0">
                        <TrendingDown className="w-5 h-5 text-edu-danger" />
                    </div>
                </div>
                <p className="text-edu-ink-700 text-[0.8rem] m-0">
                    No aprobaste {worst?.failedEvals}{" "}
                    {worst?.failedEvals === 1 ? "evaluación" : "evaluaciones"}
                </p>
                <div className="flex items-center justify-between gap-2 mt-auto">
                    <p className="text-edu-ink-400 text-xs m-0">
                        {worst?.teacher}
                    </p>
                    <span className="font-semibold text-[0.8rem] px-2.5 py-[3px] rounded-[6px] text-white bg-edu-danger shrink-0">
                        Promedio de {worst?.average}
                    </span>
                </div>
            </button>
        </div>
    );
}
