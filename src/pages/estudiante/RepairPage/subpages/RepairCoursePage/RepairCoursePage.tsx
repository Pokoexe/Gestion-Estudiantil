import { useRepairCourse } from "./functions/useRepairCourse";
import { StageTabs } from "./ui/StageTabs";
import { StageOverview } from "./ui/StageOverview";
import { EvaluationPlan } from "./ui/EvaluationPlan";

export function RepairCoursePage() {
    const {
        subject, loading,
        activeIdx, setActiveIdx,
        filter, setFilter,
        page, setPage, pageCount, setPaused, go,
        theme, glass,
        itemsPerPage,
        etapa, pendingCount, gradedCount, firstPending, filteredAssignments,
    } = useRepairCourse();

    if (loading) {
        return (
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">
                Cargando reparación…
            </div>
        );
    }

    if (!subject || !etapa) {
        return (
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">
                No se encontró la materia en reparación.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5">
            {/* Pestañas de etapa */}
            <StageTabs
                subject={subject}
                activeIdx={activeIdx}
                setActiveIdx={setActiveIdx}
                page={page}
                setPage={setPage}
                pageCount={pageCount}
                setPaused={setPaused}
                go={go}
                theme={theme}
                glass={glass}
                itemsPerPage={itemsPerPage}
            />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                <StageOverview
                    subject={subject}
                    etapa={etapa}
                    pendingCount={pendingCount}
                    gradedCount={gradedCount}
                />

                {/* Plan de evaluación de la etapa */}
                <EvaluationPlan
                    etapa={etapa}
                    filteredAssignments={filteredAssignments}
                    firstPending={firstPending}
                    filter={filter}
                    setFilter={setFilter}
                    activeIdx={activeIdx}
                />
            </div>
        </div>
    );
}
