import { useState } from "react";
import {
  DollarSign,
  Coins,
  Banknote,
  ShieldCheck,
} from "lucide-react";
import { color, accent } from "@themes/tokens";
import { useFetch } from "@shared/services";
import { getIngresos, getDeudores, getPagosPendientes } from "@shared/services/actions/director";
import type { IncomeKpi, InventoryItem } from "../interfaces";

const INCOME_KPIS: IncomeKpi[] = [
  { label: "Ingresos USD", value: "$ 8.450", icon: DollarSign, ac: accent.green, hint: "Recaudado este mes" },
  { label: "Ingresos Bs.", value: "Bs. 308.000", icon: Banknote, ac: accent.amber, hint: "Recaudado este mes" },
  { label: "Ingresos COP", value: "$ 29,1 M", icon: Coins, ac: accent.blue, hint: "Recaudado este mes" },
  { label: "Solvencia", value: "78 %", icon: ShieldCheck, ac: accent.purple, hint: "478 de 612 al día" },
];

const PAGOS_MONEDA = [
  { name: "USD", value: 46, fill: color.success },
  { name: "Bs.", value: 33, fill: color.warning },
  { name: "COP", value: 21, fill: color.primary },
];

const INVENTORY: InventoryItem[] = [
  { label: "Artículos en almacén", value: "1.284", ac: accent.blue },
  { label: "Bajo stock", value: "12", ac: accent.amber },
  { label: "Valor estimado", value: "$ 14.200", ac: accent.green },
];

export function useDirFinanzas() {
  const [contacted, setContacted] = useState<number[]>([]);
  const [confirmed, setConfirmed] = useState<number[]>([]);

  const { data: MONTHLY, loading: loadingIngresos } = useFetch(getIngresos, []);
  const { data: DEBTORS, loading: loadingDeudores } = useFetch(getDeudores, []);
  const { data: PENDING, loading: loadingPendientes } = useFetch(getPagosPendientes, []);

  const loading = loadingIngresos || loadingDeudores || loadingPendientes;

  const pendingList = PENDING.filter((p) => !confirmed.includes(p.id));

  function contact(id: number) {
    setContacted((c) => (c.includes(id) ? c : [...c, id]));
  }

  function confirm(id: number) {
    setConfirmed((c) => [...c, id]);
  }

  return {
    MONTHLY,
    DEBTORS,
    PENDING,
    loading,
    pendingList,
    contacted,
    confirmed,
    contact,
    confirm,
    INCOME_KPIS,
    PAGOS_MONEDA,
    INVENTORY,
  };
}
