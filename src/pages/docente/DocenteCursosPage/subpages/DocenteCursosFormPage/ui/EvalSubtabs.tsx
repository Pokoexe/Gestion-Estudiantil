import { PlusCircle, ClipboardCheck } from "lucide-react";
import type { EvalRow } from "../interfaces";

interface EvalSubtabsProps {
    evalRows: EvalRow[];
    evalTab: number | "review";
    setEvalTab: (t: number | "review") => void;
    addEval: () => void;
}

export function EvalSubtabs({ evalRows, evalTab, setEvalTab, addEval }: EvalSubtabsProps) {
    return (
        <div className="flex items-center gap-1 flex-wrap border-b border-edu-border-soft -mx-5 px-5">
            {evalRows.map((r, i) => {
                const active = evalTab === i;
                return (
                    <button
                        key={r.id}
                        type="button"
                        onClick={() => setEvalTab(i)}
                        className={`px-3 py-2.5 text-[0.8rem] font-medium border-b-2 -mb-px transition-colors cursor-pointer bg-transparent ${active ? "border-edu-primary text-edu-primary" : "border-transparent text-edu-ink-500 hover:text-edu-ink-700"}`}
                    >
                        Evaluación {i + 1}
                    </button>
                );
            })}
            <button
                type="button"
                onClick={addEval}
                title="Añadir evaluación"
                className="px-2 py-2.5 -mb-px text-edu-primary cursor-pointer bg-transparent border-none flex items-center"
            >
                <PlusCircle className="w-4 h-4" />
            </button>
            <div className="flex-1" />
            <button
                type="button"
                onClick={() => setEvalTab("review")}
                className={`px-3 py-2.5 text-[0.8rem] font-semibold border-b-2 -mb-px inline-flex items-center gap-1.5 transition-colors cursor-pointer bg-transparent ${evalTab === "review" ? "border-edu-primary text-edu-primary" : "border-transparent text-edu-ink-500 hover:text-edu-ink-700"}`}
            >
                <ClipboardCheck className="w-3.5 h-3.5" />
                Datos colocados
            </button>
        </div>
    );
}
