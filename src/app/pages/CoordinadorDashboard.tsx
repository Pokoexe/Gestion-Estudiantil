import {
  CalendarClock,
  ClipboardList,
  Sparkles,
  AlertTriangle,
  Plus,
  CalendarPlus,
  FileWarning,
  BookPlus,
  Users,
  Clock,
  Trophy,
  Music,
  FlaskConical,
  Brain,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { color, radius, shadow, accent } from "../theme/tokens";

/* ---------- Datos ficticios ---------- */

const KPIS = [
  { label: "Próxima reunión", value: "3 jul 2026, 10:00", ac: accent.blue, icon: CalendarClock, note: "Docentes · Ajuste de plan de evaluación" },
  { label: "Planificaciones por revisar", value: "4", ac: accent.amber, icon: ClipboardList, note: "2 vencen esta semana" },
  { label: "Actividades activas", value: "6", ac: accent.green, icon: Sparkles, note: "Deportivas, culturales y académicas" },
  { label: "Incidencias del mes", value: "9", ac: accent.red, icon: AlertTriangle, note: "3 más que el mes anterior" },
];

const QUICK_ACTIONS = [
  { label: "Crear reunión", icon: CalendarPlus, primary: true },
  { label: "Nueva actividad", icon: Plus, primary: false },
  { label: "Registrar incidencia", icon: FileWarning, primary: false },
  { label: "Agregar sección/materia", icon: BookPlus, primary: false },
];

type MeetingStatus = "programada" | "realizada" | "cancelada";
const MEETING_META: Record<MeetingStatus, { bg: string; fg: string; label: string }> = {
  programada: { bg: color.primary100, fg: color.primary, label: "Programada" },
  realizada: { bg: color.successBg, fg: color.success, label: "Realizada" },
  cancelada: { bg: color.dangerBg, fg: color.danger, label: "Cancelada" },
};

const MEETINGS: { topic: string; audience: string; datetime: string; status: MeetingStatus }[] = [
  { topic: "Ajuste de plan de evaluación", audience: "Docentes", datetime: "3 jul 2026, 10:00", status: "programada" },
  { topic: "Seguimiento de convivencia escolar", audience: "Representantes", datetime: "5 jul 2026, 08:30", status: "programada" },
  { topic: "Organización de la Feria de ciencias", audience: "Docentes", datetime: "7 jul 2026, 14:00", status: "programada" },
  { topic: "Revisión de indicadores del segundo lapso", audience: "Docentes", datetime: "28 jun 2026, 09:00", status: "realizada" },
  { topic: "Coordinación de acto cultural de fin de mes", audience: "Representantes", datetime: "26 jun 2026, 11:00", status: "cancelada" },
];

type PlanStatus = "pendiente" | "aprobada" | "rechazada";
const PLAN_META: Record<PlanStatus, { bg: string; fg: string; label: string }> = {
  pendiente: { bg: color.primary100, fg: color.primary, label: "Pendiente" },
  aprobada: { bg: color.successBg, fg: color.success, label: "Aprobada" },
  rechazada: { bg: color.dangerBg, fg: color.danger, label: "Rechazada" },
};

const PLANS: { teacher: string; subject: string; sent: string; status: PlanStatus; note?: string }[] = [
  { teacher: "Prof. Alejandro Morales", subject: "Ciencias Naturales", sent: "1 jul 2026", status: "pendiente" },
  { teacher: "Prof. Daniela Fuentes", subject: "Matemática", sent: "30 jun 2026", status: "pendiente" },
  { teacher: "Prof. Ricardo Villalba", subject: "Historia Universal", sent: "29 jun 2026", status: "aprobada" },
  {
    teacher: "Prof. Marisol Cabrera",
    subject: "Lengua y Literatura",
    sent: "27 jun 2026",
    status: "rechazada",
    note: "Observación: los porcentajes de evaluación no suman 100%. Ajustar ponderación del proyecto final.",
  },
  { teacher: "Prof. Óscar Delgado", subject: "Educación Física", sent: "26 jun 2026", status: "pendiente" },
];

type ActivityType = "Deportiva" | "Cultural" | "Académica";
const ACTIVITY_META: Record<ActivityType, { bg: string; fg: string; icon: React.FC<{ style?: React.CSSProperties }> }> = {
  Deportiva: { bg: accent.blue.bg, fg: accent.blue.fg, icon: Trophy },
  Cultural: { bg: accent.purple.bg, fg: accent.purple.fg, icon: Music },
  Académica: { bg: accent.green.bg, fg: accent.green.fg, icon: Brain },
};

const ACTIVITIES: {
  name: string;
  type: ActivityType;
  icon: React.FC<{ style?: React.CSSProperties }>;
  teacher: string;
  taken: number;
  cap: number;
  status: string;
  statusOk: boolean;
}[] = [
    { name: "Torneo de fútbol", type: "Deportiva", icon: Trophy, teacher: "Prof. Óscar Delgado", taken: 18, cap: 25, status: "En curso", statusOk: true },
    { name: "Festival de danzas", type: "Cultural", icon: Music, teacher: "Prof. Marisol Cabrera", taken: 22, cap: 30, status: "Inscripciones abiertas", statusOk: true },
  ];

type PersonRole = "Estudiante" | "Docente";
type Severity = "Leve" | "Moderada" | "Grave";
const SEVERITY_META: Record<Severity, { bg: string; fg: string }> = {
  Leve: { bg: color.successBg, fg: color.success },
  Moderada: { bg: color.warningBg, fg: color.warning },
  Grave: { bg: color.dangerBg, fg: color.danger },
};

const INCIDENTS: { person: string; role: PersonRole; type: string; date: string; severity: Severity }[] = [
  { person: "Carlos Jiménez", role: "Estudiante", type: "Ausencia injustificada", date: "30 jun 2026", severity: "Leve" },
  { person: "Valentina Rojas", role: "Estudiante", type: "Conducta disruptiva en aula", date: "28 jun 2026", severity: "Moderada" },
  { person: "Prof. Ricardo Villalba", role: "Docente", type: "Retraso en entrega de notas", date: "26 jun 2026", severity: "Leve" },
  { person: "Andrés Peralta", role: "Estudiante", type: "Agresión física en recreo", date: "24 jun 2026", severity: "Grave" },
  { person: "Lucía Mendoza", role: "Estudiante", type: "Uso indebido de dispositivos", date: "22 jun 2026", severity: "Moderada" },
];

const INCIDENTS_BY_MONTH = [
  { mes: "Feb", incidencias: 5 },
  { mes: "Mar", incidencias: 8 },
  { mes: "Abr", incidencias: 6 },
  { mes: "May", incidencias: 11 },
  { mes: "Jun", incidencias: 7 },
  { mes: "Jul", incidencias: 9 },
];

/* ---------- Helpers ---------- */

function SectionHeader({ title, link }: { title: string; link: string }) {
  return (
    <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
      <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">{title}</h3>
      <span className="text-[0.8rem] text-edu-primary cursor-pointer font-medium">{link}</span>
    </div>
  );
}

function Pill({ bg, fg, children }: { bg: string; fg: string; children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit whitespace-nowrap"
      style={{ backgroundColor: bg, color: fg }}
    >
      {children}
    </span>
  );
}

/* ---------- Página ---------- */

export function CoordinadorDashboard() {
  return (
    <div className="flex flex-col gap-5">

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {KPIS.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-edu-ink-500 text-[0.75rem] font-medium m-0 uppercase tracking-[0.05em]">{kpi.label}</p>
                  <p className="text-edu-ink text-[1.6rem] font-bold mt-1 mb-0">{kpi.value}</p>
                </div>
                <div
                  className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0"
                  style={{ backgroundColor: kpi.ac.bg }}
                >
                  <Icon style={{ width: "20px", height: "20px", color: kpi.ac.fg }} />
                </div>
              </div>
              <p className="text-edu-ink-400 text-[0.75rem] m-0">{kpi.note}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-5">

        {/* Incidencias recientes */}
        <div className="col-span-2 bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
          <SectionHeader title="Incidencias recientes" link="Ver todo →" />
          <div>
            <div className="grid grid-cols-[1.4fr_1.3fr_0.9fr_0.8fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
              {["Persona", "Tipo", "Fecha", "Gravedad"].map((h) => (
                <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
              ))}
            </div>
            {INCIDENTS.map((inc, i) => {
              const sev = SEVERITY_META[inc.severity];
              const roleMeta = inc.role === "Docente" ? { bg: color.purpleBg, fg: color.purple } : { bg: color.primary50, fg: color.primary };
              return (
                <div
                  key={inc.person + inc.date}
                  className={`grid grid-cols-[1.4fr_1.3fr_0.9fr_0.8fr] px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < INCIDENTS.length - 1 ? "border-b border-edu-border-soft" : ""
                    }`}
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-[0.875rem] text-edu-ink font-medium">{inc.person}</span>
                    <Pill bg={roleMeta.bg} fg={roleMeta.fg}>{inc.role}</Pill>
                  </div>
                  <span className="text-[0.8125rem] text-edu-ink-700">{inc.type}</span>
                  <span className="text-[0.8125rem] text-edu-ink-500">{inc.date}</span>
                  <Pill bg={sev.bg} fg={sev.fg}>{inc.severity}</Pill>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actividades académicas y culturales */}
        <div className=" bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
          <SectionHeader title="Actividades académicas y culturales en curso" link="Ver todo →" />
          <div className="px-5 py-4 grid  gap-3.5">
            {ACTIVITIES.map((act) => {
              const meta = ACTIVITY_META[act.type];
              const Icon = act.icon;
              const pct = Math.round((act.taken / act.cap) * 100);
              const barColor = pct >= 100 ? color.danger : pct >= 80 ? color.warningStrong : color.primary;
              return (
                <div key={act.name} className="border border-edu-border-soft rounded-xl p-4 flex flex-col gap-3 bg-edu-tint">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0"
                      style={{ backgroundColor: meta.bg }}
                    >
                      <Icon style={{ width: "19px", height: "19px", color: meta.fg }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[0.9rem] font-semibold text-edu-ink">{act.name}</span>
                        <Pill bg={meta.bg} fg={meta.fg}>{act.type}</Pill>
                      </div>
                      <div className="text-[0.775rem] text-edu-ink-500 mt-[3px]">{act.teacher}</div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-[5px]">
                      <span className="text-[0.75rem] text-edu-ink-500 font-medium">Cupos</span>
                      <span className="text-[0.8rem] text-edu-ink-700 font-bold">{act.taken}/{act.cap}</span>
                    </div>
                    <div className="h-1.5 bg-edu-border-soft rounded-edu-pill overflow-hidden">
                      <div
                        className="h-full rounded-edu-pill"
                        style={{ width: `${pct}%`, backgroundColor: barColor }}
                      />
                    </div>
                  </div>
                  <Pill bg={act.statusOk ? color.successBg : color.warningBg} fg={act.statusOk ? color.success : color.warning}>{act.status}</Pill>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
