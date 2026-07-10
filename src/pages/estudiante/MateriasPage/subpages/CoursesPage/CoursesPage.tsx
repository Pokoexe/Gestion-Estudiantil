import { useCourses } from "./functions/useCourses";
import { CourseBanner } from "./ui/CourseBanner";
import { GradesSummary } from "./ui/GradesSummary";
import { TeacherCard } from "./ui/TeacherCard";
import { EvaluationPlan } from "./ui/EvaluationPlan";

export function CoursesPage() {
  const {
    isPendiente,
    filter, setFilter,
    course, teacher, assignments,
    pendingCount, gradedCount, filteredAssignments,
    loading,
  } = useCourses();

  if (loading) {
    return (
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">
        Cargando…
      </div>
    );
  }

  return (
    <>
      {/* Banner de la materia */}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        <div className="lg:col-span-2 space-y-2">
          <CourseBanner
            course={course!}
            isPendiente={isPendiente}
            pendingCount={pendingCount}
            gradedCount={gradedCount}
          />

          {/* Resumen de notas */}
          <GradesSummary gradedCount={gradedCount} totalAssignments={assignments.length} />

          {/* Datos del docente */}
          <TeacherCard teacher={teacher!} />
        </div>

        {/* Plan de evaluación */}
        <EvaluationPlan
          filter={filter}
          setFilter={setFilter}
          assignments={assignments}
          filteredAssignments={filteredAssignments}
        />

      </div>
    </>

  );
}
