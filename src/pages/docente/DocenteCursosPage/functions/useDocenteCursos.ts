import { useState } from "react";
import { useNavigate } from "react-router";
import { BookOpen, Users } from "lucide-react";
import { color, accent } from "@themes/tokens";
import { useFetch } from "@shared/services";
import {
    getDocenteCursos,
    getCursosInscripciones,
    type CursoStatus,
} from "@shared/services/actions/docente-eval";

export const PER_PAGE = 5;

export const AREAS = [
    { dataKey: "rob", name: "Robótica", color: color.primary },
    { dataKey: "web", name: "Prog. web", color: color.success },
    { dataKey: "fot", name: "Fotografía", color: color.warning },
];

export const STATUS_META: Record<CursoStatus, { label: string; bg: string; fg: string }> = {
    aceptado: { label: "Aceptado", bg: color.successBg, fg: color.success },
    solicitado: { label: "Solicitado", bg: color.primary100, fg: color.primary },
};

export function useDocenteCursos() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"todos" | CursoStatus>("todos");
    const [page, setPage] = useState(1);

    const { data: DOCENTE_CURSOS, loading } = useFetch(getDocenteCursos, []);
    const { data: CHART_DATA } = useFetch(getCursosInscripciones, []);

    const cursosActivos = DOCENTE_CURSOS.filter((c) => c.status === "aceptado");
    const estudiantesActivos = cursosActivos.reduce((sum, c) => sum + c.enrolledCount, 0);

    const KPIS = [
        { label: "Estudiantes asignados", value: String(estudiantesActivos), icon: Users, ac: accent.blue, hint: "En cursos activos" },
        { label: "Cursos activos", value: String(cursosActivos.length), icon: BookOpen, ac: accent.purple, hint: "Período 2026-I" },
    ];

    const filtered = DOCENTE_CURSOS
        .filter((c) => statusFilter === "todos" || c.status === statusFilter)
        .filter((c) => !query.trim() || c.title.toLowerCase().includes(query.trim().toLowerCase()) || c.code.toLowerCase().includes(query.trim().toLowerCase()));

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    return {
        navigate,
        query,
        setQuery,
        statusFilter,
        setStatusFilter,
        page,
        setPage,
        DOCENTE_CURSOS,
        loading,
        CHART_DATA,
        cursosActivos,
        estudiantesActivos,
        KPIS,
        filtered,
        totalPages,
        currentPage,
        paged,
    };
}
