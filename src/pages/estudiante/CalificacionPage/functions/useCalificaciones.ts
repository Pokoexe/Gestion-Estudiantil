import { useState } from "react";
import { useFetch } from "@shared/services";
import { getCalificaciones, type Grade } from "@shared/services/actions/estudiante";
import { useLapso } from "@shared/context/LapsoContext";
import type { StatusFilter } from "../interfaces";

const GRADES_PER_PAGE = 6;
export const PASS_MARK = 10;

const money1 = (n: number) => n.toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/**
 * Estado y lógica de la página de calificaciones: fetch, filtro por lapso,
 * búsqueda, filtros por materia/estado, paginación, KPIs derivados y detalle.
 */
export function useCalificaciones() {
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<Grade | null>(null);
    const [query, setQuery] = useState("");
    const [subjectFilter, setSubjectFilter] = useState("todas");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos");

    const { selectedId } = useLapso();
    const { data: grades } = useFetch(getCalificaciones, []);
    const lapsoGrades = grades.filter((g) => g.lapso === selectedId);

    const done = lapsoGrades.length;
    const average = lapsoGrades.reduce((sum, g) => sum + g.grade, 0) / (done || 1);

    const subjects = Array.from(new Set(lapsoGrades.map((g) => g.subject)));

    const filtered = lapsoGrades.filter((g) => {
        if (subjectFilter !== "todas" && g.subject !== subjectFilter) return false;
        const passed = g.grade >= PASS_MARK;
        if (statusFilter === "aprobada" && !passed) return false;
        if (statusFilter === "reprobada" && passed) return false;
        if (query.trim() && !`${g.title} ${g.subject}`.toLowerCase().includes(query.trim().toLowerCase())) return false;
        return true;
    });

    const totalPages = Math.ceil(filtered.length / GRADES_PER_PAGE);
    const currentPage = Math.min(page, Math.max(1, totalPages));
    const paged = filtered.slice((currentPage - 1) * GRADES_PER_PAGE, currentPage * GRADES_PER_PAGE);

    return {
        selected, setSelected,
        query, setQuery,
        subjectFilter, setSubjectFilter,
        statusFilter, setStatusFilter,
        setPage,
        done, average: money1(average),
        subjects,
        filtered, paged, totalPages, currentPage,
    };
}
