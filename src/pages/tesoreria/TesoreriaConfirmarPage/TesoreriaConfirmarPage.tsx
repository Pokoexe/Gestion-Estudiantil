import { Check, X } from "lucide-react";
import { BaucheModal } from "@shared/ui/BaucheModal";
import { ConfirmDialog } from "@shared/ui/ConfirmDialog";
import { useTesoreriaConfirmar, money } from "./functions/useTesoreriaConfirmar";
import { FeedbackBanner } from "./ui/FeedbackBanner";
import { PendingHeader } from "./ui/PendingHeader";
import { PendingPaymentsGrid } from "./ui/PendingPaymentsGrid";

export { money };

export function TesoreriaConfirmarPage() {
  const {
    pending, feedback, setFeedback,
    selected, setSelected,
    confirm, setConfirm,
    resolve, money,
  } = useTesoreriaConfirmar();

  return (
    <div className="flex flex-col gap-5">
      {feedback && <FeedbackBanner feedback={feedback} onClose={() => setFeedback(null)} />}

      <PendingHeader count={pending.length} />

      <PendingPaymentsGrid
        pending={pending}
        onSelect={(p) => setSelected(p)}
        onConfirm={(p, ok) => setConfirm({ p, ok })}
        money={money}
      />

      {selected && (
        <BaucheModal
          showOptions={true}
          rep={selected.rep}
          student={selected.student}
          amount={`${money(selected.amount)} ${selected.currency}`}
          method={selected.bank}
          reference={selected.ref}
          date={selected.date}
          onClose={() => setSelected(null)}
          onAccept={() => setConfirm({ p: selected, ok: true })}
          onReject={() => setConfirm({ p: selected, ok: false })}
        />
      )}

      {confirm && (
        <ConfirmDialog
          title={confirm.ok ? "Confirmar pago" : "Rechazar pago"}
          message="¿Está seguro que desea continuar?"
          confirmLabel={confirm.ok ? "Sí, aceptar" : "Sí, rechazar"}
          icon={confirm.ok ? Check : X}
          tone={confirm.ok ? "success" : "danger"}
          onConfirm={() => { resolve(confirm.p, confirm.ok); setConfirm(null); }}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
