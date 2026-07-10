import { CreditCard, CalendarDays, Receipt, FileText, CheckCircle2, XCircle } from "lucide-react";
import type { Inscripcion, InscripcionEstado } from "@shared/services/actions/inscripciones";
import { SectionCard } from "./SectionCard";
import { Info } from "./Info";

interface EstadoMeta {
    label: string;
    cls: string;
}

interface PaymentCardProps {
    record: Inscripcion;
    estado: InscripcionEstado | undefined;
    estadoMeta: EstadoMeta;
    enRevision: boolean;
    onShowBauche: () => void;
    onReject: () => void;
    onAccept: () => void;
}

export function PaymentCard({ record, estado, estadoMeta, enRevision, onShowBauche, onReject, onAccept }: PaymentCardProps) {
    return (
        <SectionCard icon={CreditCard} title="Pago de inscripción">
            <Info icon={CreditCard} label="Monto" value={record.monto} />
            <Info icon={CalendarDays} label="Fecha del pago" value={record.fechaPago} />
            <Info icon={Receipt} label="N.º de comprobante" value={record.bauche} />
            <Info icon={FileText} label="Método" value={record.metodo} full />

            <div className="sm:col-span-2 flex flex-col gap-2.5 pt-1">
                <button
                    type="button"
                    onClick={onShowBauche}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer hover:bg-edu-subtle transition-colors"
                >
                    <Receipt className="w-4 h-4" />
                    Ver comprobante (bauche)
                </button>

                {enRevision ? (
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onReject}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-edu-control text-sm font-semibold border-[1.5px] border-edu-danger-bg bg-edu-danger-bg text-edu-danger cursor-pointer hover:brightness-95 transition-all"
                        >
                            <XCircle className="w-4 h-4" />
                            Rechazar
                        </button>
                        <button
                            type="button"
                            onClick={onAccept}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-edu-control text-sm font-semibold border-none bg-edu-success text-white cursor-pointer hover:brightness-95 transition-all"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Aceptar inscripción
                        </button>
                    </div>
                ) : (
                    <div className={`flex items-center gap-2 px-3.5 py-2.5 rounded-edu-control text-[0.8125rem] font-medium ${estadoMeta.cls}`}>
                        {(estado ?? record.estado) === "aceptado" ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        Esta inscripción ya fue {(estado ?? record.estado) === "aceptado" ? "aceptada" : "rechazada"}.
                    </div>
                )}
            </div>
        </SectionCard>
    );
}
