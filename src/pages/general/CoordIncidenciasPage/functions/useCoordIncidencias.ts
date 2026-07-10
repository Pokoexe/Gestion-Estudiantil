import { useState, useEffect } from "react";
import {
    getIncidencias,
    getFormatoIncidencias,
    type Incidencia,
    type TipoPersona,
    type Gravedad,
} from "@shared/services/actions/coordinador";
import { useFetch } from "@shared/services";

const PER_PAGE = 5;

export const GRAVEDAD_META: Record<Gravedad, { cls: string }> = {
    Leve: { cls: "bg-edu-primary-100 text-edu-primary" },
    Moderada: { cls: "bg-edu-warning-bg text-edu-warning" },
    Grave: { cls: "bg-edu-danger-bg text-edu-danger" },
};

export const GRAVEDADES: Gravedad[] = ["Leve", "Moderada", "Grave"];

export const COLS = "grid-cols-[1.2fr_0.9fr_0.9fr_0.8fr_1.9fr]";
export const HEADERS = ["Persona", "Tipo", "Gravedad", "Fecha", "Descripción"];

export function useCoordIncidencias() {
    const { data: incidenciasFetched } = useFetch(getIncidencias, []);
    const { data: camposFormato } = useFetch(getFormatoIncidencias, []);

    const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
    useEffect(() => setIncidencias(incidenciasFetched), [incidenciasFetched]);

    const [filtro, setFiltro] = useState<"Todos" | TipoPersona>("Todos");
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        persona: "",
        tipo: "Estudiante" as TipoPersona,
        gravedad: "Leve" as Gravedad,
        descripcion: "",
    });

    const visibles = incidencias
        .filter((i) => filtro === "Todos" || i.tipo === filtro)
        .filter((i) => !query.trim() || `${i.persona} ${i.tipo} ${i.descripcion}`.toLowerCase().includes(query.trim().toLowerCase()));

    const totalPages = Math.max(1, Math.ceil(visibles.length / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paged = visibles.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    const openModal = () => {
        setForm({ persona: "", tipo: "Estudiante", gravedad: "Leve", descripcion: "" });
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const nueva: Incidencia = {
            id: Date.now(),
            persona: form.persona.trim() || "Sin nombre",
            tipo: form.tipo,
            gravedad: form.gravedad,
            fecha: new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }),
            descripcion: form.descripcion.trim() || "Sin descripción.",
        };
        setIncidencias([nueva, ...incidencias]);
        setShowModal(false);
    };

    return {
        camposFormato,
        incidencias,
        filtro,
        setFiltro,
        query,
        setQuery,
        page,
        setPage,
        showModal,
        setShowModal,
        form,
        setForm,
        visibles,
        totalPages,
        currentPage,
        paged,
        openModal,
        handleSubmit,
        GRAVEDAD_META,
        GRAVEDADES,
        COLS,
        HEADERS,
    };
}
