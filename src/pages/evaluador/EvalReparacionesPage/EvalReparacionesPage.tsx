import { useEvalReparaciones } from "./functions/useEvalReparaciones";
import { KpiStack } from "./ui/KpiStack";
import { MateriasReprobadasDonut } from "./ui/MateriasReprobadasDonut";
import { EstudiantesTable } from "./ui/EstudiantesTable";
import { EstudianteDetalleModal } from "./modals/EstudianteDetalleModal";

export function EvalReparacionesPage() {
  const {
    query,
    setQuery,
    page,
    setPage,
    selected,
    setSelected,
    loading,
    pendienteCount,
    totalReprobadas,
    DONUT_DATA,
    rows,
    totalPages,
    currentPage,
    paged,
  } = useEvalReparaciones();

  if (loading) {
    return (
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">
        Cargando…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        <KpiStack pendienteCount={pendienteCount} totalReprobadas={totalReprobadas} />
        <MateriasReprobadasDonut donutData={DONUT_DATA} />
      </div>
      <EstudiantesTable
        rows={rows}
        paged={paged}
        totalPages={totalPages}
        currentPage={currentPage}
        query={query}
        onQuery={(q) => { setQuery(q); setPage(1); }}
        onPage={setPage}
        onSelect={setSelected}
      />
      {selected && (
        <EstudianteDetalleModal selected={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
