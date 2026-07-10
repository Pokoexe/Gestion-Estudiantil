import { ArrowDownRight, X } from "lucide-react";
import { color } from "@themes/tokens";
import type { InvItem } from "@shared/services/actions/tesoreria";

type DiscountForm = { qty: string; note: string };

type Props = {
  item: InvItem;
  discountForm: DiscountForm;
  setDiscountForm: (f: DiscountForm) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  field: string;
};

export function DiscountItemModal({ item, discountForm, setDiscountForm, onSubmit, onClose, field }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-edu-surface rounded-edu-card w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-edu-control bg-edu-warning-bg flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4 text-edu-warning" />
            </div>
            <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Descontar del inventario</h3>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between px-4 py-3 rounded-edu-control bg-edu-subtle">
            <div>
              <div className="text-[0.875rem] text-edu-ink font-semibold">{item.name}</div>
              <div className="text-[0.72rem] text-edu-ink-400">{item.category}</div>
            </div>
            <div className="text-right">
              <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em]">En stock</div>
              <div className="text-[1.1rem] text-edu-ink font-bold">{item.qty.toLocaleString("es-ES")}</div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-edu-ink-700 text-sm font-medium">Cantidad a descontar</label>
            <input
              type="number"
              required
              min="1"
              max={item.qty}
              value={discountForm.qty}
              onChange={(e) => setDiscountForm({ ...discountForm, qty: e.target.value })}
              placeholder="Ej. 5"
              className={field}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-edu-ink-700 text-sm font-medium">Observación</label>
            <textarea
              required
              rows={3}
              value={discountForm.note}
              onChange={(e) => setDiscountForm({ ...discountForm, note: e.target.value })}
              placeholder="Ej. Se usaron 5 globos para el acto cultural del viernes."
              className={`${field} resize-none`}
            />
            <span className="text-[0.72rem] text-edu-ink-400">Queda registrado como constancia del uso.</span>
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle">
              Cancelar
            </button>
            <button type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold border-none cursor-pointer transition-colors hover:brightness-95" style={{ backgroundColor: color.warning }}>
              <ArrowDownRight className="w-4 h-4" />
              Descontar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
