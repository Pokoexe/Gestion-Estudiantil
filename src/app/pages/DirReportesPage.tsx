import { useState } from "react";
import {
  Download,
  Users,
  GraduationCap,
  ShieldCheck,
  ClipboardCheck,
  CheckCircle2,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
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

interface Indicator {
  label: string;
  value: string;
  icon: React.FC<{ style?: React.CSSProperties }>;
  ac: { bg: string; fg: string };
  hint: string;
}

const INDICATORS: Indicator[] = [
  { label: "Matrícula total", value: "612", icon: Users, ac: accent.blue, hint: "+38 vs. período anterior" },
  { label: "Promedio institucional", value: "15,8", icon: GraduationCap, ac: accent.amber, hint: "Escala 0 – 20" },
  { label: "Solvencia", value: "78 %", icon: ShieldCheck, ac: accent.purple, hint: "478 representantes al día" },
  { label: "Asistencia anual", value: "91 %", icon: ClipboardCheck, ac: accent.green, hint: "Promedio 2026-I" },
];

const MATRICULA_ANIO = [
  { anio: "1.º", estudiantes: 96 },
  { anio: "2.º", estudiantes: 90 },
  { anio: "3.º", estudiantes: 88 },
  { anio: "4.º", estudiantes: 84 },
  { anio: "5.º", estudiantes: 79 },
  { anio: "6.º", estudiantes: 58 },
];

const RENDIMIENTO_LAPSO = [
  { lapso: "Lapso I", promedio: 15.1 },
  { lapso: "Lapso II", promedio: 15.6 },
  { lapso: "Lapso III", promedio: 15.8 },
];

const PAGOS_MONEDA = [
  { name: "USD", value: 46, fill: color.success },
  { name: "Bs.", value: 33, fill: color.warning },
  { name: "COP", value: 21, fill: color.primary },
];

const ASISTENCIA_MES = [
  { mes: "Feb", asistencia: 88 },
  { mes: "Mar", asistencia: 90 },
  { mes: "Abr", asistencia: 89 },
  { mes: "May", asistencia: 92 },
  { mes: "Jun", asistencia: 91 },
  { mes: "Jul", asistencia: 93 },
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

function TooltipBox({ active, payload, label, suffix }: any) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-edu-surface border border-edu-border rounded-edu-chip px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
      <div className="text-[0.72rem] font-bold text-edu-ink mb-1">{label ?? payload[0].name}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey ?? p.name} className="flex items-center gap-1.5 text-[0.72rem] text-edu-ink-700">
          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: p.color ?? p.payload.fill }} />
          {p.name}: <strong>{p.value}{suffix ?? ""}</strong>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function DirReportesPage() {
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Encabezado de sección */}
      <div className="flex justify-between items-end flex-wrap gap-3">
        <div>
          <h2 className="m-0 text-edu-ink font-bold text-xl">Estadísticas generales de la institución</h2>
          <p className="m-0 mt-1 text-edu-ink-400 text-[0.85rem]">
            Indicadores clave, rendimiento y finanzas · Período 2026-I
          </p>
        </div>
        <button
          onClick={handleExport}
          className={`inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold border-none cursor-pointer transition-colors ${
            exported ? "bg-edu-success text-white" : "text-white hover:opacity-90"
          }`}
          style={exported ? undefined : { backgroundColor: color.warning }}
        >
          {exported ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
          {exported ? "Reporte generado" : "Exportar reporte"}
        </button>
      </div>

      {/* Indicadores clave */}
      <div className="grid grid-cols-4 gap-4">
        {INDICATORS.map((ind) => {
          const Icon = ind.icon;
          return (
            <div key={ind.label} className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-edu-ink-500 text-[0.72rem] font-medium m-0 uppercase tracking-[0.05em]">{ind.label}</p>
                  <p className="text-[1.6rem] font-bold mt-1.5 m-0 text-edu-ink">{ind.value}</p>
                </div>
                <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: ind.ac.bg }}>
                  <Icon style={{ width: "20px", height: "20px", color: ind.ac.fg }} />
                </div>
              </div>
              <p className="text-edu-ink-400 text-[0.72rem] m-0">{ind.hint}</p>
            </div>
          );
        })}
      </div>

      {/* Matrícula por año + rendimiento por lapso */}
      <div className="grid grid-cols-2 gap-4 items-stretch">
        <SectionCard title="Matrícula por año" hint="Estudiantes activos">
          <div className="px-3 pt-[18px] pb-3 flex-1">
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={MATRICULA_ANIO} margin={{ top: 6, right: 12, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={color.borderSoft} vertical={false} />
                <XAxis dataKey="anio" tick={{ fontSize: 12, fill: color.ink500 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: color.ink400 }} axisLine={false} tickLine={false} width={40} />
                <Tooltip content={<TooltipBox />} cursor={{ fill: color.subtle }} />
                <Bar dataKey="estudiantes" name="Estudiantes" fill={color.primary} radius={[5, 5, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Rendimiento por lapso" hint="Promedio 0 – 20">
          <div className="px-3 pt-[18px] pb-3 flex-1">
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={RENDIMIENTO_LAPSO} margin={{ top: 6, right: 16, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={color.borderSoft} vertical={false} />
                <XAxis dataKey="lapso" tick={{ fontSize: 12, fill: color.ink500 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: color.ink400 }} axisLine={false} tickLine={false} width={40} domain={[14, 17]} />
                <Tooltip content={<TooltipBox />} />
                <Line type="monotone" dataKey="promedio" name="Promedio" stroke={color.warning} strokeWidth={2.5} dot={{ r: 4, fill: color.warning, strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Distribución de pagos + asistencia mensual */}
      <div className="grid grid-cols-[1fr_1.5fr] gap-4 items-stretch">
        <SectionCard title="Pagos por moneda" hint="% del total recaudado">
          <div className="px-3 pt-2 pb-3 flex-1 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie data={PAGOS_MONEDA} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="82%" paddingAngle={3} stroke="none">
                  {PAGOS_MONEDA.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<TooltipBox suffix=" %" />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-1 flex-wrap">
              {PAGOS_MONEDA.map((m) => (
                <span key={m.name} className="inline-flex items-center gap-1.5 text-[0.75rem] text-edu-ink-500">
                  <span className="w-2.5 h-2.5 rounded-[3px]" style={{ backgroundColor: m.fill }} /> {m.name} · {m.value} %
                </span>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Asistencia mensual" hint="% promedio · últimos 6 meses">
          <div className="px-3 pt-[18px] pb-3 flex-1">
            <ResponsiveContainer width="100%" height={190}>
              <AreaChart data={ASISTENCIA_MES} margin={{ top: 6, right: 12, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradAsistMes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color.success} stopOpacity={0.28} />
                    <stop offset="100%" stopColor={color.success} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={color.borderSoft} vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: color.ink500 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: color.ink400 }} axisLine={false} tickLine={false} width={40} domain={[80, 100]} />
                <Tooltip content={<TooltipBox suffix=" %" />} />
                <Area type="monotone" dataKey="asistencia" name="Asistencia" stroke={color.success} strokeWidth={2.5} fill="url(#gradAsistMes)" dot={{ r: 3, fill: color.success, strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
