import { PlusCircle } from "lucide-react";
import { PlanStats } from "@shared/ui/PlanStats";
import { useDocentePlanes } from "./functions/useDocentePlanes";
import { FeedbackBanner } from "./ui/FeedbackBanner";
import { PlanesTable } from "./ui/PlanesTable";
import { PlanReviewModal } from "./modals/PlanReviewModal";

export function DocentePlanesPage() {
    const {
        feedback,
        setFeedback,
        selectedPlan,
        setSelectedPlan,
        query,
        setQuery,
        statusFilter,
        setStatusFilter,
        subidos,
        porRevisar,
        aprobados,
        filteredPlans,
        paged,
        currentPage,
        totalPages,
        setPage,
        navigate,
        STATUS_META,
    } = useDocentePlanes();

    return (
        <div className="flex flex-col gap-5">
            {/* Confirmación */}
            {feedback && (
                <FeedbackBanner feedback={feedback} onClose={() => setFeedback(null)} />
            )}

            {/* Bloques de resumen */}
            <PlanStats subidos={subidos} porRevisar={porRevisar} aprobados={aprobados} />

            <button
                onClick={() => navigate("/docente/planes/nuevo")}
                className="justify-center inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold bg-edu-primary text-white hover:bg-edu-primary-hover border-none cursor-pointer"
            >
                <PlusCircle className="w-4 h-4" />
                Crear plan de evaluación
            </button>

            {/* Tabla de planes */}
            <PlanesTable
                filteredPlans={filteredPlans}
                paged={paged}
                query={query}
                setQuery={setQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                currentPage={currentPage}
                totalPages={totalPages}
                setPage={setPage}
                onSelect={setSelectedPlan}
                navigate={navigate}
                STATUS_META={STATUS_META}
            />

            {selectedPlan && (
                <PlanReviewModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
            )}
        </div>
    );
}
