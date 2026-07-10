import { useLapsos } from "./functions/useLapsos";
import { CurrentLapsoCard } from "./ui/CurrentLapsoCard";
import { LapsosTable } from "./ui/LapsosTable";
import { EditCierreModal } from "./modals/EditCierreModal";
import { NuevoLapsoModal } from "./modals/NuevoLapsoModal";

export function LapsosPage() {
  const {
    lapsos,
    editTarget,
    setEditTarget,
    editInicio,
    setEditInicio,
    editCierre,
    setEditCierre,
    showNuevo,
    setShowNuevo,
    nuevoForm,
    setNuevoForm,
    setPage,
    current,
    progreso,
    totalPages,
    currentPage,
    paged,
    openEdit,
    guardarCierre,
    agregarLapso,
    TODAY,
    COLS,
    HEADERS,
    fmtFecha,
  } = useLapsos();

  return (
    <div className="flex flex-col gap-5">
      <CurrentLapsoCard
        current={current}
        progreso={progreso}
        onEdit={openEdit}
        onNuevo={() => setShowNuevo(true)}
        fmtFecha={fmtFecha}
        TODAY={TODAY}
      />

      <LapsosTable
        lapsos={lapsos}
        paged={paged}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setPage}
        onEdit={openEdit}
        fmtFecha={fmtFecha}
        COLS={COLS}
        HEADERS={HEADERS}
      />

      {editTarget !== null && (
        <EditCierreModal
          editTarget={editTarget}
          lapsos={lapsos}
          editInicio={editInicio}
          setEditInicio={setEditInicio}
          editCierre={editCierre}
          setEditCierre={setEditCierre}
          guardarCierre={guardarCierre}
          setEditTarget={setEditTarget}
        />
      )}

      {showNuevo && (
        <NuevoLapsoModal
          nuevoForm={nuevoForm}
          setNuevoForm={setNuevoForm}
          agregarLapso={agregarLapso}
          setShowNuevo={setShowNuevo}
        />
      )}
    </div>
  );
}
