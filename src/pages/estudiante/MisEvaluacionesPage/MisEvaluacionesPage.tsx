import { useMisEvaluaciones } from "./functions/useMisEvaluaciones";
import { SummaryCards } from "./ui/SummaryCards";
import { EvaluacionesTable } from "./ui/EvaluacionesTable";
import { EvaluacionModal } from "./modals/EvaluacionModal";

export function MisEvaluacionesPage() {
    const {
        selected, setSelected,
        query, setQuery,
        subjectFilter, setSubjectFilter,
        order, setOrder,
        setPage,
        lapsoEvals, thisWeek, nearest, mostImportant, subjects,
        filtered, paged, totalPages, currentPage,
    } = useMisEvaluaciones();

    return (
        <>
            <SummaryCards
                lapsoEvals={lapsoEvals}
                thisWeek={thisWeek}
                nearest={nearest}
                mostImportant={mostImportant}
                onSelect={setSelected}
            />
            <EvaluacionesTable
                filtered={filtered}
                paged={paged}
                query={query}
                setQuery={setQuery}
                subjectFilter={subjectFilter}
                setSubjectFilter={setSubjectFilter}
                order={order}
                setOrder={setOrder}
                subjects={subjects}
                currentPage={currentPage}
                totalPages={totalPages}
                setPage={setPage}
                onSelect={setSelected}
            />
            {selected && (
                <EvaluacionModal selected={selected} onClose={() => setSelected(null)} />
            )}
        </>
    );
}
