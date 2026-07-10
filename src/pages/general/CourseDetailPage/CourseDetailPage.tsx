import { ChevronLeft } from "lucide-react";
import { useCourseDetail } from "./functions/useCourseDetail";
import { CourseBanner } from "./ui/CourseBanner";
import { CourseSummary } from "./ui/CourseSummary";
import { EnrollCta } from "./ui/EnrollCta";
import { EvaluationPlanSection } from "./ui/EvaluationPlanSection";
import { CoursePresentation } from "./ui/CoursePresentation";

export function CourseDetailPage() {
    const {
        course,
        loading,
        filter,
        setFilter,
        isEnrolled,
        evaluations,
        pendingCount,
        gradedEvals,
        firstPending,
        filteredEvaluations,
        avg,
        evaluatedWeight,
        goBack,
    } = useCourseDetail();

    if (loading) {
        return (
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">
                Cargando curso…
            </div>
        );
    }

    if (!course) {
        return (
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">
                No se encontró el curso.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5">
            {/* Volver */}
            <button
                onClick={goBack}
                className="flex items-center gap-1.5 text-edu-ink-500 text-sm font-medium bg-transparent border-none cursor-pointer w-fit hover:text-edu-primary transition-colors"
            >
                <ChevronLeft className="w-4 h-4" />
                Volver a cursos
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

                <div className="lg:col-span-2 space-y-2">
                    <CourseBanner
                        course={course}
                        isEnrolled={isEnrolled}
                        pendingCount={pendingCount}
                        gradedEvalsCount={gradedEvals.length}
                    />

                    {isEnrolled ? (
                        <CourseSummary
                            evaluations={evaluations}
                            gradedEvals={gradedEvals}
                            avg={avg}
                            evaluatedWeight={evaluatedWeight}
                            pendingCount={pendingCount}
                        />
                    ) : (
                        <EnrollCta />
                    )}
                </div>

                <EvaluationPlanSection
                    isEnrolled={isEnrolled}
                    evaluations={evaluations}
                    filteredEvaluations={filteredEvaluations}
                    firstPending={firstPending}
                    filter={filter}
                    setFilter={setFilter}
                />

            </div>

            <CoursePresentation course={course} />
        </div>
    );
}
