import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { accent } from "@themes/tokens";
import { useFetch } from "@shared/services";
import {
    getPlanificacionesCoord,
    type Planificacion,
    type EstadoPlan,
} from "@shared/services/actions/coordinador";

/* ------------------------------------------------------------------ */
/* Presentación                                                        */
/* ------------------------------------------------------------------ */

export const ESTADO_META: Record<EstadoPlan, { cls: string }> = {
    Pendiente: { cls: "bg-edu-warning-bg text-edu-warning" },
    Aprobada: { cls: "bg-edu-success-bg text-edu-success" },
    Rechazada: { cls: "bg-edu-danger-bg text-edu-danger" },
};

export const COLS = "grid-cols-[1.4fr_1.2fr_0.9fr_0.9fr_0.9fr_1.1fr]";
export const HEADERS = ["Docente", "Materia", "Sección", "Entrega", "Estado", "Acciones"];

/* ------------------------------------------------------------------ */
/* Hook                                                                */
/* ------------------------------------------------------------------ */

export function useCoordPlanificaciones() {
    const { data: planesFetched } = useFetch(getPlanificacionesCoord, []);
    const [planes, setPlanes] = useState<Planificacion[]>([]);
    useEffect(() => setPlanes(planesFetched), [planesFetched]);
    const [modal, setModal] = useState<{ id: number; docente: string } | null>(null);
    const [observacion, setObservacion] = useState("");

    const aprobar = (id: number) =>
        setPlanes((ps) => ps.map((p) => (p.id === id ? { ...p, estado: "Aprobada", observacion: undefined } : p)));

    const abrirRechazo = (id: number, docente: string) => {
        setObservacion("");
        setModal({ id, docente });
    };

    const confirmarRechazo = (e: React.FormEvent) => {
        e.preventDefault();
        if (!modal) return;
        setPlanes((ps) => ps.map((p) => (p.id === modal.id ? { ...p, estado: "Rechazada", observacion: observacion.trim() || undefined } : p)));
        setModal(null);
    };

    const kpis = [
        { label: "Pendientes", value: planes.filter((p) => p.estado === "Pendiente").length, icon: Clock, ac: accent.amber },
        { label: "Aprobadas", value: planes.filter((p) => p.estado === "Aprobada").length, icon: CheckCircle2, ac: accent.green },
        { label: "Rechazadas", value: planes.filter((p) => p.estado === "Rechazada").length, icon: XCircle, ac: accent.red },
    ];

    return {
        planes,
        modal,
        setModal,
        observacion,
        setObservacion,
        kpis,
        aprobar,
        abrirRechazo,
        confirmarRechazo,
        ESTADO_META,
        COLS,
        HEADERS,
    };
}
