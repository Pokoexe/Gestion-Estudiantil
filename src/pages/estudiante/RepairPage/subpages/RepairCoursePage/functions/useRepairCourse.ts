import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useFetch } from "@shared/services";
import { getReparacionMateria } from "@shared/services/actions/estudiante";
import { SECTION_AUTOPLAY_MS, useCarousel } from "@/pages/Auth/LandingPage/ui/LandingView";
import { THEMES } from "@/pages/Auth/LandingPage/functions/themes";
import { loadDraft, loadPublished } from "@/pages/Auth/LandingPage/functions/storage";
import { DEFAULT_TEMPLATE, makeDefaultConfig } from "@/pages/Auth/LandingPage/interfaces/types";

/**
 * Estado y lógica de la subpágina de materia en reparación: fetch de la materia,
 * etapa activa, filtro de evaluaciones, carrusel responsive y tema del landing.
 */
export function useRepairCourse() {
    const { id } = useParams();
    const fetchSubject = useCallback(() => getReparacionMateria(id ?? ""), [id]);
    const { data: subject, loading } = useFetch(fetchSubject, undefined, [id]);
    const [activeIdx, setActiveIdx] = useState(0);
    const [filter, setFilter] = useState<"Todas" | "Pendientes" | "Calificadas">("Todas");


    const { page, setPage, pageCount, setPaused, go } = useCarousel(2, 1, SECTION_AUTOPLAY_MS);

    const config = loadDraft() ?? loadPublished() ?? makeDefaultConfig(DEFAULT_TEMPLATE);
    const theme = THEMES[config.template];
    const glass: React.CSSProperties = {
        background: theme.surface,
        border: `1px solid ${theme.border}`,
        backdropFilter: "blur(6px)",
    };

    // Al cargar la materia, abre la etapa en curso (o la primera).
    useEffect(() => {
        if (!subject) return;
        setActiveIdx(Math.max(0, subject.etapas.findIndex((e) => e.status === "in_progress")));
    }, [subject]);


    const [itemsPerPage, setItemsPerPage] = useState(1); // 1 por defecto (Móvil)

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width >= 1024) {
                setItemsPerPage(3); // lg
            } else if (width >= 768) {
                setItemsPerPage(2); // md
            } else {
                setItemsPerPage(1); // menor a md
            }
        };

        // Ejecutar una vez al montar para obtener el tamaño inicial
        handleResize();

        // Escuchar cuando el usuario redimensione la ventana
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Asegurarnos de que si itemsPerPage cambia y estamos en una página vacía, regresamos al inicio
    useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    const etapa = subject ? (subject.etapas[activeIdx] ?? subject.etapas[0]) : undefined;
    const pendingCount = etapa ? etapa.assignments.filter((a) => a.status === "pending").length : 0;
    const gradedCount = etapa ? etapa.assignments.filter((a) => a.status === "graded").length : 0;
    const firstPending = etapa ? etapa.assignments.find((a) => a.status === "pending") : undefined;
    const filteredAssignments = etapa
        ? etapa.assignments.filter((a) =>
            filter === "Todas" ? true : filter === "Calificadas" ? a.status === "graded" : a.status !== "graded",
        )
        : [];

    return {
        subject, loading,
        activeIdx, setActiveIdx,
        filter, setFilter,
        page, setPage, pageCount, setPaused, go,
        theme, glass,
        itemsPerPage,
        etapa, pendingCount, gradedCount, firstPending, filteredAssignments,
    };
}
