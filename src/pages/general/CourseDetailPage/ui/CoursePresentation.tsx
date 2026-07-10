import { User } from "lucide-react";
import { type ExtraCourse } from "@shared/services/actions/courses";

function initialsOf(name: string) {
    return name
        .replace(/^Prof\.?\s*/i, "")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();
}

interface CoursePresentationProps {
    course: ExtraCourse;
}

export function CoursePresentation({ course }: CoursePresentationProps) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col md:flex-row">
            <img
                src={course.image}
                alt={course.title}
                className="w-full md:w-[280px] h-[180px] md:h-auto object-cover bg-edu-subtle shrink-0"
            />
            <div className="p-[22px] flex flex-col gap-3 flex-1 min-w-0">
                <div>
                    <p className="text-[0.78rem] font-semibold text-edu-ink-500 uppercase tracking-[0.05em] m-0 mb-1.5">
                        Sobre el curso
                    </p>
                    <p className="text-sm text-edu-ink-700 leading-[1.65] m-0">
                        {course.description}
                    </p>
                </div>
                <div className="flex items-center gap-3 mt-auto pt-2 border-t border-edu-border-soft">
                    <div className="w-10 h-10 rounded-full bg-edu-primary-50 border-2 border-edu-primary-100 flex items-center justify-center text-[0.8rem] font-bold text-edu-primary shrink-0">
                        {initialsOf(course.teacher)}
                    </div>
                    <div>
                        <div className="text-[0.875rem] font-semibold text-edu-ink">{course.teacher}</div>
                        <div className="text-[0.75rem] text-edu-ink-400 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            Profesor asignado
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
