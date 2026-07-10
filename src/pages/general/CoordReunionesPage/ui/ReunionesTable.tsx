import { CheckCircle2, XCircle, Clock } from "lucide-react";
import type { Reunion, ReunionEstado } from "@shared/services/actions/coordinador";

type Estado = ReunionEstado;

interface ReunionesTableProps {
    reuniones: Reunion[];
    COLS: string;
    HEADERS: string[];
    ESTADO_META: Record<Estado, { cls: string }>;
    onConfirm: (payload: { id: number; action: "Realizada" | "Cancelada"; tema: string }) => void;
}

export function ReunionesTable({ reuniones, COLS, HEADERS, ESTADO_META, onConfirm }: ReunionesTableProps) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Agenda de reuniones</h3>
                <span className="text-[0.8rem] text-edu-ink-400 font-medium">{reuniones.length} reuniones</span>
            </div>
            <div className="overflow-x-auto">
                <div className="min-w-[760px]">
                    <div className={`grid ${COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                        {HEADERS.map((h) => (
                            <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
                        ))}
                    </div>
                    {reuniones.map((r, i) => {
                        const st = ESTADO_META[r.estado];
                        const editable = r.estado === "Programada";
                        return (
                            <div key={r.id} className={`grid ${COLS} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < reuniones.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
                                <div className="min-w-0 pr-3">
                                    <div className="text-sm text-edu-ink font-semibold">{r.tema}</div>
                                    {r.observaciones && <div className="text-[0.75rem] text-edu-ink-400 mt-0.5 truncate">{r.observaciones}</div>}
                                </div>
                                <span className="text-[0.8125rem] text-edu-ink-500">{r.fecha}</span>
                                <span className="text-[0.8125rem] text-edu-ink-500 flex items-center gap-1">
                                    <Clock className="text-edu-ink-400" style={{ width: 12, height: 12 }} />
                                    {r.hora}
                                </span>
                                <span className="text-[0.8125rem] text-edu-ink-700">{r.convocados}</span>
                                <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${st.cls}`}>{r.estado}</span>
                                <div className="flex gap-2">
                                    {editable ? (
                                        <>
                                            <button
                                                onClick={() => onConfirm({ id: r.id, action: "Realizada", tema: r.tema })}
                                                className="inline-flex items-center gap-1 text-[0.75rem] font-semibold text-edu-success cursor-pointer bg-transparent border-none p-0 hover:underline"
                                            >
                                                <CheckCircle2 style={{ width: 14, height: 14 }} /> Realizada
                                            </button>
                                            <button
                                                onClick={() => onConfirm({ id: r.id, action: "Cancelada", tema: r.tema })}
                                                className="inline-flex items-center gap-1 text-[0.75rem] font-semibold text-edu-danger cursor-pointer bg-transparent border-none p-0 hover:underline"
                                            >
                                                <XCircle style={{ width: 14, height: 14 }} /> Cancelar
                                            </button>
                                        </>
                                    ) : (
                                        <span className="text-[0.75rem] text-edu-ink-400">Sin acciones</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
