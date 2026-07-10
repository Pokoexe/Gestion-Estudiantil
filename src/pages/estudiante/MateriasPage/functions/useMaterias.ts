import { useState } from "react";
import { useNavigate } from "react-router";
import { useFetch } from "@shared/services";
import { getMaterias } from "@shared/services/actions/estudiante";

const PER_PAGE = 6;

/**
 * Estado y lógica de la página de materias: fetch, búsqueda, paginación,
 * KPIs derivados (mejor/peor promedio, materias en riesgo) y navegación.
 */
export function useMaterias() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const { data: subjects, loading } = useFetch(getMaterias, []);

    const best = subjects.length ? subjects.reduce((a, b) => (b.average > a.average ? b : a)) : undefined;
    const worst = subjects.length ? subjects.reduce((a, b) => (b.average < a.average ? b : a)) : undefined;
    const failing = subjects.filter((s) => s.status !== "aprobado");

    const filteredSubjects = subjects.filter((s) =>
        !query.trim() ||
        s.name.toLowerCase().includes(query.trim().toLowerCase()) ||
        s.teacher.toLowerCase().includes(query.trim().toLowerCase()),
    );

    const totalPages = Math.max(1, Math.ceil(filteredSubjects.length / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const pagedSubjects = filteredSubjects.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    const goToSubject = (id: number) => navigate(`/estudiante/materias/${id}`);

    return {
        query, setQuery,
        setPage,
        loading,
        best, worst, failing,
        filteredSubjects, pagedSubjects, totalPages, currentPage,
        goToSubject,
    };
}
