import { useTesoreriaReportes } from "./functions/useTesoreriaReportes";
import { ReportsSummary } from "./ui/ReportsSummary";
import { GenerateReportAction } from "./ui/GenerateReportAction";
import { ReportsTable } from "./ui/ReportsTable";
import { GenerateReportModal } from "./modals/GenerateReportModal";
import { EditReportModal } from "./modals/EditReportModal";

export function TesoreriaReportesPage() {
  const {
    showModal, setShowModal,
    form, setForm, responsable, setResponsable,
    editReport, setEditReport, editForm, setEditForm,
    query, setQuery, typeFilter, setTypeFilter, statusFilter, setStatusFilter, setPage,
    total, last, thisMonth,
    filtered, totalPages, currentPage, paged,
    openModal, handleSubmit, openEdit, handleEditSubmit,
    REPORT_TYPES, REPORT_STATUS, RESPONSABLES, REP_COLS, REP_HEADERS,
  } = useTesoreriaReportes();

  return (
    <div className="flex flex-col gap-5">
      <ReportsSummary total={total} last={last} thisMonth={thisMonth} />

      <GenerateReportAction onClick={openModal} />

      <ReportsTable
        query={query} setQuery={setQuery}
        typeFilter={typeFilter} setTypeFilter={setTypeFilter}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        setPage={setPage}
        filtered={filtered} paged={paged}
        currentPage={currentPage} totalPages={totalPages}
        reportTypes={REPORT_TYPES} reportStatus={REPORT_STATUS}
        onEdit={openEdit}
        cols={REP_COLS} headers={REP_HEADERS}
      />

      {showModal && (
        <GenerateReportModal
          form={form} setForm={setForm}
          responsable={responsable} setResponsable={setResponsable}
          reportTypes={REPORT_TYPES} responsables={RESPONSABLES}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
        />
      )}

      {editReport && (
        <EditReportModal
          editForm={editForm} setEditForm={setEditForm}
          reportTypes={REPORT_TYPES} reportStatus={REPORT_STATUS}
          responsables={RESPONSABLES}
          onSubmit={handleEditSubmit}
          onClose={() => setEditReport(null)}
        />
      )}
    </div>
  );
}
