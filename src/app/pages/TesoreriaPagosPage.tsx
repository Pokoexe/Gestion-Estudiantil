import { useState } from "react";
import {
  Wallet,
  Coins,
  Banknote,
  HandCoins,
  X,
  Receipt,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { color, accent } from "../theme/tokens";

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */

type Currency = "USD" | "Bs." | "COP";
type Method = "Efectivo" | "Transferencia";
type PayStatus = "confirmed" | "review";

interface Payment {
  id: number;
  rep: string;
  student: string;
  amount: number;
  currency: Currency;
  date: string;
  method: Method;
  status: PayStatus;
}

/* ------------------------------------------------------------------ */
/* Datos ficticios                                                     */
/* ------------------------------------------------------------------ */

const PAYMENTS: Payment[] = [
  { id: 1, rep: "María Fernanda Rojas", student: "Diego Rojas · 4.º A", amount: 65, currency: "USD", date: "1 jul 2026", method: "Efectivo", status: "confirmed" },
  { id: 2, rep: "Carlos Alberto Guerra", student: "Valentina Guerra · 1.º B", amount: 2400, currency: "Bs.", date: "1 jul 2026", method: "Transferencia", status: "confirmed" },
  { id: 3, rep: "Yohana Piñango", student: "Samuel Piñango · 6.º A", amount: 260000, currency: "COP", date: "30 jun 2026", method: "Transferencia", status: "confirmed" },
  { id: 4, rep: "Ronald Betancourt", student: "Isabella Betancourt · 3.º C", amount: 65, currency: "USD", date: "30 jun 2026", method: "Efectivo", status: "confirmed" },
  { id: 5, rep: "Génesis Alvarado", student: "Mateo Alvarado · 2.º A", amount: 2400, currency: "Bs.", date: "29 jun 2026", method: "Transferencia", status: "review" },
  { id: 6, rep: "Douglas Sánchez", student: "Andrea Sánchez · 5.º B", amount: 65, currency: "USD", date: "28 jun 2026", method: "Efectivo", status: "confirmed" },
  { id: 7, rep: "Marbella Quintero", student: "Josué Quintero · 1.º A", amount: 130000, currency: "COP", date: "27 jun 2026", method: "Transferencia", status: "confirmed" },
  { id: 8, rep: "Alexis Parra", student: "Camila Parra · 4.º B", amount: 4800, currency: "Bs.", date: "26 jun 2026", method: "Efectivo", status: "confirmed" },
];

/** Recaudo del mes en USD (equivalente) — para la gráfica. */
const MONTHLY: { dia: string; monto: number }[] = [
  { dia: "Sem 1", monto: 1240 },
  { dia: "Sem 2", monto: 1980 },
  { dia: "Sem 3", monto: 2340 },
  { dia: "Sem 4", monto: 2890 },
];

const CURRENCIES: Currency[] = ["USD", "Bs.", "COP"];

/* Saldo disponible por moneda (caja de Administración). */
const AVAILABLE: { currency: Currency; value: number; icon: React.FC<{ style?: React.CSSProperties }>; ac: { bg: string; fg: string }; hint: string }[] = [
  { currency: "USD", value: 8450, icon: Wallet, ac: accent.green, hint: "Dólares en caja" },
  { currency: "Bs.", value: 312500, icon: Coins, ac: accent.blue, hint: "Bolívares · Tasa BCV 36,80" },
  { currency: "COP", value: 1240000, icon: Banknote, ac: accent.purple, hint: "Pesos · frontera Táchira" },
];

const STATUS_META: Record<PayStatus, { label: string; cls: string }> = {
  confirmed: { label: "Confirmado", cls: "bg-edu-success-bg text-edu-success" },
  review: { label: "En revisión", cls: "bg-edu-warning-bg text-edu-warning" },
};

const money = (n: number) => n.toLocaleString("es-ES", { maximumFractionDigits: 2 });

const COLS = "grid-cols-[1.3fr_1.3fr_0.9fr_0.6fr_0.9fr_1fr_0.9fr]";
const HEADERS = ["Representante", "Estudiante", "Monto", "Moneda", "Fecha", "Método", "Estado"];

/* ------------------------------------------------------------------ */
/* Tooltip de la gráfica                                               */
/* ------------------------------------------------------------------ */

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-edu-surface border border-edu-border rounded-edu-chip shadow-[0_4px_16px_rgba(0,0,0,0.08)] px-3 py-2">
      <div style={{ fontSize: "0.7rem", color: color.ink400, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
      <div style={{ fontSize: "0.9rem", color: color.ink, fontWeight: 700, marginTop: "2px" }}>$ {payload[0].value.toLocaleString("es-ES")}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function TesoreriaPagosPage() {
  const [payments, setPayments] = useState<Payment[]>(PAYMENTS);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ rep: "", amount: "", currency: "USD" as Currency, concepto: "Mensualidad" });

  const openModal = () => {
    setForm({ rep: "", amount: "", currency: "USD", concepto: "Mensualidad" });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevo: Payment = {
      id: Date.now(),
      rep: form.rep.trim() || "Representante",
      student: form.concepto.trim() || "Mensualidad",
      amount: Number(form.amount) || 0,
      currency: form.currency,
      date: "3 jul 2026",
      method: "Efectivo",
      status: "confirmed",
    };
    setPayments([nuevo, ...payments]);
    setShowModal(false);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* KPIs de disponibilidad por moneda */}
      <div className="grid grid-cols-3 gap-4">
        {AVAILABLE.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.currency} className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">Disponible · {k.currency}</p>
                  <p className="text-edu-ink text-[1.6rem] font-bold mt-1 m-0">{money(k.value)}</p>
                </div>
                <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: k.ac.bg }}>
                  <Icon style={{ width: "20px", height: "20px", color: k.ac.fg }} />
                </div>
              </div>
              <p className="text-edu-ink-400 text-xs m-0">{k.hint}</p>
            </div>
          );
        })}
      </div>

      {/* Acción */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={openModal}
          className="inline-flex items-center gap-[9px] px-5 py-[11px] rounded-edu-control text-sm font-semibold cursor-pointer transition-colors border-none bg-edu-success text-white hover:brightness-95"
        >
          <HandCoins style={{ width: "16px", height: "16px" }} />
          Agregar pago en efectivo
        </button>
      </div>

      {/* Gráfica de pagos del mes */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-edu-border-soft">
          <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Pagos de julio 2026</h3>
          <p className="mt-0.5 text-edu-ink-400 text-[0.78rem]">Recaudo semanal en USD equivalente</p>
        </div>
        <div className="px-4 pt-5 pb-3">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={MONTHLY} margin={{ top: 8, right: 12, left: 4, bottom: 0 }} barCategoryGap="32%">
              <CartesianGrid vertical={false} stroke={color.borderSoft} />
              <XAxis dataKey="dia" tickLine={false} axisLine={{ stroke: color.border }} tick={{ fill: color.ink400, fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: color.ink400, fontSize: 12 }} tickFormatter={(v) => `$ ${(v / 1000).toLocaleString("es-ES")}k`} width={48} />
              <Tooltip cursor={{ fill: color.successBg }} content={<ChartTooltip />} />
              <Bar dataKey="monto" radius={[6, 6, 0, 0]} maxBarSize={54}>
                {MONTHLY.map((_, i) => (
                  <Cell key={i} fill={i === MONTHLY.length - 1 ? color.success : "#86efac"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historial de pagos */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
          <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Historial de pagos</h3>
          <span className="text-[0.8rem] text-edu-ink-400 font-medium">{payments.length} pagos</span>
        </div>
        <div className={`grid ${COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
          {HEADERS.map((h) => (
            <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
          ))}
        </div>
        {payments.map((p, i) => {
          const st = STATUS_META[p.status];
          return (
            <div key={p.id} className={`grid ${COLS} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < payments.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
              <span className="text-sm text-edu-ink font-medium">{p.rep}</span>
              <span className="text-[0.8125rem] text-edu-ink-700">{p.student}</span>
              <span className="text-sm text-edu-ink font-bold">{money(p.amount)}</span>
              <span className="text-[0.8125rem] text-edu-ink-700">{p.currency}</span>
              <span className="text-[0.8125rem] text-edu-ink-500">{p.date}</span>
              <span className="text-[0.8125rem] text-edu-ink-700">{p.method}</span>
              <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${st.cls}`}>{st.label}</span>
            </div>
          );
        })}
      </div>

      {/* Modal: agregar pago en efectivo */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-edu-surface rounded-edu-card w-full max-w-md shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-edu-control bg-edu-success-bg flex items-center justify-center">
                  <Receipt className="w-4 h-4 text-edu-success" />
                </div>
                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Registrar pago en efectivo</h3>
              </div>
              <button onClick={() => setShowModal(false)} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
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
              <div className="grid grid-cols-[1.4fr_1fr] gap-3">
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
                    {CURRENCIES.map((c) => (
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
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle">
                  Cancelar
                </button>
                <button type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control bg-edu-success text-white text-sm font-semibold border-none cursor-pointer transition-colors hover:brightness-95">
                  <HandCoins className="w-4 h-4" />
                  Registrar pago
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
