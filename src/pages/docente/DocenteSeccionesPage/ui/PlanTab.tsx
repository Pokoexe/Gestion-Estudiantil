import { ChevronRight, Clock } from "lucide-react";
import { Th } from "./Th";
import type { EvaluacionPlan, EvalEstado, EvalTipo } from "../interfaces";

interface Props {
    PLAN: EvaluacionPlan[];
    onSelect: (ev: EvaluacionPlan) => void;
    TYPE_META: Record<EvalTipo, { icon: React.FC<{ style?: React.CSSProperties }>; bg: string; color: string; label: string }>;
    EVAL_STATUS: Record<EvalEstado, { bg: string; fg: string }>;
}

export function PlanTab({ PLAN, onSelect, TYPE_META, EVAL_STATUS }: Props) {
    return (
        <div className="overflow-x-auto">
            <div className="min-w-[680px]">
                <div className="grid grid-cols-[2fr_1fr_0.6fr_1fr_1fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                    {["Evaluación", "Horario", "%", "Fecha", "Estado"].map((h) => (
                        <Th key={h}>{h}</Th>
                    ))}
                </div>
                {PLAN.map((ev, i) => {
                    const st = EVAL_STATUS[ev.status];
                    const tm = TYPE_META[ev.type];
                    return (
                        <div
                            key={ev.id}
                            onClick={() => onSelect(ev)}
                            className={`grid grid-cols-[2fr_1fr_0.6fr_1fr_1fr] px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle ${i < PLAN.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                        >
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 rounded-edu-chip flex items-center justify-center shrink-0" style={{ backgroundColor: tm.bg }}>
                                    <tm.icon style={{ width: "15px", height: "15px", color: tm.color }} />
                                </div>
                                <span className="text-sm text-edu-ink font-medium truncate">{ev.name}</span>
                            </div>
                            <span className="text-[0.8125rem] text-edu-ink-500 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-edu-ink-400 shrink-0" />
                                {ev.horario}
                            </span>
                            <span className="text-sm text-edu-ink-700 font-semibold">{ev.weight}%</span>
                            <span className="text-[0.8125rem] text-edu-ink-500">{ev.date}</span>
                            <div className="flex items-center justify-between gap-1">
                                <span
                                    className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit"
                                    style={{ backgroundColor: st.bg, color: st.fg }}
                                >
                                    {ev.status}
                                </span>
                                <ChevronRight className="w-4 h-4 text-edu-ink-300 shrink-0" />
                            </div>
                        </div>
                    );
                })}
                <div className="px-5 py-3 bg-edu-subtle border-t border-edu-border-soft text-[0.8125rem] text-edu-ink-500 flex justify-between">
                    <span>Total ponderado</span>
                    <span className="font-semibold text-edu-ink">
                        {PLAN.reduce((a, e) => a + e.weight, 0)}%
                    </span>
                </div>
            </div>
        </div>
    );
}
