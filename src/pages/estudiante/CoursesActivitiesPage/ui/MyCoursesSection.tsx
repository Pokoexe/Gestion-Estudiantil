import type { ExtraCourse } from "@shared/services/actions/courses";
import { CoursesGrid } from "./CoursesGrid";

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

const SELECT_CLS = "w-full md:w-auto border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary";

interface MyCoursesSectionProps {
    myTopics: string[];
    myTopicFilter: string;
    setMyTopicFilter: (v: string) => void;
    myDateSort: "asc" | "desc";
    setMyDateSort: (v: "asc" | "desc") => void;
    filteredMyCourses: ExtraCourse[];
    myPage: number;
    setMyPage: (v: number) => void;
    openCourse: (id: number) => void;
}

/** Pestaña "Cursos": filtros de tema/fecha y grid de cursos en los que participo. */
export function MyCoursesSection({
    myTopics, myTopicFilter, setMyTopicFilter,
    myDateSort, setMyDateSort,
    filteredMyCourses, myPage, setMyPage, openCourse,
}: MyCoursesSectionProps) {
    return (
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
    );
}
