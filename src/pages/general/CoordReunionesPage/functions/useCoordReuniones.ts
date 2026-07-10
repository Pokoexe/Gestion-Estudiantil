import { useState, useEffect } from "react";
import { CalendarClock, CheckCircle2, XCircle, Clock, CalendarCheck } from "lucide-react";
import { accent } from "@themes/tokens";
import { useFetch } from "@shared/services";
import {
    getReuniones,
    type Reunion,
    type ReunionEstado,
    type ReunionConvocados,
} from "@shared/services/actions/coordinador";

type Estado = ReunionEstado;
type Convocados = ReunionConvocados;

export const ESTADO_META: Record<Estado, { cls: string }> = {
    Programada: { cls: "bg-edu-primary-100 text-edu-primary" },
    Realizada: { cls: "bg-edu-success-bg text-edu-success" },
    Cancelada: { cls: "bg-edu-danger-bg text-edu-danger" },
};

export const COLS = "grid-cols-[1.7fr_0.9fr_0.6fr_1fr_0.9fr_1fr]";
export const HEADERS = ["Tema", "Fecha", "Hora", "Convocados", "Estado", "Acciones"];

export function useCoordReuniones() {
    const { data: reunionesFetched } = useFetch(getReuniones, []);
    const [reuniones, setReuniones] = useState<Reunion[]>([]);
    useEffect(() => setReuniones(reunionesFetched), [reunionesFetched]);
    const [showModal, setShowModal] = useState(false);
    const [confirm, setConfirm] = useState<{ id: number; action: "Realizada" | "Cancelada"; tema: string } | null>(null);
    const [form, setForm] = useState({
        tema: "",
        fecha: "",
        hora: "",
        convocados: "Docentes" as Convocados,
        aviso: true,
        observaciones: "",
    });

    const cambiarEstado = (id: number, estado: Estado) =>
        setReuniones((rs) => rs.map((r) => (r.id === id ? { ...r, estado } : r)));

    const totalProgramadas = reuniones.filter((r) => r.estado === "Programada").length;
    const totalRealizadas = reuniones.filter((r) => r.estado === "Realizada").length;

    const openModal = () => {
        setForm({ tema: "", fecha: "", hora: "", convocados: "Docentes", aviso: true, observaciones: "" });
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fechaTexto = form.fecha
            ? new Date(form.fecha + "T00:00").toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })
            : "Por definir";
        const nueva: Reunion = {
            id: Date.now(),
            tema: form.tema.trim() || "Reunión sin título",
            fecha: fechaTexto,
            hora: form.hora || "—",
            convocados: form.convocados,
            estado: "Programada",
            observaciones: form.observaciones.trim() || undefined,
        };
        setReuniones([nueva, ...reuniones]);
        setShowModal(false);
    };

    const kpis = [
        { label: "Programadas", value: totalProgramadas, icon: Clock, ac: accent.purple },
        { label: "Realizadas", value: totalRealizadas, icon: CalendarCheck, ac: accent.green },
        { label: "Próxima reunión", value: "14 Feb, 2027", icon: CalendarClock, ac: accent.amber },
    ];

    return {
        reuniones,
        showModal,
        setShowModal,
        confirm,
        setConfirm,
        form,
        setForm,
        kpis,
        totalProgramadas,
        totalRealizadas,
        openModal,
        handleSubmit,
        cambiarEstado,
        ESTADO_META,
        COLS,
        HEADERS,
    };
}
