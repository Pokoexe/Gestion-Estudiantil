import { useState } from "react";
import {
  DollarSign,
  Coins,
  Banknote,
  ShieldCheck,
  Phone,
  CheckCircle2,
  Package,
  AlertTriangle,
  Receipt,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { color, accent } from "../theme/tokens";

/* ------------------------------------------------------------------ */
/* Datos ficticios                                                     */
/* ------------------------------------------------------------------ */

interface IncomeKpi {
  label: string;
  value: string;
  icon: React.FC<{ style?: React.CSSProperties }>;
  ac: { bg: string; fg: string };
  hint: string;
}

const INCOME_KPIS: IncomeKpi[] = [
  { label: "Ingresos USD", value: "$ 8.450", icon: DollarSign, ac: accent.green, hint: "Recaudado este mes" },
  { label: "Ingresos Bs.", value: "Bs. 308.000", icon: Banknote, ac: accent.amber, hint: "Recaudado este mes" },
  { label: "Ingresos COP", value: "$ 29,1 M", icon: Coins, ac: accent.blue, hint: "Recaudado este mes" },
  { label: "Solvencia", value: "78 %", icon: ShieldCheck, ac: accent.purple, hint: "478 de 612 al día" },
];

const PAGOS_MONEDA = [
  { name: "USD", value: 46, fill: color.success },
  { name: "Bs.", value: 33, fill: color.warning },
  { name: "COP", value: 21, fill: color.primary },
];

const MONTHLY = [
  { mes: "Feb", ingresos: 6800 },
  { mes: "Mar", ingresos: 7250 },
  { mes: "Abr", ingresos: 7020 },
  { mes: "May", ingresos: 7980 },
  { mes: "Jun", ingresos: 8210 },
  { mes: "Jul", ingresos: 8450 },
];

interface Debtor {
  id: number;
  name: string;
  student: string;
  months: number;
  amount: string;
  phone: string;
}

const DEBTORS: Debtor[] = [
  { id: 1, name: "Carmen Rojas", student: "Luis Fernández — 4.º B", months: 3, amount: "600 USD", phone: "0414-123..." },
  { id: 2, name: "Pedro Malavé", student: "Andrea Malavé — 2.º A", months: 2, amount: "400 USD", phone: "0424-556..." },
  { id: 3, name: "Yolanda Pérez", student: "Diego Pérez — 5.º C", months: 4, amount: "800 USD", phone: "0416-778..." },
  { id: 4, name: "José Guerra", student: "Marta Guerra — 1.º B", months: 1, amount: "200 USD", phone: "0412-990..." },
];

interface PendingPayment {
  id: number;
  rep: string;
  amount: string;
  method: string;
  date: string;
}

const PENDING: PendingPayment[] = [
  { id: 1, rep: "Ana Beltrán", amount: "200 USD", method: "Zelle", date: "2 jul 2026" },
  { id: 2, rep: "Luis Contreras", amount: "7.300 Bs.", method: "Pago Móvil", date: "1 jul 2026" },
  { id: 3, rep: "María Salcedo", amount: "780.000 COP", method: "Nequi", date: "1 jul 2026" },
];

interface InventoryItem {
  label: string;
  value: string;
  ac: { bg: string; fg: string };
}

const INVENTORY: InventoryItem[] = [
  { label: "Artículos en almacén", value: "1.284", ac: accent.blue },
  { label: "Bajo stock", value: "12", ac: accent.amber },
  { label: "Valor estimado", value: "$ 14.200", ac: accent.green },
];

/* ------------------------------------------------------------------ */
/* Subcomponentes                                                      */
/* ------------------------------------------------------------------ */

function SectionCard({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">{title}</h3>
        {hint && <span className="text-xs text-edu-ink-400 font-medium">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">
      {children}
    </span>
  );
}

function TooltipBox({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-edu-surface border border-edu-border rounded-edu-chip px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
      <div className="text-[0.72rem] font-bold text-edu-ink mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-1.5 text-[0.72rem] text-edu-ink-700">
          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: p.color }} />
          {p.name}: <strong>$ {Number(p.value).toLocaleString("es-ES")}</strong>
        </div>
      ))}
    </div>
  );
}

function PieTooltipBox({ active, payload }: any) {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0];
  return (
    <div className="bg-edu-surface border border-edu-border rounded-edu-chip px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-1.5 text-[0.72rem] text-edu-ink-700">
        <span className="w-2 h-2 rounded-[3px] inline-block" style={{ backgroundColor: p.payload.fill }} />
        {p.name}: <strong>{p.value} %</strong>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function DirFinanzasPage() {
  const [contacted, setContacted] = useState<number[]>([]);
  const [confirmed, setConfirmed] = useState<number[]>([]);

  const pendingList = PENDING.filter((p) => !confirmed.includes(p.id));

  return (
    <div className="flex flex-col gap-5">
      {/* Encabezado de sección */}
      <div>
        <h2 className="m-0 text-edu-ink font-bold text-xl">Finanzas globales</h2>
        <p className="m-0 mt-1 text-edu-ink-400 text-[0.85rem]">
          Ingresos por moneda, morosidad e inventario · Período 2026-I
        </p>
      </div>

      {/* Fila de KPIs de ingresos */}
      <div className="grid grid-cols-4 gap-4">
        {INCOME_KPIS.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-edu-surface rounded-edu-card p-5 flex flex-col gap-3 border border-edu-border-soft">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-edu-ink-500 text-[0.72rem] font-medium m-0 uppercase tracking-[0.05em]">{kpi.label}</p>
                  <p className="text-[1.5rem] font-bold mt-1.5 m-0 text-edu-ink">{kpi.value}</p>
                </div>
                <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: kpi.ac.bg }}>
                  <Icon style={{ width: "20px", height: "20px", color: kpi.ac.fg }} />
                </div>
              </div>
              <p className="text-edu-ink-400 text-[0.72rem] m-0">{kpi.hint}</p>
            </div>
          );
        })}
      </div>

      {/* Ingresos mensuales + pagos por moneda + inventario */}
      <div className="grid grid-cols-[1.5fr_0.9fr_1fr] gap-4 items-stretch">
        <SectionCard title="Ingresos mensuales" hint="Equivalente en USD · últimos 6 meses">
          <div className="px-3 pt-[18px] pb-3 flex-1">
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={MONTHLY} margin={{ top: 6, right: 12, left: -6, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color.warning} stopOpacity={0.28} />
                    <stop offset="100%" stopColor={color.warning} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={color.borderSoft} vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: color.ink500 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: color.ink400 }} axisLine={false} tickLine={false} width={48} />
                <Tooltip content={<TooltipBox />} />
                <Area type="monotone" dataKey="ingresos" name="Ingresos" stroke={color.warning} strokeWidth={2.5} fill="url(#gradIngresos)" dot={{ r: 3, fill: color.warning, strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Pagos por moneda" hint="% del total recaudado">
          <div className="px-3 pt-2 pb-3 flex-1 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={PAGOS_MONEDA} dataKey="value" nameKey="name" innerRadius="52%" outerRadius="80%" paddingAngle={3} stroke="none">
                  {PAGOS_MONEDA.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltipBox />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1.5 mt-1 w-full px-2">
              {PAGOS_MONEDA.map((m) => (
                <span key={m.name} className="inline-flex items-center gap-1.5 text-[0.75rem] text-edu-ink-500">
                  <span className="w-2.5 h-2.5 rounded-[3px]" style={{ backgroundColor: m.fill }} /> {m.name} · {m.value} %
                </span>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Resumen de inventario" hint="Almacén general">
          <div className="p-4 flex flex-col gap-3 flex-1">
            {INVENTORY.map((it) => (
              <div key={it.label} className="flex items-center gap-3.5 bg-edu-subtle rounded-edu-control px-4 py-3 border border-edu-border-soft">
                <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: it.ac.bg }}>
                  <Package style={{ width: "20px", height: "20px", color: it.ac.fg }} />
                </div>
                <div>
                  <div className="text-[1.25rem] font-bold text-edu-ink leading-none">{it.value}</div>
                  <div className="text-[0.78rem] text-edu-ink-500 mt-1">{it.label}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Representantes deudores */}
      <SectionCard title="Representantes deudores" hint={`${DEBTORS.length} sin solvencia`}>
        <div>
          <div className="grid grid-cols-[1.2fr_1.4fr_0.7fr_0.8fr_0.9fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
            {["Representante", "Estudiante", "Meses", "Monto", "Acción"].map((h) => (
              <Th key={h}>{h}</Th>
            ))}
          </div>
          {DEBTORS.map((d, i) => {
            const done = contacted.includes(d.id);
            return (
              <div
                key={d.id}
                className={`grid grid-cols-[1.2fr_1.4fr_0.7fr_0.8fr_0.9fr] px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < DEBTORS.length - 1 ? "border-b border-edu-border-soft" : ""}`}
              >
                <span className="text-sm text-edu-ink font-semibold">{d.name}</span>
                <span className="text-[0.8125rem] text-edu-ink-500">{d.student}</span>
                <span className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit bg-edu-danger-bg text-edu-danger">{d.months} mes{d.months > 1 ? "es" : ""}</span>
                <span className="text-sm text-edu-ink-700 font-semibold">{d.amount}</span>
                <button
                  onClick={() => setContacted((c) => (c.includes(d.id) ? c : [...c, d.id]))}
                  disabled={done}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-edu-control text-[0.8rem] font-semibold border-none cursor-pointer transition-colors w-fit ${
                    done ? "bg-edu-success-bg text-edu-success cursor-default" : "bg-edu-primary text-white hover:bg-edu-primary-hover"
                  }`}
                >
                  {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
                  {done ? "Contactado" : "Contactar"}
                </button>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Pagos por confirmar */}
      <SectionCard title="Pagos por confirmar" hint={`${pendingList.length} en revisión`}>
        {pendingList.length === 0 ? (
          <div className="px-5 py-10 flex flex-col items-center gap-2 text-center">
            <CheckCircle2 className="w-8 h-8 text-edu-success" />
            <span className="text-sm text-edu-ink-500">No hay pagos pendientes por confirmar.</span>
          </div>
        ) : (
          <div>
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
                  onClick={() => setConfirmed((c) => [...c, p.id])}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-edu-control text-[0.8rem] font-semibold border-none cursor-pointer transition-colors w-fit bg-edu-success text-white hover:opacity-90"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Aceptar
                </button>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Aviso de morosidad */}
      <div className="px-4 py-3 bg-edu-warning-bg rounded-edu-control flex items-center gap-2.5">
        <AlertTriangle style={{ width: "18px", height: "18px", color: color.warning, flexShrink: 0 }} />
        <span className="text-[0.82rem] text-edu-ink-700">
          Representantes sin solvencia: <strong className="text-edu-warning">134</strong> · Monto adeudado estimado:{" "}
          <strong className="text-edu-warning">$ 12.400 USD</strong>
        </span>
      </div>
    </div>
  );
}
