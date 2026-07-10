import { useState } from "react";
import { useNavigate } from "react-router";
import { useFetch } from "@shared/services";
import { getPostulaciones } from "@shared/services/actions/discusiones";

/* ------------------------------------------------------------------ */
/* Constantes                                                          */
/* ------------------------------------------------------------------ */

export const PER_PAGE = 5;
export const COLS = "grid-cols-[1.6fr_1.2fr_1fr_0.7fr]";
export const HEADERS = ["Estudiante", "Materia", "Año", "Nota"];

/* ------------------------------------------------------------------ */
/* Hook                                                                */
/* ------------------------------------------------------------------ */

export function useDocenteConcejo() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);

    const { data: POSTULACIONES, loading } = useFetch(getPostulaciones, []);

    // Solo hay una discusión de notas en curso a la vez.
    const activa = POSTULACIONES.find((p) => p.estado === "Pendiente");
    // Historial: estudiantes ya discutidos. No se revela si fueron aceptados o rechazados.
    const historial = POSTULACIONES.filter((p) => p.estado !== "Pendiente");

    const q = query.trim().toLowerCase();
    const filtrado = historial.filter(
        (p) => !q || `${p.estudiante} ${p.materia} ${p.anio}`.toLowerCase().includes(q),
    );

    const totalPages = Math.max(1, Math.ceil(filtrado.length / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paged = filtrado.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    return {
        navigate,
        POSTULACIONES,
        loading,
        query,
        setQuery,
        page,
        setPage,
        activa,
        historial,
        filtrado,
        totalPages,
        currentPage,
        paged,
    };
}
