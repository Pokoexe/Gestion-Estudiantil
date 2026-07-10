import { useDirFinanzas } from "./functions/useDirFinanzas";
import { IncomeKpiRow } from "./ui/IncomeKpiRow";
import { MonthlyIncomeCard } from "./ui/MonthlyIncomeCard";
import { PaymentsByCurrencyCard } from "./ui/PaymentsByCurrencyCard";
import { InventorySummaryCard } from "./ui/InventorySummaryCard";
import { DebtorsTable } from "./ui/DebtorsTable";
import { PendingPaymentsTable } from "./ui/PendingPaymentsTable";
import { DelinquencyNotice } from "./ui/DelinquencyNotice";

export function DirFinanzasPage() {
  const {
    MONTHLY,
    DEBTORS,
    loading,
    pendingList,
    contacted,
    contact,
    confirm,
    INCOME_KPIS,
    PAGOS_MONEDA,
    INVENTORY,
  } = useDirFinanzas();

  if (loading)
    return <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">Cargando…</div>;

  return (
    <div className="flex flex-col gap-5">
      {/* Encabezado de sección */}
      <div>
        <h2 className="m-0 text-edu-ink font-bold text-xl">Finanzas globales</h2>
        <p className="m-0 mt-1 text-edu-ink-400 text-[0.85rem]">
          Ingresos por moneda, morosidad e inventario · Período 2026-I
        </p>
      </div>

      {/* Fila de KPIs de ingresos */}
      <IncomeKpiRow INCOME_KPIS={INCOME_KPIS} />

      {/* Ingresos mensuales + pagos por moneda + inventario */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.9fr_1fr] gap-4 items-stretch">
        <MonthlyIncomeCard MONTHLY={MONTHLY} />
        <PaymentsByCurrencyCard PAGOS_MONEDA={PAGOS_MONEDA} />
        <InventorySummaryCard INVENTORY={INVENTORY} />
      </div>

      {/* Representantes deudores */}
      <DebtorsTable DEBTORS={DEBTORS} contacted={contacted} contact={contact} />

      {/* Pagos por confirmar */}
      <PendingPaymentsTable pendingList={pendingList} confirm={confirm} />

      {/* Aviso de morosidad */}
      <DelinquencyNotice />
    </div>
  );
}
