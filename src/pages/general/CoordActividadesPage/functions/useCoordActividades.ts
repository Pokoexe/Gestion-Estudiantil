import { useState, useEffect } from "react";
import { useFetch } from "@shared/services";
import {
    getActividadesAgenda,
    getDocentes,
    type ActividadTabla,
    type EstadoPostulado,
} from "@shared/services/actions/coordinador";

/* ------------------------------------------------------------------ */
/* Presentación                                                        */
/* ------------------------------------------------------------------ */

export const COLS = "grid-cols-[1.7fr_1.5fr_1.5fr_0.5fr_1fr_1fr_1fr]";
export const HEADERS = ["Tema", "Docente", "Lugar", "Cupo", "Fecha", "Estado", "Acciones"];
const REUNIONES_PER_PAGE = 5;

export const ESTADO_META: Record<EstadoPostulado, { cls: string }> = {
    Pendiente: { cls: "bg-edu-warning-bg text-edu-warning" },
    Aprobado: { cls: "bg-edu-success-bg text-edu-success" },
    Rechazado: { cls: "bg-edu-danger-bg text-edu-danger" },
};

/* ------------------------------------------------------------------ */
/* Hook                                                                */
/* ------------------------------------------------------------------ */

export function useCoordActividades() {
    const { data: agendaFetched } = useFetch(getActividadesAgenda, []);
    const { data: DOCENTES } = useFetch(getDocentes, []);

    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ nombre: "", lugar: "", docente: "Sin asignar", cupo: "20" });
    const [reuniones, setReuniones] = useState<ActividadTabla[]>([]);

    // Fila seleccionada — controla el panel derecho de detalle.
    const [selectedId, setSelectedId] = useState<number | null>(null);
    useEffect(() => {
        setReuniones(agendaFetched);
        setSelectedId((cur) => cur ?? agendaFetched[0]?.id ?? null);
    }, [agendaFetched]);

    // Buscador y paginación de la agenda
    const [reunionesQuery, setReunionesQuery] = useState("");
    const [reunionesPage, setReunionesPage] = useState(1);

    // Confirmación de postulados
    const [confirmPost, setConfirmPost] = useState<{ rowId: number; postId: number; estado: EstadoPostulado; nombre: string } | null>(null);

    // Confirmación de acciones en la agenda (check / X)
    const [confirmAgenda, setConfirmAgenda] = useState<{ id: number; nuevoEstado: EstadoPostulado } | null>(null);

    const filteredReuniones = reuniones.filter((r) =>
        !reunionesQuery.trim() ||
        `${r.tema} ${r.docente} ${r.lugar}`.toLowerCase().includes(reunionesQuery.trim().toLowerCase()),
    );
    const totalPages = Math.max(1, Math.ceil(filteredReuniones.length / REUNIONES_PER_PAGE));
    const currentPage = Math.min(reunionesPage, totalPages);
    const paged = filteredReuniones.slice((currentPage - 1) * REUNIONES_PER_PAGE, currentPage * REUNIONES_PER_PAGE);
    const filteredCount = filteredReuniones.length;

    const selected = reuniones.find((r) => r.id === selectedId) ?? null;

    const asignarDocente = (rowId: number, docente: string) =>
        setReuniones((rs) => rs.map((r) => (r.id === rowId ? { ...r, docente } : r)));

    const revisarPostulado = (rowId: number, postId: number, estado: EstadoPostulado) =>
        setReuniones((rs) =>
            rs.map((r) =>
                r.id === rowId ? { ...r, postulados: r.postulados.map((p) => (p.id === postId ? { ...p, estado } : p)) } : r
            )
        );

    const aplicarAgenda = (id: number, nuevoEstado: EstadoPostulado) =>
        setReuniones((rs) => rs.map((r) => (r.id === id ? { ...r, estado: nuevoEstado } : r)));

    const openModal = () => {
        setForm({ nombre: "", lugar: "", docente: "Sin asignar", cupo: "20" });
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const nueva: ActividadTabla = {
            id: Date.now(),
            tema: form.nombre.trim() || "Actividad sin nombre",
            lugar: form.lugar.trim() || "Por definir",
            cupos: `0/${Number(form.cupo) || 20}`,
            fecha: "Por definir",
            docente: form.docente,
            estado: "Pendiente",
            postulados: [],
        };
        setReuniones([nueva, ...reuniones]);
        setSelectedId(nueva.id);
        setReunionesPage(1);
        setShowModal(false);
    };

    return {
        DOCENTES,
        showModal,
        setShowModal,
        form,
        setForm,
        reuniones,
        selectedId,
        setSelectedId,
        reunionesQuery,
        setReunionesQuery,
        reunionesPage,
        setReunionesPage,
        confirmPost,
        setConfirmPost,
        confirmAgenda,
        setConfirmAgenda,
        filteredReuniones,
        filteredCount,
        totalPages,
        currentPage,
        paged,
        selected,
        asignarDocente,
        revisarPostulado,
        aplicarAgenda,
        openModal,
        handleSubmit,
        COLS,
        HEADERS,
        ESTADO_META,
    };
}
