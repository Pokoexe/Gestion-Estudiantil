import { PackagePlus, ArrowDownRight, X } from "lucide-react";
import type { Currency } from "@shared/services/actions/tesoreria";

type Form = { name: string; category: string; qty: string; cost: string; currency: Currency };

type Props = {
  form: Form;
  setForm: (f: Form) => void;
  categories: string[];
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  field: string;
};

export function AddInventoryModal({ form, setForm, categories, onSubmit, onClose, field }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-edu-surface rounded-edu-card w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-edu-control bg-edu-success-bg flex items-center justify-center">
              <PackagePlus className="w-4 h-4 text-edu-success" />
            </div>
            <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Agregar inventario</h3>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-edu-ink-700 text-sm font-medium">Artículo</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej. Ventiladores de pared" className={field} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-edu-ink-700 text-sm font-medium">Categoría</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={`${field} cursor-pointer`}>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-edu-ink-700 text-sm font-medium">Cantidad</label>
              <input type="number" required min="0" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} placeholder="0" className={field} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-edu-ink-700 text-sm font-medium">Costo total</label>
              <input type="number" required min="0" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} placeholder="0" className={field} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-edu-ink-700 text-sm font-medium">Moneda</label>
              <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value as Currency })} className={`${field} cursor-pointer`}>
                {(["USD", "Bs.", "COP"] as Currency[]).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-3 rounded-edu-control bg-edu-warning-bg text-edu-warning text-[0.8125rem]">
            <ArrowDownRight className="w-4 h-4 shrink-0" />
            <span>El costo se descontará del saldo disponible al guardar.</span>
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle">
              Cancelar
            </button>
            <button type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control bg-edu-success text-white text-sm font-semibold border-none cursor-pointer transition-colors hover:brightness-95">
              <PackagePlus className="w-4 h-4" />
              Guardar y descontar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
