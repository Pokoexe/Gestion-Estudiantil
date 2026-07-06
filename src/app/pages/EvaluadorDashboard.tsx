import { useNavigate } from "react-router";
import {
  ClipboardList,
  FileCheck2,
  FileBarChart2,
  Upload,
  CalendarClock,
  FilePlus2,
  MessageSquarePlus,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { color, shadow, accent } from "../theme/tokens";
import { useFetch } from "../datos_maquetados";
import { getDashboard, type DashboardKpiKey } from "../datos_maquetados/actions/evaluador";

/* ------------------------------------------------------------------ */
/* Presentación (label/icono/tono/ruta) — los VALORES vienen del fetch */
/* ------------------------------------------------------------------ */

const KPI_META: Record<
  DashboardKpiKey,
  { label: string; icon: React.FC<{ style?: React.CSSProperties }>; tone: { bg: string; fg: string }; to: string }
> = {
  revisiones: { label: "Revisiones pendientes", icon: ClipboardList, tone: accent.amber, to: "/evaluador/revisiones" },
  examenes: { label: "Exámenes por aprobar", icon: FileCheck2, tone: accent.blue, to: "/evaluador/revisiones" },
  boletines: { label: "Boletines generados", icon: FileBarChart2, tone: accent.green, to: "/evaluador/boletines" },
};

/** Color de cada barra del gráfico, por estado. */
const CHART_FILL: Record<string, string> = {
  Pendiente: color.primary,
  Aprobado: color.success,
  Cambios: color.danger,
};

const QUICK_ACTIONS: {
  label: string;
  icon: React.FC<{ style?: React.CSSProperties }>;
  primary: boolean;
  to: string;
}[] = [
  { label: "Subir planilla de evaluación", icon: Upload, primary: true, to: "/evaluador/revisiones" },
  { label: "Asignar cronograma", icon: CalendarClock, primary: false, to: "/evaluador/cronograma" },
  { label: "Generar boletín", icon: FilePlus2, primary: false, to: "/evaluador/boletines" },
  { label: "Nueva discusión de notas", icon: MessageSquarePlus, primary: false, to: "/evaluador/discusion" },
];

/* ------------------------------------------------------------------ */
/* Subcomponentes                                                      */
/* ------------------------------------------------------------------ */

function SectionCard({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
        <div>
          <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 mb-0 text-edu-ink-400 text-[0.775rem]">{subtitle}</p>
          )}
        </div>
        {action && (
          <span className="text-[0.8rem] text-edu-primary cursor-pointer font-medium">
            {action}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function Pill({ label, tone }: { label: string; tone: { bg: string; fg: string } }) {
  return (
    <span
      className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit whitespace-nowrap"
      style={{ backgroundColor: tone.bg, color: tone.fg }}
    >
      {label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function EvaluadorDashboard() {
  const navigate = useNavigate();
  const { data, loading } = useFetch(getDashboard, { kpis: [], chart: [] });

  const kpis = data.kpis.map((k) => ({ ...k, ...KPI_META[k.key] }));
  const chartData = data.chart.map((c) => ({ ...c, fill: CHART_FILL[c.estado] ?? color.primary }));

  if (loading) {
    return (
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">
        Cargando…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Fila de KPIs — cada bloque redirige a su página */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.key}
              onClick={() => navigate(kpi.to)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && navigate(kpi.to)}
              className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5 cursor-pointer transition-colors hover:border-edu-primary-200 focus:outline-none focus-visible:border-edu-primary"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-edu-ink-500 text-[0.75rem] font-medium m-0 uppercase tracking-[0.05em]">
                    {kpi.label}
                  </p>
                  <p className="text-edu-ink text-[1.6rem] font-bold mt-1.5 mb-0">
                    {kpi.value}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0"
                  style={{ backgroundColor: kpi.tone.bg }}
                >
                  <Icon style={{ width: "20px", height: "20px", color: kpi.tone.fg }} />
                </div>
              </div>
              <p className="text-edu-ink-400 text-[0.75rem] m-0">{kpi.foot}</p>
            </div>
          );
        })}
      </div>

      {/* Acciones rápidas (estilo botones) */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
        {QUICK_ACTIONS.map((qa) => {
          const Icon = qa.icon;
          return (
            <button
              key={qa.label}
              onClick={() => navigate(qa.to)}
              className={`w-full inline-flex justify-center items-center gap-[9px] px-5 py-[11px] rounded-edu-control text-sm font-semibold cursor-pointer transition-colors ${qa.primary
                ? "border-none bg-edu-primary text-white hover:bg-edu-primary-hover"
                : "border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 hover:bg-edu-subtle"
                }`}
            >
              <Icon style={{ width: "16px", height: "16px" }} />
              {qa.label}
            </button>
          );
        })}
      </div>

      {/* Cronograma + gráfico */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5 items-stretch">
        {/* Cronograma de evaluación */}
        <SectionCard title="Cronograma de evaluación" subtitle="Lapso académico en curso" action="Ajustar reglas →">
          <div className="p-5 flex flex-col gap-[18px]">
            <div className="flex justify-between items-start flex-wrap gap-2.5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[1.1rem] font-bold text-edu-ink">Lapso II · 2026-I</span>
                  <Pill label="En curso" tone={accent.green} />
                </div>
                <p className="mt-1 mb-0 text-[0.8rem] text-edu-ink-500">
                  Cierre del lapso: <strong className="text-edu-ink-700">31 jul 2026</strong>
                </p>
              </div>
              <div className="text-right">
                <div className="text-[1.4rem] font-bold text-edu-primary">64 %</div>
                <div className="text-[0.72rem] text-edu-ink-400">del lapso transcurrido</div>
              </div>
            </div>

            {/* Barra de progreso / timeline */}
            <div className="flex flex-col gap-1.5">
              <div className="h-2.5 bg-edu-border-soft rounded-edu-pill overflow-hidden">
                <div className="h-full w-[64%] bg-edu-primary rounded-edu-pill" />
              </div>
              <div className="flex justify-between text-[0.7rem] text-edu-ink-400">
                <span>1 jul</span>
                <span>Hoy · 20 jul</span>
                <span>31 jul</span>
              </div>
            </div>

            {/* Reglas de tiempo */}
            <div className="flex gap-3 flex-wrap">
              <div className="flex-1 min-w-[150px] bg-edu-primary-50 rounded-edu-chip px-3.5 py-3 flex items-center gap-2.5">
                <CalendarClock style={{ width: "18px", height: "18px", color: color.primary, flexShrink: 0 }} />
                <div>
                  <div className="text-[0.72rem] text-edu-ink-500 font-medium">Separación mínima</div>
                  <div className="text-[0.9rem] text-edu-ink font-bold">5 días entre evaluaciones</div>
                </div>
              </div>
              <div className="flex-1 min-w-[150px] bg-edu-warning-bg rounded-edu-chip px-3.5 py-3 flex items-center gap-2.5">
                <CalendarClock style={{ width: "18px", height: "18px", color: color.warning, flexShrink: 0 }} />
                <div>
                  <div className="text-[0.72rem] text-edu-ink-500 font-medium">Separación máxima</div>
                  <div className="text-[0.9rem] text-edu-ink font-bold">15 días entre evaluaciones</div>
                </div>
              </div>
            </div>
            <p className="m-0 text-[0.775rem] text-edu-ink-400">
              Regla vigente: Mín. 5 días · Máx. 15 días entre evaluaciones. Próxima evaluación habilitada desde el 8 jul 2026.
            </p>
          </div>
        </SectionCard>

        {/* Gráfico revisiones por estado */}
        <SectionCard title="Revisiones por estado" subtitle="Distribución del lapso">
          <div className="px-3 pt-4 pb-2.5">
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={color.borderSoft} vertical={false} />
                <XAxis
                  dataKey="estado"
                  tick={{ fontSize: 11, fill: color.ink500 }}
                  axisLine={{ stroke: color.border }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: color.ink400 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: color.subtle }}
                  contentStyle={{
                    borderRadius: "var(--radius-chip, 8px)",
                    border: `1px solid ${color.border}`,
                    fontSize: "0.8rem",
                    boxShadow: shadow.menu,
                  }}
                />
                <Bar dataKey="cantidad" radius={[6, 6, 0, 0]} maxBarSize={54}>
                  {chartData.map((d) => (
                    <Cell key={d.estado} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
