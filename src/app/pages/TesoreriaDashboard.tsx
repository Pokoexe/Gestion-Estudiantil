import { useState } from "react";
import {
  Wallet,
  Coins,
  Banknote,
  AlertTriangle,
  HandCoins,
  BellRing,
  PackagePlus,
  Check,
  X,
  TrendingUp,
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
import { color, radius, shadow, accent } from "../theme/tokens";

/* ---------- Datos ficticios ---------- */

const KPIS: {
  label: string;
  value: string;
  hint: string;
  icon: React.FC<{ style?: React.CSSProperties }>;
  ac: { bg: string; fg: string };
  trend?: string;
}[] = [
  {
    label: "Recaudado este mes",
    value: "$ 8.450",
    hint: "USD · 68 pagos confirmados",
    icon: Wallet,
    ac: accent.green,
    trend: "+12,4 % vs. mayo",
  },
  {
    label: "Bolívares (Bs)",
    value: "Bs 312.500",
    hint: "VES · 41 pagos en efectivo",
    icon: Coins,
    ac: accent.blue,
    trend: "Tasa BCV: 36,80",
  },
  {
    label: "Pesos (COP)",
    value: "$ 1.240.000",
    hint: "COP · 9 transferencias",
    icon: Banknote,
    ac: accent.purple,
    trend: "Frontera Táchira",
  },
  {
    label: "Sin solvencia",
    value: "14",
    hint: "representantes con mora",
    icon: AlertTriangle,
    ac: accent.red,
    trend: "$ 2.310 por cobrar",
  },
];

const QUICK_ACTIONS: {
  label: string;
  icon: React.FC<{ style?: React.CSSProperties }>;
  primary: boolean;
}[] = [
  { label: "Registrar pago en efectivo", icon: HandCoins, primary: true },
  { label: "Enviar recordatorios", icon: BellRing, primary: false },
  { label: "Agregar inventario", icon: PackagePlus, primary: false },
];

const MONTHLY_COLLECTION: { mes: string; monto: number }[] = [
  { mes: "Ene", monto: 6120 },
  { mes: "Feb", monto: 6980 },
  { mes: "Mar", monto: 7540 },
  { mes: "Abr", monto: 7210 },
  { mes: "May", monto: 7520 },
  { mes: "Jun", monto: 8450 },
];

const PENDING_PAYMENTS: {
  id: number;
  rep: string;
  student: string;
  amount: string;
  method: string;
  date: string;
  ref: string;
}[] = [
  { id: 1, rep: "María Fernanda Rojas", student: "Diego Rojas · 4to A", amount: "$ 65", method: "Transferencia", date: "28 jun 2026", ref: "Zelle · 4821" },
  { id: 2, rep: "Carlos Alberto Guerra", student: "Valentina Guerra · 1ro B", amount: "Bs 2.400", method: "Transferencia", date: "29 jun 2026", ref: "Pago Móvil · 0102" },
  { id: 3, rep: "Yohana Piñango", student: "Samuel Piñango · 6to A", amount: "$ 130.000", method: "Transferencia", date: "30 jun 2026", ref: "Nequi COP · 3390" },
  { id: 4, rep: "Ronald Betancourt", student: "Isabella Betancourt · 3ro C", amount: "$ 65", method: "Transferencia", date: "30 jun 2026", ref: "Zelle · 7715" },
  { id: 5, rep: "Génesis Alvarado", student: "Mateo Alvarado · 2do A", amount: "Bs 2.400", method: "Transferencia", date: "1 jul 2026", ref: "Pago Móvil · 0134" },
];

const DEBTORS: {
  id: number;
  rep: string;
  student: string;
  months: number;
  amount: string;
}[] = [
  { id: 1, rep: "Pedro Nava", student: "Andrés Nava · 5to B", months: 3, amount: "$ 195" },
  { id: 2, rep: "Luisana Mendoza", student: "Camila Mendoza · 1ro A", amount: "Bs 7.200", months: 3 },
  { id: 3, rep: "Jorge Emilio Castro", student: "Sofía Castro · 4to C", months: 2, amount: "$ 130" },
  { id: 4, rep: "Neida Contreras", student: "Luis Contreras · 3ro A", months: 5, amount: "$ 390.000" },
  { id: 5, rep: "Wilmer Ochoa", student: "Gabriel Ochoa · 6to B", months: 1, amount: "$ 65" },
  { id: 6, rep: "Aracelis Duque", student: "Daniela Duque · 2do C", months: 4, amount: "Bs 9.600" },
];

/* ---------- Metadatos semánticos ---------- */

function monthsBadge(m: number): { bg: string; fg: string } {
  if (m >= 4) return { bg: color.dangerBg, fg: color.danger };
  if (m >= 2) return { bg: color.warningBg, fg: color.warning };
  return { bg: color.primary50, fg: color.primary };
}

/* ---------- Subcomponentes ---------- */

function SectionHeader({ title, link, subtitle }: { title: string; link?: string; subtitle?: string }) {
  return (
    <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
      <div>
        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">{title}</h3>
        {subtitle && <p className="mt-0.5 text-edu-ink-400 text-[0.78rem]">{subtitle}</p>}
      </div>
      {link && <span className="text-[0.8rem] text-edu-primary cursor-pointer font-medium">{link} →</span>}
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-edu-surface border border-edu-border rounded-edu-chip shadow-[0_4px_16px_rgba(0,0,0,0.08)] px-3 py-2">
      <div style={{ fontSize: "0.7rem", color: color.ink400, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label} 2026</div>
      <div style={{ fontSize: "0.9rem", color: color.ink, fontWeight: 700, marginTop: "2px" }}>
        $ {payload[0].value.toLocaleString("es-ES")}
      </div>
    </div>
  );
}

/* ---------- Vista principal ---------- */

export function TesoreriaDashboard() {
  const [tab, setTab] = useState<"pagos" | "solvencia">("pagos");

  return (
    <div className="flex flex-col gap-5">
      {/* Fila de KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {KPIS.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                    {kpi.label}
                  </p>
                  <p className="text-edu-ink text-[1.4rem] font-bold mt-1">{kpi.value}</p>
                </div>
                <div
                  className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0"
                  style={{ backgroundColor: kpi.ac.bg }}
                >
                  <Icon style={{ width: "20px", height: "20px", color: kpi.ac.fg }} />
                </div>
              </div>
              <p className="text-edu-ink-400 text-xs m-0">{kpi.hint}</p>
              {kpi.trend && (
                <span
                  className="inline-flex items-center gap-[5px] text-[0.7rem] font-semibold px-[9px] py-[3px] rounded-edu-pill w-fit"
                  style={{ color: kpi.ac.fg, backgroundColor: kpi.ac.bg }}
                >
                  <TrendingUp style={{ width: "11px", height: "11px" }} />
                  {kpi.trend}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Acciones rápidas */}
      <div className="flex gap-3 flex-wrap">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              className={`inline-flex items-center gap-[9px] px-5 py-[11px] rounded-edu-control text-sm font-semibold cursor-pointer transition-colors ${
                action.primary
                  ? "border-none bg-edu-primary text-white hover:bg-edu-primary-hover"
                  : "border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 hover:bg-edu-subtle"
              }`}
            >
              <Icon style={{ width: "16px", height: "16px" }} />
              {action.label}
            </button>
          );
        })}
      </div>

      {/* Pagos del mes (col-span-2) + panel con pestañas (col-span-1) */}
      <div className="grid grid-cols-3 gap-5">
        {/* Pagos del mes — gráfico */}
        <div className="col-span-2 bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
          <SectionHeader title="Pagos del mes" subtitle="Recaudo en USD · últimos 6 meses" link="Ver reporte completo" />
          <div className="px-4 pt-5 pb-3">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={MONTHLY_COLLECTION} margin={{ top: 8, right: 12, left: 4, bottom: 0 }} barCategoryGap="32%">
                <CartesianGrid vertical={false} stroke={color.borderSoft} />
                <XAxis
                  dataKey="mes"
                  tickLine={false}
                  axisLine={{ stroke: color.border }}
                  tick={{ fill: color.ink400, fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: color.ink400, fontSize: 12 }}
                  tickFormatter={(v) => `$ ${(v / 1000).toLocaleString("es-ES")}k`}
                  width={48}
                />
                <Tooltip cursor={{ fill: color.primary50 }} content={<CustomTooltip />} />
                <Bar dataKey="monto" radius={[6, 6, 0, 0]} maxBarSize={46}>
                  {MONTHLY_COLLECTION.map((entry, i) => (
                    <Cell key={i} fill={i === MONTHLY_COLLECTION.length - 1 ? color.primary : color.primary200} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Panel con 2 pestañas: por confirmar / sin solvencia (máx. 5 ítems) */}
        <div className="col-span-1 bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
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
                    active ? "border-edu-primary text-edu-primary" : "border-transparent text-edu-ink-500 hover:text-edu-ink-700"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Pagos manuales por confirmar */}
          {tab === "pagos" && (
            <div className="flex flex-col">
              {PENDING_PAYMENTS.slice(0, 5).map((p, i, arr) => (
                <div
                  key={p.id}
                  className={`px-4 py-3 flex flex-col gap-2 ${i < arr.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <div className="text-[0.8125rem] text-edu-ink font-medium truncate">{p.rep}</div>
                      <div className="text-[0.72rem] text-edu-ink-400 truncate">{p.student}</div>
                    </div>
                    <span className="text-[0.8125rem] text-edu-ink font-bold shrink-0">{p.amount}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[0.7rem] text-edu-ink-400 truncate">{p.method} · {p.ref}</span>
                    <div className="flex gap-1.5 shrink-0">
                      <button aria-label="Aceptar" className="w-7 h-7 rounded-edu-chip border-none bg-edu-success text-white flex items-center justify-center cursor-pointer">
                        <Check style={{ width: "13px", height: "13px" }} />
                      </button>
                      <button aria-label="Rechazar" className="w-7 h-7 rounded-edu-chip border-none bg-edu-danger-bg text-edu-danger flex items-center justify-center cursor-pointer">
                        <X style={{ width: "13px", height: "13px" }} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Representantes sin solvencia */}
          {tab === "solvencia" && (
            <div className="flex flex-col">
              {DEBTORS.slice(0, 5).map((d, i, arr) => {
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
      </div>
    </div>
  );
}
