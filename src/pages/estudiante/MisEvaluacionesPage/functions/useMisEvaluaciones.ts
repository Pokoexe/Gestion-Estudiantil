import { useState } from "react";
import { useLapso } from "@shared/context/LapsoContext";
import { useFetch } from "@shared/services";
import { getEvaluaciones, type Evaluation } from "@shared/services/actions/estudiante";
import type { SortOrder } from "../interfaces";

const PER_PAGE = 5;

const RISK_MARK = 12;

/**
 * Estado y lógica de la página de mis evaluaciones: fetch por lapso, búsqueda,
 * filtro por materia, ordenamiento, paginación, KPIs derivados y selección del modal.
 */
export function useMisEvaluaciones() {
    const [selected, setSelected] = useState<Evaluation | null>(null);
    const [query, setQuery] = useState("");
    const [subjectFilter, setSubjectFilter] = useState("todas");
    const [order, setOrder] = useState<SortOrder>("fecha");
    const [page, setPage] = useState(1);

    const { selectedId } = useLapso();
    const { data: evaluations } = useFetch(getEvaluaciones, []);
    const lapsoEvals = evaluations.filter((e) => e.lapso === selectedId);

    const thisWeek = lapsoEvals.filter((e) => e.daysUntil <= 7).length;
    const nearest = [...lapsoEvals].sort((a, b) => a.daysUntil - b.daysUntil)[0];
    const atRiskEvals = lapsoEvals.filter((e) => e.currentAverage < RISK_MARK);
    const mostImportant = (atRiskEvals.length ? atRiskEvals : lapsoEvals)
        .slice()
        .sort((a, b) => a.currentAverage - b.currentAverage || a.daysUntil - b.daysUntil)[0];

    const subjects = Array.from(new Set(lapsoEvals.map((e) => e.subject)));

    const filtered = lapsoEvals.filter((e) => {
        if (subjectFilter !== "todas" && e.subject !== subjectFilter) return false;
        if (query.trim() && !`${e.title} ${e.subject}`.toLowerCase().includes(query.trim().toLowerCase())) return false;
        return true;
    }).sort((a, b) =>
        order === "riesgo"
            ? a.currentAverage - b.currentAverage || a.daysUntil - b.daysUntil
            : a.daysUntil - b.daysUntil,
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    return {
        selected, setSelected,
        query, setQuery,
        subjectFilter, setSubjectFilter,
        order, setOrder,
        setPage,
        lapsoEvals, thisWeek, nearest, mostImportant, subjects,
        filtered, paged, totalPages, currentPage,
    };
}
