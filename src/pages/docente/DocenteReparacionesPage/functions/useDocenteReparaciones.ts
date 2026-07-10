import { useState } from "react";
import { useLocation } from "react-router";
import { Wrench, CheckCircle2, AlertTriangle } from "lucide-react";
import { color } from "@themes/tokens";
import { useFetch } from "@shared/services";
import { getReparaciones } from "@shared/services/actions/reparaciones";

const PER_PAGE = 5;

export function useDocenteReparaciones() {
    const location = useLocation();
    const [feedback, setFeedback] = useState<string | null>(
        (location.state as { feedback?: string } | null)?.feedback ?? null,
    );
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);

    const { data: REPARACIONES, loading } = useFetch(getReparaciones, []);

    const creadas = REPARACIONES.filter((r) => r.status === "creada").length;
    const porCrear = REPARACIONES.filter((r) => r.status === "por_crear").length;

    const q = query.trim().toLowerCase();
    const filtered = REPARACIONES.filter(
        (r) => !q || `${r.subject} ${r.section}`.toLowerCase().includes(q),
    );
    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    const BLOCKS = [
        { label: "Total", value: REPARACIONES.length, icon: Wrench, bg: color.primary100, fg: color.primary, hint: "Materias en reparación" },
        { label: "Creadas", value: creadas, icon: CheckCircle2, bg: color.successBg, fg: color.success, hint: "Con plan de recuperación" },
        { label: "Por crear", value: porCrear, icon: AlertTriangle, bg: color.warningBg, fg: color.warningStrong, hint: "Requieren tu atención" },
    ];

    return {
        feedback,
        setFeedback,
        query,
        setQuery,
        page,
        setPage,
        loading,
        BLOCKS,
        filtered,
        paged,
        totalPages,
        currentPage,
    };
}
