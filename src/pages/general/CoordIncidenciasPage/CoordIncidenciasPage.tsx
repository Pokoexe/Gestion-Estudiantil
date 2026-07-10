import { PlusCircle } from "lucide-react";
import { accent } from "@themes/tokens";
import { useCoordIncidencias } from "./functions/useCoordIncidencias";
import { FiltroTipoTabs } from "./ui/FiltroTipoTabs";
import { FormatoIncidencias } from "./ui/FormatoIncidencias";
import { IncidenciasTable } from "./ui/IncidenciasTable";
import { RegistrarIncidenciaModal } from "./modals/RegistrarIncidenciaModal";

export function CoordIncidenciasPage() {
    const {
        camposFormato,
        filtro,
        setFiltro,
        query,
        setQuery,
        page,
        setPage,
        showModal,
        setShowModal,
        form,
        setForm,
        visibles,
        totalPages,
        currentPage,
        paged,
        openModal,
        handleSubmit,
        GRAVEDAD_META,
        GRAVEDADES,
        COLS,
        HEADERS,
    } = useCoordIncidencias();

    return (
        <div className="flex flex-col gap-5">
            <FiltroTipoTabs filtro={filtro} setFiltro={setFiltro} setPage={setPage} />

            <button onClick={openModal} className="w-full justify-center inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold cursor-pointer border-none text-white" style={{ backgroundColor: accent.purple.fg }}>
                <PlusCircle style={{ width: 16, height: 16 }} />
                Registrar incidencia
            </button>

            {filtro === "Formato" ? (
                <FormatoIncidencias camposFormato={camposFormato} />
            ) : (
                <IncidenciasTable
                    visibles={visibles}
                    paged={paged}
                    query={query}
                    setQuery={setQuery}
                    setPage={setPage}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    COLS={COLS}
                    HEADERS={HEADERS}
                    GRAVEDAD_META={GRAVEDAD_META}
                />
            )}

            {showModal && (
                <RegistrarIncidenciaModal
                    form={form}
                    setForm={setForm}
                    gravedades={GRAVEDADES}
                    onSubmit={handleSubmit}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}
