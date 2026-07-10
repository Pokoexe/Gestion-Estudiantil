import { Search } from "lucide-react";
import type { ExtraCourse } from "@shared/services/actions/courses";
import { CoursesGrid } from "./CoursesGrid";
import type { SpotsFilter } from "../interfaces";

const SELECT_CLS = "w-full md:w-auto border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary";

interface NewCoursesSectionProps {
    newQuery: string;
    setNewQuery: (v: string) => void;
    newTeacherFilter: string;
    setNewTeacherFilter: (v: string) => void;
    newCourseTeachers: string[];
    newDateSort: string;
    setNewDateSort: (v: string) => void;
    newPriceSort: string;
    setNewPriceSort: (v: string) => void;
    newSpotsFilter: SpotsFilter;
    setNewSpotsFilter: (v: SpotsFilter) => void;
    filteredNewCourses: ExtraCourse[];
    newPage: number;
    setNewPage: (v: number) => void;
    openCourse: (id: number) => void;
}

/** Pestaña "Nuevos cursos": buscador, filtros/ordenamientos y catálogo de cursos. */
export function NewCoursesSection({
    newQuery, setNewQuery,
    newTeacherFilter, setNewTeacherFilter, newCourseTeachers,
    newDateSort, setNewDateSort,
    newPriceSort, setNewPriceSort,
    newSpotsFilter, setNewSpotsFilter,
    filteredNewCourses, newPage, setNewPage, openCourse,
}: NewCoursesSectionProps) {
    return (
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
                    onChange={(e) => { setNewSpotsFilter(e.target.value as SpotsFilter); setNewPage(1); }}
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
    );
}
