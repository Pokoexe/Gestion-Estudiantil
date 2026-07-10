import { CheckCircle2 } from "lucide-react";
import { ConfirmDialog } from "@shared/ui/ConfirmDialog";
import { useEvalRevisiones } from "./functions/useEvalRevisiones";
import { KpiRow } from "./ui/KpiRow";
import { RevisionesTabs } from "./ui/RevisionesTabs";
import { RevisionesFilters } from "./ui/RevisionesFilters";
import { RevisionesTable } from "./ui/RevisionesTable";
import { DetalleEntregaModal } from "./modals/DetalleEntregaModal";
import { SolicitarRevisionModal } from "./modals/SolicitarRevisionModal";

export function EvalRevisionesPage() {
  const {
    tab,
    setTab,
    query,
    setQuery,
    estadoFilter,
    setEstadoFilter,
    setPage,
    modalId,
    setModalId,
    obs,
    setObs,
    detail,
    setDetail,
    confirmAprobar,
    setConfirmAprobar,
    filtradas,
    totalPages,
    currentPage,
    paged,
    modalRevision,
    KPIS,
    aprobar,
    solicitarRevision,
    TEAL,
    TEAL_BG,
    TEAL_50,
    ESTADO_META,
    TIPO_META,
    TABS,
    COLS,
    HEADERS,
  } = useEvalRevisiones();

  return (
    <div className="flex flex-col gap-5">
      {/* KPIs */}
      <KpiRow kpis={KPIS} />

      {/* Cola de revisiones */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
          <div>
            <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">
              Cola de revisiones
            </h3>
            <p className="mt-0.5 mb-0 text-edu-ink-400 text-[0.775rem]">
              Material enviado por los docentes para validación
            </p>
          </div>
          <span className="text-[0.8rem] text-edu-ink-400 font-medium">
            {filtradas.length} entregas
          </span>
        </div>

        <RevisionesTabs
          tabs={TABS}
          tab={tab}
          onTabChange={(t) => { setTab(t); setPage(1); }}
          teal={TEAL}
        />

        <RevisionesFilters
          query={query}
          onQuery={(q) => { setQuery(q); setPage(1); }}
          estadoFilter={estadoFilter}
          onEstado={(e) => { setEstadoFilter(e); setPage(1); }}
          teal={TEAL}
        />

        <RevisionesTable
          paged={paged}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setPage}
          cols={COLS}
          headers={HEADERS}
          estadoMeta={ESTADO_META}
          tipoMeta={TIPO_META}
          teal={TEAL}
          onDetail={setDetail}
          onAprobar={setConfirmAprobar}
          onRevision={(r) => { setModalId(r.id); setObs(""); }}
          filtradas={filtradas}
        />
      </div>

      {/* Modal: ver detalle */}
      {detail && (
        <DetalleEntregaModal
          detail={detail}
          onClose={() => setDetail(null)}
          estadoMeta={ESTADO_META}
          tipoMeta={TIPO_META}
          teal={TEAL}
          tealBg={TEAL_BG}
          teal50={TEAL_50}
        />
      )}

      {/* Modal: solicitar revisión */}
      {modalId !== null && (
        <SolicitarRevisionModal
          modalRevision={modalRevision}
          obs={obs}
          onObs={setObs}
          onClose={() => setModalId(null)}
          onSubmit={solicitarRevision}
          teal={TEAL}
          teal50={TEAL_50}
        />
      )}

      {/* ConfirmDialog shared */}
      {confirmAprobar && (
        <ConfirmDialog
          title="Aprobar entrega"
          message={
            <>
              Se aprobará la entrega de{" "}
              <span className="font-semibold text-edu-ink">
                {confirmAprobar.materia} · {confirmAprobar.seccion}
              </span>{" "}
              ({confirmAprobar.docente}). ¿Estás seguro?
            </>
          }
          confirmLabel="Sí, aprobar"
          icon={CheckCircle2}
          tone="success"
          onConfirm={() => {
            aprobar(confirmAprobar.id);
            setConfirmAprobar(null);
          }}
          onCancel={() => setConfirmAprobar(null)}
        />
      )}
    </div>
  );
}
