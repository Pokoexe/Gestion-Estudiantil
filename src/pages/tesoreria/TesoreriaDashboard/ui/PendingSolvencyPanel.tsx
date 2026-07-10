import { Check, X, Eye } from "lucide-react";
import type { PendingPay } from "../functions/useTesoreriaDashboard";

type Debtor = {
  id: number;
  rep: string;
  student: string;
  months: number;
  amount: string;
};

type Props = {
  tab: "pagos" | "solvencia";
  setTab: (t: "pagos" | "solvencia") => void;
  pending: PendingPay[];
  debtors: Debtor[];
  monthsBadge: (m: number) => { bg: string; fg: string };
  onSelectPay: (p: PendingPay) => void;
  onConfirmPay: (p: PendingPay, ok: boolean) => void;
};

export function PendingSolvencyPanel({
  tab, setTab,
  pending, debtors,
  monthsBadge,
  onSelectPay, onConfirmPay,
}: Props) {
  return (
    <div className="c bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
      <div className="px-2 pt-2 border-b border-edu-border-soft flex gap-1">
        {([
          { key: "pagos", label: "Por confirmar" },
          { key: "solvencia", label: "Sin solvencia" },
        ] as const).map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 px-2 py-2.5 text-[0.78rem] font-semibold border-b-2 -mb-px transition-colors cursor-pointer bg-transparent ${
                active
                  ? "border-edu-primary text-edu-primary"
                  : "border-transparent text-edu-ink-500 hover:text-edu-ink-700"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "pagos" && (
        <div className="flex flex-col">
          {pending.length === 0 && (
            <div className="px-4 py-8 text-center text-edu-ink-400 text-sm">
              No quedan pagos por confirmar.
            </div>
          )}
          {pending.slice(0, 5).map((p, i, arr) => (
            <div
              key={p.id}
              onClick={() => onSelectPay(p)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelectPay(p)}
              className={`px-4 py-3 flex flex-col gap-2 cursor-pointer transition-colors hover:bg-edu-subtle focus:outline-none focus-visible:bg-edu-subtle ${
                i < arr.length - 1 ? "border-b border-edu-border-soft" : ""
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <div className="text-[0.8125rem] text-edu-ink font-medium truncate">{p.rep}</div>
                  <div className="text-[0.72rem] text-edu-ink-400 truncate">{p.student}</div>
                </div>
                <span className="text-[0.8125rem] text-edu-ink font-bold shrink-0">{p.amount}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[0.7rem] text-edu-primary font-semibold truncate inline-flex items-center gap-1">
                  <Eye className="w-3 h-3 shrink-0" /> Ver comprobante
                </span>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); onConfirmPay(p, true); }}
                    aria-label="Aceptar"
                    className="w-7 h-7 rounded-edu-chip border-none bg-edu-success text-white flex items-center justify-center cursor-pointer transition-colors hover:brightness-95"
                  >
                    <Check style={{ width: "13px", height: "13px" }} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onConfirmPay(p, false); }}
                    aria-label="Rechazar"
                    className="w-7 h-7 rounded-edu-chip border-none bg-edu-danger-bg text-edu-danger flex items-center justify-center cursor-pointer transition-colors hover:brightness-95"
                  >
                    <X style={{ width: "13px", height: "13px" }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "solvencia" && (
        <div className="flex flex-col">
          {debtors.slice(0, 5).map((d, i, arr) => {
            const badge = monthsBadge(d.months);
            return (
              <div
                key={d.id}
                className={`px-4 py-3 flex items-center gap-2.5 ${i < arr.length - 1 ? "border-b border-edu-border-soft" : ""}`}
              >
                <div className="w-8 h-8 rounded-full bg-edu-subtle border border-edu-border flex items-center justify-center text-[0.68rem] font-bold text-edu-ink-500 shrink-0">
                  {d.rep.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[0.8125rem] text-edu-ink font-medium truncate">{d.rep}</div>
                  <div className="text-[0.72rem] text-edu-ink-400 truncate">{d.student}</div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[0.8125rem] text-edu-danger font-bold">{d.amount}</span>
                  <span
                    className="inline-flex items-center justify-center px-2 py-[1px] rounded-edu-pill text-[0.65rem] font-semibold"
                    style={{ backgroundColor: badge.bg, color: badge.fg }}
                  >
                    {d.months} {d.months === 1 ? "mes" : "meses"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
