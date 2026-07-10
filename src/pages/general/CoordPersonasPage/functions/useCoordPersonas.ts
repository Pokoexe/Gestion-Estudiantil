import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { color } from "@themes/tokens";
import { useFetch } from "@shared/services";
import {
    getPersonasEstudiantes,
    getPersonasDocentes,
    getPersonasPorSeccion,
    type Estudiante,
    type Docente,
    type RepRelacion,
} from "@shared/services/actions/coordinador";
import type { Tab } from "../interfaces";

/** Colores del donut de secciones (por posición). */
export const SECCIONES_FILLS = [color.primary, color.purple, color.success, color.warningStrong, color.danger];

const PER_PAGE = 5;

export const getAño = (grado: string) => grado.split(" ").slice(0, 2).join(" ");
export const getSeccion = (grado: string) => grado.split(" ").pop() ?? "";

export const EST_COLS = "grid-cols-[1.3fr_1fr_0.9fr_1.2fr_1fr]";
export const EST_HEADERS = ["Nombre", "Cédula", "Año / Sección", "Representante", "Acciones"];
export const DOC_COLS = "grid-cols-[1.3fr_1.4fr_1.1fr_0.8fr_1.2fr]";
export const DOC_HEADERS = ["Nombre", "Área / Materias", "Secciones", "Estado", "Acciones"];

export function useCoordPersonas() {
    const { pathname } = useLocation();
    const { data: estudiantesFetched } = useFetch(getPersonasEstudiantes, []);
    const { data: docentesFetched } = useFetch(getPersonasDocentes, []);
    const { data: seccionesRaw } = useFetch(getPersonasPorSeccion, []);

    const [tab, setTab] = useState<Tab>(pathname.endsWith("docentes") ? "docentes" : "estudiantes");
    const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
    useEffect(() => setEstudiantes(estudiantesFetched), [estudiantesFetched]);
    const [docentes, setDocentes] = useState<Docente[]>([]);
    useEffect(() => setDocentes(docentesFetched), [docentesFetched]);

    // Serie del donut: reatacha el color por posición.
    const SECCIONES_DATA = seccionesRaw.map((s, i) => ({ ...s, fill: SECCIONES_FILLS[i % SECCIONES_FILLS.length] }));
    const TOTAL_SECCIONES = SECCIONES_DATA.reduce((n, s) => n + s.estudiantes, 0);

    // Búsqueda y filtros
    const [query, setQuery] = useState("");
    const [añoFilter, setAñoFilter] = useState("todos");
    const [seccionFilter, setSeccionFilter] = useState("todos");
    const [page, setPage] = useState(1);

    // Modal estudiante
    const [estModal, setEstModal] = useState<{ mode: "ver" | "añadir" | "modificar"; data: Estudiante } | null>(null);
    // Modal docente
    const [docModal, setDocModal] = useState<{ mode: "ver" | "modificar" | "asignar"; data: Docente } | null>(null);

    const emptyEst: Estudiante = {
        id: 0, nombre: "", cedula: "", grado: "1.º Año A", fechaNac: "",
        representante: "", repCedula: "", repTelefono: "", repRelacion: "Madre", repEmail: "",
    };

    const toggleDocente = (id: number) =>
        setDocentes((ds) => ds.map((d) => (d.id === id ? { ...d, estado: d.estado === "Activo" ? "Suspendido" : "Activo" } : d)));

    const guardarEstudiante = (e: React.FormEvent) => {
        e.preventDefault();
        if (!estModal) return;
        const d = estModal.data;
        if (estModal.mode === "añadir") {
            setEstudiantes([{ ...d, id: Date.now() }, ...estudiantes]);
        } else if (estModal.mode === "modificar") {
            setEstudiantes((es) => es.map((x) => (x.id === d.id ? d : x)));
        }
        setEstModal(null);
    };

    const guardarDocente = (e: React.FormEvent) => {
        e.preventDefault();
        if (!docModal) return;
        const d = docModal.data;
        setDocentes((ds) => ds.map((x) => (x.id === d.id ? d : x)));
        setDocModal(null);
    };

    // Opciones dinámicas de filtro
    const añosDisponibles = Array.from(new Set(estudiantes.map((s) => getAño(s.grado)))).sort();
    const seccionesDisponibles = Array.from(new Set(estudiantes.map((s) => getSeccion(s.grado)))).sort();

    // Filtrado y paginación
    const filteredEst = estudiantes.filter((s) => {
        if (añoFilter !== "todos" && getAño(s.grado) !== añoFilter) return false;
        if (seccionFilter !== "todos" && getSeccion(s.grado) !== seccionFilter) return false;
        if (query.trim() && !`${s.nombre} ${s.cedula} ${s.representante}`.toLowerCase().includes(query.trim().toLowerCase())) return false;
        return true;
    });
    const totalPages = Math.max(1, Math.ceil(filteredEst.length / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paged = filteredEst.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    const readOnlyDoc = docModal?.mode === "ver";

    return {
        tab, setTab,
        estudiantes, docentes,
        query, setQuery,
        añoFilter, setAñoFilter,
        seccionFilter, setSeccionFilter,
        page, setPage,
        estModal, setEstModal,
        docModal, /* inert */
        SECCIONES_DATA, TOTAL_SECCIONES,
        añosDisponibles, seccionesDisponibles,
        filteredEst, totalPages, currentPage, paged,
        guardarEstudiante, guardarDocente, toggleDocente,
        readOnlyDoc,
        SECCIONES_FILLS, getAño, getSeccion,
        EST_COLS, EST_HEADERS, DOC_COLS, DOC_HEADERS,
        emptyEst,
    };
}
