import { ArrowDownRight, Pencil } from "lucide-react";
import type { Movement } from "@shared/services/actions/tesoreria";

type Props = {
  movements: Movement[];
  onEdit: (m: Movement) => void;
};

export function MovementsLog({ movements, onEdit }: Props) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
        <div>
          <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Registro de descuentos</h3>
          <p className="mt-0.5 text-edu-ink-400 text-[0.78rem]">Constancia de cada salida de inventario y su observación</p>
        </div>
        <span className="text-[0.8rem] text-edu-ink-400 font-medium">
          {movements.length} movimiento{movements.length === 1 ? "" : "s"}
        </span>
      </div>
      {movements.length === 0 ? (
        <div className="px-5 py-8 text-center text-edu-ink-400 text-sm">Aún no se han registrado descuentos.</div>
      ) : (
        movements.map((m, i) => (
          <div
            key={m.id}
            onClick={() => onEdit(m)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onEdit(m)}
            className={`px-5 py-3 flex items-start gap-3 cursor-pointer transition-colors hover:bg-edu-subtle focus:outline-none focus-visible:bg-edu-subtle ${i < movements.length - 1 ? "border-b border-edu-border-soft" : ""}`}
          >
            <div className="w-8 h-8 rounded-edu-control bg-edu-warning-bg flex items-center justify-center shrink-0">
              <ArrowDownRight className="w-4 h-4 text-edu-warning" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[0.875rem] text-edu-ink font-medium">−{m.qty.toLocaleString("es-ES")} · {m.item}</div>
              <div className="text-[0.8rem] text-edu-ink-500 break-words">{m.note}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[0.72rem] text-edu-ink-400">{m.date}</span>
              <Pencil className="w-3.5 h-3.5 text-edu-ink-300" />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
