import { useState } from "react";
import { useNavigate } from "react-router";
import { User, CalendarDays, CheckCircle2, Clock, ListChecks, Search, Users } from "lucide-react";
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

const TOPIC_LABELS: Record<string, string> = {
    robotica: "Robótica",
    cocina: "Cocina",
    programacion: "Programación",
    comunicacion: "Comunicación",
    juegos: "Juegos",
    arte: "Arte",
    musica: "Música",
    ecologia: "Ecología",
    deportes: "Deportes",
};

const TABS = [
    { key: "cursos", label: "Cursos" },
    { key: "nuevos", label: "Nuevos cursos" },
    { key: "actividades", label: "Actividades" },
] as const;

const COURSES_PER_PAGE = 4;
const ACTIVITIES_PER_PAGE = 5;

const ACTIVITY_COLS = "grid-cols-[1.8fr_1fr_1.4fr_1fr]";
const ACTIVITY_HEADERS = ["Actividad", "Fecha", "Profesor asignado", "Estado"];

const SELECT_CLS = "border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary";

function parseSpanishDate(s: string): number {
    const months: Record<string, number> = {
        ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5,
        jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11,
    };
    const parts = s.split(" ");
    return new Date(Number(parts[2]), months[parts[1]] ?? 0, Number(parts[0])).getTime();
}

function CourseCard({ course, onClick, showSpots = false }: { course: ExtraCourse; onClick: () => void; showSpots?: boolean }) {
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

function CoursesGrid({
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
            <div className="grid grid-cols-2 gap-4">
                {paged.map((c) => (
                    <CourseCard key={c.id} course={c} onClick={() => onOpen(c.id)} showSpots={showSpots} />
                ))}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} className="mt-1" />
        </div>
    );
}

export function CoursesActivitiesPage() {
    const navigate = useNavigate();

    const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("cursos");

    // Cursos tab
    const [myPage, setMyPage] = useState(1);
    const [myTopicFilter, setMyTopicFilter] = useState("todos");
    const [myDateSort, setMyDateSort] = useState<"asc" | "desc">("asc");

    // Nuevos cursos tab
    const [newPage, setNewPage] = useState(1);
    const [newQuery, setNewQuery] = useState("");
    const [newTeacherFilter, setNewTeacherFilter] = useState("todos");
    const [newDateSort, setNewDateSort] = useState("");
    const [newPriceSort, setNewPriceSort] = useState("");
    const [newSpotsFilter, setNewSpotsFilter] = useState<"todos" | "disponible">("todos");

    // Actividades tab
    const [activityQuery, setActivityQuery] = useState("");
    const [activityStatusFilter, setActivityStatusFilter] = useState<"todas" | ActivityStatus>("todas");
    const [activityPage, setActivityPage] = useState(1);

    const myCourses = EXTRA_COURSES.filter((c) => c.enrollment);
    const newCourses = EXTRA_COURSES.filter((c) => !c.enrollment);

    const doneCount = ACTIVITIES.filter((a) => a.status === "completed").length;
    const upcomingCount = ACTIVITIES.filter((a) => a.status === "upcoming").length;

    // Cursos tab — filter + sort
    const myTopics = Array.from(new Set(myCourses.map((c) => c.topic)));
    const filteredMyCourses = myCourses
        .filter((c) => myTopicFilter === "todos" || c.topic === myTopicFilter)
        .sort((a, b) => {
            const diff = parseSpanishDate(a.date) - parseSpanishDate(b.date);
            return myDateSort === "asc" ? diff : -diff;
        });

    // Nuevos cursos tab — filter + sort
    const newCourseTeachers = Array.from(new Set(newCourses.map((c) => c.teacher)));
    const filteredNewCourses = newCourses
        .filter((c) => {
            if (newTeacherFilter !== "todos" && c.teacher !== newTeacherFilter) return false;
            if (newSpotsFilter === "disponible" && c.totalSpots - c.enrolledCount <= 0) return false;
            if (newQuery.trim() && !`${c.title} ${c.teacher} ${c.description}`.toLowerCase().includes(newQuery.trim().toLowerCase())) return false;
            return true;
        })
        .sort((a, b) => {
            if (newPriceSort === "asc") return a.price - b.price;
            if (newPriceSort === "desc") return b.price - a.price;
            if (newDateSort === "asc") return parseSpanishDate(a.date) - parseSpanishDate(b.date);
            if (newDateSort === "desc") return parseSpanishDate(b.date) - parseSpanishDate(a.date);
            return 0;
        });

    // Actividades tab
    const filteredActivities = ACTIVITIES.filter((a) => {
        if (activityStatusFilter !== "todas" && a.status !== activityStatusFilter) return false;
        if (activityQuery.trim() && !`${a.name} ${a.teacher}`.toLowerCase().includes(activityQuery.trim().toLowerCase())) return false;
        return true;
    });
    const activityTotalPages = Math.max(1, Math.ceil(filteredActivities.length / ACTIVITIES_PER_PAGE));
    const activityCurrentPage = Math.min(activityPage, activityTotalPages);
    const pagedActivities = filteredActivities.slice((activityCurrentPage - 1) * ACTIVITIES_PER_PAGE, activityCurrentPage * ACTIVITIES_PER_PAGE);

    const openCourse = (id: number) => navigate(`/estudiante/cursos/${id}`);

    const changeTab = (key: (typeof TABS)[number]["key"]) => {
        setTab(key);
    };

    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            {/* Pestañas */}
            <div className="px-5 pt-3 border-b border-edu-border-soft">
                <div className="flex gap-1">
                    {TABS.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => changeTab(t.key)}
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

            {/* ── Cursos (los que participo) ── */}
            {tab === "cursos" && (
                <>
                    <div className="px-5 py-3 flex gap-2 items-center flex-wrap border-b border-edu-border-soft">
                        <select
                            value={myTopicFilter}
                            onChange={(e) => { setMyTopicFilter(e.target.value); setMyPage(1); }}
                            className={SELECT_CLS}
                        >
                            <option value="todos">Todos los temas</option>
                            {myTopics.map((t) => (
                                <option key={t} value={t}>{TOPIC_LABELS[t] ?? t}</option>
                            ))}
                        </select>
                        <select
                            value={myDateSort}
                            onChange={(e) => { setMyDateSort(e.target.value as "asc" | "desc"); setMyPage(1); }}
                            className={SELECT_CLS}
                        >
                            <option value="asc">Fecha: más cercana</option>
                            <option value="desc">Fecha: más lejana</option>
                        </select>
                    </div>
                    <CoursesGrid
                        courses={filteredMyCourses}
                        page={myPage}
                        onPageChange={setMyPage}
                        onOpen={openCourse}
                        emptyText="Aún no participas en ningún curso. Explora los nuevos cursos disponibles."
                    />
                </>
            )}

            {/* ── Nuevos cursos (catálogo) ── */}
            {tab === "nuevos" && (
                <>
                    <div className="px-5 py-3 flex gap-2 items-center flex-wrap border-b border-edu-border-soft">
                        <div className="relative flex-1 min-w-[180px]">
                            <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={newQuery}
                                onChange={(e) => { setNewQuery(e.target.value); setNewPage(1); }}
                                placeholder="Buscar curso…"
                                className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                            />
                        </div>
                        <select
                            value={newTeacherFilter}
                            onChange={(e) => { setNewTeacherFilter(e.target.value); setNewPage(1); }}
                            className={SELECT_CLS}
                        >
                            <option value="todos">Todos los profesores</option>
                            {newCourseTeachers.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                        <select
                            value={newDateSort}
                            onChange={(e) => { setNewDateSort(e.target.value); setNewPage(1); }}
                            className={SELECT_CLS}
                        >
                            <option value="">Ordenar por fecha</option>
                            <option value="asc">Fecha: más cercana</option>
                            <option value="desc">Fecha: más lejana</option>
                        </select>
                        <select
                            value={newPriceSort}
                            onChange={(e) => { setNewPriceSort(e.target.value); setNewPage(1); }}
                            className={SELECT_CLS}
                        >
                            <option value="">Ordenar por precio</option>
                            <option value="asc">Precio: menor primero</option>
                            <option value="desc">Precio: mayor primero</option>
                        </select>
                        <select
                            value={newSpotsFilter}
                            onChange={(e) => { setNewSpotsFilter(e.target.value as "todos" | "disponible"); setNewPage(1); }}
                            className={SELECT_CLS}
                        >
                            <option value="todos">Todos los cupos</option>
                            <option value="disponible">Con cupo disponible</option>
                        </select>
                    </div>
                    <CoursesGrid
                        courses={filteredNewCourses}
                        page={newPage}
                        onPageChange={setNewPage}
                        onOpen={openCourse}
                        emptyText="No hay nuevos cursos disponibles por ahora."
                        showSpots
                    />
                </>
            )}

            {/* ── Actividades ── */}
            {tab === "actividades" && (
                <>
                    {/* Bloques resumen */}
                    <div className="p-5 grid grid-cols-2 gap-4">
                        <div className="bg-edu-subtle rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
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

                        <div className="bg-edu-subtle rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
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
                    <div className="border-t border-edu-border-soft">
                        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                            <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">
                                Historial de actividades
                            </h3>
                            <span className="text-[0.8rem] text-edu-ink-400 font-medium">
                                {filteredActivities.length} actividad{filteredActivities.length === 1 ? "" : "es"}
                            </span>
                        </div>

                        {/* Buscador y filtro */}
                        <div className="px-5 py-3 flex gap-2 items-center flex-wrap border-b border-edu-border-soft">
                            <div className="relative flex-1 min-w-[180px]">
                                <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={activityQuery}
                                    onChange={(e) => { setActivityQuery(e.target.value); setActivityPage(1); }}
                                    placeholder="Buscar actividad o profesor…"
                                    className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                                />
                            </div>
                            <select
                                value={activityStatusFilter}
                                onChange={(e) => { setActivityStatusFilter(e.target.value as "todas" | ActivityStatus); setActivityPage(1); }}
                                className={SELECT_CLS}
                            >
                                <option value="todas">Todas</option>
                                <option value="completed">Realizadas</option>
                                <option value="upcoming">Por realizar</option>
                            </select>
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

                            {filteredActivities.length === 0 && (
                                <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">
                                    No hay actividades que coincidan con el filtro.
                                </div>
                            )}

                            {pagedActivities.map((a, i) => {
                                const meta = ACTIVITY_META[a.status];
                                return (
                                    <div
                                        key={a.id}
                                        className={`grid ${ACTIVITY_COLS} px-5 py-[13px] items-center ${i < pagedActivities.length - 1 ? "border-b border-edu-border-soft" : ""}`}
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

                            {activityTotalPages > 1 && (
                                <div className="px-5 py-4 border-t border-edu-border-soft">
                                    <Pagination currentPage={activityCurrentPage} totalPages={activityTotalPages} onPageChange={setActivityPage} />
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
