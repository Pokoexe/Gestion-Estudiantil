import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useFetch } from "@shared/services";
import { getPlanes, type Plan, type PlanEstado } from "@shared/services/actions/plans";
import { useLapso } from "@shared/context/LapsoContext";
import { CURRENT_LAPSO_ID } from "@shared/services/data/lapsos";
import { color } from "@themes/tokens";

const PER_PAGE = 5;

export const STATUS_META: Record<PlanEstado, { label: string; bg: string; fg: string }> = {
    approved: { label: "Aprobado", bg: color.successBg, fg: color.success },
    review: { label: "En revisión", bg: color.primary100, fg: color.primary },
    draft: { label: "Borrador", bg: color.subtle, fg: color.ink500 },
    changes: { label: "Cambios solicitados", bg: color.dangerBg, fg: color.danger },
};

export function useDocentePlanes() {
    const navigate = useNavigate();
    const location = useLocation();
    const [feedback, setFeedback] = useState<string | null>(
        (location.state as { feedback?: string } | null)?.feedback ?? null,
    );

    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"todos" | PlanEstado>("todos");
    const [page, setPage] = useState(1);

    const { data: plans } = useFetch(getPlanes, []);
    const { selectedId } = useLapso();
    const lapsoPlans = plans.filter((p) => (p.lapso ?? CURRENT_LAPSO_ID) === selectedId);

    const subidos = lapsoPlans.filter((p) => p.status !== "draft").length;
    const porRevisar = lapsoPlans.filter((p) => p.status === "review").length;
    const aprobados = lapsoPlans.filter((p) => p.status === "approved").length;

    const filteredPlans = lapsoPlans
        .filter((p) => statusFilter === "todos" || p.status === statusFilter)
        .filter((p) => !query.trim() || `${p.subject} ${p.section}`.toLowerCase().includes(query.trim().toLowerCase()));
    const totalPages = Math.max(1, Math.ceil(filteredPlans.length / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paged = filteredPlans.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    return {
        feedback,
        setFeedback,
        selectedPlan,
        setSelectedPlan,
        query,
        setQuery,
        statusFilter,
        setStatusFilter,
        subidos,
        porRevisar,
        aprobados,
        filteredPlans,
        paged,
        currentPage,
        totalPages,
        setPage,
        navigate,
        STATUS_META,
    };
}
