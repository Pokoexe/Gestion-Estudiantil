import {
    BarChart3,
    Users,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
} from "lucide-react";
import { accent } from "@themes/tokens";
import type { Estudiante } from "../interfaces";

interface Props {
    promedioSeccion: number;
    asistenciaSeccion: number;
    aprobados: number;
    raspados: Estudiante[];
    faltanUltima: number;
    totalEstudiantes: number;
    notaColor: (n: number) => string;
}

export function SeccionResumen({
    promedioSeccion,
    asistenciaSeccion,
    aprobados,
    raspados,
    faltanUltima,
    totalEstudiantes,
    notaColor,
}: Props) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
                { label: "Promedio de la sección", value: promedioSeccion.toFixed(1), icon: BarChart3, ac: accent.blue, valueClass: notaColor(promedioSeccion), trend: { text: "0,4 más que el mes pasado", dir: "up" as const, good: true } },
                { label: "Asistencia media", value: `${asistenciaSeccion.toFixed(0)} %`, icon: Users, ac: accent.purple, valueClass: "text-edu-ink", trend: { text: "2 % menos que el mes pasado", dir: "down" as const, good: false } },
                { label: "Aprobados", value: `${aprobados}/${totalEstudiantes}`, icon: CheckCircle2, ac: accent.green, valueClass: "text-edu-success", trend: { text: "3 más que el mes pasado", dir: "up" as const, good: true } },
                { label: "Reprobados", value: String(raspados.length), icon: XCircle, ac: accent.red, valueClass: "text-edu-danger", trend: { text: "1 menos que el mes pasado", dir: "down" as const, good: true } },
                { label: "Faltan última evaluación", value: String(faltanUltima), icon: AlertTriangle, ac: accent.amber, valueClass: "text-edu-warning", trend: { text: "2 más que el mes pasado", dir: "up" as const, good: false } },
            ].map((s) => {
                const Icon = s.icon;
                const TrendIcon = s.trend.dir === "up" ? TrendingUp : TrendingDown;
                return (
                    <div key={s.label} className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-3">
                        <div className="flex justify-between items-start gap-2">
                            <div className="min-w-0">
                                <p className="text-edu-ink-500 text-[0.75rem] font-medium m-0 uppercase tracking-[0.05em]">{s.label}</p>
                                <p className={`text-[1.6rem] font-bold mt-1.5 m-0 ${s.valueClass}`}>{s.value}</p>
                            </div>
                            <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: s.ac.bg }}>
                                <Icon style={{ width: "20px", height: "20px", color: s.ac.fg }} />
                            </div>
                        </div>
                        <p className="text-edu-ink-400 text-[0.75rem] m-0 flex items-center gap-[5px]">
                            <TrendIcon style={{ width: "12px", height: "12px" }} className={s.trend.good ? "text-edu-success" : "text-edu-danger"} />
                            {s.trend.text}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}
