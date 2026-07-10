import { Package, Wallet, ArrowDownRight } from "lucide-react";
import { color } from "@themes/tokens";

type Props = {
  totalValue: number;
  itemsCount: number;
  balance: number;
  fetchedBalance: number;
  discountedThisMonth: number;
  money: (n: number) => string;
};

export function InventoryKpis({ totalValue, itemsCount, balance, fetchedBalance, discountedThisMonth, money }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">Valor total del inventario</p>
            <p className="text-edu-ink text-[1.6rem] font-bold mt-1 m-0">$ {money(totalValue)}</p>
          </div>
          <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: color.successBg }}>
            <Package style={{ width: "20px", height: "20px", color: color.success }} />
          </div>
        </div>
        <p className="text-edu-ink-400 text-xs m-0">{itemsCount} artículos registrados · USD equivalente</p>
      </div>

      <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">Saldo disponible</p>
            <p className={`text-[1.6rem] font-bold mt-1 m-0 ${balance < fetchedBalance ? "text-edu-warning" : "text-edu-ink"}`}>$ {money(balance)}</p>
          </div>
          <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: color.primary50 }}>
            <Wallet style={{ width: "20px", height: "20px", color: color.primary }} />
          </div>
        </div>
        <p className="text-edu-ink-400 text-xs m-0">Caja en USD · cada compra lo descuenta</p>
      </div>

      <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">Descontados este mes</p>
            <p className="text-edu-ink text-[1.6rem] font-bold mt-1 m-0">{discountedThisMonth.toLocaleString("es-ES")}</p>
          </div>
          <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: color.warningBg }}>
            <ArrowDownRight style={{ width: "20px", height: "20px", color: color.warning }} />
          </div>
        </div>
        <p className="text-edu-ink-400 text-xs m-0">Unidades retiradas en julio 2026</p>
      </div>
    </div>
  );
}
