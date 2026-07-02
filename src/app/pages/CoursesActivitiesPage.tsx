import { useState } from "react";
import { useNavigate } from "react-router";
import { User, CalendarDays, CheckCircle2, Clock, ListChecks } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Pagination } from "../components/Pagination";
import { EXTRA_COURSES, type ExtraCourse, type EnrollmentStatus } from "../data/courses";
import { color } from "../theme/tokens";

type ActivityStatus = "completed" | "upcoming";

interface Activity {
    id: number;
    name: string;
    date: string;
    teacher: string;
    status: ActivityStatus;
}

const ACTIVITIES: Activity[] = [
    { id: 1, name: "Feria de ciencias", date: "12 may 2026", teacher: "Prof. Alejandro Morales", status: "completed" },
    { id: 2, name: "Jornada de reforestación", date: "24 may 2026", teacher: "Prof. Roberto Díaz", status: "completed" },
    { id: 3, name: "Olimpiada de matemática", date: "3 jun 2026", teacher: "Prof. Ana Ramírez", status: "completed" },
    { id: 4, name: "Visita al museo de historia", date: "18 jun 2026", teacher: "Prof. Flores", status: "completed" },
    { id: 5, name: "Torneo interescolar de ajedrez", date: "9 jul 2026", teacher: "Prof. Marco Salcedo", status: "upcoming" },
    { id: 6, name: "Festival cultural de fin de lapso", date: "26 jul 2026", teacher: "Prof. Camila Ortiz", status: "upcoming" },
    { id: 7, name: "Campaña de donación de libros", date: "2 ago 2026", teacher: "Prof. Lucía Fernández", status: "upcoming" },
];

const ACTIVITY_META: Record<ActivityStatus, { label: string; cls: string; dot: string }> = {
    completed: { label: "Realizada", cls: "bg-edu-success-bg text-edu-success", dot: color.success },
    upcoming: { label: "Por realizar", cls: "bg-edu-primary-50 text-edu-primary", dot: color.primary },
};

const ENROLLMENT_META: Record<EnrollmentStatus, { label: string; cls: string }> = {
    active: { label: "Activo", cls: "bg-edu-primary-50 text-edu-primary" },
    participated: { label: "Participado", cls: "bg-edu-success-bg text-edu-success" },
};

const TABS = [
    { key: "cursos", label: "Cursos" },
    { key: "nuevos", label: "Nuevos cursos" },
    { key: "actividades", label: "Actividades" },
] as const;

const COURSES_PER_PAGE = 4;

const ACTIVITY_COLS = "grid-cols-[1.8fr_1fr_1.4fr_1fr]";
const ACTIVITY_HEADERS = ["Actividad", "Fecha", "Profesor asignado", "Estado"];

function CourseCard({ course, onClick }: { course: ExtraCourse; onClick: () => void }) {
    const meta = course.enrollment ? ENROLLMENT_META[course.enrollment] : null;
    const gradedCount = course.evaluations.filter((e) => e.status === "graded").length;

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
            </div>
        </button>
    );
}

function CoursesGrid({
    courses,
    page,
    onPageChange,
    onOpen,
    emptyText,
}: {
    courses: ExtraCourse[];
    page: number;
    onPageChange: (p: number) => void;
    onOpen: (id: number) => void;
    emptyText: string;
}) {
    if (courses.length === 0) {
        return (
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-12 text-center text-edu-ink-400 text-sm">
                {emptyText}
            </div>
        );
    }

    const totalPages = Math.ceil(courses.length / COURSES_PER_PAGE);
    const paged = courses.slice((page - 1) * COURSES_PER_PAGE, page * COURSES_PER_PAGE);

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
                {paged.map((c) => (
                    <CourseCard key={c.id} course={c} onClick={() => onOpen(c.id)} />
                ))}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} className="mt-1" />
        </div>
    );
}

export function CoursesActivitiesPage() {
    const navigate = useNavigate();

    const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("cursos");
    const [myPage, setMyPage] = useState(1);
    const [newPage, setNewPage] = useState(1);

    const myCourses = EXTRA_COURSES.filter((c) => c.enrollment);
    const newCourses = EXTRA_COURSES.filter((c) => !c.enrollment);

    const doneCount = ACTIVITIES.filter((a) => a.status === "completed").length;
    const upcomingCount = ACTIVITIES.filter((a) => a.status === "upcoming").length;

    const openCourse = (id: number) => navigate(`/estudiante/cursos/${id}`);

    return (
        <>
            {/* Pestañas */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 pt-3">
                <div className="flex gap-1">
                    {TABS.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`px-3.5 py-2.5 text-[0.8125rem] font-medium border-b-2 -mb-px transition-colors cursor-pointer bg-transparent ${
                                tab === t.key
                                    ? "border-edu-primary text-edu-primary"
                                    : "border-transparent text-edu-ink-500 hover:text-edu-ink-700"
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Cursos (los que participo) */}
            {tab === "cursos" && (
                <CoursesGrid
                    courses={myCourses}
                    page={myPage}
                    onPageChange={setMyPage}
                    onOpen={openCourse}
                    emptyText="Aún no participas en ningún curso. Explora los nuevos cursos disponibles."
                />
            )}

            {/* Nuevos cursos (catálogo) */}
            {tab === "nuevos" && (
                <CoursesGrid
                    courses={newCourses}
                    page={newPage}
                    onPageChange={setNewPage}
                    onOpen={openCourse}
                    emptyText="No hay nuevos cursos disponibles por ahora."
                />
            )}

            {/* Actividades */}
            {tab === "actividades" && (
                <div className="flex flex-col gap-5">
                    {/* Bloques resumen */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                                        Actividades realizadas
                                    </p>
                                    <p className="text-edu-ink text-[1.4rem] font-bold mt-1">
                                        {doneCount}
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-edu-control bg-edu-success-bg flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-5 h-5 text-edu-success" />
                                </div>
                            </div>
                            <p className="text-edu-ink-400 text-xs m-0">
                                Actividades en las que ya participaste
                            </p>
                        </div>

                        <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                                        Actividades por realizar
                                    </p>
                                    <p className="text-edu-ink text-[1.4rem] font-bold mt-1">
                                        {upcomingCount}
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-edu-control bg-edu-primary-100 flex items-center justify-center shrink-0">
                                    <Clock className="w-5 h-5 text-edu-primary" />
                                </div>
                            </div>
                            <p className="text-edu-ink-400 text-xs m-0">
                                Actividades programadas próximamente
                            </p>
                        </div>
                    </div>

                    {/* Tabla de actividades */}
                    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                        <div className="px-5 py-4 border-b border-edu-border-soft">
                            <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">
                                Historial de actividades
                            </h3>
                        </div>
                        <div>
                            <div className={`grid ${ACTIVITY_COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                                {ACTIVITY_HEADERS.map((h) => (
                                    <span
                                        key={h}
                                        className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]"
                                    >
                                        {h}
                                    </span>
                                ))}
                            </div>
                            {ACTIVITIES.map((a, i) => {
                                const meta = ACTIVITY_META[a.status];
                                return (
                                    <div
                                        key={a.id}
                                        className={`grid ${ACTIVITY_COLS} px-5 py-[13px] items-center ${i < ACTIVITIES.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="w-2 h-2 rounded-full shrink-0"
                                                style={{ backgroundColor: meta.dot }}
                                            />
                                            <span className="text-[0.875rem] text-edu-ink font-medium">
                                                {a.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <CalendarDays className="w-3 h-3 text-edu-ink-400 shrink-0" />
                                            <span className="text-[0.8125rem] text-edu-ink-500">{a.date}</span>
                                        </div>
                                        <span className="text-[0.875rem] text-edu-ink-700">{a.teacher}</span>
                                        <span
                                            className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${meta.cls}`}
                                        >
                                            {meta.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
