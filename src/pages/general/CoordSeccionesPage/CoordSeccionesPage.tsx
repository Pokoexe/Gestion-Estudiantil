import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@shared/ui/ConfirmDialog";
import { useCoordSecciones } from "./functions/useCoordSecciones";
import { SeccionesTabs } from "./ui/SeccionesTabs";
import { SeccionesTab } from "./ui/SeccionesTab";
import { MateriasTab } from "./ui/MateriasTab";
import { HorariosTab } from "./ui/HorariosTab";
import { SeccionModal } from "./modals/SeccionModal";
import { MateriaModal } from "./modals/MateriaModal";

export function CoordSeccionesPage() {
    const {
        tab, setTab,
        secModal, setSecModal, confirmDelSec, setConfirmDelSec,
        secQuery, setSecQuery, secPage, setSecPage,
        matModal, setMatModal, confirmDelMat, setConfirmDelMat,
        matQuery, setMatQuery, matPage, setMatPage,
        bloques, nuevoBloque, setNuevoBloque, asignaciones,
        filteredSec, secTotalPages, secCurrentPage, secPaged,
        filteredMat, matTotalPages, matCurrentPage, matPaged,
        openAddSec, openEditSec, guardarSeccion, eliminarSeccion,
        openAddMat, openEditMat, guardarMateria, eliminarMateria,
        agregarBloque, eliminarBloque, setAsignacion,
        DOCENTES,
        NIVELES, NIVEL_META, DIAS, ANIOS,
        SEC_COLS, SEC_HEADERS, MAT_COLS, MAT_HEADERS, TABS,
    } = useCoordSecciones();

    return (
        <div className="flex flex-col gap-5">
            {/* Pestañas */}
            <SeccionesTabs tab={tab} setTab={setTab} TABS={TABS} />

            {/* --- Tab Secciones --- */}
            {tab === "secciones" && (
                <SeccionesTab
                    filteredSec={filteredSec}
                    secPaged={secPaged}
                    secQuery={secQuery}
                    setSecQuery={setSecQuery}
                    setSecPage={setSecPage}
                    secCurrentPage={secCurrentPage}
                    secTotalPages={secTotalPages}
                    SEC_COLS={SEC_COLS}
                    SEC_HEADERS={SEC_HEADERS}
                    openAddSec={openAddSec}
                    openEditSec={openEditSec}
                    setConfirmDelSec={setConfirmDelSec}
                />
            )}

            {/* --- Tab Materias --- */}
            {tab === "materias" && (
                <MateriasTab
                    filteredMat={filteredMat}
                    matPaged={matPaged}
                    matQuery={matQuery}
                    setMatQuery={setMatQuery}
                    setMatPage={setMatPage}
                    matCurrentPage={matCurrentPage}
                    matTotalPages={matTotalPages}
                    MAT_COLS={MAT_COLS}
                    MAT_HEADERS={MAT_HEADERS}
                    NIVEL_META={NIVEL_META}
                    PER_PAGE={5}
                    openAddMat={openAddMat}
                    openEditMat={openEditMat}
                    setConfirmDelMat={setConfirmDelMat}
                />
            )}

            {/* --- Tab Formato de horarios --- */}
            {tab === "horarios" && (
                <HorariosTab
                    bloques={bloques}
                    nuevoBloque={nuevoBloque}
                    setNuevoBloque={setNuevoBloque}
                    asignaciones={asignaciones}
                    DIAS={DIAS}
                    DOCENTES={DOCENTES}
                    agregarBloque={agregarBloque}
                    eliminarBloque={eliminarBloque}
                    setAsignacion={setAsignacion}
                />
            )}

            {/* Modal agregar / modificar sección */}
            {secModal && (
                <SeccionModal
                    secModal={secModal}
                    anios={ANIOS}
                    DOCENTES={DOCENTES}
                    onSubmit={guardarSeccion}
                    onClose={() => setSecModal(null)}
                    onChange={setSecModal}
                />
            )}

            {/* Confirmación de eliminación de sección */}
            {confirmDelSec && (
                <ConfirmDialog
                    tone="danger"
                    icon={Trash2}
                    title="Eliminar sección"
                    message={<>¿Seguro que deseas eliminar la sección <strong>{confirmDelSec.anio} · {confirmDelSec.seccion}</strong>? Esta acción no se puede deshacer.</>}
                    confirmLabel="Sí, eliminar"
                    onConfirm={eliminarSeccion}
                    onCancel={() => setConfirmDelSec(null)}
                />
            )}

            {/* Modal agregar / modificar materia */}
            {matModal && (
                <MateriaModal
                    matModal={matModal}
                    niveles={NIVELES}
                    onSubmit={guardarMateria}
                    onClose={() => setMatModal(null)}
                    onChange={setMatModal}
                />
            )}

            {/* Confirmación de eliminación de materia */}
            {confirmDelMat && (
                <ConfirmDialog
                    tone="danger"
                    icon={Trash2}
                    title="Eliminar materia"
                    message={<>¿Seguro que deseas eliminar la materia <strong>{confirmDelMat.nombre}</strong>? Esta acción no se puede deshacer.</>}
                    confirmLabel="Sí, eliminar"
                    onConfirm={eliminarMateria}
                    onCancel={() => setConfirmDelMat(null)}
                />
            )}
        </div>
    );
}
