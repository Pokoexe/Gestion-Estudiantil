import { useNavigate } from "react-router";
import { useMateriasPendientes } from "./functions/useMateriasPendientes";
import { KpiCards } from "./ui/KpiCards";
import { PendientesTable } from "./ui/PendientesTable";

export function MateriasPendientesPage() {
    const navigate = useNavigate();
    const {
        query, setQuery,
        statusFilter, setStatusFilter,
        setPage,
        totalPendientes, proximaReparacion,
        rows, paged, totalPages, currentPage,
    } = useMateriasPendientes();

    return (
        <>
            <KpiCards totalPendientes={totalPendientes} proximaReparacion={proximaReparacion} />
            <PendientesTable
                rows={rows}
                paged={paged}
                query={query}
                setQuery={setQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                currentPage={currentPage}
                totalPages={totalPages}
                setPage={setPage}
                onRepairClick={() => navigate("/estudiante/reparacion")}
            />
        </>
    );
}
