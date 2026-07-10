import { color } from "@themes/tokens";
import { type CourseEvaluation } from "@shared/services/actions/courses";

interface CourseSummaryProps {
    evaluations: CourseEvaluation[];
    gradedEvals: CourseEvaluation[];
    avg: number | null;
    evaluatedWeight: number;
    pendingCount: number;
}

export function CourseSummary({ evaluations, gradedEvals, avg, evaluatedWeight, pendingCount }: CourseSummaryProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 bg-edu-surface rounded-edu-card border border-edu-border-soft px-[22px] py-4 gap-0">
            {[
                { label: "Evaluaciones", value: `${gradedEvals.length}/${evaluations.length}`, color: color.success },
                { label: "Promedio", value: avg !== null ? `${avg.toFixed(1).replace(".", ",")}/20` : "—", color: color.primary },
                { label: "Peso evaluado", value: `${evaluatedWeight}%`, color: color.warning },
                { label: "Estado", value: pendingCount === 0 ? "Completado" : "En curso", color: color.purple },
            ].map(({ label, value, color: dot }, i, arr) => (
                <div
                    key={label}
                    className={`flex-1 px-4 py-2.5 flex flex-col gap-1 ${i < arr.length - 1 ? "border-r border-edu-border-soft" : ""}`}
                >
                    <div className="text-[0.72rem] text-edu-ink-400 font-medium uppercase tracking-[0.05em]">{label}</div>
                    <div className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ backgroundColor: dot }} />
                        <span className="text-base font-bold text-edu-ink">{value}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
