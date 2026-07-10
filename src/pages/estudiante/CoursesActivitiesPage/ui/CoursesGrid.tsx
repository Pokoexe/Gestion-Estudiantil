import { Pagination } from "@shared/ui/Pagination";
import type { ExtraCourse } from "@shared/services/actions/courses";
import { CourseCard } from "./CourseCard";
import { COURSES_PER_PAGE } from "../functions/useCoursesActivities";

export function CoursesGrid({
    courses,
    page,
    onPageChange,
    onOpen,
    emptyText,
    showSpots = false,
}: {
    courses: ExtraCourse[];
    page: number;
    onPageChange: (p: number) => void;
    onOpen: (id: number) => void;
    emptyText: string;
    showSpots?: boolean;
}) {
    if (courses.length === 0) {
        return (
            <div className="px-5 py-12 text-center text-edu-ink-400 text-sm">
                {emptyText}
            </div>
        );
    }

    const totalPages = Math.ceil(courses.length / COURSES_PER_PAGE);
    const paged = courses.slice((page - 1) * COURSES_PER_PAGE, page * COURSES_PER_PAGE);

    return (
        <div className="p-5 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {paged.map((c) => (
                    <CourseCard key={c.id} course={c} onClick={() => onOpen(c.id)} showSpots={showSpots} />
                ))}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} className="mt-1" />
        </div>
    );
}
