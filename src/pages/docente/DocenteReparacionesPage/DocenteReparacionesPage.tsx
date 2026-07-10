import { useDocenteReparaciones } from "./functions/useDocenteReparaciones";
import { FeedbackBanner } from "./ui/FeedbackBanner";
import { ReparacionesBlocks } from "./ui/ReparacionesBlocks";
import { ReparacionesTable } from "./ui/ReparacionesTable";

export function DocenteReparacionesPage() {
    const {
        feedback,
        setFeedback,
        query,
        setQuery,
        page,
        setPage,
        loading,
        BLOCKS,
        filtered,
        paged,
        totalPages,
        currentPage,
    } = useDocenteReparaciones();

    if (loading) return <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">Cargando…</div>;

    return (
        <div className="flex flex-col gap-5">
            {/* Confirmación */}
            <FeedbackBanner feedback={feedback} onClose={() => setFeedback(null)} />

            {/* Encabezado */}
            {/* <div>
                <h2 className="m-0 text-edu-ink font-bold text-[1.35rem]">Reparaciones</h2>
                <p className="text-edu-ink-500 text-sm mt-1 m-0">
                    Materias reprobadas: crea y gestiona sus evaluaciones de recuperación
                </p>
            </div> */}

            {/* Bloques */}
            <ReparacionesBlocks BLOCKS={BLOCKS} />

            {/* Tabla */}
            <ReparacionesTable
                filtered={filtered}
                paged={paged}
                query={query}
                setQuery={setQuery}
                setPage={setPage}
                totalPages={totalPages}
                currentPage={currentPage}
            />
        </div>
    );
}
