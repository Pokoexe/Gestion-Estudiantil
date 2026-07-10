import { PlusCircle, XCircle, CheckCircle2 } from "lucide-react";
import { accent } from "@themes/tokens";
import { ConfirmDialog } from "@shared/ui/ConfirmDialog";
import { useCoordActividades } from "./functions/useCoordActividades";
import { AgendaTable } from "./ui/AgendaTable";
import { ActividadDetalle } from "./ui/ActividadDetalle";
import { CrearActividadModal } from "./modals/CrearActividadModal";

export function CoordActividadesPage() {
    const {
        DOCENTES,
        showModal,
        setShowModal,
        form,
        setForm,
        selectedId,
        setSelectedId,
        reunionesQuery,
        setReunionesQuery,
        reunionesPage,
        setReunionesPage,
        confirmPost,
        setConfirmPost,
        confirmAgenda,
        setConfirmAgenda,
        filteredReuniones,
        filteredCount,
        totalPages,
        currentPage,
        paged,
        selected,
        asignarDocente,
        revisarPostulado,
        aplicarAgenda,
        openModal,
        handleSubmit,
        COLS,
        HEADERS,
        ESTADO_META,
    } = useCoordActividades();

    return (
        <div className="flex flex-col gap-5">
            <button onClick={openModal} className="w-full justify-center inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold cursor-pointer border-none text-white" style={{ backgroundColor: accent.purple.fg }}>
                <PlusCircle style={{ width: 16, height: 16 }} />
                Crear actividad
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                {/* Tabla de actividades (maestro) */}
                <AgendaTable
                    filteredCount={filteredCount}
                    reunionesQuery={reunionesQuery}
                    setReunionesQuery={setReunionesQuery}
                    setReunionesPage={setReunionesPage}
                    COLS={COLS}
                    HEADERS={HEADERS}
                    ESTADO_META={ESTADO_META}
                    paged={paged}
                    filteredReuniones={filteredReuniones}
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                    setConfirmAgenda={setConfirmAgenda}
                    currentPage={currentPage}
                    totalPages={totalPages}
                />

                {/* Detalle de la actividad seleccionada (esclavo) */}
                {selected ? (
                    <ActividadDetalle
                        selected={selected}
                        DOCENTES={DOCENTES}
                        ESTADO_META={ESTADO_META}
                        asignarDocente={asignarDocente}
                        setConfirmPost={setConfirmPost}
                    />
                ) : (
                    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-10 text-center text-edu-ink-400 text-sm">
                        Selecciona una actividad de la tabla para ver su detalle.
                    </div>
                )}
            </div>

            {/* Modal crear actividad */}
            {showModal && (
                <CrearActividadModal
                    form={form}
                    setForm={setForm}
                    DOCENTES={DOCENTES}
                    onSubmit={handleSubmit}
                    onClose={() => setShowModal(false)}
                />
            )}

            {/* Confirmación: aprobar / rechazar postulado */}
            {confirmPost && (
                <ConfirmDialog
                    title={confirmPost.estado === "Aprobado" ? "Aprobar postulación" : "Rechazar postulación"}
                    message={
                        <>
                            ¿Confirmas {confirmPost.estado === "Aprobado" ? "la aprobación" : "el rechazo"} de la postulación de{" "}
                            <span className="font-semibold text-edu-ink">{confirmPost.nombre}</span>?
                        </>
                    }
                    confirmLabel={confirmPost.estado === "Aprobado" ? "Aprobar" : "Rechazar"}
                    tone={confirmPost.estado === "Aprobado" ? "success" : "danger"}
                    icon={confirmPost.estado === "Aprobado" ? CheckCircle2 : XCircle}
                    onConfirm={() => {
                        revisarPostulado(confirmPost.rowId, confirmPost.postId, confirmPost.estado);
                        setConfirmPost(null);
                    }}
                    onCancel={() => setConfirmPost(null)}
                />
            )}

            {/* Confirmación: aprobar / rechazar ítem de agenda */}
            {confirmAgenda && (
                <ConfirmDialog
                    title={confirmAgenda.nuevoEstado === "Aprobado" ? "Aprobar actividad" : "Rechazar actividad"}
                    message={
                        <>
                            ¿Confirmas {confirmAgenda.nuevoEstado === "Aprobado" ? "la aprobación" : "el rechazo"} de esta actividad de la agenda?
                        </>
                    }
                    confirmLabel={confirmAgenda.nuevoEstado === "Aprobado" ? "Aprobar" : "Rechazar"}
                    tone={confirmAgenda.nuevoEstado === "Aprobado" ? "success" : "danger"}
                    icon={confirmAgenda.nuevoEstado === "Aprobado" ? CheckCircle2 : XCircle}
                    onConfirm={() => {
                        aplicarAgenda(confirmAgenda.id, confirmAgenda.nuevoEstado);
                        setConfirmAgenda(null);
                    }}
                    onCancel={() => setConfirmAgenda(null)}
                />
            )}
        </div>
    );
}
