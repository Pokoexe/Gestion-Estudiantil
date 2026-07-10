import { useCalificaciones } from "./functions/useCalificaciones";
import { KpiCards } from "./ui/KpiCards";
import { GradesTable } from "./ui/GradesTable";
import { GradeDetailModal } from "./modals/GradeDetailModal";

export function CalificacionPage() {
    const {
        selected, setSelected,
        query, setQuery,
        subjectFilter, setSubjectFilter,
        statusFilter, setStatusFilter,
        setPage,
        done, average,
        subjects,
        filtered, paged, totalPages, currentPage,
    } = useCalificaciones();

    return (
        <>
            {/* Bloques resumen */}
            <KpiCards done={done} average={average} />

            {/* Tabla de evaluaciones */}
            <GradesTable
                filtered={filtered}
                paged={paged}
                query={query}
                setQuery={setQuery}
                subjectFilter={subjectFilter}
                setSubjectFilter={setSubjectFilter}
                subjects={subjects}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                currentPage={currentPage}
                totalPages={totalPages}
                setPage={setPage}
                onSelect={setSelected}
            />

            {/* Modal con el detalle de la evaluación */}
            {selected && (
                <GradeDetailModal selected={selected} onClose={() => setSelected(null)} />
            )}
        </>
    );
}
