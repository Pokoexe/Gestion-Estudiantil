import { useState } from "react";
import {
  PackagePlus,
  Package,
  Wallet,
  X,
  ArrowDownRight,
} from "lucide-react";
import { color } from "../theme/tokens";

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */

type Currency = "USD" | "Bs." | "COP";
type ItemStatus = "ok" | "low" | "out";

interface InvItem {
  id: number;
  name: string;
  category: string;
  qty: number;
  unit: number; // valor unitario en USD
  status: ItemStatus;
}

/* ------------------------------------------------------------------ */
/* Datos ficticios                                                     */
/* ------------------------------------------------------------------ */

const INITIAL: InvItem[] = [
  { id: 1, name: "Sillas de aula", category: "Mobiliario", qty: 340, unit: 12, status: "ok" },
  { id: 2, name: "Mesas de trabajo", category: "Mobiliario", qty: 172, unit: 28, status: "ok" },
  { id: 3, name: "Computadoras de escritorio", category: "Tecnología", qty: 24, unit: 320, status: "low" },
  { id: 4, name: "Tabletas educativas", category: "Tecnología", qty: 6, unit: 150, status: "low" },
  { id: 5, name: "Escobas y coletos", category: "Limpieza", qty: 3, unit: 4, status: "out" },
  { id: 6, name: "Líquidos de limpieza", category: "Limpieza", qty: 42, unit: 3, status: "ok" },
  { id: 7, name: "Pizarras acrílicas", category: "Aula", qty: 28, unit: 22, status: "ok" },
  { id: 8, name: "Resmas de papel bond", category: "Insumos", qty: 90, unit: 5, status: "ok" },
];

const CATEGORIES = ["Mobiliario", "Tecnología", "Limpieza", "Aula", "Insumos"];

const INV_STATUS: Record<ItemStatus, { label: string; bg: string; fg: string }> = {
  ok: { label: "Suficiente", bg: color.successBg, fg: color.success },
  low: { label: "Bajo", bg: color.warningBg, fg: color.warning },
  out: { label: "Agotado", bg: color.dangerBg, fg: color.danger },
};

const money = (n: number) => n.toLocaleString("es-ES", { maximumFractionDigits: 2 });

const COLS = "grid-cols-[1.6fr_1fr_0.7fr_0.9fr_0.9fr_0.9fr]";
const HEADERS = ["Artículo", "Categoría", "Cantidad", "Valor unit.", "Valor total", "Estado"];

const INITIAL_BALANCE = 8450; // saldo disponible en USD

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function TesoreriaInventarioPage() {
  const [items, setItems] = useState<InvItem[]>(INITIAL);
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", category: CATEGORIES[0], qty: "", cost: "", currency: "USD" as Currency });
  const [feedback, setFeedback] = useState<string | null>(null);

  const totalValue = items.reduce((acc, it) => acc + it.qty * it.unit, 0);

  const openModal = () => {
    setForm({ name: "", category: CATEGORIES[0], qty: "", cost: "", currency: "USD" });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(form.qty) || 0;
    const cost = Number(form.cost) || 0; // costo total en USD equivalente
    const unit = qty > 0 ? cost / qty : 0;
    const nuevo: InvItem = {
      id: Date.now(),
      name: form.name.trim() || "Artículo",
      category: form.category,
      qty,
      unit,
      status: qty === 0 ? "out" : qty < 10 ? "low" : "ok",
    };
    setItems([nuevo, ...items]);
    const remaining = balance - cost;
    setBalance(remaining);
    setShowModal(false);
    setFeedback(`Se registró «${nuevo.name}» por ${money(cost)} ${form.currency}. Saldo disponible restante: $ ${money(remaining)} USD.`);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Aviso de descuento */}
      {feedback && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-edu-control text-sm font-medium bg-edu-primary-50 text-edu-primary">
          <ArrowDownRight className="w-4 h-4 shrink-0" />
          <span className="flex-1">{feedback}</span>
          <button onClick={() => setFeedback(null)} aria-label="Cerrar" className="bg-transparent border-none cursor-pointer p-0 flex items-center opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
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
          <p className="text-edu-ink-400 text-xs m-0">{items.length} artículos registrados · USD equivalente</p>
        </div>

        <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">Saldo disponible</p>
              <p className={`text-[1.6rem] font-bold mt-1 m-0 ${balance < INITIAL_BALANCE ? "text-edu-warning" : "text-edu-ink"}`}>$ {money(balance)}</p>
            </div>
            <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: color.primary50 }}>
              <Wallet style={{ width: "20px", height: "20px", color: color.primary }} />
            </div>
          </div>
          <p className="text-edu-ink-400 text-xs m-0">Caja en USD · cada compra lo descuenta</p>
        </div>

        <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col justify-center">
          <button
            onClick={openModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-edu-control text-sm font-semibold cursor-pointer transition-colors border-none bg-edu-success text-white hover:brightness-95"
          >
            <PackagePlus style={{ width: "16px", height: "16px" }} />
            Agregar inventario
          </button>
          <p className="text-edu-ink-400 text-xs m-0 mt-2.5 text-center">Registra una compra y descuenta del saldo</p>
        </div>
      </div>

      {/* Tabla de inventario */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
          <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Inventario de la institución</h3>
          <span className="text-[0.8rem] text-edu-ink-400 font-medium">{items.length} artículos</span>
        </div>
        <div className={`grid ${COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
          {HEADERS.map((h) => (
            <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
          ))}
        </div>
        {items.map((it, i) => {
          const st = INV_STATUS[it.status];
          return (
            <div key={it.id} className={`grid ${COLS} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < items.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
              <span className="text-sm text-edu-ink font-medium">{it.name}</span>
              <span className="text-[0.8125rem] text-edu-ink-700">{it.category}</span>
              <span className="text-sm text-edu-ink-700 font-semibold">{it.qty.toLocaleString("es-ES")}</span>
              <span className="text-[0.8125rem] text-edu-ink-500">$ {money(it.unit)}</span>
              <span className="text-sm text-edu-ink font-bold">$ {money(it.qty * it.unit)}</span>
              <span className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit" style={{ backgroundColor: st.bg, color: st.fg }}>
                {st.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Modal: agregar inventario */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-edu-surface rounded-edu-card w-full max-w-md shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-edu-control bg-edu-success-bg flex items-center justify-center">
                  <PackagePlus className="w-4 h-4 text-edu-success" />
                </div>
                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Agregar inventario</h3>
              </div>
              <button onClick={() => setShowModal(false)} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-edu-ink-700 text-sm font-medium">Artículo</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ej. Ventiladores de pared"
                  className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-success"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-edu-ink-700 text-sm font-medium">Categoría</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-edu-success"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-edu-ink-700 text-sm font-medium">Cantidad</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.qty}
                    onChange={(e) => setForm({ ...form, qty: e.target.value })}
                    placeholder="0"
                    className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-success"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-edu-ink-700 text-sm font-medium">Costo total</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.cost}
                    onChange={(e) => setForm({ ...form, cost: e.target.value })}
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
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle">
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
      )}
    </div>
  );
}
