import { CheckCircle2, Receipt } from "lucide-react";
import { SectionCard } from "./SectionCard";
import { Th } from "./Th";

export function PendingPaymentsTable({
  pendingList,
  confirm,
}: {
  pendingList: any[];
  confirm: (id: number) => void;
}) {
  return (
    <SectionCard title="Pagos por confirmar" hint={`${pendingList.length} en revisión`}>
      {pendingList.length === 0 ? (
        <div className="px-5 py-10 flex flex-col items-center gap-2 text-center">
          <CheckCircle2 className="w-8 h-8 text-edu-success" />
          <span className="text-sm text-edu-ink-500">No hay pagos pendientes por confirmar.</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[680px]">
            <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr_0.8fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
              {["Representante", "Monto", "Método", "Fecha", "Acción"].map((h) => (
                <Th key={h}>{h}</Th>
              ))}
            </div>
            {pendingList.map((p, i) => (
              <div
                key={p.id}
                className={`grid grid-cols-[1.2fr_1fr_1fr_1fr_0.8fr] px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < pendingList.length - 1 ? "border-b border-edu-border-soft" : ""}`}
              >
                <span className="text-sm text-edu-ink font-semibold flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5 text-edu-ink-400 shrink-0" /> {p.rep}
                </span>
                <span className="text-sm text-edu-ink-700 font-semibold">{p.amount}</span>
                <span className="text-[0.8125rem] text-edu-ink-500">{p.method}</span>
                <span className="text-[0.8125rem] text-edu-ink-500">{p.date}</span>
                <button
                  onClick={() => confirm(p.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-edu-control text-[0.8rem] font-semibold border-none cursor-pointer transition-colors w-fit bg-edu-success text-white hover:opacity-90"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Aceptar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </SectionCard>
  );
}
