import { ClipboardCheck } from "lucide-react";

export function PendingHeader({ count }: { count: number }) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-edu-card bg-edu-warning-bg flex items-center justify-center shrink-0">
        <ClipboardCheck className="w-6 h-6 text-edu-warning" />
      </div>
      <div className="flex-1">
        <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">Pagos manuales por confirmar</p>
        <p className="text-edu-ink text-[1.4rem] font-bold mt-0.5 m-0">{count} pendiente{count === 1 ? "" : "s"}</p>
        <p className="text-edu-ink-400 text-[0.8rem] m-0">Transferencias subidas por los representantes en espera de validación</p>
      </div>
    </div>
  );
}
