import { useEvalBoletines } from "./functions/useEvalBoletines";
import { FeedbackBanner } from "./ui/FeedbackBanner";
import { VistaTabs } from "./ui/VistaTabs";
import { KpiRow } from "./ui/KpiRow";
import { BoletinesTable } from "./ui/BoletinesTable";
import { SabanaSeccionTable } from "./ui/SabanaSeccionTable";
import { BoletinDetalleModal } from "./modals/BoletinDetalleModal";

export function EvalBoletinesPage() {
  const {
    query,
    setQuery,
    selAnio,
    setSelAnio,
    selSeccion,
    setSelSeccion,
    selMateria,
    setSelMateria,
    setPage,
    selected,
    setSelected,
    feedback,
    setFeedback,
    vista,
    setVista,
    BOLETINES,
    ANIOS,
    SECCIONES,
    MATERIAS,
    GRUPOS,
    recibidosGlobal,
    promGlobal,
    porSelects,
    filtradas,
    totalPages,
    currentPage,
    paged,
    KPIS,
    selectedId,
    descargar,
    descargarTodos,
    descargarGrupo,
  } = useEvalBoletines();

  return (
    <div className="flex flex-col gap-5">
      {feedback && (
        <FeedbackBanner message={feedback} onClose={() => setFeedback(null)} />
      )}

      <VistaTabs vista={vista} onVista={setVista} />

      {vista === "estudiante" && (
        <>
          <KpiRow kpis={KPIS} />
          <BoletinesTable
            paged={paged}
            filtradas={filtradas}
            totalPages={totalPages}
            currentPage={currentPage}
            selectedId={selectedId}
            query={query}
            selAnio={selAnio}
            selSeccion={selSeccion}
            selMateria={selMateria}
            ANIOS={ANIOS}
            SECCIONES={SECCIONES}
            MATERIAS={MATERIAS}
            porSelectsLength={porSelects.length}
            onQuery={(q) => { setQuery(q); setPage(1); }}
            onAnio={(a) => { setSelAnio(a); setPage(1); }}
            onSeccion={(s) => { setSelSeccion(s); setPage(1); }}
            onMateria={(m) => { setSelMateria(m); setPage(1); }}
            onPageChange={setPage}
            onDescargar={descargar}
            onDescargarTodos={descargarTodos}
            onSelect={setSelected}
          />
        </>
      )}

      {vista === "seccion" && (
        <SabanaSeccionTable
          grupos={GRUPOS}
          totalBoletines={BOLETINES.length}
          recibidosGlobal={recibidosGlobal}
          promGlobal={promGlobal}
          onDescargarGrupo={descargarGrupo}
        />
      )}

      {selected && (
        <BoletinDetalleModal
          selected={selected}
          selectedId={selectedId}
          MATERIAS={MATERIAS}
          onClose={() => setSelected(null)}
          onDescargar={descargar}
        />
      )}
    </div>
  );
}
