import { Check, X, Receipt, Clock, Eye, Landmark } from "lucide-react";
import type { PendingPay } from "@shared/services/actions/tesoreria";

type Props = {
  pending: PendingPay[];
  onSelect: (p: PendingPay) => void;
  onConfirm: (p: PendingPay, ok: boolean) => void;
  money: (n: number) => string;
};

export function PendingPaymentsGrid({ pending, onSelect, onConfirm, money }: Props) {
  if (pending.length === 0) {
    return (
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 flex flex-col items-center gap-2 text-center">
        <div className="w-12 h-12 rounded-full bg-edu-success-bg flex items-center justify-center">
          <Check className="w-6 h-6 text-edu-success" />
        </div>
        <p className="text-edu-ink font-semibold text-[0.95rem] m-0">No quedan pagos por confirmar</p>
        <p className="text-edu-ink-400 text-sm m-0">Todos los comprobantes fueron revisados.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {pending.map((p) => (
        <div
          key={p.id}
          onClick={() => onSelect(p)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(p)}
          className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col cursor-pointer transition-colors hover:border-edu-primary focus:outline-none focus-visible:border-edu-primary"
        >
          <div className="flex gap-3.5 p-4">
            <div className="group relative w-20 h-20 rounded-edu-control bg-edu-subtle border border-edu-border-soft flex flex-col items-center justify-center gap-1 shrink-0">
              <Receipt className="w-6 h-6 text-edu-ink-400" />
              <span className="text-[0.6rem] text-edu-ink-400 font-medium">Comprobante</span>
              <div className="absolute inset-0 rounded-edu-control bg-edu-ink/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Eye className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-edu-ink font-semibold m-0 truncate">{p.rep}</p>
              <p className="text-[0.8125rem] text-edu-ink-500 m-0 truncate">{p.student}</p>
              <p className="text-[1.15rem] text-edu-ink font-bold mt-1 m-0">
                {money(p.amount)} <span className="text-[0.8rem] text-edu-ink-500 font-semibold">{p.currency}</span>
              </p>
              <span className="inline-flex items-center gap-1 text-[0.7rem] text-edu-ink-400 mt-1">
                <Clock className="w-3 h-3" /> {p.date}
              </span>
            </div>
          </div>

          <div className="mx-4 mb-3 rounded-edu-control bg-edu-subtle px-3.5 py-2.5 flex items-center gap-2">
            <Landmark className="w-4 h-4 text-edu-ink-500 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-[0.8125rem] text-edu-ink font-medium truncate">{p.bank}</div>
              <div className="text-[0.72rem] text-edu-ink-400">Referencia (bauche): {p.ref}</div>
            </div>
            <span className="inline-flex items-center gap-1 text-[0.72rem] text-edu-primary font-semibold shrink-0">
              <Eye className="w-3.5 h-3.5" /> Ver
            </span>
          </div>

          <div className="flex gap-2 px-4 pb-4 mt-auto">
            <button
              onClick={(e) => { e.stopPropagation(); onConfirm(p, true); }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-edu-control border-none bg-edu-success text-white text-sm font-semibold cursor-pointer transition-colors hover:brightness-95"
            >
              <Check className="w-4 h-4" />
              Aceptar
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onConfirm(p, false); }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-edu-control border-[1.5px] border-edu-danger-bg bg-edu-danger-bg text-edu-danger text-sm font-semibold cursor-pointer transition-colors hover:brightness-95"
            >
              <X className="w-4 h-4" />
              Rechazar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
