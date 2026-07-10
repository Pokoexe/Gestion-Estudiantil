import { AlertTriangle } from "lucide-react";
import { Th } from "./Th";
import type { Estudiante } from "../interfaces";

interface Props {
    raspados: Estudiante[];
}

export function RaspadosTab({ raspados }: Props) {
    return (
        <div>
            <div className="px-5 py-3 bg-edu-danger-bg border-b border-edu-border-soft text-[0.8125rem] text-edu-danger flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {raspados.length} estudiante(s) con promedio inferior a 10 puntos
            </div>
            <div className="overflow-x-auto">
                <div className="min-w-[520px]">
                    <div className="grid grid-cols-[2fr_1fr_0.8fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                        {["Estudiante", "Cédula", "Promedio"].map((h) => (
                            <Th key={h}>{h}</Th>
                        ))}
                    </div>
                    {raspados.map((e, i) => (
                        <div
                            key={e.id}
                            className={`grid grid-cols-[2fr_1fr_0.8fr] px-5 py-[13px] items-center bg-edu-danger-bg/30 ${i < raspados.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                        >
                            <span className="text-sm text-edu-danger font-semibold">{e.name}</span>
                            <span className="text-[0.8125rem] text-edu-ink-500">{e.cedula}</span>
                            <span className="text-sm font-bold text-edu-danger">{e.average.toFixed(1)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
