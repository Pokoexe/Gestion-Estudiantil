import { Paperclip } from "lucide-react";
import { Th } from "./Th";
import type { Pendiente } from "../interfaces";

interface Props {
    PENDIENTES: Pendiente[];
    onEvidence: (p: Pendiente) => void;
}

export function FaltanTab({ PENDIENTES, onEvidence }: Props) {
    return (
        <div className="overflow-x-auto">
            <div className="min-w-[520px]">
                <div className="grid grid-cols-[1.6fr_1.6fr_1fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                    {["Estudiante", "Evaluación", "Evidencia"].map((h) => (
                        <Th key={h}>{h}</Th>
                    ))}
                </div>
                {PENDIENTES.map((p, i) => (
                    <div
                        key={i}
                        className={`grid grid-cols-[1.6fr_1.6fr_1fr] px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < PENDIENTES.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                    >
                        <span className="text-sm text-edu-ink font-medium">{p.student}</span>
                        <span className="text-[0.8125rem] text-edu-ink-500">{p.evaluation}</span>
                        {p.hasEvidence ? (
                            <button
                                onClick={() => onEvidence(p)}
                                className="inline-flex items-center gap-1.5 text-edu-primary text-[0.8rem] font-semibold w-fit cursor-pointer bg-transparent border-none p-0 hover:underline"
                            >
                                <Paperclip className="w-3.5 h-3.5" /> Ver evidencia
                            </button>
                        ) : (
                            <span className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit bg-edu-warning-bg text-edu-warning">
                                Sin evidencia
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
