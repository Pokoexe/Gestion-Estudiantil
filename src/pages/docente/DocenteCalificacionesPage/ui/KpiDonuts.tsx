import { CheckCircle2, AlertCircle } from "lucide-react";
import { DonutChart } from "./DonutChart";
import type { Estudiante } from "@shared/services/actions/docente-eval";

interface KpiDonutsProps {
    classAverage: number;
    approvedCount: number;
    ESTUDIANTES: Estudiante[];
    avgKpiColor: string;
    attendancePct: number;
    attKpiColor: string;
}

export function KpiDonuts({
    classAverage,
    approvedCount,
    ESTUDIANTES,
    avgKpiColor,
    attendancePct,
    attKpiColor,
}: KpiDonutsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Promedio de notas */}
            <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex items-center gap-5">
                <div className="relative shrink-0 w-[76px] h-[76px]">
                    <DonutChart pct={classAverage / 20} fillColor={avgKpiColor} />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-edu-ink font-bold text-[0.9rem]">
                            {classAverage > 0 ? classAverage.toFixed(1) : "—"}
                        </span>
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">Promedio de notas</p>
                    <p className="text-edu-ink text-[1.5rem] font-bold mt-0.5 m-0 leading-none">
                        {classAverage > 0 ? classAverage.toFixed(1) : "—"}
                        {classAverage > 0 && <span className="text-edu-ink-400 font-normal text-sm ml-1">/20</span>}
                    </p>
                    <p className="text-edu-ink-400 text-xs mt-1.5 m-0 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-edu-success shrink-0" />
                        {approvedCount} de {ESTUDIANTES.length} aprobados
                    </p>
                </div>
            </div>

            {/* Asistencia */}
            <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex items-center gap-5">
                <div className="relative shrink-0 w-[76px] h-[76px]">
                    <DonutChart pct={attendancePct / 100} fillColor={attendancePct > 0 ? attKpiColor : "#e9edf2"} />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-edu-ink font-bold text-[0.85rem]">
                            {attendancePct > 0 ? `${attendancePct}%` : "—"}
                        </span>
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">Asistencia</p>
                    <p className="text-edu-ink text-[1.5rem] font-bold mt-0.5 m-0 leading-none">
                        {attendancePct > 0 ? `${attendancePct} %` : "—"}
                    </p>
                    <p className="text-edu-ink-400 text-xs mt-1.5 m-0 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-edu-warning shrink-0" />
                        Mínimo exigido: 75 %
                    </p>
                </div>
            </div>
        </div>
    );
}
