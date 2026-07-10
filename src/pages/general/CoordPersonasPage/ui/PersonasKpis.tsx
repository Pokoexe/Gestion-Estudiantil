import { AlertCircle, AlertTriangle } from "lucide-react";
import { accent } from "@themes/tokens";

export function PersonasKpis() {
    return (
        <div className="space-y-2">
            <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">Asistencia general</p>
                        <p className="text-edu-ink text-[1.4rem] font-bold mt-1">92,4 %</p>
                    </div>
                    <div className="w-10 h-10 rounded-edu-control bg-edu-warning-bg flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-edu-warning-strong" />
                    </div>
                </div>
                <div className="flex gap-1">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className={`flex-1 h-1.5 rounded-edu-pill ${i < 18 ? "bg-edu-primary" : "bg-edu-danger-bg"}`} />
                    ))}
                </div>
                <p className="text-edu-ink-400 text-xs m-0">Los estudiantes han asistido a clases en un +2%</p>
            </div>

            <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-edu-ink-500 text-[0.75rem] font-medium m-0 uppercase tracking-[0.05em]">Incidencias</p>
                        <p className="text-edu-ink text-[1.6rem] font-bold mt-1 mb-0">4</p>
                    </div>
                    <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: accent.red.bg }}>
                        <AlertTriangle style={{ width: "20px", height: "20px", color: accent.red.fg }} />
                    </div>
                </div>
                <p className="text-edu-ink-400 text-[0.75rem] m-0">3 más que el mes anterior</p>
            </div>
        </div>
    );
}
