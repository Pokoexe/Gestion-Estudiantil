import {
  ClipboardList,
  FileCheck2,
  FileBarChart2,
  MessagesSquare,
  Upload,
  CalendarClock,
  FilePlus2,
  MessageSquarePlus,
  Download,
  Clock,
  Star,
  Trophy,
  Music,
  Palette,
  Users,
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

/* ------------------------------------------------------------------ */
/* Datos ficticios                                                     */
/* ------------------------------------------------------------------ */

const KPIS: {
  label: string;
  value: string;
  icon: React.FC<{ style?: React.CSSProperties }>;
  tone: { bg: string; fg: string };
  foot: string;
}[] = [
  {
    label: "Revisiones pendientes",
    value: "7",
    icon: ClipboardList,
    tone: accent.amber,
    foot: "3 vencen esta semana",
  },
  {
    label: "Exámenes por aprobar",
    value: "3",
    icon: FileCheck2,
    tone: accent.blue,
    foot: "Enviados por 3 docentes",
  },
  {
    label: "Boletines generados",
    value: "12",
    icon: FileBarChart2,
    tone: accent.green,
    foot: "de 15 secciones",
  },
  {
    label: "Discusiones activas",
    value: "2",
    icon: MessagesSquare,
    tone: accent.purple,
    foot: "En revisión del concejo",
  },
];

const QUICK_ACTIONS: {
  label: string;
  icon: React.FC<{ style?: React.CSSProperties }>;
  tone: { bg: string; fg: string };
}[] = [
  { label: "Subir planilla de evaluación", icon: Upload, tone: accent.blue },
  { label: "Asignar cronograma", icon: CalendarClock, tone: accent.amber },
  { label: "Generar boletín", icon: FilePlus2, tone: accent.green },
  { label: "Nueva discusión de notas", icon: MessageSquarePlus, tone: accent.purple },
];

type ReviewType = "Examen" | "Plan de evaluación" | "Tema de reparación";
type ReviewStatus = "Pendiente" | "Aprobado" | "Cambios solicitados";

const TYPE_META: Record<ReviewType, { bg: string; fg: string }> = {
  Examen: accent.amber,
  "Plan de evaluación": accent.blue,
  "Tema de reparación": accent.purple,
};

const STATUS_META: Record<ReviewStatus, { bg: string; fg: string }> = {
  Pendiente: { bg: color.primary50, fg: color.primary },
  Aprobado: { bg: color.successBg, fg: color.success },
  "Cambios solicitados": { bg: color.dangerBg, fg: color.danger },
};

const REVIEWS: {
  id: number;
  teacher: string;
  subject: string;
  type: ReviewType;
  sent: string;
  status: ReviewStatus;
  note?: string;
}[] = [
  {
    id: 1,
    teacher: "Prof. Alejandro Morales",
    subject: "Ciencias Naturales",
    type: "Plan de evaluación",
    sent: "1 jul 2026",
    status: "Pendiente",
  },
  {
    id: 2,
    teacher: "Prof. Carmen Villalba",
    subject: "Matemática",
    type: "Examen",
    sent: "30 jun 2026",
    status: "Pendiente",
  },
  {
    id: 3,
    teacher: "Prof. Luis Fernández",
    subject: "Historia",
    type: "Examen",
    sent: "28 jun 2026",
    status: "Cambios solicitados",
    note: "El examen supera el peso máximo permitido (30%). Ajustar la ponderación y reenviar.",
  },
  {
    id: 4,
    teacher: "Prof. Daniela Rojas",
    subject: "Literatura",
    type: "Tema de reparación",
    sent: "26 jun 2026",
    status: "Aprobado",
  },
  {
    id: 5,
    teacher: "Prof. Gabriel Suárez",
    subject: "Física",
    type: "Plan de evaluación",
    sent: "24 jun 2026",
    status: "Aprobado",
  },
];

const CHART_DATA = [
  { estado: "Pendiente", cantidad: 7, fill: color.primary },
  { estado: "Aprobado", cantidad: 12, fill: color.success },
  { estado: "Cambios", cantidad: 3, fill: color.danger },
];

type BulletinStatus = "Generado" | "En proceso" | "Pendiente";

const BULLETIN_STATUS: Record<BulletinStatus, { bg: string; fg: string }> = {
  Generado: { bg: color.successBg, fg: color.success },
  "En proceso": { bg: color.warningBg, fg: color.warning },
  Pendiente: { bg: color.primary50, fg: color.primary },
};

const BULLETINS: {
  id: number;
  section: string;
  students: number;
  avg: string;
  status: BulletinStatus;
}[] = [
  { id: 1, section: "4.º Año · Sección A", students: 32, avg: "16,4", status: "Generado" },
  { id: 2, section: "4.º Año · Sección B", students: 30, avg: "15,8", status: "Generado" },
  { id: 3, section: "5.º Año · Sección A", students: 28, avg: "17,1", status: "En proceso" },
  { id: 4, section: "5.º Año · Sección B", students: 29, avg: "—", status: "Pendiente" },
];

type DebateStatus = "Postulado" | "Aceptado" | "Rechazado";

const DEBATE_STATUS: Record<DebateStatus, { bg: string; fg: string }> = {
  Postulado: { bg: color.warningBg, fg: color.warning },
  Aceptado: { bg: color.successBg, fg: color.success },
  Rechazado: { bg: color.dangerBg, fg: color.danger },
};

const ACTIVITY_ICONS: Record<string, React.FC<{ style?: React.CSSProperties }>> = {
  Deporte: Trophy,
  Música: Music,
  Arte: Palette,
  Voluntariado: Users,
  Ciencia: Star,
};

const DEBATES: {
  id: number;
  student: string;
  section: string;
  subject: string;
  reason: string;
  activities: string[];
  status: DebateStatus;
}[] = [
  {
    id: 1,
    student: "Valentina Ríos",
    section: "5.º A",
    subject: "Matemática",
    reason: "Nota final 09; a 1 punto de aprobar con desempeño sostenido en el lapso.",
    activities: ["Ciencia", "Voluntariado"],
    status: "Postulado",
  },
  {
    id: 2,
    student: "Mateo Guerrero",
    section: "4.º B",
    subject: "Física",
    reason: "Mejoró de 07 a 09 en el último corte; participación destacada en el laboratorio.",
    activities: ["Deporte", "Ciencia"],
    status: "Aceptado",
  },
  {
    id: 3,
    student: "Sofía Delgado",
    section: "5.º A",
    subject: "Historia",
    reason: "Inasistencias por representación deportiva del plantel; recuperó contenidos.",
    activities: ["Deporte", "Arte"],
    status: "Rechazado",
  },
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
  const REVIEW_COLS = "1.6fr 1.2fr 1.1fr 0.9fr 1.1fr 0.7fr";

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

      {/* Acciones rápidas */}
      <div className="grid grid-cols-4 gap-3">
        {QUICK_ACTIONS.map((qa) => {
          const Icon = qa.icon;
          return (
            <button
              key={qa.label}
              className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-[18px] py-4 flex items-center gap-3 cursor-pointer text-left transition-colors hover:border-edu-primary-200 hover:bg-edu-tint"
            >
              <div
                className="w-[38px] h-[38px] rounded-edu-control flex items-center justify-center shrink-0"
                style={{ backgroundColor: qa.tone.bg }}
              >
                <Icon style={{ width: "18px", height: "18px", color: qa.tone.fg }} />
              </div>
              <span className="text-[0.875rem] font-semibold text-edu-ink">{qa.label}</span>
            </button>
          );
        })}
      </div>

      {/* Cola de revisiones */}
      <SectionCard
        title="Cola de revisiones"
        subtitle="Material enviado por los docentes para validación"
        action="Ver todo →"
      >
        <div>
          <div
            className="grid px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft"
            style={{ gridTemplateColumns: REVIEW_COLS }}
          >
            {["Docente", "Materia", "Tipo", "Envío", "Estado", ""].map((h, i) => (
              <span
                key={i}
                className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]"
              >
                {h}
              </span>
            ))}
          </div>
          {REVIEWS.map((r, i) => (
            <div
              key={r.id}
              className={`${i < REVIEWS.length - 1 ? "border-b border-edu-border-soft" : ""}`}
            >
              <div
                className="grid px-5 py-[13px] items-center"
                style={{ gridTemplateColumns: REVIEW_COLS }}
              >
                <span className="text-[0.875rem] text-edu-ink font-medium">{r.teacher}</span>
                <span className="text-[0.875rem] text-edu-ink-700">{r.subject}</span>
                <Pill label={r.type} tone={TYPE_META[r.type]} />
                <div className="flex items-center gap-1">
                  <Clock style={{ width: "12px", height: "12px", color: color.ink400, flexShrink: 0 }} />
                  <span className="text-[0.8125rem] text-edu-ink-500">{r.sent}</span>
                </div>
                <Pill label={r.status} tone={STATUS_META[r.status]} />
                <span className="text-[0.8rem] text-edu-primary font-semibold cursor-pointer justify-self-start">
                  Revisar
                </span>
              </div>
              {r.note && (
                <div className="mx-5 mb-3.5 px-3.5 py-2.5 bg-edu-danger-bg rounded-edu-chip border-l-[3px] border-edu-danger flex gap-2 items-start">
                  <span className="text-[0.7rem] font-bold text-edu-danger whitespace-nowrap">
                    Observación:
                  </span>
                  <span className="text-[0.8125rem] text-edu-ink-700 leading-[1.5]">{r.note}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Cronograma + gráfico */}
      <div className="grid grid-cols-[1.5fr_1fr] gap-5 items-stretch">
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
              <BarChart data={CHART_DATA} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
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
                  {CHART_DATA.map((d) => (
                    <Cell key={d.estado} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Boletines / Sábana de notas */}
      <SectionCard
        title="Boletines / Sábana de notas"
        subtitle="Estado de generación por sección"
        action="Ver todo →"
      >
        {/* Resumen sábana de notas */}
        <div className="flex gap-0 border-b border-edu-border-soft bg-edu-tint">
          {[
            { label: "Secciones", value: "15", tone: color.primary },
            { label: "Boletines generados", value: "12", tone: color.success },
            { label: "Estudiantes evaluados", value: "428", tone: color.purple },
            { label: "Promedio general", value: "16,3", tone: color.warning },
          ].map(({ label, value, tone }, i, arr) => (
            <div
              key={label}
              className={`flex-1 px-5 py-3.5 flex flex-col gap-1 ${i < arr.length - 1 ? "border-r border-edu-border-soft" : ""}`}
            >
              <div className="text-[0.72rem] text-edu-ink-400 font-medium uppercase tracking-[0.05em]">
                {label}
              </div>
              <div className="inline-flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full inline-block shrink-0"
                  style={{ backgroundColor: tone }}
                />
                <span className="text-[1.1rem] font-bold text-edu-ink">{value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tabla de boletines */}
        <div>
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_0.9fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
            {["Sección / Año", "Estudiantes", "Promedio", "Estado", ""].map((h, i) => (
              <span
                key={i}
                className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]"
              >
                {h}
              </span>
            ))}
          </div>
          {BULLETINS.map((b, i) => {
            const enabled = b.status === "Generado";
            return (
              <div
                key={b.id}
                className={`grid grid-cols-[2fr_1fr_1fr_1fr_0.9fr] px-5 py-[13px] items-center ${i < BULLETINS.length - 1 ? "border-b border-edu-border-soft" : ""}`}
              >
                <span className="text-[0.875rem] text-edu-ink font-medium">{b.section}</span>
                <span className="text-[0.875rem] text-edu-ink-700">{b.students}</span>
                <span className="text-[0.875rem] text-edu-ink-700 font-semibold">{b.avg}</span>
                <Pill label={b.status} tone={BULLETIN_STATUS[b.status]} />
                <button
                  disabled={!enabled}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-edu-control text-[0.775rem] font-semibold justify-self-start ${
                    enabled
                      ? "border-[1.5px] border-edu-primary-200 bg-edu-primary-50 text-edu-primary cursor-pointer"
                      : "border-[1.5px] border-edu-border bg-edu-subtle text-edu-ink-400 cursor-not-allowed"
                  }`}
                >
                  <Download style={{ width: "13px", height: "13px" }} />
                  Descargar
                </button>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Discusión de notas */}
      <SectionCard
        title="Discusión de notas"
        subtitle="Estudiantes postulados al concejo de profesores para revisión de casos"
        action="Ver todo →"
      >
        <div className="flex flex-col">
          {DEBATES.map((d, i) => (
            <div
              key={d.id}
              className={`px-5 py-4 flex gap-3.5 items-start ${i < DEBATES.length - 1 ? "border-b border-edu-border-soft" : ""}`}
            >
              <div className="w-[42px] h-[42px] rounded-full bg-edu-primary-50 border-2 border-edu-primary-100 flex items-center justify-center text-[0.85rem] font-bold text-edu-primary shrink-0">
                {d.student
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[0.9rem] font-bold text-edu-ink">{d.student}</span>
                  <span className="text-[0.7rem] font-semibold px-2 py-0.5 rounded-edu-pill bg-edu-subtle text-edu-ink-500">
                    {d.section} · {d.subject}
                  </span>
                </div>
                <p className="mt-1.5 mb-0 text-[0.8125rem] text-edu-ink-700 leading-[1.55]">
                  {d.reason}
                </p>
                <div className="flex gap-1.5 mt-2.5 flex-wrap items-center">
                  <span className="text-[0.7rem] text-edu-ink-400 font-medium">Actividades:</span>
                  {d.activities.map((act) => {
                    const ActIcon = ACTIVITY_ICONS[act] ?? Star;
                    return (
                      <span
                        key={act}
                        className="inline-flex items-center gap-[5px] px-2.5 py-[3px] rounded-edu-pill bg-edu-purple-bg text-edu-purple text-[0.7rem] font-semibold"
                      >
                        <ActIcon style={{ width: "12px", height: "12px" }} />
                        {act}
                      </span>
                    );
                  })}
                </div>
              </div>

              <Pill label={d.status} tone={DEBATE_STATUS[d.status]} />
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
