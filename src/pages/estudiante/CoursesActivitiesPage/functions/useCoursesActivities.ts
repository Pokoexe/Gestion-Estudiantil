import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useFetch } from "@shared/services";
import { getCursosExtra } from "@shared/services/actions/courses";
import { getActividades, type Activity } from "@shared/services/actions/estudiante";
import type { ActivityStatusFilter, SpotsFilter, TabKey } from "../interfaces";

export const COURSES_PER_PAGE = 4;
export const ACTIVITIES_PER_PAGE = 5;

export function parseSpanishDate(s: string): number {
    const months: Record<string, number> = {
        ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5,
        jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11,
    };
    const parts = s.split(" ");
    return new Date(Number(parts[2]), months[parts[1]] ?? 0, Number(parts[0])).getTime();
}

/**
 * Estado y lógica de la página de cursos y actividades: fetch, pestañas,
 * filtros/ordenamiento por pestaña, paginación, KPIs y modal de actividad.
 */
export function useCoursesActivities() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const { data: extraCourses } = useFetch(getCursosExtra, []);
    const { data: activities } = useFetch(getActividades, []);

    const initialTab = searchParams.get("tab");
    const [tab, setTab] = useState<TabKey>(
        initialTab === "nuevos" || initialTab === "actividades" ? initialTab : "cursos",
    );

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
    const [newSpotsFilter, setNewSpotsFilter] = useState<SpotsFilter>("todos");

    // Actividades tab
    const [activityQuery, setActivityQuery] = useState("");
    const [activityStatusFilter, setActivityStatusFilter] = useState<ActivityStatusFilter>("todas");
    const [activityPage, setActivityPage] = useState(1);
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

    const myCourses = extraCourses.filter((c) => c.enrollment);
    const newCourses = extraCourses.filter((c) => !c.enrollment);

    const doneCount = activities.filter((a) => a.status === "completed").length;
    const upcomingCount = activities.filter((a) => a.status === "upcoming").length;

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
    const filteredActivities = activities.filter((a) => {
        if (activityStatusFilter !== "todas" && a.status !== activityStatusFilter) return false;
        if (activityQuery.trim() && !`${a.name} ${a.teacher}`.toLowerCase().includes(activityQuery.trim().toLowerCase())) return false;
        return true;
    });
    const activityTotalPages = Math.max(1, Math.ceil(filteredActivities.length / ACTIVITIES_PER_PAGE));
    const activityCurrentPage = Math.min(activityPage, activityTotalPages);
    const pagedActivities = filteredActivities.slice((activityCurrentPage - 1) * ACTIVITIES_PER_PAGE, activityCurrentPage * ACTIVITIES_PER_PAGE);

    const openCourse = (id: number) => navigate(`/estudiante/cursos/${id}`);

    const changeTab = (key: TabKey) => {
        setTab(key);
    };

    return {
        tab, changeTab,
        // Cursos tab
        myPage, setMyPage,
        myTopicFilter, setMyTopicFilter,
        myDateSort, setMyDateSort,
        myTopics, filteredMyCourses,
        // Nuevos cursos tab
        newPage, setNewPage,
        newQuery, setNewQuery,
        newTeacherFilter, setNewTeacherFilter,
        newDateSort, setNewDateSort,
        newPriceSort, setNewPriceSort,
        newSpotsFilter, setNewSpotsFilter,
        newCourseTeachers, filteredNewCourses,
        // Actividades tab
        activityQuery, setActivityQuery,
        activityStatusFilter, setActivityStatusFilter,
        setActivityPage,
        selectedActivity, setSelectedActivity,
        filteredActivities, pagedActivities,
        activityTotalPages, activityCurrentPage,
        // KPIs
        doneCount, upcomingCount,
        // Handlers
        openCourse,
    };
}
