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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { color, accent } from "../theme/tokens";

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

interface SectionRow {
  year: string;
  section: string;
  students: number;
  average: number;
  attendance: number;
}

const SECTIONS: SectionRow[] = [
  { year: "1.º Año", section: "A / B / C", students: 96, average: 16.4, attendance: 94 },
  { year: "2.º Año", section: "A / B / C", students: 90, average: 15.9, attendance: 92 },
  { year: "3.º Año", section: "A / B / C", students: 88, average: 15.2, attendance: 89 },
  { year: "4.º Año", section: "A / B / C", students: 84, average: 15.6, attendance: 90 },
  { year: "5.º Año", section: "A / B / C", students: 79, average: 16.1, attendance: 93 },
  { year: "6.º Año", section: "A / B", students: 58, average: 14.8, attendance: 87 },
];

const PERFORMANCE = [
  { anio: "1.º", promedio: 16.4 },
  { anio: "2.º", promedio: 15.9 },
  { anio: "3.º", promedio: 15.2 },
  { anio: "4.º", promedio: 15.6 },
  { anio: "5.º", promedio: 16.1 },
  { anio: "6.º", promedio: 14.8 },
];

interface Incident {
  who: string;
  role: "Docente" | "Estudiante";
  detail: string;
  date: string;
  level: "alta" | "media" | "baja";
}

const INCIDENTS: Incident[] = [
  { who: "Prof. Ricardo Salas", role: "Docente", detail: "Retraso reiterado en carga de notas", date: "1 jul", level: "media" },
  { who: "Luis Fernández — 4.º B", role: "Estudiante", detail: "Ausencia injustificada (3 días)", date: "30 jun", level: "alta" },
  { who: "María Colmenares — 5.º A", role: "Estudiante", detail: "Incidente disciplinario en aula", date: "29 jun", level: "media" },
  { who: "Prof. Daniela Herrera", role: "Docente", detail: "Solicitud de permiso académico", date: "28 jun", level: "baja" },
];

const LEVEL_META: Record<Incident["level"], { label: string; cls: string }> = {
  alta: { label: "Prioridad alta", cls: "bg-edu-danger-bg text-edu-danger" },
  media: { label: "Prioridad media", cls: "bg-edu-warning-bg text-edu-warning" },
  baja: { label: "Informativa", cls: "bg-edu-primary-100 text-edu-primary" },
};

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
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function DirAcademicoPage() {
  return (
    <div className="flex flex-col gap-5">
      {/* Encabezado de sección */}
      <div>
        <h2 className="m-0 text-edu-ink font-bold text-xl">Panorama académico global</h2>
        <p className="m-0 mt-1 text-edu-ink-400 text-[0.85rem]">
          Rendimiento, asistencia e incidencias de toda la institución · Período 2026-I
        </p>
      </div>

      {/* Fila de KPIs */}
      <div className="grid grid-cols-5 gap-4">
        {KPIS.map((kpi) => {
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
      <div className="grid grid-cols-[1.7fr_1fr] gap-4 items-stretch">
        <SectionCard title="Rendimiento por año" hint="Promedio institucional 0 – 20">
          <div className="px-3 pt-[18px] pb-3 flex-1">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={PERFORMANCE} margin={{ top: 6, right: 12, left: -14, bottom: 0 }}>
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

      {/* Tabla de secciones por año */}
      <SectionCard title="Secciones por año" hint="24 secciones activas">
        <div>
          <div className="grid grid-cols-[1fr_1fr_0.8fr_0.9fr_1fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
            {["Año", "Secciones", "Estudiantes", "Promedio", "Asistencia"].map((h) => (
              <Th key={h}>{h}</Th>
            ))}
          </div>
          {SECTIONS.map((r, i) => (
            <div
              key={r.year}
              className={`grid grid-cols-[1fr_1fr_0.8fr_0.9fr_1fr] px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < SECTIONS.length - 1 ? "border-b border-edu-border-soft" : ""}`}
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
      </SectionCard>

      {/* Incidencias recientes */}
      <SectionCard title="Incidencias recientes" hint="Docentes y estudiantes">
        <div>
          {INCIDENTS.map((inc, i) => {
            const meta = LEVEL_META[inc.level];
            return (
              <div
                key={i}
                className={`flex items-center gap-3.5 px-5 py-3.5 transition-colors hover:bg-edu-subtle ${i < INCIDENTS.length - 1 ? "border-b border-edu-border-soft" : ""}`}
              >
                <div className={`w-9 h-9 rounded-edu-control flex items-center justify-center shrink-0 ${inc.role === "Docente" ? "bg-edu-purple-bg" : "bg-edu-warning-bg"}`}>
                  {inc.role === "Docente" ? (
                    <GraduationCap style={{ width: "18px", height: "18px", color: color.purple }} />
                  ) : (
                    <Users style={{ width: "18px", height: "18px", color: color.warning }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[0.9rem] font-semibold text-edu-ink">{inc.who}</span>
                    <span className="text-[0.68rem] font-semibold px-2 py-0.5 rounded-edu-pill bg-edu-subtle text-edu-ink-500">{inc.role}</span>
                  </div>
                  <div className="text-[0.8rem] text-edu-ink-500 mt-0.5">{inc.detail}</div>
                </div>
                <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${meta.cls}`}>{meta.label}</span>
                <span className="text-[0.8rem] text-edu-ink-400 w-12 text-right shrink-0">{inc.date}</span>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
