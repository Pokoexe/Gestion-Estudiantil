import { useNavigate } from "react-router";
import {
  Layers,
  BookOpen,
  Users,
  GraduationCap,
  ClipboardCheck,
  AlertTriangle,
  UserX,
  CalendarCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { color, accent } from "../theme/tokens";
import { LapsoFilter } from "../components/LapsoFilter";
import { useLapso } from "../context/LapsoContext";
import { useFetch } from "../datos_maquetados";
import {
  getSecciones,
  getRendimiento,
  getRendimientoLapso,
  getAsistenciaMes,
  getAcademicoAjustes,
  type AcademicoLapsoAjustes,
} from "../datos_maquetados/actions/director";

/* ------------------------------------------------------------------ */
/* Datos ficticios                                                     */
/* ------------------------------------------------------------------ */

interface Kpi {
  label: string;
  value: string;
  icon: React.FC<{ style?: React.CSSProperties }>;
  ac: { bg: string; fg: string };
  hint: string;
}

const KPIS: Kpi[] = [
  { label: "Secciones", value: "24", icon: Layers, ac: accent.blue, hint: "7 años · 3 secciones c/u" },
  { label: "Materias", value: "32", icon: BookOpen, ac: accent.purple, hint: "Plan de estudios completo" },
  { label: "Estudiantes", value: "612", icon: Users, ac: accent.green, hint: "Matrícula activa 2026-I" },
  { label: "Promedio general", value: "15,8", icon: GraduationCap, ac: accent.amber, hint: "Escala 0 – 20" },
  { label: "Asistencia global", value: "91 %", icon: ClipboardCheck, ac: accent.red, hint: "Promedio del lapso" },
];

/* Redondeo y recorte de las cifras agregadas ajustadas por lapso. */
const round1 = (n: number) => Math.round(n * 10) / 10;
const clampPct = (n: number) => Math.max(0, Math.min(100, n));

interface AttStat {
  label: string;
  value: string;
  ac: { bg: string; fg: string };
  icon: React.FC<{ style?: React.CSSProperties }>;
}

const ATT_STATS: AttStat[] = [
  { label: "Asistencia hoy", value: "93 %", ac: accent.green, icon: CalendarCheck },
  { label: "Inasistencias del día", value: "43", ac: accent.amber, icon: UserX },
  { label: "Retardos del día", value: "17", ac: accent.blue, icon: AlertTriangle },
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

function TooltipBox({ active, payload, label, suffix }: any) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-edu-surface border border-edu-border rounded-edu-chip px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
      <div className="text-[0.72rem] font-bold text-edu-ink mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-1.5 text-[0.72rem] text-edu-ink-700">
          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: p.color }} />
          {p.name}: <strong>{p.value}{suffix ?? ""}</strong>
        </div>
      ))}
    </div>
  );
}

/** Punto del gráfico de lapsos; resalta el lapso actualmente seleccionado. */
function LapsoDot({ cx, cy, index, selectedIndex }: any) {
  if (cx == null || cy == null) return null;
  const sel = index === selectedIndex;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={sel ? 7 : 4}
      fill={color.warning}
      stroke={sel ? color.primary : "transparent"}
      strokeWidth={sel ? 2.5 : 0}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function DirAcademicoPage() {
  const navigate = useNavigate();
  const { selected, selectedId } = useLapso();

  const { data: SECTIONS, loading: loadingSecciones } = useFetch(getSecciones, []);
  const { data: PERFORMANCE, loading: loadingRendimiento } = useFetch(getRendimiento, []);
  const { data: RENDIMIENTO_LAPSO, loading: loadingRendLapso } = useFetch(getRendimientoLapso, []);
  const { data: ASISTENCIA_MES, loading: loadingAsistencia } = useFetch(getAsistenciaMes, []);
  const ajustesEmpty: AcademicoLapsoAjustes = {
    promedioPorLapso: { 1: 0, 2: 0, 3: 0 },
    deltaPromedio: { 1: 0, 2: 0, 3: 0 },
    deltaAsistencia: { 1: 0, 2: 0, 3: 0 },
  };
  const { data: ajustes, loading: loadingAjustes } = useFetch(getAcademicoAjustes, ajustesEmpty);

  if (loadingSecciones || loadingRendimiento || loadingRendLapso || loadingAsistencia || loadingAjustes)
    return <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">Cargando…</div>;

  // Cifras agregadas ajustadas al lapso seleccionado.
  const kpis = KPIS.map((k) => {
    if (k.label === "Promedio general")
      return { ...k, value: (ajustes.promedioPorLapso[selectedId] ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 1 }), hint: `Escala 0 – 20 · ${selected.label}` };
    if (k.label === "Asistencia global")
      return { ...k, value: `${clampPct(91 + (ajustes.deltaAsistencia[selectedId] ?? 0))} %`, hint: `Promedio del ${selected.label.toLowerCase()}` };
    return k;
  });
  const sections = SECTIONS.map((s) => ({
    ...s,
    average: round1(s.average + (ajustes.deltaPromedio[selectedId] ?? 0)),
    attendance: clampPct(s.attendance + (ajustes.deltaAsistencia[selectedId] ?? 0)),
  }));
  const performance = PERFORMANCE.map((p) => ({ ...p, promedio: round1(p.promedio + (ajustes.deltaPromedio[selectedId] ?? 0)) }));

  return (
    <div className="flex flex-col gap-5">
      {/* Encabezado de sección */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="m-0 text-edu-ink font-bold text-xl">Panorama académico global</h2>
          <p className="m-0 mt-1 text-edu-ink-400 text-[0.85rem]">
            Rendimiento, asistencia e incidencias de toda la institución · Período 2026-I
          </p>
        </div>
        <LapsoFilter />
      </div>

      {/* Fila de KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => {
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

      {/* Rendimiento por año + resumen de asistencia */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-4 items-stretch">
        <SectionCard title="Rendimiento por año" hint="Promedio institucional 0 – 20">
          <div className="px-3 pt-[18px] pb-3 flex-1">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={performance} margin={{ top: 6, right: 12, left: -14, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={color.borderSoft} vertical={false} />
                <XAxis dataKey="anio" tick={{ fontSize: 12, fill: color.ink500 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: color.ink400 }} axisLine={false} tickLine={false} domain={[0, 20]} width={40} />
                <Tooltip content={<TooltipBox />} cursor={{ fill: color.subtle }} />
                <Bar dataKey="promedio" name="Promedio" fill={color.warning} radius={[5, 5, 0, 0]} maxBarSize={44} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Resumen de asistencia" hint="Miércoles 1 jul 2026">
          <div className="p-4 flex flex-col gap-3 flex-1">
            {ATT_STATS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-3.5 bg-edu-subtle rounded-edu-control px-4 py-3 border border-edu-border-soft">
                  <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: s.ac.bg }}>
                    <Icon style={{ width: "20px", height: "20px", color: s.ac.fg }} />
                  </div>
                  <div>
                    <div className="text-[1.3rem] font-bold text-edu-ink leading-none">{s.value}</div>
                    <div className="text-[0.78rem] text-edu-ink-500 mt-1">{s.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      {/* Asistencia mensual + Rendimiento por lapso */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        <SectionCard title="Asistencia mensual" hint="% promedio · últimos 6 meses">
          <div className="px-3 pt-[18px] pb-3 flex-1">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={ASISTENCIA_MES} margin={{ top: 6, right: 12, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradAsistAcad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color.success} stopOpacity={0.28} />
                    <stop offset="100%" stopColor={color.success} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={color.borderSoft} vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: color.ink500 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: color.ink400 }} axisLine={false} tickLine={false} width={40} domain={[80, 100]} />
                <Tooltip content={<TooltipBox suffix=" %" />} />
                <Area type="monotone" dataKey="asistencia" name="Asistencia" stroke={color.success} strokeWidth={2.5} fill="url(#gradAsistAcad)" dot={{ r: 3, fill: color.success, strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Rendimiento por lapso" hint="Promedio 0 – 20">
          <div className="px-3 pt-[18px] pb-3 flex-1">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={RENDIMIENTO_LAPSO} margin={{ top: 6, right: 16, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={color.borderSoft} vertical={false} />
                <XAxis dataKey="lapso" tick={{ fontSize: 12, fill: color.ink500 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: color.ink400 }} axisLine={false} tickLine={false} width={40} domain={[14, 17]} />
                <Tooltip content={<TooltipBox />} />
                <Line type="monotone" dataKey="promedio" name="Promedio" stroke={color.warning} strokeWidth={2.5} dot={(p: any) => <LapsoDot key={p.index} {...p} selectedIndex={selectedId - 1} />} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Tabla de secciones por año */}
      <SectionCard title="Secciones por año" hint="24 secciones activas">
        <div className="overflow-x-auto">
          <div className="min-w-[680px]">
          <div className="grid grid-cols-[1fr_1fr_0.8fr_0.9fr_1fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
            {["Año", "Secciones", "Estudiantes", "Promedio", "Asistencia"].map((h) => (
              <Th key={h}>{h}</Th>
            ))}
          </div>
          {sections.map((r, i) => (
            <div
              key={r.year}
              onClick={() => navigate("/director/secciones")}
              className={`grid grid-cols-[1fr_1fr_0.8fr_0.9fr_1fr] px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle cursor-pointer ${i < sections.length - 1 ? "border-b border-edu-border-soft" : ""}`}
            >
              <span className="text-sm text-edu-ink font-semibold">{r.year}</span>
              <span className="text-[0.8125rem] text-edu-ink-500">{r.section}</span>
              <span className="text-sm text-edu-ink-700">{r.students}</span>
              <span className={`text-sm font-semibold ${r.average >= 15 ? "text-edu-ink" : "text-edu-warning"}`}>{r.average.toLocaleString("es-ES")}</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-edu-border-soft rounded-edu-pill overflow-hidden">
                  <div className="h-full rounded-edu-pill" style={{ width: `${r.attendance}%`, backgroundColor: r.attendance >= 90 ? color.success : color.warning }} />
                </div>
                <span className="text-[0.8rem] text-edu-ink-700 font-medium">{r.attendance} %</span>
              </div>
            </div>
          ))}
          </div>
        </div>
      </SectionCard>

    </div>
  );
}
