import { PlusCircle } from "lucide-react";
import { PlanStats } from "@shared/ui/PlanStats";
import { useDocentePlanificacion } from "./functions/useDocentePlanificacion";
import { FeedbackBanner } from "./ui/FeedbackBanner";
import { PlanificacionesTable } from "./ui/PlanificacionesTable";

export function DocentePlanificacionPage() {
    const {
        feedback,
        setFeedback,
        query,
        setQuery,
        statusFilter,
        setStatusFilter,
        subidos,
        porRevisar,
        aprobados,
        filteredPlanif,
        paged,
        currentPage,
        totalPages,
        setPage,
        navigate,
    } = useDocentePlanificacion();

    return (
        <div className="flex flex-col gap-5">
            {/* Confirmación */}
            <FeedbackBanner feedback={feedback} onClose={() => setFeedback(null)} />

            {/* Bloques de resumen */}
            <PlanStats subidos={subidos} porRevisar={porRevisar} aprobados={aprobados} />
            <button
                onClick={() => navigate("/docente/planificacion/nuevo")}
                className="w-full justify-center md:w-auto inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold bg-edu-primary text-white hover:bg-edu-primary-hover border-none cursor-pointer"
            >
                <PlusCircle className="w-4 h-4" />
                Crear planificación
            </button>
            {/* Tabla de planificaciones */}
            <PlanificacionesTable
                filteredPlanif={filteredPlanif}
                paged={paged}
                currentPage={currentPage}
                totalPages={totalPages}
                query={query}
                statusFilter={statusFilter}
                onQueryChange={setQuery}
                onStatusFilterChange={setStatusFilter}
                onPageChange={setPage}
                onEdit={(id) => navigate(`/docente/planificacion/${id}/editar`)}
            />
        </div>
    );
}
