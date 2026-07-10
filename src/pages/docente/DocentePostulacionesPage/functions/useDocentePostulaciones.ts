import { useState, useEffect } from "react";
import {
    Trophy,
    Music,
    FlaskConical,
    Dumbbell,
    Palette,
    Users,
    Clock,
    CalendarDays,
} from "lucide-react";
import { accent } from "@themes/tokens";
import { useFetch } from "@shared/services";
import {
    getPostulacionesActividades,
    getEstudiantesDisponibles,
    type TipoActividad,
    type EstadoPostulado,
    type Actividad,
} from "@shared/services/actions/docente-eval";

export const TIPO_META: Record<TipoActividad, { icon: React.FC<{ style?: React.CSSProperties }>; ac: { bg: string; fg: string } }> = {
    Cultural: { icon: Music, ac: accent.purple },
    Deportiva: { icon: Dumbbell, ac: accent.blue },
    Científica: { icon: FlaskConical, ac: accent.green },
    Artística: { icon: Palette, ac: accent.amber },
};

export const ESTADO_META: Record<EstadoPostulado, { cls: string }> = {
    Pendiente: { cls: "bg-edu-warning-bg text-edu-warning" },
    Aprobado: { cls: "bg-edu-success-bg text-edu-success" },
    Rechazado: { cls: "bg-edu-danger-bg text-edu-danger" },
};

export const fmtFecha = (f: string) =>
    new Date(f + "T00:00:00").toLocaleDateString("es-VE", { day: "numeric", month: "short", year: "numeric" });

export const TABLE_COLS = "grid-cols-[2fr_1fr_1fr_1.6fr_0.8fr_7.5rem]";
export const TABLE_HEADERS = ["Título", "Tipo", "Fecha", "Lugar", "Cupos", ""];
export const PER_PAGE = 6;
export const MODAL_PER_PAGE = 5;

export function useDocentePostulaciones() {
    const { data: actividadesIniciales, loading } = useFetch(getPostulacionesActividades, []);
    const { data: ESTUDIANTES_DISPONIBLES } = useFetch(getEstudiantesDisponibles, []);

    const [actividades, setActividades] = useState<Actividad[]>([]);
    useEffect(() => setActividades(actividadesIniciales), [actividadesIniciales]);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);

    // Modal: detalle de actividad
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // Modal: postular estudiante
    const [showPostular, setShowPostular] = useState(false);
    const [estudianteId, setEstudianteId] = useState<number>(0);

    // Confirmación: quitar postulado
    const [confirmRemove, setConfirmRemove] = useState<{ postId: number; nombre: string } | null>(null);

    // Modal: paginación y búsqueda de postulados
    const [modalQuery, setModalQuery] = useState("");
    const [modalPage, setModalPage] = useState(1);

    // ---- KPIs ----
    const totalPostulados = actividades.reduce((s, a) => s + a.postulados.length, 0);
    const pendientes = actividades.reduce((s, a) => s + a.postulados.filter((p) => p.estado === "Pendiente").length, 0);
    const proxima = [...actividades]
        .filter((a) => a.fecha >= "2026-07-05")
        .sort((a, b) => a.fecha.localeCompare(b.fecha))[0];

    const KPIS = [
        { label: "Actividades asignadas", value: String(actividades.length), note: "Total de actividades a tu cargo", ac: accent.blue, Icon: Trophy, hideOnPhone: false },
        { label: "Total postulados", value: String(totalPostulados), note: `${pendientes} pendiente${pendientes !== 1 ? "s" : ""} de aprobación`, ac: accent.purple, Icon: Users, hideOnPhone: false },
        { label: "Próxima actividad", value: proxima ? fmtFecha(proxima.fecha) : "—", note: proxima ? proxima.nombre : "Sin actividades próximas", ac: accent.amber, Icon: CalendarDays, hideOnPhone: false },
        { label: "Pendientes de revisión", value: String(pendientes), note: "Postulaciones esperando al coordinador", ac: accent.red, Icon: Clock, hideOnPhone: true },
    ];

    // ---- Filtros y paginación ----
    const filtered = actividades.filter(
        (a) => !query.trim() || `${a.nombre} ${a.tipo} ${a.lugar}`.toLowerCase().includes(query.trim().toLowerCase()),
    );
    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    // ---- Actividad seleccionada ----
    const selectedAct = actividades.find((a) => a.id === selectedId) ?? null;
    const selectedMeta = selectedAct ? TIPO_META[selectedAct.tipo] : null;
    const selectedAprobados = selectedAct ? selectedAct.postulados.filter((p) => p.estado === "Aprobado").length : 0;
    const cupoLleno = selectedAct ? selectedAprobados >= selectedAct.cupo : false;

    // Estudiantes no postulados aún en la actividad seleccionada
    const postCedulas = new Set(selectedAct?.postulados.map((p) => p.cedula) ?? []);
    const disponibles = ESTUDIANTES_DISPONIBLES.filter((e) => !postCedulas.has(e.cedula));

    const filteredPostulados = selectedAct
        ? selectedAct.postulados.filter(
            (p) =>
                !modalQuery.trim() ||
                `${p.nombre} ${p.seccion} ${p.cedula}`.toLowerCase().includes(modalQuery.trim().toLowerCase()),
        )
        : [];
    const modalTotalPages = Math.max(1, Math.ceil(filteredPostulados.length / MODAL_PER_PAGE));
    const modalCurrentPage = Math.min(modalPage, modalTotalPages);
    const pagedPostulados = filteredPostulados.slice(
        (modalCurrentPage - 1) * MODAL_PER_PAGE,
        modalCurrentPage * MODAL_PER_PAGE,
    );

    const openDetalle = (id: number) => {
        setSelectedId(id);
        setModalQuery("");
        setModalPage(1);
    };
    const closeDetalle = () => { setSelectedId(null); setShowPostular(false); setModalQuery(""); setModalPage(1); };

    const abrirPostular = (act: Actividad) => {
        const ceds = new Set(act.postulados.map((p) => p.cedula));
        const libre = ESTUDIANTES_DISPONIBLES.find((e) => !ceds.has(e.cedula));
        setEstudianteId(libre?.id ?? ESTUDIANTES_DISPONIBLES[0]?.id ?? 0);
        setSelectedId(act.id);
        setShowPostular(true);
    };

    const confirmarPostulacion = () => {
        if (!selectedAct) return;
        const est = ESTUDIANTES_DISPONIBLES.find((e) => e.id === estudianteId);
        if (!est) return;
        setActividades((prev) =>
            prev.map((a) =>
                a.id === selectedAct.id
                    ? { ...a, postulados: [...a.postulados, { id: Date.now(), nombre: est.nombre, seccion: est.seccion, cedula: est.cedula, estado: "Pendiente" }] }
                    : a,
            ),
        );
        setShowPostular(false);
    };

    const confirmarEliminar = () => {
        if (!confirmRemove || !selectedAct) return;
        setActividades((prev) =>
            prev.map((a) =>
                a.id === selectedAct.id
                    ? { ...a, postulados: a.postulados.filter((p) => p.id !== confirmRemove.postId) }
                    : a,
            ),
        );
        setConfirmRemove(null);
    };

    return {
        loading,
        // estado tabla
        query,
        setQuery,
        page,
        setPage,
        filtered,
        totalPages,
        currentPage,
        paged,
        // estado modal detalle
        selectedAct,
        selectedMeta,
        selectedAprobados,
        cupoLleno,
        openDetalle,
        closeDetalle,
        // estado postular
        showPostular,
        setShowPostular,
        estudianteId,
        setEstudianteId,
        disponibles,
        abrirPostular,
        confirmarPostulacion,
        // estado modal postulados
        modalQuery,
        setModalQuery,
        modalPage,
        setModalPage,
        filteredPostulados,
        modalTotalPages,
        modalCurrentPage,
        pagedPostulados,
        // confirmación eliminar
        confirmRemove,
        setConfirmRemove,
        confirmarEliminar,
        // derivados/constantes
        KPIS,
    };
}
