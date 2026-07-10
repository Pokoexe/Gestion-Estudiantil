import { X, HandCoins, Receipt } from "lucide-react";
import type { Currency } from "@shared/services/actions/tesoreria";

type Form = { rep: string; amount: string; currency: Currency; concepto: string };

type Props = {
  form: Form;
  setForm: (f: Form) => void;
  currencies: Currency[];
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
};

export function AddCashPaymentModal({ form, setForm, currencies, onSubmit, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-edu-surface rounded-edu-card w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-edu-control bg-edu-success-bg flex items-center justify-center">
              <Receipt className="w-4 h-4 text-edu-success" />
            </div>
            <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Registrar pago en efectivo</h3>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-edu-ink-700 text-sm font-medium">Representante</label>
            <input
              type="text"
              required
              value={form.rep}
              onChange={(e) => setForm({ ...form, rep: e.target.value })}
              placeholder="Ej. María Fernanda Rojas"
              className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-success"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[1.4fr_1fr] gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-edu-ink-700 text-sm font-medium">Monto</label>
              <input
                type="number"
                required
                min="0"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0"
                className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-success"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-edu-ink-700 text-sm font-medium">Moneda</label>
              <select
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value as Currency })}
                className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-edu-success"
              >
                {currencies.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-edu-ink-700 text-sm font-medium">Concepto</label>
            <input
              type="text"
              value={form.concepto}
              onChange={(e) => setForm({ ...form, concepto: e.target.value })}
              placeholder="Ej. Mensualidad julio · Diego Rojas 4.º A"
              className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-success"
            />
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control bg-edu-success text-white text-sm font-semibold border-none cursor-pointer transition-colors hover:brightness-95"
            >
              <HandCoins className="w-4 h-4" />
              Registrar pago
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
