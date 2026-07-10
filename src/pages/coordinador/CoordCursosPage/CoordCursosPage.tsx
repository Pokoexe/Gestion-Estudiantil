import { CheckCircle2, XCircle } from "lucide-react";
import { ConfirmDialog } from "@shared/ui/ConfirmDialog";
import { useCoordCursos } from "./functions/useCoordCursos";
import { StudentsAreaChart } from "./ui/StudentsAreaChart";
import { CursosKpis } from "./ui/CursosKpis";
import { CreateCourseButton } from "./ui/CreateCourseButton";
import { CursosList } from "./ui/CursosList";
import { CursoDetailModal } from "./modals/CursoDetailModal";

export function CoordCursosPage() {
  const {
    navigate, CHART_DATA, KPIS, AREAS, STATUS_META,
    query, setQuery, statusFilter, setStatusFilter, page, setPage,
    selectedCurso, setSelectedCurso, pending, setPending,
    filtered, totalPages, currentPage, paged,
    applyAction, triggerAction,
  } = useCoordCursos();

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
        <StudentsAreaChart data={CHART_DATA} areas={AREAS} />
        <CursosKpis kpis={KPIS} />
      </div>

      <CreateCourseButton onClick={() => navigate("/coordinador/cursos/nuevo")} />

      <CursosList
        query={query}
        setQuery={setQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        setPage={setPage}
        filtered={filtered}
        paged={paged}
        currentPage={currentPage}
        totalPages={totalPages}
        statusMeta={STATUS_META}
        onSelect={setSelectedCurso}
        onAction={triggerAction}
      />

      {selectedCurso && (
        <CursoDetailModal
          curso={selectedCurso}
          statusMeta={STATUS_META}
          onClose={() => setSelectedCurso(null)}
          onAction={(action) => triggerAction(selectedCurso.id, action)}
        />
      )}

      {pending && (
        <ConfirmDialog
          title={pending.action === "aceptar" ? "¿Aceptar este curso?" : "¿Rechazar este curso?"}
          message={
            pending.action === "aceptar"
              ? "El curso quedará activo y el profesor será notificado."
              : "La solicitud será rechazada. Esta acción puede revertirse."
          }
          confirmLabel={pending.action === "aceptar" ? "Sí, aceptar" : "Sí, rechazar"}
          tone={pending.action === "aceptar" ? "success" : "danger"}
          icon={pending.action === "aceptar" ? CheckCircle2 : XCircle}
          onConfirm={() => applyAction(pending.id, pending.action)}
          onCancel={() => setPending(null)}
        />
      )}
    </div>
  );
}
