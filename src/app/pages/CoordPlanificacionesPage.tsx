import { useState, useEffect } from "react";
import {
    ClipboardList,
    CheckCircle2,
    XCircle,
    Clock,
    FileCheck2,
    X,
    MessageSquareWarning,
} from "lucide-react";
import { accent } from "../theme/tokens";
import { useFetch } from "../datos_maquetados";
import {
    getPlanificacionesCoord,
    type Planificacion,
    type EstadoPlan,
} from "../datos_maquetados/actions/coordinador";

/* ------------------------------------------------------------------ */
/* Presentación                                                        */
/* ------------------------------------------------------------------ */

const ESTADO_META: Record<EstadoPlan, { cls: string }> = {
    Pendiente: { cls: "bg-edu-warning-bg text-edu-warning" },
    Aprobada: { cls: "bg-edu-success-bg text-edu-success" },
    Rechazada: { cls: "bg-edu-danger-bg text-edu-danger" },
};

const COLS = "grid-cols-[1.4fr_1.2fr_0.9fr_0.9fr_0.9fr_1.1fr]";
const HEADERS = ["Docente", "Materia", "Sección", "Entrega", "Estado", "Acciones"];

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function CoordPlanificacionesPage() {
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

    return (
        <div className="flex flex-col gap-5">
            {/* Encabezado */}
            <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: accent.purple.bg }}>
                    <ClipboardList style={{ width: 22, height: 22, color: accent.purple.fg }} />
                </div>
                <div>
                    <h2 className="m-0 text-edu-ink font-bold text-[1.15rem]">Planificaciones</h2>
                    <p className="m-0 text-edu-ink-500 text-[0.8125rem]">Supervisa y aprueba las planificaciones entregadas por los docentes</p>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {kpis.map((kpi) => {
                    const Icon = kpi.icon;
                    return (
                        <div key={kpi.label} className="bg-edu-surface rounded-edu-card p-5 flex justify-between items-start border border-edu-border-soft">
                            <div>
                                <p className="text-edu-ink-500 text-[0.75rem] font-medium m-0 uppercase tracking-[0.05em]">{kpi.label}</p>
                                <p className="text-[1.6rem] font-bold mt-1.5 m-0 text-edu-ink">{kpi.value}</p>
                            </div>
                            <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: kpi.ac.bg }}>
                                <Icon style={{ width: 20, height: 20, color: kpi.ac.fg }} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Tabla */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                    <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Planificaciones entregadas</h3>
                    <span className="text-[0.8rem] text-edu-ink-400 font-medium">{planes.length} registros</span>
                </div>
                <div className="overflow-x-auto">
                    <div className="min-w-[760px]">
                    <div className={`grid ${COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                        {HEADERS.map((h) => (
                            <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
                        ))}
                    </div>
                    {planes.map((p, i) => {
                        const st = ESTADO_META[p.estado];
                        const pendiente = p.estado === "Pendiente";
                        return (
                            <div key={p.id} className={`px-5 py-[13px] transition-colors hover:bg-edu-subtle ${i < planes.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
                                <div className={`grid ${COLS} items-center`}>
                                    <span className="text-sm text-edu-ink font-semibold pr-3">{p.docente}</span>
                                    <span className="text-[0.8125rem] text-edu-ink-700 pr-3">{p.materia}</span>
                                    <span className="text-[0.8125rem] text-edu-ink-500">{p.seccion}</span>
                                    <span className="text-[0.8125rem] text-edu-ink-500">{p.entrega}</span>
                                    <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${st.cls}`}>{p.estado}</span>
                                    <div className="flex gap-2">
                                        {pendiente ? (
                                            <>
                                                <button onClick={() => aprobar(p.id)} className="inline-flex items-center gap-1 text-[0.75rem] font-semibold text-edu-success cursor-pointer bg-transparent border-none p-0 hover:underline">
                                                    <CheckCircle2 style={{ width: 14, height: 14 }} /> Aprobar
                                                </button>
                                                <button onClick={() => abrirRechazo(p.id, p.docente)} className="inline-flex items-center gap-1 text-[0.75rem] font-semibold text-edu-danger cursor-pointer bg-transparent border-none p-0 hover:underline">
                                                    <XCircle style={{ width: 14, height: 14 }} /> Rechazar
                                                </button>
                                            </>
                                        ) : (
                                            <span className="text-[0.75rem] text-edu-ink-400">Revisada</span>
                                        )}
                                    </div>
                                </div>
                                {p.observacion && (
                                    <div className="mt-2 flex items-center gap-1.5 text-xs w-fit rounded-edu-chip px-2.5 py-1.5 text-edu-danger bg-edu-danger-bg">
                                        <MessageSquareWarning className="shrink-0" style={{ width: 12, height: 12 }} />
                                        {p.observacion}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    </div>
                </div>
            </div>

            {/* Modal de observación al rechazar */}
            {modal && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setModal(null)}>
                    <div className="bg-edu-surface rounded-edu-card w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
                        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-edu-control bg-edu-danger-bg flex items-center justify-center">
                                    <MessageSquareWarning className="w-4 h-4 text-edu-danger" />
                                </div>
                                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Rechazar planificación</h3>
                            </div>
                            <button onClick={() => setModal(null)} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={confirmarRechazo} className="p-5 flex flex-col gap-4">
                            <p className="m-0 text-[0.8125rem] text-edu-ink-500">Indícale a <span className="font-semibold text-edu-ink-700">{modal.docente}</span> el motivo del rechazo para que corrija su entrega.</p>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-edu-ink-700 text-sm font-medium">Observación</label>
                                <textarea value={observacion} onChange={(e) => setObservacion(e.target.value)} rows={4} required placeholder="Ej. Falta el cronograma de evaluaciones del lapso." className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full resize-none focus:border-edu-primary" />
                            </div>
                            <div className="flex gap-2 justify-end pt-1">
                                <button type="button" onClick={() => setModal(null)} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer hover:bg-edu-subtle">Cancelar</button>
                                <button type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control bg-edu-danger text-white text-sm font-semibold border-none cursor-pointer hover:opacity-90">
                                    <FileCheck2 className="w-4 h-4" />
                                    Rechazar entrega
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
