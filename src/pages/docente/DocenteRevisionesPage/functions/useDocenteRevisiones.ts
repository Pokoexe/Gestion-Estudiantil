import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
    FileText,
    AlertTriangle,
    CalendarCheck,
    ClipboardList,
} from "lucide-react";
import { color } from "@themes/tokens";
import { useFetch } from "@shared/services";
import { getPlanificaciones, type Planificacion } from "@shared/services/actions/planificaciones";
import { getPlanes, type Plan } from "@shared/services/actions/plans";
import { useLapso } from "@shared/context/LapsoContext";
import type { Revision, RevType, RevEstado } from "../interfaces";

export const PER_PAGE = 5;

export const TYPE_META: Record<
    RevType,
    { badge: string; block: string; hint: string; icon: React.FC<{ style?: React.CSSProperties }>; bg: string; fg: string }
> = {
    examen: { badge: "Examen", block: "Exámenes", hint: "Pruebas por revisar", icon: FileText, bg: color.warningBg, fg: color.warning },
    tema: { badge: "Tema", block: "Temas reprobadas", hint: "Materias reprobadas", icon: AlertTriangle, bg: color.dangerBg, fg: color.danger },
    planificacion: { badge: "Planificación", block: "Planificaciones", hint: "En revisión", icon: CalendarCheck, bg: color.purpleBg, fg: color.purple },
    plan: { badge: "Plan", block: "Planes de evaluación", hint: "En revisión", icon: ClipboardList, bg: color.primary100, fg: color.primary },
};

/* Exámenes y temas de materias reprobadas (mock). Planificaciones y planes se
   derivan de los stores compartidos (los que están "En revisión"). */
const EXAMENES: Omit<Revision, "estado">[] = [
    { id: "ex-1", lapso: 2, type: "examen", title: "Examen · Unidad 3", materia: "Ciencias Naturales", seccion: "4.º Año B", fecha: "5 jul 2026", adjunto: "examen_u3_4B.pdf", detalle: "El evaluador solicitó reformular la pregunta 4 y ajustar la ponderación." },
    { id: "ex-2", lapso: 2, type: "examen", title: "Examen · Genética", materia: "Biología", seccion: "5.º Año A", fecha: "7 jul 2026", adjunto: "examen_genetica_5A.pdf", detalle: "Corregir el enunciado del problema 2." },
    { id: "ex-3", lapso: 1, type: "examen", title: "Examen del lapso · Suelos", materia: "Ciencias de la Tierra", seccion: "3.º Año C", fecha: "26 may 2026", adjunto: "examen_suelos_3C.pdf", detalle: "Ajustar la ponderación de la sección práctica." },
];

const TEMAS: Omit<Revision, "estado">[] = [
    { id: "tm-1", lapso: 2, type: "tema", title: "Temario de recuperación", materia: "Química", seccion: "5.º Año B", fecha: "9 jul 2026", adjunto: "reparacion_quimica_5B.pdf", detalle: "Detallar los temas del período de reparación y adjuntar el material corregido." },
    { id: "tm-2", lapso: 2, type: "tema", title: "Temario de recuperación", materia: "Ciencias de la Tierra", seccion: "3.º Año C", fecha: "10 jul 2026", adjunto: "reparacion_ct_3C.pdf", detalle: "Incluir el cronograma de las evaluaciones de recuperación." },
];

function buildRevisiones(planificaciones: Planificacion[], planes: Plan[]): Revision[] {
    const planif: Revision[] = planificaciones.filter((p) => p.status === "review").map((p) => ({
        id: `planif-${p.id}`,
        lapso: 2,
        type: "planificacion",
        title: `Planificación · ${p.count} sesiones`,
        materia: p.subject,
        seccion: p.section,
        fecha: "1 jul 2026",
        adjunto: `planificacion_${p.subject.toLowerCase().replace(/\s+/g, "_")}.pdf`,
        estado: "Por revisar",
        detalle: "Planificación enviada al coordinador. Modifícala si se solicitan cambios.",
    }));
    const planesRev: Revision[] = planes.filter((p) => p.status === "review").map((p) => ({
        id: `plan-${p.id}`,
        lapso: 2,
        type: "plan",
        title: `Plan de evaluación · ${p.count} evaluaciones`,
        materia: p.subject,
        seccion: p.section,
        fecha: "1 jul 2026",
        adjunto: `plan_${p.subject.toLowerCase().replace(/\s+/g, "_")}.pdf`,
        estado: "Por revisar",
        detalle: "Plan de evaluación enviado al evaluador. Modifícalo si se solicitan cambios.",
    }));
    return [
        ...EXAMENES.map((e) => ({ ...e, estado: "Por revisar" as RevEstado })),
        ...TEMAS.map((t) => ({ ...t, estado: "Por revisar" as RevEstado })),
        ...planif,
        ...planesRev,
    ];
}

export const TABS: { key: "todos" | RevType; label: string }[] = [
    { key: "todos", label: "Todos" },
    { key: "examen", label: "Exámenes" },
    { key: "tema", label: "Temas de materias reprobadas" },
    { key: "planificacion", label: "Planificaciones" },
    { key: "plan", label: "Planes de evaluación" },
];

export const COLS = "grid-cols-[1fr_1.9fr_0.9fr_0.9fr_0.9fr_0.9fr]";
export const HEADERS = ["Tipo", "Detalle", "Sección", "Fecha", "Estado", "Acción"];

export function useDocenteRevisiones() {
    const navigate = useNavigate();
    const { data: planificaciones } = useFetch(getPlanificaciones, []);
    const { data: planes } = useFetch(getPlanes, []);
    const [items, setItems] = useState<Revision[]>([]);
    useEffect(() => {
        setItems(buildRevisiones(planificaciones, planes));
    }, [planificaciones, planes]);
    const [tab, setTab] = useState<"todos" | RevType>("todos");
    const [query, setQuery] = useState("");
    const [estadoFilter, setEstadoFilter] = useState<"todos" | RevEstado>("todos");
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<Revision | null>(null);
    const [changeFile, setChangeFile] = useState<{ url: string; name: string; isImage: boolean } | null>(null);

    const { selectedId } = useLapso();
    const lapsoItems = items.filter((i) => i.lapso === selectedId);

    const countOf = (t: RevType) => lapsoItems.filter((i) => i.type === t).length;

    const filtered = lapsoItems
        .filter((r) => tab === "todos" || r.type === tab)
        .filter((r) => estadoFilter === "todos" || r.estado === estadoFilter)
        .filter((r) => !query.trim() || `${r.title} ${r.materia} ${r.seccion}`.toLowerCase().includes(query.trim().toLowerCase()));

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    const openItem = (r: Revision) => {
        setSelected(r);
        setChangeFile(null);
    };

    const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setChangeFile({ url: URL.createObjectURL(file), name: file.name, isImage: file.type.startsWith("image/") });
    };

    const enviarCambio = (id: string) => {
        setItems((rs) => rs.map((r) => (r.id === id ? { ...r, estado: "Cambios enviados" } : r)));
        setSelected(null);
        setChangeFile(null);
    };

    const irAEditar = (r: Revision) => {
        const numId = r.id.split("-")[1];
        navigate(r.type === "planificacion" ? `/docente/planificacion/${numId}/editar` : `/docente/planes/${numId}/editar`);
    };

    const KPIS: RevType[] = ["examen", "tema", "planificacion", "plan"];

    return {
        // state
        items,
        tab,
        query,
        estadoFilter,
        page,
        selected,
        changeFile,
        // derived
        lapsoItems,
        countOf,
        filtered,
        totalPages,
        currentPage,
        paged,
        KPIS,
        // handlers
        openItem,
        onChangeFile,
        enviarCambio,
        irAEditar,
        setTab,
        setQuery,
        setEstadoFilter,
        setPage,
        setSelected,
    };
}
