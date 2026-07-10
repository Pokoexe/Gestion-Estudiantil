import { useEvalCronograma } from "./functions/useEvalCronograma";
import { KpiRow } from "./ui/KpiRow";
import { CronogramaCard } from "./ui/CronogramaCard";
import { CalendarioTable } from "./ui/CalendarioTable";
import { ModificarCronogramaModal } from "./modals/ModificarCronogramaModal";

export function EvalCronogramaPage() {
  const {
    lapso,
    showEdit,
    setShowEdit,
    form,
    setForm,
    query,
    setQuery,
    estadoFilter,
    setEstadoFilter,
    page,
    setPage,
    progreso,
    KPIS,
    filtradas,
    totalPages,
    currentPage,
    paged,
    openEdit,
    guardar,
  } = useEvalCronograma();

  return (
    <div className="flex flex-col gap-5">
      <KpiRow kpis={KPIS} />
      <CronogramaCard lapso={lapso} progreso={progreso} onModificar={openEdit} />
      <CalendarioTable
        paged={paged}
        filtradas={filtradas}
        totalPages={totalPages}
        currentPage={currentPage}
        query={query}
        estadoFilter={estadoFilter}
        onQuery={(q) => { setQuery(q); setPage(1); }}
        onEstado={(e) => { setEstadoFilter(e); setPage(1); }}
        onPageChange={setPage}
      />
      {showEdit && (
        <ModificarCronogramaModal
          form={form}
          onFormChange={setForm}
          onClose={() => setShowEdit(false)}
          onSubmit={guardar}
        />
      )}
    </div>
  );
}
