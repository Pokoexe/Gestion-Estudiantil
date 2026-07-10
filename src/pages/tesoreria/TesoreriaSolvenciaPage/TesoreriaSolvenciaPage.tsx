import { Bell } from "lucide-react";
import { color } from "@themes/tokens";
import { ConfirmDialog } from "@shared/ui/ConfirmDialog";
import { useTesoreriaSolvencia } from "./functions/useTesoreriaSolvencia";
import { SolvencySummary } from "./ui/SolvencySummary";
import { RepresentativesTable } from "./ui/RepresentativesTable";
import { RepresentativeModal } from "./modals/RepresentativeModal";

export function TesoreriaSolvenciaPage() {
  const {
    loading,
    query, setQuery,
    statusFilter, setStatusFilter,
    setPage,
    notified,
    selected, setSelected,
    confirmNotify, setConfirmNotify,
    SUMMARY, filtered, totalPages, currentPage, paged,
    notify,
    money, monthsBadge, initials, studentYears, payPattern,
    COLS, HEADERS,
  } = useTesoreriaSolvencia();

  if (loading) {
    return (
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">
        Cargando…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <SolvencySummary summary={SUMMARY} />

      <RepresentativesTable
        query={query}
        setQuery={setQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        setPage={setPage}
        filtered={filtered}
        paged={paged}
        currentPage={currentPage}
        totalPages={totalPages}
        notified={notified}
        onSelect={(r) => setSelected(r)}
        onNotify={(r) => setConfirmNotify(r)}
        money={money}
        monthsBadge={monthsBadge}
        cols={COLS}
        headers={HEADERS}
      />

      {selected && (
        <RepresentativeModal
          representative={selected}
          notified={notified}
          onClose={() => setSelected(null)}
          onNotify={() => setConfirmNotify(selected)}
          money={money}
          initials={initials}
          studentYears={studentYears}
          payPattern={payPattern}
        />
      )}

      {confirmNotify && (
        <ConfirmDialog
          title="Enviar notificación de cobro"
          message={<>Se enviará un recordatorio de pago a <span className="font-semibold text-edu-ink">{confirmNotify.rep}</span> por WhatsApp al {confirmNotify.phone}. ¿Está seguro que desea continuar?</>}
          confirmLabel="Enviar notificación"
          icon={Bell}
          tone="success"
          confirmStyle={{ backgroundColor: color.whatsapp }}
          onConfirm={() => { notify(confirmNotify.id); setConfirmNotify(null); }}
          onCancel={() => setConfirmNotify(null)}
        />
      )}
    </div>
  );
}
