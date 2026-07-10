import { useState } from "react";
import { useFetch } from "@shared/services";
import { getMateriasPendientes } from "@shared/services/actions/estudiante";
import type { StatusFilter } from "../interfaces";

const PER_PAGE = 5;

/**
 * Estado y lógica de la página de materias pendientes: fetch, búsqueda,
 * filtro por estado, paginación y KPIs derivados.
 */
export function useMateriasPendientes() {
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("todas");
    const [page, setPage] = useState(1);
    const { data: pendingSubjects } = useFetch(getMateriasPendientes, []);

    const totalPendientes = pendingSubjects.length;
    const proximaReparacion = pendingSubjects
        .filter((s) => s.status === "reparacion" && s.repairDate)
        .sort((a, b) => a.repairDate!.localeCompare(b.repairDate!))[0]?.repairDate ?? "—";

    const rows = pendingSubjects.filter((s) => {
        if (statusFilter !== "todas" && s.status !== statusFilter) return false;
        if (
            query.trim() &&
            !s.name.toLowerCase().includes(query.trim().toLowerCase()) &&
            !s.year.toLowerCase().includes(query.trim().toLowerCase())
        ) return false;
        return true;
    });

    const totalPages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paged = rows.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    return {
        query, setQuery,
        statusFilter, setStatusFilter,
        setPage,
        totalPendientes, proximaReparacion,
        rows, paged, totalPages, currentPage,
    };
}
