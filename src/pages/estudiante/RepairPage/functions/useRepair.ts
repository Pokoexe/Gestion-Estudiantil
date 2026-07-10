import { useState } from "react";
import { useNavigate } from "react-router";
import { useFetch } from "@shared/services";
import { getReparacionMaterias, type RepairSubjectRow } from "@shared/services/actions/estudiante";
import type { StatusFilter } from "../interfaces";
import { TABS } from "../ui/RepairTable";

const PER_PAGE = 5;

/**
 * Estado y lógica de la página de reparación: fetch, pestañas, búsqueda,
 * filtro por estado, paginación, conteos derivados y navegación por materia.
 */
export function useRepair() {
    const navigate = useNavigate();

    const [tab, setTab] = useState<"todas" | "pendientes" | "reprobadas" | "reparacion">("todas");
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("todas");
    const [page, setPage] = useState(1);
    const { data: repairSubjects } = useFetch(getReparacionMaterias, []);

    const changeTab = (key: "todas" | "pendientes" | "reprobadas" | "reparacion") => {
        setTab(key);
        setStatusFilter("todas");
        setPage(1);
    };

    const reprobadoCount = repairSubjects.filter((s) => s.status === "reprobado").length;
    const repairingCount = repairSubjects.filter((s) => s.status === "reparando").length;
    const pendienteCount = repairSubjects.filter((s) => s.status === "pendiente").length;

    const tabStatuses = TABS.find((t) => t.key === tab)!.statuses;

    const rows = repairSubjects.filter((s) => {
        if (!tabStatuses.includes(s.status)) return false;
        if (statusFilter !== "todas" && s.status !== statusFilter) return false;
        if (query.trim() && !s.name.toLowerCase().includes(query.trim().toLowerCase())) return false;
        return true;
    });

    const totalPages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paged = rows.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    const goToSubject = (s: RepairSubjectRow) =>
        navigate(
            s.status === "reparando"
                ? `/estudiante/reparacion/${s.id}`
                : s.status === "pendiente"
                    ? `/estudiante/materias/${s.id}?pendiente=true`
                    : `/estudiante/materias/${s.id}`
        );

    return {
        tab, changeTab,
        query, setQuery,
        statusFilter, setStatusFilter,
        setPage,
        reprobadoCount, repairingCount, pendienteCount,
        rows, paged, totalPages, currentPage,
        goToSubject,
    };
}
