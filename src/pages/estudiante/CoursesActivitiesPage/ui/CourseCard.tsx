import { User, CalendarDays, ListChecks, Users } from "lucide-react";
import { ImageWithFallback } from "@shared/ui-figma/ImageWithFallback";
import type { EnrollmentStatus, ExtraCourse } from "@shared/services/actions/courses";

const ENROLLMENT_META: Record<EnrollmentStatus, { label: string; cls: string }> = {
    active: { label: "Activo", cls: "bg-edu-primary-50 text-edu-primary" },
    participated: { label: "Participado", cls: "bg-edu-success-bg text-edu-success" },
};

export function CourseCard({ course, onClick, showSpots = false }: { course: ExtraCourse; onClick: () => void; showSpots?: boolean }) {
    const meta = course.enrollment ? ENROLLMENT_META[course.enrollment] : null;
    const gradedCount = course.evaluations.filter((e) => e.status === "graded").length;
    const available = course.totalSpots - course.enrolledCount;
    const spotsColor = available === 0 ? "text-edu-danger" : available <= 5 ? "text-edu-warning" : "text-edu-ink-400";

    return (
        <button
            onClick={onClick}
            className="text-left bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden cursor-pointer transition-all hover:border-edu-primary-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
        >
            <div className="relative">
                <ImageWithFallback
                    src={course.image}
                    alt={course.title}
                    className="w-full h-40 object-cover bg-edu-subtle"
                />
                {meta && (
                    <span
                        className={`absolute top-2.5 left-2.5 inline-flex items-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold shadow-sm ${meta.cls}`}
                    >
                        {meta.label}
                    </span>
                )}
            </div>
            <div className="p-4 flex flex-col gap-2">
                <h3 className="m-0 text-edu-ink font-bold text-[0.95rem] leading-snug">
                    {course.title}
                </h3>
                <div className="flex items-center gap-4 flex-wrap">
                    <span className="flex items-center gap-1.5 text-[0.775rem] text-edu-ink-500">
                        <User className="w-3.5 h-3.5 text-edu-ink-400 shrink-0" />
                        {course.teacher}
                    </span>
                    <span className="flex items-center gap-1.5 text-[0.775rem] text-edu-ink-500">
                        <CalendarDays className="w-3.5 h-3.5 text-edu-ink-400 shrink-0" />
                        {course.date}
                    </span>
                </div>
                <p className="m-0 text-[0.8125rem] text-edu-ink-500 leading-[1.55] line-clamp-2">
                    {course.description}
                </p>
                {course.enrollment && (
                    <div className="flex items-center gap-1.5 text-[0.75rem] text-edu-ink-400 pt-2 mt-1 border-t border-edu-border-soft">
                        <ListChecks className="w-3.5 h-3.5 shrink-0" />
                        {gradedCount}/{course.evaluations.length} evaluaciones completadas
                    </div>
                )}
                {showSpots && !course.enrollment && (
                    <div className={`flex items-center gap-1.5 text-[0.75rem] font-medium pt-2 mt-1 border-t border-edu-border-soft ${spotsColor}`}>
                        <Users className="w-3.5 h-3.5 shrink-0" />
                        {available === 0 ? "Sin cupos disponibles" : `${available} cupo${available === 1 ? "" : "s"} disponible${available === 1 ? "" : "s"}`}
                    </div>
                )}
            </div>
        </button>
    );
}
