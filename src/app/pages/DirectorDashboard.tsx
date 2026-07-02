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
  BarChart,
  Bar,
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
  { moneda: "USD", recaudado: 8450, pendiente: 2380 },
  { moneda: "Bs", recaudado: 6120, pendiente: 3540 },
  { moneda: "COP", recaudado: 7280, pendiente: 1960 },
];

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
  { label: "Estudiantes activos", value: "612", icon: Users, tone: accent.blue, trend: "3 % vs. mes anterior", up: true },
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

      {/* Matrícula y asistencia + resumen académico */}
      <div className="grid grid-cols-[1.7fr_1fr] gap-4 items-stretch">
        {/* Gráfico principal */}
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
          <SectionHeader title="Matrícula y asistencia" hint="Últimos 6 meses" />
          <div className="px-3 pt-[18px] pb-2 flex-1">
            <div className="flex gap-[18px] px-2.5 pb-3">
              <span className="inline-flex items-center gap-1.5 text-xs text-edu-ink-500">
                <span className="w-2.5 h-2.5 rounded-[3px] bg-edu-primary" /> Matrícula
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-edu-ink-500">
                <span className="w-2.5 h-2.5 rounded-[3px] bg-edu-purple" /> Asistencia %
              </span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={ENROLLMENT} margin={{ top: 6, right: 12, left: -8, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradMatricula" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color.primary} stopOpacity={0.28} />
                    <stop offset="100%" stopColor={color.primary} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gradAsistencia" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color.purple} stopOpacity={0.22} />
                    <stop offset="100%" stopColor={color.purple} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={color.borderSoft} vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: color.ink500 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: color.ink400 }} axisLine={false} tickLine={false} width={40} domain={[540, 640]} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: color.ink400 }} axisLine={false} tickLine={false} width={32} domain={[70, 100]} />
                <Tooltip content={<TooltipBox />} />
                <Area yAxisId="left" type="monotone" dataKey="matricula" name="Matrícula" stroke={color.primary} strokeWidth={2.5} fill="url(#gradMatricula)" dot={{ r: 3, fill: color.primary, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                <Area yAxisId="right" type="monotone" dataKey="asistencia" name="Asistencia %" stroke={color.purple} strokeWidth={2.5} fill="url(#gradAsistencia)" dot={{ r: 3, fill: color.purple, strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resumen académico */}
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
          <SectionHeader title="Resumen académico" />
          <div className="p-4 flex flex-col gap-3">
            {[
              { label: "Promedio institucional", value: "15,8", unit: "/20", tone: accent.blue, bar: 79 },
              { label: "Asistencia promedio", value: "91", unit: "%", tone: accent.purple, bar: 91 },
              { label: "Materias en reparación", value: "6", unit: "materias", tone: accent.amber, bar: 24 },
            ].map((item) => (
              <div key={item.label} className="bg-edu-subtle rounded-edu-control px-4 py-3.5 border border-edu-border-soft">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-[0.78rem] text-edu-ink-500 font-medium">{item.label}</span>
                  <span className="text-[1.1rem] font-bold text-edu-ink">
                    {item.value}
                    <span className="text-[0.72rem] text-edu-ink-400 font-medium"> {item.unit}</span>
                  </span>
                </div>
                <div className="h-1.5 bg-edu-border-soft rounded-edu-pill overflow-hidden">
                  <div
                    className="h-full rounded-edu-pill"
                    style={{ width: `${item.bar}%`, backgroundColor: item.tone.fg }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resumen financiero + solvencia */}
      <div className="grid grid-cols-[1.7fr_1fr] gap-4 items-stretch">
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
          <SectionHeader title="Resumen financiero" hint="Recaudado vs. pendiente por moneda" />
          <div className="px-3 pt-[18px] pb-3 flex-1">
            <div className="flex gap-[18px] px-2.5 pb-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-edu-ink-500">
                <span className="w-2.5 h-2.5 rounded-[3px] bg-edu-primary" /> Recaudado
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-edu-ink-500">
                <span className="w-2.5 h-2.5 rounded-[3px]" style={{ backgroundColor: color.ink300 }} /> Pendiente
              </span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={FINANCE} margin={{ top: 6, right: 12, left: -8, bottom: 0 }} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke={color.borderSoft} vertical={false} />
                <XAxis dataKey="moneda" tick={{ fontSize: 12, fill: color.ink500 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: color.ink400 }} axisLine={false} tickLine={false} width={44} />
                <Tooltip content={<TooltipBox />} cursor={{ fill: color.subtle }} />
                <Bar dataKey="recaudado" name="Recaudado" fill={color.primary} radius={[5, 5, 0, 0]} maxBarSize={34} />
                <Bar dataKey="pendiente" name="Pendiente" fill={color.ink300} radius={[5, 5, 0, 0]} maxBarSize={34} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mx-4 mb-4 px-4 py-3 bg-edu-warning-bg rounded-edu-control flex items-center gap-2.5">
            <AlertTriangle style={{ width: "18px", height: "18px", color: accent.amber.fg, flexShrink: 0 }} />
            <span className="text-[0.82rem] text-edu-ink-700">
              Representantes sin solvencia: <strong className="text-edu-warning">14</strong>
            </span>
          </div>
        </div>

        {/* Donut de solvencia */}
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
          <SectionHeader title="Solvencia institucional" />
          <div className="px-4 pt-2.5 pb-4 flex-1 flex flex-col items-center justify-center">
            <div className="relative w-full h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="72%" outerRadius="100%" data={SOLVENCY} startAngle={90} endAngle={-270}>
                  <RadialBar background={{ fill: color.borderSoft }} dataKey="value" cornerRadius={10} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[2rem] font-bold text-edu-ink">78 %</span>
                <span className="text-[0.72rem] text-edu-ink-500">al día</span>
              </div>
            </div>
            <div className="flex justify-between w-full mt-2 gap-2">
              <div className="flex-1 text-center bg-edu-success-bg rounded-edu-chip px-1 py-2">
                <div className="text-[0.95rem] font-bold text-edu-success">478</div>
                <div className="text-[0.68rem] text-edu-ink-500">Solventes</div>
              </div>
              <div className="flex-1 text-center bg-edu-danger-bg rounded-edu-chip px-1 py-2">
                <div className="text-[0.95rem] font-bold text-edu-danger">134</div>
                <div className="text-[0.68rem] text-edu-ink-500">Pendientes</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal y académico */}
      <div>
        <div className="mb-3">
          <h3 className="m-0 text-edu-ink font-bold text-base">Personal y académico</h3>
          <p className="m-0 mt-0.5 text-edu-ink-400 text-[0.8rem]">Indicadores operativos del período</p>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {STAFF.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-[18px] flex items-center gap-3.5">
                <div
                  className="w-11 h-11 rounded-edu-control flex items-center justify-center shrink-0"
                  style={{ backgroundColor: s.tone.bg }}
                >
                  <Icon style={{ width: "22px", height: "22px", color: s.tone.fg }} />
                </div>
                <div>
                  <div className="text-[1.4rem] font-bold text-edu-ink leading-[1.1]">{s.value}</div>
                  <div className="text-[0.78rem] text-edu-ink-500 mt-0.5">{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Próximas actividades + Cierre de lapso */}
      <div className="grid grid-cols-[1.4fr_1fr] gap-4 items-stretch">
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

        {/* Cierre de lapso */}
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
          <SectionHeader title="Cierre de lapso" hint="2026-I" />
          <div className="px-5 py-[18px] flex flex-col gap-4 flex-1">
            <div className="flex items-center gap-3 bg-edu-primary-50 rounded-edu-control px-4 py-3.5">
              <div className="w-10 h-10 rounded-edu-control bg-edu-surface flex items-center justify-center shrink-0">
                <CalendarDays style={{ width: "20px", height: "20px", color: color.primary }} />
              </div>
              <div>
                <div className="text-[0.72rem] text-edu-ink-500 font-medium uppercase tracking-[0.05em]">Fin del lapso</div>
                <div className="text-[1.05rem] font-bold text-edu-ink">31 jul 2026</div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-[0.8rem] text-edu-ink-500 font-medium">Progreso del período</span>
                <span className="text-[0.9rem] font-bold text-edu-primary">65 %</span>
              </div>
              <div className="h-2.5 bg-edu-border-soft rounded-edu-pill overflow-hidden">
                <div className="h-full w-[65%] rounded-edu-pill bg-[linear-gradient(90deg,#1a56db,#7c3aed)]" />
              </div>
              <div className="text-[0.72rem] text-edu-ink-400 mt-1.5">Faltan 30 días para el cierre</div>
            </div>

            <div className="flex flex-col gap-2.5 mt-0.5">
              <span className="text-[0.72rem] text-edu-ink-500 font-semibold uppercase tracking-[0.05em]">Hitos</span>
              {MILESTONES.map((m) => (
                <div key={m.label} className="flex items-center gap-2.5">
                  {m.done ? (
                    <CheckCircle2 style={{ width: "18px", height: "18px", color: color.success, flexShrink: 0 }} />
                  ) : (
                    <Circle style={{ width: "18px", height: "18px", color: color.ink300, flexShrink: 0 }} />
                  )}
                  <span className={`text-[0.85rem] font-medium ${m.done ? "text-edu-ink-700" : "text-edu-ink-500"}`}>{m.label}</span>
                  <span
                    className={`ml-auto text-[0.68rem] font-semibold px-2 py-0.5 rounded-edu-pill ${m.done ? "bg-edu-success-bg text-edu-success" : "bg-edu-subtle text-edu-ink-400"}`}
                  >
                    {m.done ? "Completado" : "Pendiente"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
