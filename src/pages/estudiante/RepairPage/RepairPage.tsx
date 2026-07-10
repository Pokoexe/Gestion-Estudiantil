import { useRepair } from "./functions/useRepair";
import { SummaryCards } from "./ui/SummaryCards";
import { RepairTable } from "./ui/RepairTable";

export function RepairPage() {
    const {
        tab, changeTab,
        query, setQuery,
        statusFilter, setStatusFilter,
        setPage,
        reprobadoCount, repairingCount, pendienteCount,
        rows, paged, totalPages, currentPage,
        goToSubject,
    } = useRepair();

    return (
        <>
            <SummaryCards
                pendienteCount={pendienteCount}
                reprobadoCount={reprobadoCount}
                repairingCount={repairingCount}
            />
            <RepairTable
                tab={tab}
                changeTab={changeTab}
                query={query}
                setQuery={setQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                rows={rows}
                paged={paged}
                currentPage={currentPage}
                totalPages={totalPages}
                setPage={setPage}
                goToSubject={goToSubject}
            />
        </>
    );
}
