import { Plus } from "lucide-react";
import { color } from "@themes/tokens";
import { Pagination } from "@shared/ui/Pagination";
import { useDirActividades } from "./functions/useDirActividades";
import { ActividadesFilters } from "./ui/ActividadesFilters";
import { ActividadCard } from "./ui/ActividadCard";
import { EmptyState } from "./ui/EmptyState";
import { CrearActividadModal } from "./modals/CrearActividadModal";

export function DirActividadesPage() {
  const {
    filter,
    setFilter,
    query,
    setQuery,
    page,
    setPage,
    showModal,
    setShowModal,
    form,
    setForm,
    filtered,
    paged,
    currentPage,
    totalPages,
    accept,
    remove,
    create,
    TYPE_META,
    FILTERS,
  } = useDirActividades();

  return (
    <div className="flex flex-col gap-5">
      {/* Encabezado de sección */}
      <div className="flex justify-between items-end flex-wrap gap-3">
        <div>
          <h2 className="m-0 text-edu-ink font-bold text-xl">Cursos y actividades extracurriculares</h2>
          <p className="m-0 mt-1 text-edu-ink-400 text-[0.85rem]">
            Inscripciones, cupos y aprobación de nuevas actividades · Período 2026-I
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold text-white border-none cursor-pointer transition-colors hover:opacity-90"
          style={{ backgroundColor: color.warning }}
        >
          <Plus className="w-4 h-4" /> Crear actividad
        </button>
      </div>

      {/* Buscador + filtro por tipo */}
      <ActividadesFilters
        query={query}
        setQuery={setQuery}
        filter={filter}
        setFilter={setFilter}
        setPage={setPage}
        filters={FILTERS}
        filteredCount={filtered.length}
      />

      {/* Tarjetas de actividades */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paged.map((a) => (
          <ActividadCard
            key={a.id}
            a={a}
            meta={TYPE_META[a.type]}
            accept={accept}
            remove={remove}
          />
        ))}
      </div>

      {filtered.length === 0 && <EmptyState />}

      {totalPages > 1 && (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-4">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      {showModal && (
        <CrearActividadModal
          form={form}
          setForm={setForm}
          onSubmit={create}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
