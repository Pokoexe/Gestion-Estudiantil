import { useDocenteConcejo } from "./functions/useDocenteConcejo";
import { DiscusionActivaBanner } from "./ui/DiscusionActivaBanner";
import { HistorialCard } from "./ui/HistorialCard";

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function DocenteConcejoPage() {
    const {
        navigate,
        loading,
        query,
        setQuery,
        setPage,
        activa,
        historial,
        filtrado,
        totalPages,
        currentPage,
        paged,
    } = useDocenteConcejo();

    if (loading) return <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">Cargando…</div>;

    return (
        <div className="flex flex-col gap-5">
            {/* Encabezado */}
            {/* <div>
                <h2 className="m-0 text-edu-ink font-bold text-[1.35rem]">Concejo de Profesores</h2>
                <p className="text-edu-ink-500 text-sm mt-1 m-0">
                    Acepta o rechaza las discusiones de notas de los estudiantes postulados por el evaluador
                </p>
            </div> */}

            {activa && (
                <DiscusionActivaBanner
                    activa={activa}
                    onNavigate={(id) => navigate(`/docente/concejo/${id}`)}
                />
            )}

            <HistorialCard
                query={query}
                setQuery={setQuery}
                setPage={setPage}
                filtrado={filtrado}
                historial={historial}
                paged={paged}
                totalPages={totalPages}
                currentPage={currentPage}
            />
        </div>
    );
}
