import { useCoordPlanificaciones } from "./functions/useCoordPlanificaciones";
import { PlanificacionesKpis } from "./ui/PlanificacionesKpis";
import { PlanificacionesTable } from "./ui/PlanificacionesTable";
import { RechazoModal } from "./modals/RechazoModal";

export function CoordPlanificacionesPage() {
    const {
        planes,
        modal,
        setModal,
        observacion,
        setObservacion,
        kpis,
        aprobar,
        abrirRechazo,
        confirmarRechazo,
        ESTADO_META,
        COLS,
        HEADERS,
    } = useCoordPlanificaciones();

    return (
        <div className="flex flex-col gap-5">
            <PlanificacionesKpis kpis={kpis} />

            <PlanificacionesTable
                planes={planes}
                COLS={COLS}
                HEADERS={HEADERS}
                ESTADO_META={ESTADO_META}
                aprobar={aprobar}
                abrirRechazo={abrirRechazo}
            />

            {modal && (
                <RechazoModal
                    modal={modal}
                    observacion={observacion}
                    setObservacion={setObservacion}
                    onSubmit={confirmarRechazo}
                    onClose={() => setModal(null)}
                />
            )}
        </div>
    );
}
