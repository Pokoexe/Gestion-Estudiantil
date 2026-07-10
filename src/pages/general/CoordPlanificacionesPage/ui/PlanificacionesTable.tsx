import { CheckCircle2, XCircle, MessageSquareWarning } from "lucide-react";
import type { Planificacion, EstadoPlan } from "@shared/services/actions/coordinador";

type Props = {
    planes: Planificacion[];
    COLS: string;
    HEADERS: string[];
    ESTADO_META: Record<EstadoPlan, { cls: string }>;
    aprobar: (id: number) => void;
    abrirRechazo: (id: number, docente: string) => void;
};

export function PlanificacionesTable({ planes, COLS, HEADERS, ESTADO_META, aprobar, abrirRechazo }: Props) {
    return (
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
    );
}
