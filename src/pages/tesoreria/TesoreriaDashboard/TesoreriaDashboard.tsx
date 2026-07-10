import { Check, X } from "lucide-react";
import { BaucheModal } from "@shared/ui/BaucheModal";
import { ConfirmDialog } from "@shared/ui/ConfirmDialog";
import { useTesoreriaDashboard } from "./functions/useTesoreriaDashboard";
import { FeedbackBanner } from "./ui/FeedbackBanner";
import { CollectionChartCard } from "./ui/CollectionChartCard";
import { KpiCards } from "./ui/KpiCards";
import { QuickActions } from "./ui/QuickActions";
import { PendingSolvencyPanel } from "./ui/PendingSolvencyPanel";

export function TesoreriaDashboard() {
  const {
    navigate,
    MONTHLY_COLLECTION,
    DEBTORS,
    tab, setTab,
    pending,
    selectedPay, setSelectedPay,
    confirmPay, setConfirmPay,
    feedback, setFeedback,
    resolvePay,
    KPIS,
    QUICK_ACTIONS,
    monthsBadge,
  } = useTesoreriaDashboard();

  return (
    <div className="flex flex-col gap-5">
      {feedback && (
        <FeedbackBanner feedback={feedback} onClose={() => setFeedback(null)} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          <CollectionChartCard
            data={MONTHLY_COLLECTION}
            onSeeReport={() => navigate("/tesoreria/pagos")}
          />
          <KpiCards kpis={KPIS} />
        </div>

        <div className="space-y-4">
          <QuickActions actions={QUICK_ACTIONS} onNavigate={(to) => navigate(to)} />
          <PendingSolvencyPanel
            tab={tab}
            setTab={setTab}
            pending={pending}
            debtors={DEBTORS}
            monthsBadge={monthsBadge}
            onSelectPay={(p) => setSelectedPay(p)}
            onConfirmPay={(p, ok) => setConfirmPay({ p, ok })}
          />
        </div>
      </div>

      {selectedPay && (
        <BaucheModal
          showOptions={true}
          rep={selectedPay.rep}
          student={selectedPay.student}
          amount={selectedPay.amount}
          method={selectedPay.method}
          reference={selectedPay.ref}
          date={selectedPay.date}
          onClose={() => setSelectedPay(null)}
          onAccept={() => setConfirmPay({ p: selectedPay, ok: true })}
          onReject={() => setConfirmPay({ p: selectedPay, ok: false })}
        />
      )}

      {confirmPay && (
        <ConfirmDialog
          title={confirmPay.ok ? "Confirmar pago" : "Rechazar pago"}
          message="¿Está seguro que desea continuar?"
          confirmLabel={confirmPay.ok ? "Sí, aceptar" : "Sí, rechazar"}
          icon={confirmPay.ok ? Check : X}
          tone={confirmPay.ok ? "success" : "danger"}
          onConfirm={() => resolvePay(confirmPay.p, confirmPay.ok)}
          onCancel={() => setConfirmPay(null)}
        />
      )}
    </div>
  );
}
