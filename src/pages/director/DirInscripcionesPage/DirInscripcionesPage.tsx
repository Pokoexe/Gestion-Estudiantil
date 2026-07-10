import { UserPlus, CheckCircle2, XCircle } from "lucide-react";
import { accent } from "@themes/tokens";
import { BaucheModal } from "@shared/ui/BaucheModal";
import { ConfirmDialog } from "@shared/ui/ConfirmDialog";
import { useDirInscripciones } from "./functions/useDirInscripciones";
import { PeriodBanner } from "./ui/PeriodBanner";
import { InscripcionesChartCard } from "./ui/InscripcionesChartCard";
import { KpiColumn } from "./ui/KpiColumn";
import { InscripcionesTable } from "./ui/InscripcionesTable";

export function DirInscripcionesPage() {
    const {
        navigate,
        chart,
        query,
        setQuery,
        tipoFilter,
        setTipoFilter,
        estadoFilter,
        setEstadoFilter,
        setPage,
        baucheItem,
        setBaucheItem,
        pending,
        setPending,
        abiertas,
        setAbiertas,
        KPIS,
        filtered,
        totalPages,
        currentPage,
        paged,
        applyAction,
        COLS,
        HEADERS,
        AREAS,
        TIPO_META,
        ESTADO_META,
        INSCRIPCION_FEE,
        activas,
        total,
    } = useDirInscripciones();

    return (
        <div className="flex flex-col gap-5">
            {/* Encabezado */}
            <div className="flex justify-between items-center flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: accent.amber.bg }}>
                        <UserPlus style={{ width: 22, height: 22, color: accent.amber.fg }} />
                    </div>
                    <div>
                        <h2 className="m-0 text-edu-ink font-bold text-[1.15rem]">Inscripciones</h2>
                        <p className="m-0 text-edu-ink-500 text-[0.8125rem]">Gestión de inscripciones y validación de pagos · Período 2026-2027</p>
                    </div>
                </div>
            </div>

            {/* Banner superior: estado del período + solicitudes activas + valor */}
            <PeriodBanner
                abiertas={abiertas}
                setAbiertas={setAbiertas}
                activas={activas}
                total={total}
                INSCRIPCION_FEE={INSCRIPCION_FEE}
            />

            {/* Area chart + KPIs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
                <InscripcionesChartCard chart={chart} AREAS={AREAS} />
                <KpiColumn KPIS={KPIS} />
            </div>

            {/* Tabla */}
            <InscripcionesTable
                filtered={filtered}
                paged={paged}
                query={query}
                setQuery={setQuery}
                tipoFilter={tipoFilter}
                setTipoFilter={setTipoFilter}
                estadoFilter={estadoFilter}
                setEstadoFilter={setEstadoFilter}
                setPage={setPage}
                currentPage={currentPage}
                totalPages={totalPages}
                navigate={navigate}
                setBaucheItem={setBaucheItem}
                COLS={COLS}
                HEADERS={HEADERS}
                TIPO_META={TIPO_META}
                ESTADO_META={ESTADO_META}
            />

            {/* Modal bauche (aceptar / rechazar) */}
            {baucheItem && (
                <BaucheModal
                    rep={`${baucheItem.repNombre} ${baucheItem.repApellido}`}
                    student={`${baucheItem.estNombre} ${baucheItem.estApellido}`}
                    amount={baucheItem.monto}
                    method={baucheItem.metodo}
                    reference={baucheItem.bauche}
                    date={baucheItem.fechaPago}
                    showOptions={baucheItem.estado === "revision"}
                    onClose={() => setBaucheItem(null)}
                    onAccept={() => setPending({ id: baucheItem.id, action: "aceptar" })}
                    onReject={() => setPending({ id: baucheItem.id, action: "rechazar" })}
                />
            )}

            {/* Confirmación de la acción */}
            {pending && (
                <ConfirmDialog
                    title={pending.action === "aceptar" ? "¿Confirmar el pago de esta inscripción?" : "¿Rechazar esta inscripción?"}
                    message={
                        pending.action === "aceptar"
                            ? "La inscripción quedará aceptada y el representante será notificado."
                            : "La inscripción será rechazada. Esta acción puede revertirse."
                    }
                    confirmLabel={pending.action === "aceptar" ? "Sí, aceptar" : "Sí, rechazar"}
                    tone={pending.action === "aceptar" ? "success" : "danger"}
                    icon={pending.action === "aceptar" ? CheckCircle2 : XCircle}
                    onConfirm={() => applyAction(pending.id, pending.action)}
                    onCancel={() => setPending(null)}
                />
            )}
        </div>
    );
}
