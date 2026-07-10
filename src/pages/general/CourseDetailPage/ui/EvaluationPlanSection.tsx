import { type CourseEvaluation } from "@shared/services/actions/courses";
import { EvaluationCard } from "./EvaluationCard";

interface EvaluationPlanSectionProps {
    isEnrolled: boolean;
    evaluations: CourseEvaluation[];
    filteredEvaluations: CourseEvaluation[];
    firstPending: CourseEvaluation | undefined;
    filter: "Todas" | "Pendientes" | "Calificadas";
    setFilter: (f: "Todas" | "Pendientes" | "Calificadas") => void;
}

export function EvaluationPlanSection({
    isEnrolled,
    evaluations,
    filteredEvaluations,
    firstPending,
    filter,
    setFilter,
}: EvaluationPlanSectionProps) {
    return (
        <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-3 flex-wrap gap-3">
                <div>
                    <h3 className="m-0 text-edu-ink font-bold text-base">Plan de evaluación</h3>
                    <p className="mt-0.5 mb-0 text-edu-ink-400 text-[0.8rem]">
                        {isEnrolled
                            ? `${filteredEvaluations.length} de ${evaluations.length} evaluaciones · Peso total: 100%`
                            : `${evaluations.length} evaluaciones · Peso total: 100%`}
                    </p>
                </div>
                {isEnrolled && (
                    <div className="flex gap-1.5">
                        {(["Todas", "Pendientes", "Calificadas"] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`bg-white px-3 py-[5px] rounded-[7px] border-[1.5px] text-[0.775rem] font-medium cursor-pointer ${filter === f ? "border-edu-primary bg-edu-primary-50 text-edu-primary" : "border-edu-border bg-transparent text-edu-ink-500"}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-2.5">
                {isEnrolled && filteredEvaluations.length === 0 ? (
                    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-10 text-center text-edu-ink-400 text-sm">
                        No hay evaluaciones {filter === "Pendientes" ? "pendientes" : "calificadas"}.
                    </div>
                ) : (
                    (isEnrolled ? filteredEvaluations : evaluations).map((evaluation) => (
                        <EvaluationCard
                            key={evaluation.id}
                            evaluation={evaluation}
                            defaultOpen={isEnrolled && (firstPending ? evaluation.id === firstPending.id : evaluation.id === evaluations[0].id)}
                            preview={!isEnrolled}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
