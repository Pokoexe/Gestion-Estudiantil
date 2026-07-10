import { CheckCircle2 } from "lucide-react";
import { color } from "@themes/tokens";
import type { EvalRow } from "../interfaces";

interface ReviewPanelProps {
    evalRows: EvalRow[];
    totalPond: number;
    weightOk: boolean;
    evalsOk: boolean;
    infoOk: string | boolean;
}

export function ReviewPanel({ evalRows, totalPond, weightOk, evalsOk, infoOk }: ReviewPanelProps) {
    return (
        <div className="flex flex-col gap-4">
            <div className="rounded-edu-control border border-edu-border-soft overflow-hidden">
              <div className="overflow-x-auto">
                <div className="min-w-[680px]">
                <div className="grid grid-cols-[0.4fr_1.6fr_0.6fr_1fr_0.7fr] px-3 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                    {["#", "Evaluación", "%", "Fecha", "Archivos"].map((h) => (
                        <span key={h} className="text-[0.65rem] font-semibold text-edu-ink-400 uppercase tracking-[0.04em]">{h}</span>
                    ))}
                </div>
                {evalRows.map((r, i) => (
                    <div
                        key={r.id}
                        className={`grid grid-cols-[0.4fr_1.6fr_0.6fr_1fr_0.7fr] px-3 py-2.5 items-center ${i < evalRows.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                    >
                        <span className="text-[0.8rem] text-edu-ink-500 font-semibold">{i + 1}</span>
                        <span className="text-[0.8rem] text-edu-ink font-medium truncate pr-2">
                            {r.nombre || <span className="text-edu-danger">Sin nombre</span>}
                        </span>
                        <span className="text-[0.8rem] text-edu-ink-700 font-semibold">{r.ponderacion || "—"} %</span>
                        <span className="text-[0.78rem] text-edu-ink-500">{r.fecha || "—"}</span>
                        <span className="text-[0.78rem] text-edu-ink-500">{r.archivos.length} arch.</span>
                    </div>
                ))}
                <div className="px-3 py-2.5 bg-edu-subtle border-t border-edu-border-soft flex justify-between text-[0.8125rem]">
                    <span className="text-edu-ink-500">Ponderación total</span>
                    <span className={`font-semibold ${weightOk ? "text-edu-success" : "text-edu-warning"}`}>{totalPond} %</span>
                </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
                {[
                    { ok: infoOk,   text: "Información del curso completa (título y cupos)" },
                    { ok: evalsOk,  text: "Todas las evaluaciones tienen nombre y ponderación" },
                    { ok: weightOk, text: `La ponderación total es 100 % (actual: ${totalPond} %)` },
                ].map((c, i) => (
                    <div key={i} className="flex items-center gap-2 text-[0.8125rem]">
                        {c.ok
                            ? <CheckCircle2 className="w-4 h-4 text-edu-success shrink-0" />
                            : <div className="w-4 h-4 rounded-full border-2 shrink-0" style={{ borderColor: color.warning }} />
                        }
                        <span className={c.ok ? "text-edu-ink-700" : "text-edu-warning"}>{c.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
