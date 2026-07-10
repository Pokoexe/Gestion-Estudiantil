import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { color } from "@themes/tokens";
import { useFetch } from "@shared/services";
import { getPlanificaciones, type PlanifEstado } from "@shared/services/actions/planificaciones";

const PER_PAGE = 5;

export const STATUS_META: Record<PlanifEstado, { label: string; bg: string; fg: string }> = {
    approved: { label: "Aprobada", bg: color.successBg, fg: color.success },
    review: { label: "En revisión", bg: color.primary100, fg: color.primary },
    draft: { label: "Borrador", bg: color.subtle, fg: color.ink500 },
    changes: { label: "Cambios solicitados", bg: color.dangerBg, fg: color.danger },
};

export function useDocentePlanificacion() {
    const navigate = useNavigate();
    const location = useLocation();
    const [feedback, setFeedback] = useState<string | null>(
        (location.state as { feedback?: string } | null)?.feedback ?? null,
    );

    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"todos" | PlanifEstado>("todos");
    const [page, setPage] = useState(1);

    const { data: planificaciones } = useFetch(getPlanificaciones, []);

    const subidos = planificaciones.filter((p) => p.status !== "draft").length;
    const porRevisar = planificaciones.filter((p) => p.status === "review").length;
    const aprobados = planificaciones.filter((p) => p.status === "approved").length;

    const filteredPlanif = planificaciones
        .filter((p) => statusFilter === "todos" || p.status === statusFilter)
        .filter((p) => !query.trim() || `${p.subject} ${p.section}`.toLowerCase().includes(query.trim().toLowerCase()));
    const totalPages = Math.max(1, Math.ceil(filteredPlanif.length / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paged = filteredPlanif.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    return {
        feedback,
        setFeedback,
        query,
        setQuery,
        statusFilter,
        setStatusFilter,
        subidos,
        porRevisar,
        aprobados,
        filteredPlanif,
        paged,
        currentPage,
        totalPages,
        setPage,
        navigate,
        STATUS_META,
    };
}
