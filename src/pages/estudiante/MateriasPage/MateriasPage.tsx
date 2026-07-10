import { useMaterias } from "./functions/useMaterias";
import { StatsCards } from "./ui/StatsCards";
import { FailingSubjectsTable } from "./ui/FailingSubjectsTable";
import { AllSubjectsTable } from "./ui/AllSubjectsTable";

export function MateriasPage() {
    const {
        query, setQuery,
        setPage,
        loading,
        best, worst, failing,
        filteredSubjects, pagedSubjects, totalPages, currentPage,
        goToSubject,
    } = useMaterias();

    if (loading) {
        return (
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">
                Cargando materias…
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                <StatsCards best={best} worst={worst} goToSubject={goToSubject} />

                {/* Materias reprobadas*/}
                <FailingSubjectsTable failing={failing} goToSubject={goToSubject} />

            </div>

            {/* Todas las materias */}
            <AllSubjectsTable
                filteredSubjects={filteredSubjects}
                pagedSubjects={pagedSubjects}
                query={query}
                setQuery={setQuery}
                currentPage={currentPage}
                totalPages={totalPages}
                setPage={setPage}
                goToSubject={goToSubject}
            />
        </>
    );
}
