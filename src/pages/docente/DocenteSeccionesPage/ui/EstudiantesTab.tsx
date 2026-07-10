import { ChevronRight } from "lucide-react";
import { Th } from "./Th";
import type { Estudiante } from "../interfaces";

interface Props {
    ESTUDIANTES: Estudiante[];
    onSelect: (e: Estudiante) => void;
    notaColor: (n: number) => string;
}

export function EstudiantesTab({ ESTUDIANTES, onSelect, notaColor }: Props) {
    return (
        <div className="overflow-x-auto">
            <div className="min-w-[600px]">
                <div className="grid grid-cols-[2fr_1fr_0.8fr_0.8fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                    {["Estudiante", "Cédula", "Asistencia", "Promedio"].map((h) => (
                        <Th key={h}>{h}</Th>
                    ))}
                </div>
                {ESTUDIANTES.map((e, i) => (
                    <div
                        key={e.id}
                        onClick={() => onSelect(e)}
                        className={`grid grid-cols-[2fr_1fr_0.8fr_0.8fr] px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle ${i < ESTUDIANTES.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                    >
                        <span className="text-sm text-edu-ink font-medium">{e.name}</span>
                        <span className="text-[0.8125rem] text-edu-ink-500">{e.cedula}</span>
                        <span className={`text-sm font-semibold ${e.attendance >= 90 ? "text-edu-success" : "text-edu-warning"}`}>{e.attendance} %</span>
                        <div className="flex items-center justify-between gap-1">
                            <span className={`text-sm font-bold ${notaColor(e.average)}`}>{e.average.toFixed(1)}</span>
                            <ChevronRight className="w-4 h-4 text-edu-ink-300 shrink-0" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
