import { useState, useEffect } from "react";
import { useFetch } from "@shared/services";
import { getPagosPorConfirmar, type PendingPay } from "@shared/services/actions/tesoreria";

export const money = (n: number) => n.toLocaleString("es-ES", { maximumFractionDigits: 2 });

export function useTesoreriaConfirmar() {
  const { data: fetchedPending } = useFetch(getPagosPorConfirmar, []);

  const [pending, setPending] = useState<PendingPay[]>([]);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null);
  const [selected, setSelected] = useState<PendingPay | null>(null);
  const [confirm, setConfirm] = useState<{ p: PendingPay; ok: boolean } | null>(null);

  useEffect(() => setPending(fetchedPending), [fetchedPending]);

  const resolve = (p: PendingPay, ok: boolean) => {
    setPending((prev) => prev.filter((x) => x.id !== p.id));
    setSelected(null);
    setFeedback({
      msg: ok
        ? `Pago de ${p.rep} por ${money(p.amount)} ${p.currency} confirmado y sumado a caja.`
        : `Pago de ${p.rep} rechazado. Se notificó al representante para reenviar el comprobante.`,
      ok,
    });
  };

  return { pending, feedback, setFeedback, selected, setSelected, confirm, setConfirm, resolve, money };
}
