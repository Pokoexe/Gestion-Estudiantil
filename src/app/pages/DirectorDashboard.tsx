import {
  Users,
  GraduationCap,
  ShieldCheck,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Layers,
  AlertTriangle,
  CalendarDays,
  Trophy,
  Palette,
  FlaskConical,
  CheckCircle2,
  Circle,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { color, radius, accent } from "../theme/tokens";

/* ------------------------------------------------------------------ */
/* Datos ficticios                                                     */
/* ------------------------------------------------------------------ */

const ENROLLMENT = [
  { mes: "Feb", matricula: 574, asistencia: 88 },
  { mes: "Mar", matricula: 586, asistencia: 90 },
  { mes: "Abr", matricula: 595, asistencia: 89 },
  { mes: "May", matricula: 601, asistencia: 92 },
  { mes: "Jun", matricula: 608, asistencia: 91 },
  { mes: "Jul", matricula: 612, asistencia: 93 },
];

const FINANCE = [
  { mes: "Feb", usd: 6200, cop: 5400, bs: 4300, sinPagar: 3100 },
  { mes: "Mar", usd: 6800, cop: 5900, bs: 4700, sinPagar: 2900 },
  { mes: "Abr", usd: 7100, cop: 6300, bs: 5100, sinPagar: 3300 },
  { mes: "May", usd: 7600, cop: 6800, bs: 5400, sinPagar: 2600 },
  { mes: "Jun", usd: 8100, cop: 7000, bs: 5800, sinPagar: 2800 },
  { mes: "Jul", usd: 8450, cop: 7280, bs: 6120, sinPagar: 2380 },
];

const FINANCE_SERIES = [
  { key: "usd", name: "USD", stroke: color.success },
  { key: "cop", name: "COP", stroke: color.primary },
  { key: "bs", name: "Bs", stroke: color.purple },
  { key: "sinPagar", name: "Sin pagar", stroke: color.danger },
] as const;

const SOLVENCY = [{ name: "Solvencia", value: 78, fill: color.success }];

const STAFF = [
  { label: "Docentes activos", value: "38", icon: GraduationCap, tone: accent.blue },
  { label: "Secciones", value: "24", icon: Layers, tone: accent.purple },
  { label: "Materias", value: "32", icon: BookOpen, tone: accent.green },
  { label: "Incidencias del mes", value: "9", icon: AlertTriangle, tone: accent.amber },
];

const ACTIVITIES: {
  name: string;
  type: "Deportiva" | "Cultural" | "Académica";
  date: string;
  owner: string;
}[] = [
    { name: "Feria de Ciencias", type: "Académica", date: "12 jul 2026", owner: "Prof. Alejandro Morales" },
    { name: "Torneo interseccional de fútbol", type: "Deportiva", date: "18 jul 2026", owner: "Prof. Ricardo Salas" },
    { name: "Festival de talentos", type: "Cultural", date: "24 jul 2026", owner: "Prof. Daniela Herrera" },
    { name: "Olimpiada de Matemática", type: "Académica", date: "30 jul 2026", owner: "Prof. Carmen Villalobos" },
  ];

const ACTIVITY_META: Record<
  "Deportiva" | "Cultural" | "Académica",
  { bg: string; fg: string; icon: React.FC<{ style?: React.CSSProperties }> }
> = {
  Deportiva: { bg: accent.green.bg, fg: accent.green.fg, icon: Trophy },
  Cultural: { bg: accent.purple.bg, fg: accent.purple.fg, icon: Palette },
  Académica: { bg: accent.blue.bg, fg: accent.blue.fg, icon: FlaskConical },
};

const MILESTONES = [
  { label: "Notas cargadas", done: true },
  { label: "Boletines generados", done: true },
  { label: "Discusiones de casos", done: false },
];

const KPIS: {
  label: string;
  value: string;
  icon: React.FC<{ style?: React.CSSProperties }>;
  tone: { bg: string; fg: string };
  trend: string;
  up: boolean;
}[] = [
    { label: "Estudiantes", value: "612", icon: Users, tone: accent.blue, trend: "3 % vs. año anterior", up: true },
    { label: "Docentes", value: "38", icon: GraduationCap, tone: accent.purple, trend: "2 nuevos este período", up: true },
    { label: "Solvencia institucional", value: "78 %", icon: ShieldCheck, tone: accent.amber, trend: "5 % vs. mes anterior", up: true },
    { label: "Ingresos del mes", value: "$ 8.450 USD", icon: DollarSign, tone: accent.green, trend: "4 % vs. mes anterior", up: false },
  ];

/* ------------------------------------------------------------------ */
/* Componentes reutilizables                                           */
/* ------------------------------------------------------------------ */

function SectionHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
      <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">{title}</h3>
      {hint && <span className="text-xs text-edu-ink-400 font-medium">{hint}</span>}
    </div>
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
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Vista principal                                                     */
/* ------------------------------------------------------------------ */

export function DirectorDashboard() {
  return (
    <div className="flex flex-col gap-5">
      {/* Banner ejecutivo */}
      <div className="bg-edu-primary rounded-edu-card px-6 py-[22px] flex justify-between items-center flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck style={{ width: "16px", height: "16px", color: "rgba(255,255,255,0.85)" }} />
            <span className="text-xs font-medium uppercase tracking-[0.06em]" style={{ color: "rgba(255,255,255,0.75)" }}>
              Panel de Dirección · Período 2026-I
            </span>
          </div>
          <h2 className="text-white m-0 mb-1.5 text-xl font-bold">Visión institucional global</h2>
          <p className="m-0 text-[0.8rem]" style={{ color: "rgba(255,255,255,0.78)" }}>
            Unidad Educativa Simón Rodríguez · Actualizado el 1 jul 2026
          </p>
        </div>
        <div className="flex gap-3">
          {[
            { label: "Solvencia", value: "78 %" },
            { label: "Asistencia", value: "91 %" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-[rgba(255,255,255,0.15)] rounded-edu-control px-[18px] py-2.5 text-center">
              <div className="text-[1.3rem] font-bold text-white">{value}</div>
              <div className="text-[0.72rem] mt-px" style={{ color: "rgba(255,255,255,0.75)" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Fila de 4 KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {KPIS.map((kpi) => {
          const Icon = kpi.icon;
          const Trend = kpi.up ? TrendingUp : TrendingDown;
          const trendColor = kpi.up ? color.success : color.danger;
          return (
            <div key={kpi.label} className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                    {kpi.label}
                  </p>
                  <p className="text-edu-ink text-2xl font-bold m-0 mt-1.5">{kpi.value}</p>
                </div>
                <div
                  className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0"
                  style={{ backgroundColor: kpi.tone.bg }}
                >
                  <Icon style={{ width: "20px", height: "20px", color: kpi.tone.fg }} />
                </div>
              </div>
              <div className="inline-flex items-center gap-[5px]">
                <Trend style={{ width: "14px", height: "14px", color: trendColor }} />
                <span className="text-xs font-semibold" style={{ color: trendColor }}>
                  {kpi.up ? "▲" : "▼"} {kpi.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumen financiero + solvencia */}
      <div className="grid grid-cols-[1.7fr_1fr] gap-4 items-stretch">
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
          <SectionHeader title="Resumen financiero" hint="Recaudado por moneda vs. sin pagar" />
          <div className="px-3 pt-[18px] pb-3 flex-1">
            <div className="flex flex-wrap gap-x-[18px] gap-y-1.5 px-2.5 pb-2">
              {FINANCE_SERIES.map((s) => (
                <span key={s.key} className="inline-flex items-center gap-1.5 text-xs text-edu-ink-500">
                  <span className="w-2.5 h-2.5 rounded-[3px]" style={{ backgroundColor: s.stroke }} /> {s.name}
                </span>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={FINANCE} margin={{ top: 6, right: 12, left: -8, bottom: 0 }}>
                <defs>
                  {FINANCE_SERIES.map((s) => (
                    <linearGradient key={s.key} id={`fin-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={s.stroke} stopOpacity={0.22} />
                      <stop offset="95%" stopColor={s.stroke} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={color.borderSoft} vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: color.ink500 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: color.ink400 }} axisLine={false} tickLine={false} width={44} />
                <Tooltip content={<TooltipBox />} cursor={{ stroke: color.ink300, strokeWidth: 1 }} />
                {FINANCE_SERIES.map((s) => (
                  <Area
                    key={s.key}
                    type="monotone"
                    dataKey={s.key}
                    name={s.name}
                    stroke={s.stroke}
                    strokeWidth={2}
                    fill={`url(#fin-${s.key})`}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mx-4 mb-4 px-4 py-3 bg-edu-warning-bg rounded-edu-control flex items-center gap-2.5">
            <AlertTriangle style={{ width: "18px", height: "18px", color: accent.amber.fg, flexShrink: 0 }} />
            <span className="text-[0.82rem] text-edu-ink-700">
              Representantes sin solvencia: <strong className="text-edu-warning">14</strong>
            </span>
          </div>
        </div>
        {/* Próximas actividades */}
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
          <SectionHeader title="Próximas actividades" hint="Julio 2026" />
          <div>
            {ACTIVITIES.map((a, i) => {
              const meta = ACTIVITY_META[a.type];
              const Icon = meta.icon;
              return (
                <div
                  key={a.name}
                  className={`flex items-center gap-3.5 px-5 py-3.5 ${i < ACTIVITIES.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                >
                  <div
                    className="w-[38px] h-[38px] rounded-edu-control flex items-center justify-center shrink-0"
                    style={{ backgroundColor: meta.bg }}
                  >
                    <Icon style={{ width: "18px", height: "18px", color: meta.fg }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[0.9rem] font-semibold text-edu-ink">{a.name}</span>
                      <span
                        className="text-[0.68rem] font-semibold px-2 py-0.5 rounded-edu-pill"
                        style={{ backgroundColor: meta.bg, color: meta.fg }}
                      >
                        {a.type}
                      </span>
                    </div>
                    <div className="text-[0.775rem] text-edu-ink-500 mt-[3px]">{a.owner}</div>
                  </div>
                  <div className="flex items-center gap-[5px] shrink-0">
                    <CalendarDays style={{ width: "13px", height: "13px", color: color.ink400 }} />
                    <span className="text-[0.8rem] text-edu-ink-700 font-medium">{a.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
