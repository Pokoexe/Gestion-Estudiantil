import { useState } from "react";
import {
    Trophy,
    Music,
    FlaskConical,
    Dumbbell,
    Palette,
    Users,
    Calendar,
    MapPin,
    Clock,
    X,
    XCircle,
    Search,
    UserPlus,
    CalendarDays,
} from "lucide-react";
import { accent } from "../theme/tokens";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Pagination } from "../components/Pagination";

type TipoActividad = "Cultural" | "Deportiva" | "Científica" | "Artística";
type EstadoPostulado = "Pendiente" | "Aprobado" | "Rechazado";

interface Postulado {
    id: number;
    nombre: string;
    seccion: string;
    cedula: string;
    estado: EstadoPostulado;
}

interface Actividad {
    id: number;
    nombre: string;
    tipo: TipoActividad;
    fecha: string;
    lugar: string;
    cupo: number;
    postulados: Postulado[];
}

const ESTUDIANTES_DISPONIBLES = [
    { id: 101, nombre: "Carlos Mendoza", seccion: "4.º Año B", cedula: "V-28.123.456" },
    { id: 102, nombre: "Valeria Contreras", seccion: "3.º Año A", cedula: "V-29.234.567" },
    { id: 103, nombre: "Daniel Peña", seccion: "2.º Año B", cedula: "V-30.345.678" },
    { id: 104, nombre: "Isabella Moreno", seccion: "4.º Año C", cedula: "V-28.456.789" },
    { id: 105, nombre: "Sebastián Torres", seccion: "5.º Año A", cedula: "V-27.567.890" },
    { id: 106, nombre: "Gabriela Ríos", seccion: "1.º Año D", cedula: "V-31.678.901" },
    { id: 107, nombre: "Andrés López", seccion: "3.º Año B", cedula: "V-29.789.012" },
    { id: 108, nombre: "Fernanda Castro", seccion: "5.º Año C", cedula: "V-27.890.123" },
];

const ACTIVIDADES_INICIALES: Actividad[] = [
    {
        id: 1,
        nombre: "Danzas Tradicionales Venezolanas",
        tipo: "Cultural",
        fecha: "2026-07-10",
        lugar: "Tariba, Táchira",
        cupo: 25,
        postulados: [
            { id: 11, nombre: "Valeria Contreras", seccion: "3.º Año A", cedula: "V-29.234.567", estado: "Aprobado" },
            { id: 12, nombre: "Daniel Peña", seccion: "2.º Año B", cedula: "V-30.345.678", estado: "Pendiente" },
        ],
    },
    {
        id: 2,
        nombre: "Feria de Ciencias Regionales",
        tipo: "Científica",
        fecha: "2026-07-18",
        lugar: "San Cristóbal, Táchira",
        cupo: 15,
        postulados: [
            { id: 21, nombre: "Sebastián Torres", seccion: "5.º Año A", cedula: "V-27.567.890", estado: "Pendiente" },
        ],
    },
    {
        id: 3,
        nombre: "Torneo Intercolegial de Ajedrez",
        tipo: "Deportiva",
        fecha: "2026-08-05",
        lugar: "Colegio San José, Rubio",
        cupo: 10,
        postulados: [],
    },
    {
        id: 4,
        nombre: "Exposición de Arte Escolar",
        tipo: "Artística",
        fecha: "2026-08-20",
        lugar: "Sala Cultural Municipal, San Cristóbal",
        cupo: 20,
        postulados: [],
    },
];

const TIPO_META: Record<TipoActividad, { icon: React.FC<{ style?: React.CSSProperties }>; ac: { bg: string; fg: string } }> = {
    Cultural: { icon: Music, ac: accent.purple },
    Deportiva: { icon: Dumbbell, ac: accent.blue },
    Científica: { icon: FlaskConical, ac: accent.green },
    Artística: { icon: Palette, ac: accent.amber },
};

const ESTADO_META: Record<EstadoPostulado, { cls: string }> = {
    Pendiente: { cls: "bg-edu-warning-bg text-edu-warning" },
    Aprobado: { cls: "bg-edu-success-bg text-edu-success" },
    Rechazado: { cls: "bg-edu-danger-bg text-edu-danger" },
};

const fmtFecha = (f: string) =>
    new Date(f + "T00:00:00").toLocaleDateString("es-VE", { day: "numeric", month: "short", year: "numeric" });

const TABLE_COLS = "grid-cols-[2fr_1fr_1fr_1.6fr_0.8fr_7.5rem]";
const TABLE_HEADERS = ["Título", "Tipo", "Fecha", "Lugar", "Cupos", ""];
const PER_PAGE = 6;

export function DocentePostulacionesPage() {
    const [actividades, setActividades] = useState<Actividad[]>(ACTIVIDADES_INICIALES);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);

    // Modal: detalle de actividad
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // Modal: postular estudiante
    const [showPostular, setShowPostular] = useState(false);
    const [estudianteId, setEstudianteId] = useState<number>(ESTUDIANTES_DISPONIBLES[0].id);

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
        { label: "Actividades asignadas", value: String(actividades.length), note: "Total de actividades a tu cargo", ac: accent.blue, Icon: Trophy },
        { label: "Total postulados", value: String(totalPostulados), note: `${pendientes} pendiente${pendientes !== 1 ? "s" : ""} de aprobación`, ac: accent.purple, Icon: Users },
        { label: "Próxima actividad", value: proxima ? fmtFecha(proxima.fecha) : "—", note: proxima ? proxima.nombre : "Sin actividades próximas", ac: accent.amber, Icon: CalendarDays },
        { label: "Pendientes de revisión", value: String(pendientes), note: "Postulaciones esperando al coordinador", ac: accent.red, Icon: Clock },
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

    const MODAL_PER_PAGE = 5;

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
        setEstudianteId(libre?.id ?? ESTUDIANTES_DISPONIBLES[0].id);
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

    return (
        <div className="flex flex-col gap-5">
            {/* Encabezado */}
            <div>
                <h2 className="m-0 text-edu-ink font-bold text-[1.35rem]">Mis Postulaciones</h2>
                <p className="m-0 text-edu-ink-500 text-sm mt-1">
                    Actividades asignadas y estudiantes postulados para participar en ellas
                </p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-4 gap-4">
                {KPIS.map((k) => (
                    <div key={k.label} className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-4 flex gap-3 items-start">
                        <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: k.ac.bg }}>
                            <k.Icon style={{ width: 20, height: 20, color: k.ac.fg }} />
                        </div>
                        <div className="min-w-0">
                            <div className="text-[0.7rem] text-edu-ink-400 uppercase tracking-[0.05em] font-semibold leading-tight">{k.label}</div>
                            <div className="text-[1.45rem] font-bold text-edu-ink leading-tight mt-0.5">{k.value}</div>
                            <div className="text-[0.74rem] text-edu-ink-500 mt-0.5 leading-tight">{k.note}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabla de actividades */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                <div className="px-5 py-4 border-b border-edu-border-soft flex items-center justify-between gap-3">
                    <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Actividades asignadas</h3>
                    <span className="text-[0.8rem] text-edu-ink-400 font-medium">
                        {filtered.length} actividad{filtered.length === 1 ? "" : "es"}
                    </span>
                </div>

                {/* Buscador */}
                <div className="px-5 py-3 border-b border-edu-border-soft">
                    <div className="relative">
                        <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                            placeholder="Buscar por nombre, tipo o lugar…"
                            className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                        />
                    </div>
                </div>

                {/* Cabecera de columnas */}
                <div className={`grid ${TABLE_COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                    {TABLE_HEADERS.map((h) => (
                        <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
                    ))}
                </div>

                {/* Filas */}
                {filtered.length === 0 ? (
                    <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">
                        No hay actividades que coincidan con la búsqueda.
                    </div>
                ) : (
                    paged.map((act, i) => {
                        const meta = TIPO_META[act.tipo];
                        const Icon = meta.icon;
                        const aprobados = act.postulados.filter((p) => p.estado === "Aprobado").length;
                        return (
                            <div
                                key={act.id}
                                onClick={() => openDetalle(act.id)}
                                className={`grid ${TABLE_COLS} px-5 py-[13px] items-center cursor-pointer hover:bg-edu-subtle transition-colors ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                            >
                                {/* Título */}
                                <div className="flex items-center gap-2.5 min-w-0 pr-3">
                                    <div className="w-7 h-7 rounded-edu-chip flex items-center justify-center shrink-0" style={{ backgroundColor: meta.ac.bg }}>
                                        <Icon style={{ width: 14, height: 14, color: meta.ac.fg }} />
                                    </div>
                                    <span className="text-sm text-edu-ink font-semibold truncate">{act.nombre}</span>
                                </div>
                                {/* Tipo */}
                                <span className="inline-flex items-center px-2 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit" style={{ backgroundColor: meta.ac.bg, color: meta.ac.fg }}>
                                    {act.tipo}
                                </span>
                                {/* Fecha */}
                                <span className="text-[0.8125rem] text-edu-ink-500">{fmtFecha(act.fecha)}</span>
                                {/* Lugar */}
                                <span className="text-[0.8125rem] text-edu-ink-500 truncate pr-2">{act.lugar}</span>
                                {/* Cupos */}
                                <span className={`text-[0.8125rem] font-semibold ${aprobados >= act.cupo ? "text-edu-danger" : "text-edu-ink"}`}>
                                    {aprobados}/{act.cupo}
                                </span>
                                {/* Postular */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); abrirPostular(act); }}
                                    disabled={aprobados >= act.cupo}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-edu-control text-[0.8rem] font-semibold text-white border-none cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                                    style={{ backgroundColor: meta.ac.fg }}
                                >
                                    <UserPlus style={{ width: 13, height: 13 }} />
                                    Postular
                                </button>
                            </div>
                        );
                    })
                )}

                {totalPages > 1 && (
                    <div className="px-5 py-4 border-t border-edu-border-soft">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
                    </div>
                )}
            </div>

            {/* ── Modal: detalle de actividad ── */}
            {selectedAct && selectedMeta && (
                <div
                    className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
                    onClick={closeDetalle}
                >
                    <div
                        className="bg-edu-surface rounded-edu-card w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-5 py-4 border-b border-edu-border-soft flex items-start gap-3">
                            <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: selectedMeta.ac.bg }}>
                                {(() => { const Icon = selectedMeta.icon; return <Icon style={{ width: 20, height: 20, color: selectedMeta.ac.fg }} />; })()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="m-0 text-edu-ink font-bold text-[1.05rem] leading-tight">{selectedAct.nombre}</h3>
                                    <span className="inline-flex items-center px-2 py-[2px] rounded-edu-pill text-[0.7rem] font-semibold shrink-0" style={{ backgroundColor: selectedMeta.ac.bg, color: selectedMeta.ac.fg }}>
                                        {selectedAct.tipo}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                                    <span className="text-[0.8125rem] text-edu-ink-500 flex items-center gap-1">
                                        <Calendar style={{ width: 12, height: 12 }} /> {fmtFecha(selectedAct.fecha)}
                                    </span>
                                    <span className="text-[0.8125rem] text-edu-ink-500 flex items-center gap-1">
                                        <MapPin style={{ width: 12, height: 12 }} /> {selectedAct.lugar}
                                    </span>
                                    <span className={`text-[0.8125rem] font-semibold flex items-center gap-1 ${cupoLleno ? "text-edu-danger" : "text-edu-ink-700"}`}>
                                        <Users style={{ width: 12, height: 12 }} />
                                        Cupos: {selectedAprobados}/{selectedAct.cupo}
                                        {cupoLleno && <span className="ml-1 text-[0.7rem] font-semibold px-1.5 py-[1px] rounded-edu-pill bg-edu-danger-bg text-edu-danger">Lleno</span>}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={closeDetalle}
                                aria-label="Cerrar"
                                className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700 shrink-0"
                            >
                                <X style={{ width: 18, height: 18 }} />
                            </button>
                        </div>

                        {/* Sección de postulados */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="px-5 py-3 border-b border-edu-border-soft flex items-center gap-1.5">
                                <Users style={{ width: 14, height: 14, color: "var(--color-edu-ink-400)" }} />
                                <span className="text-[0.8rem] font-semibold text-edu-ink-700">
                                    Estudiantes postulados ({selectedAct.postulados.length})
                                </span>
                            </div>

                            {/* Buscador modal */}
                            {selectedAct.postulados.length > 0 && (
                                <div className="px-5 py-2.5 border-b border-edu-border-soft">
                                    <div className="relative">
                                        <Search className="w-3.5 h-3.5 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            value={modalQuery}
                                            onChange={(e) => { setModalQuery(e.target.value); setModalPage(1); }}
                                            placeholder="Buscar por nombre, sección o cédula…"
                                            className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-8 pr-3 py-1.5 text-[0.8rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                                        />
                                    </div>
                                </div>
                            )}

                            {selectedAct.postulados.length === 0 ? (
                                <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">
                                    Ningún estudiante postulado en esta actividad aún.
                                </div>
                            ) : filteredPostulados.length === 0 ? (
                                <div className="px-5 py-8 text-center text-edu-ink-400 text-sm">
                                    No hay resultados para la búsqueda.
                                </div>
                            ) : (
                                <div>
                                    <div className="grid grid-cols-[1.8fr_1.2fr_1fr_0.9fr_2rem] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                                        {["Estudiante", "Sección", "Cédula", "Estado", ""].map((h) => (
                                            <span key={h} className="text-[0.68rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
                                        ))}
                                    </div>
                                    {pagedPostulados.map((p, j) => {
                                        const st = ESTADO_META[p.estado];
                                        return (
                                            <div
                                                key={p.id}
                                                className={`grid grid-cols-[1.8fr_1.2fr_1fr_0.9fr_2rem] px-5 py-[13px] items-center ${j < pagedPostulados.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                                            >
                                                <span className="text-[0.875rem] text-edu-ink font-medium">{p.nombre}</span>
                                                <span className="text-[0.8125rem] text-edu-ink-500">{p.seccion}</span>
                                                <span className="text-[0.8125rem] text-edu-ink-500">{p.cedula}</span>
                                                <span className={`inline-flex items-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${st.cls}`}>
                                                    {p.estado}
                                                </span>
                                                <button
                                                    onClick={() => setConfirmRemove({ postId: p.id, nombre: p.nombre })}
                                                    aria-label="Quitar postulación"
                                                    className="w-6 h-6 rounded-edu-chip flex items-center justify-center text-edu-ink-400 bg-transparent border-none cursor-pointer hover:text-edu-danger hover:bg-edu-danger-bg transition-colors"
                                                >
                                                    <X style={{ width: 12, height: 12 }} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                    {modalTotalPages > 1 && (
                                        <div className="px-5 py-3 border-t border-edu-border-soft">
                                            <Pagination currentPage={modalCurrentPage} totalPages={modalTotalPages} onPageChange={setModalPage} />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-5 py-3 border-t border-edu-border-soft flex justify-end">
                            <button
                                onClick={closeDetalle}
                                className="px-4 py-2 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer hover:bg-edu-subtle transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Modal: postular estudiante ── */}
            {showPostular && selectedAct && selectedMeta && (
                <div
                    className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4"
                    onClick={() => setShowPostular(false)}
                >
                    <div
                        className="bg-edu-surface rounded-edu-card w-full max-w-md shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: selectedMeta.ac.bg }}>
                                    <UserPlus style={{ width: 16, height: 16, color: selectedMeta.ac.fg }} />
                                </div>
                                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Postular estudiante</h3>
                            </div>
                            <button
                                onClick={() => setShowPostular(false)}
                                aria-label="Cerrar"
                                className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700"
                            >
                                <X style={{ width: 16, height: 16 }} />
                            </button>
                        </div>
                        <div className="p-5 flex flex-col gap-4">
                            <div className="px-3.5 py-2.5 rounded-edu-control bg-edu-subtle border border-edu-border-soft text-[0.8125rem] text-edu-ink-700">
                                Actividad: <strong>{selectedAct.nombre}</strong>
                            </div>

                            {disponibles.length === 0 ? (
                                <p className="text-[0.8125rem] text-edu-ink-400 m-0 text-center py-2">
                                    Todos los estudiantes disponibles ya están postulados.
                                </p>
                            ) : (
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-edu-ink-700 text-sm font-medium">Seleccionar estudiante</label>
                                    <select
                                        value={estudianteId}
                                        onChange={(e) => setEstudianteId(Number(e.target.value))}
                                        className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-edu-primary"
                                    >
                                        {disponibles.map((e) => (
                                            <option key={e.id} value={e.id}>{e.nombre} · {e.seccion}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="flex gap-2 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowPostular(false)}
                                    className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer hover:bg-edu-subtle"
                                >
                                    Cancelar
                                </button>
                                {disponibles.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={confirmarPostulacion}
                                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold border-none cursor-pointer transition-opacity hover:opacity-90"
                                        style={{ backgroundColor: selectedMeta.ac.fg }}
                                    >
                                        <UserPlus style={{ width: 16, height: 16 }} />
                                        Postular
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmación: quitar postulación */}
            {confirmRemove && (
                <ConfirmDialog
                    title="Quitar postulación"
                    message={
                        <>
                            ¿Deseas quitar la postulación de{" "}
                            <span className="font-semibold text-edu-ink">{confirmRemove.nombre}</span>? Esta acción no se puede deshacer.
                        </>
                    }
                    confirmLabel="Quitar"
                    tone="danger"
                    icon={XCircle}
                    onConfirm={confirmarEliminar}
                    onCancel={() => setConfirmRemove(null)}
                />
            )}
        </div>
    );
}
