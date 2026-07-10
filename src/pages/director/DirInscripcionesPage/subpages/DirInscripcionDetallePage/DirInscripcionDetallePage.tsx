import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { BaucheModal } from "@shared/ui/BaucheModal";
import { ConfirmDialog } from "@shared/ui/ConfirmDialog";
import { useDirInscripcionDetalle } from "./functions/useDirInscripcionDetalle";
import { NotFoundState } from "./ui/NotFoundState";
import { DetalleHeader } from "./ui/DetalleHeader";
import { StudentDataCard } from "./ui/StudentDataCard";
import { RepresentativeDataCard } from "./ui/RepresentativeDataCard";
import { DocumentsCard } from "./ui/DocumentsCard";
import { PaymentCard } from "./ui/PaymentCard";

export function DirInscripcionDetallePage() {
    const {
        navigate,
        loading,
        record,
        estado,
        showBauche,
        setShowBauche,
        pending,
        setPending,
        tipo,
        estadoMeta,
        iniciales,
        enRevision,
        applyAction,
    } = useDirInscripcionDetalle();

    if (loading)
        return <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">Cargando…</div>;

    if (!record)
        return <NotFoundState onBack={() => navigate("/director/inscripciones")} />;

    return (
        <div className="flex flex-col gap-5">
            {/* Volver */}
            <button
                type="button"
                onClick={() => navigate("/director/inscripciones")}
                className="inline-flex items-center gap-1.5 text-edu-ink-500 text-sm font-medium bg-transparent border-none cursor-pointer w-fit hover:text-edu-primary transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Volver a inscripciones
            </button>

            {/* Encabezado */}
            <DetalleHeader
                record={record}
                iniciales={iniciales}
                tipo={tipo!}
                estadoMeta={estadoMeta!}
            />

            {/* Secciones de datos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                <StudentDataCard record={record} />
                <RepresentativeDataCard record={record} />
                <DocumentsCard record={record} />
                <PaymentCard
                    record={record}
                    estado={estado}
                    estadoMeta={estadoMeta!}
                    enRevision={enRevision}
                    onShowBauche={() => setShowBauche(true)}
                    onReject={() => setPending("rechazar")}
                    onAccept={() => setPending("aceptar")}
                />
            </div>

            {/* Modal bauche */}
            {showBauche && (
                <BaucheModal
                    rep={`${record.repNombre} ${record.repApellido}`}
                    student={`${record.estNombre} ${record.estApellido}`}
                    amount={record.monto}
                    method={record.metodo}
                    reference={record.bauche}
                    date={record.fechaPago}
                    showOptions={enRevision}
                    onClose={() => setShowBauche(false)}
                    onAccept={() => setPending("aceptar")}
                    onReject={() => setPending("rechazar")}
                />
            )}

            {/* Confirmación */}
            {pending && (
                <ConfirmDialog
                    title={pending === "aceptar" ? "¿Confirmar el pago de esta inscripción?" : "¿Rechazar esta inscripción?"}
                    message={
                        pending === "aceptar"
                            ? "La inscripción quedará aceptada y el representante será notificado."
                            : "La inscripción será rechazada. Esta acción puede revertirse."
                    }
                    confirmLabel={pending === "aceptar" ? "Sí, aceptar" : "Sí, rechazar"}
                    tone={pending === "aceptar" ? "success" : "danger"}
                    icon={pending === "aceptar" ? CheckCircle2 : XCircle}
                    onConfirm={() => applyAction(pending)}
                    onCancel={() => setPending(null)}
                />
            )}
        </div>
    );
}
