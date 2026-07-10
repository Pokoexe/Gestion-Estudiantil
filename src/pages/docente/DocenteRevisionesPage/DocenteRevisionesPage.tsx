import { useDocenteRevisiones, TYPE_META } from "./functions/useDocenteRevisiones";
import { RevisionesKpis } from "./ui/RevisionesKpis";
import { RevisionesCard } from "./ui/RevisionesCard";
import { RevisionModal } from "./modals/RevisionModal";

export function DocenteRevisionesPage() {
    const {
        tab,
        query,
        estadoFilter,
        page,
        selected,
        changeFile,
        countOf,
        filtered,
        totalPages,
        currentPage,
        paged,
        KPIS,
        openItem,
        onChangeFile,
        enviarCambio,
        irAEditar,
        setTab,
        setQuery,
        setEstadoFilter,
        setPage,
        setSelected,
    } = useDocenteRevisiones();

    return (
        <div className="flex flex-col gap-5">
            {/* Bloques por categoría (cantidad que hay) */}
            <RevisionesKpis KPIS={KPIS} countOf={countOf} />

            {/* Tarjeta con tabs + tabla */}
            <RevisionesCard
                tab={tab}
                setTab={setTab}
                query={query}
                setQuery={setQuery}
                estadoFilter={estadoFilter}
                setEstadoFilter={setEstadoFilter}
                setPage={setPage}
                filtered={filtered}
                paged={paged}
                totalPages={totalPages}
                currentPage={currentPage}
                openItem={openItem}
            />

            {/* Modal de detalle / acción de la revisión */}
            {selected && (
                <RevisionModal
                    selected={selected}
                    changeFile={changeFile}
                    onChangeFile={onChangeFile}
                    onEnviar={enviarCambio}
                    onEditar={irAEditar}
                    onClose={() => setSelected(null)}
                    TYPE_META={TYPE_META}
                />
            )}
        </div>
    );
}
