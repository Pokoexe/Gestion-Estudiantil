import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Wallet, AlertTriangle, HandCoins, BellRing, PackagePlus } from "lucide-react";
import { color, accent } from "@themes/tokens";
import { useFetch } from "@shared/services";
import {
  getRecaudoMensual,
  getPagosPorConfirmarResumen,
  getMorosos,
  type DashboardPendingPay,
} from "@shared/services/actions/tesoreria";

export type PendingPay = DashboardPendingPay;

const KPIS: {
  label: string;
  value: string;
  hint: string;
  icon: React.FC<{ style?: React.CSSProperties }>;
  ac: { bg: string; fg: string };
  trend?: string;
}[] = [
  {
    label: "Recaudado este mes",
    value: "$ 8.450",
    hint: "USD · 68 pagos confirmados",
    icon: Wallet,
    ac: accent.green,
    trend: "+12,4 % vs. mayo",
  },
  {
    label: "Sin solvencia",
    value: "14",
    hint: "representantes con mora",
    icon: AlertTriangle,
    ac: accent.red,
    trend: "$ 2.310 por cobrar",
  },
];

const QUICK_ACTIONS: {
  label: string;
  icon: React.FC<{ style?: React.CSSProperties }>;
  primary: boolean;
  to: string;
}[] = [
  { label: "Registrar pago", icon: HandCoins, primary: true, to: "/tesoreria/pagos" },
  { label: "Enviar recordatorios", icon: BellRing, primary: false, to: "/tesoreria/solvencia" },
  { label: "Agregar inventario", icon: PackagePlus, primary: false, to: "/tesoreria/inventario" },
];

export function monthsBadge(m: number): { bg: string; fg: string } {
  if (m >= 4) return { bg: color.dangerBg, fg: color.danger };
  if (m >= 2) return { bg: color.warningBg, fg: color.warning };
  return { bg: color.primary50, fg: color.primary };
}

export function useTesoreriaDashboard() {
  const navigate = useNavigate();
  const { data: MONTHLY_COLLECTION } = useFetch(getRecaudoMensual, []);
  const { data: fetchedPending } = useFetch(getPagosPorConfirmarResumen, []);
  const { data: DEBTORS } = useFetch(getMorosos, []);

  const [tab, setTab] = useState<"pagos" | "solvencia">("pagos");
  const [pending, setPending] = useState<PendingPay[]>([]);
  const [selectedPay, setSelectedPay] = useState<PendingPay | null>(null);
  const [confirmPay, setConfirmPay] = useState<{ p: PendingPay; ok: boolean } | null>(null);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null);

  useEffect(() => setPending(fetchedPending), [fetchedPending]);

  const resolvePay = (p: PendingPay, ok: boolean) => {
    setPending((prev) => prev.filter((x) => x.id !== p.id));
    setSelectedPay(null);
    setConfirmPay(null);
    setFeedback({
      msg: ok
        ? `Pago de ${p.rep} por ${p.amount} confirmado y sumado a caja.`
        : `Pago de ${p.rep} rechazado. Se notificó al representante para reenviar el comprobante.`,
      ok,
    });
  };

  return {
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
  };
}
