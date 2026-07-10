import { XCircle } from "lucide-react";
import { ConfirmDialog } from "@shared/ui/ConfirmDialog";
import { useDocentePostulaciones } from "./functions/useDocentePostulaciones";
import { PostulacionesKpis } from "./ui/PostulacionesKpis";
import { ActividadesTable } from "./ui/ActividadesTable";
import { ActividadDetalleModal } from "./modals/ActividadDetalleModal";
import { PostularModal } from "./modals/PostularModal";

export function DocentePostulacionesPage() {
    const {
        loading,
        query,
        setQuery,
        page,
        setPage,
        filtered,
        totalPages,
        currentPage,
        paged,
        selectedAct,
        selectedMeta,
        selectedAprobados,
        cupoLleno,
        openDetalle,
        closeDetalle,
        showPostular,
        setShowPostular,
        estudianteId,
        setEstudianteId,
        disponibles,
        abrirPostular,
        confirmarPostulacion,
        modalQuery,
        setModalQuery,
        modalPage,
        setModalPage,
        filteredPostulados,
        modalTotalPages,
        modalCurrentPage,
        pagedPostulados,
        confirmRemove,
        setConfirmRemove,
        confirmarEliminar,
        KPIS,
    } = useDocentePostulaciones();

    if (loading) return <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">Cargando…</div>;

    return (
        <div className="flex flex-col gap-5">
            {/* Encabezado */}
            {/* <div>
                <h2 className="m-0 text-edu-ink font-bold text-[1.35rem]">Mis Postulaciones</h2>
                <p className="m-0 text-edu-ink-500 text-sm mt-1">
                    Actividades asignadas y estudiantes postulados para participar en ellas
                </p>
            </div> */}

            {/* KPIs */}
            <PostulacionesKpis KPIS={KPIS} />

            {/* Tabla de actividades */}
            <ActividadesTable
                filtered={filtered}
                paged={paged}
                currentPage={currentPage}
                totalPages={totalPages}
                query={query}
                setQuery={setQuery}
                setPage={setPage}
                openDetalle={openDetalle}
                abrirPostular={abrirPostular}
            />

            {/* ── Modal: detalle de actividad ── */}
            {selectedAct && selectedMeta && (
                <ActividadDetalleModal
                    selectedAct={selectedAct}
                    selectedMeta={selectedMeta}
                    selectedAprobados={selectedAprobados}
                    cupoLleno={cupoLleno}
                    modalQuery={modalQuery}
                    setModalQuery={setModalQuery}
                    modalPage={modalPage}
                    setModalPage={setModalPage}
                    filteredPostulados={filteredPostulados}
                    modalTotalPages={modalTotalPages}
                    modalCurrentPage={modalCurrentPage}
                    pagedPostulados={pagedPostulados}
                    setConfirmRemove={setConfirmRemove}
                    closeDetalle={closeDetalle}
                />
            )}

            {/* ── Modal: postular estudiante ── */}
            {showPostular && selectedAct && selectedMeta && (
                <PostularModal
                    selectedAct={selectedAct}
                    selectedMeta={selectedMeta}
                    disponibles={disponibles}
                    estudianteId={estudianteId}
                    setEstudianteId={setEstudianteId}
                    setShowPostular={setShowPostular}
                    confirmarPostulacion={confirmarPostulacion}
                />
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
