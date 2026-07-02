import {
  Layers,
  Users,
  CalendarClock,
  ClipboardList,
  ClipboardCheck,
  PlusCircle,
  FileSpreadsheet,
  Upload,
  Clock,
  BookOpen,
  ChevronRight,
  Pencil,
  CheckCircle2,
  Circle,
  AlertTriangle,
} from "lucide-react";
import { color, accent } from "../theme/tokens";

/* ------------------------------------------------------------------ */
/* Datos ficticios                                                     */
/* ------------------------------------------------------------------ */

const KPIS: {
  label: string;
  value: string;
  icon: React.FC<{ style?: React.CSSProperties }>;
  ac: { bg: string; fg: string };
  hint: string;
  alert?: boolean;
}[] = [
  { label: "Secciones asignadas", value: "5", icon: Layers, ac: accent.blue, hint: "Ciclo escolar 2026-I" },
  { label: "Estudiantes", value: "142", icon: Users, ac: accent.green, hint: "En todas tus secciones" },
  { label: "Clases de hoy", value: "3", icon: CalendarClock, ac: accent.purple, hint: "Miércoles 1 jul 2026" },
  { label: "Planes por revisar", value: "1", icon: ClipboardList, ac: accent.amber, hint: "Requiere tu atención", alert: true },
];

const QUICK_ACTIONS: {
  label: string;
  icon: React.FC<{ style?: React.CSSProperties }>;
  primary?: boolean;
}[] = [
  { label: "Cargar asistencia", icon: ClipboardCheck, primary: true },
  { label: "Añadir calificaciones", icon: FileSpreadsheet },
  { label: "Crear plan de evaluación", icon: PlusCircle },
  { label: "Subir prueba de examen", icon: Upload },
];

const TODAY_CLASSES: {
  time: string;
  subject: string;
  section: string;
  room: string;
  status: "En curso" | "Próxima";
}[] = [
  { time: "07:00", subject: "Ciencias Naturales", section: "4.º B", room: "Lab 102", status: "En curso" },
  { time: "09:30", subject: "Biología", section: "5.º A", room: "Aula 204", status: "Próxima" },
  { time: "11:15", subject: "Ciencias de la Tierra", section: "3.º C", room: "Aula 108", status: "Próxima" },
];

const SECTIONS: {
  subject: string;
  grade: string;
  students: number;
  attendance: number;
  evals: string;
  accent: string;
}[] = [
  { subject: "Ciencias Naturales", grade: "4.º Año B", students: 32, attendance: 94, evals: "4 / 5", accent: "#dbeafe" },
  { subject: "Biología", grade: "5.º Año A", students: 29, attendance: 91, evals: "5 / 5", accent: "#dcfce7" },
  { subject: "Ciencias de la Tierra", grade: "3.º Año C", students: 30, attendance: 88, evals: "3 / 5", accent: "#ede9fe" },
  { subject: "Química", grade: "5.º Año B", students: 27, attendance: 96, evals: "2 / 4", accent: "#ffedd5" },
  { subject: "Ciencias Naturales", grade: "4.º Año A", students: 24, attendance: 90, evals: "4 / 5", accent: "#fce7f3" },
];

const EVAL_PLANS: {
  subject: string;
  section: string;
  count: number;
  status: "approved" | "review" | "draft" | "changes";
  note?: string;
}[] = [
  { subject: "Biología", section: "5.º A", count: 5, status: "approved" },
  {
    subject: "Ciencias Naturales",
    section: "4.º B",
    count: 5,
    status: "review",
    note: "Prueba enviada al evaluador · revisar 1 semana antes",
  },
  { subject: "Química", section: "5.º B", count: 4, status: "changes", note: "El evaluador solicitó ajustar la ponderación de la Unidad 2" },
  { subject: "Ciencias de la Tierra", section: "3.º C", count: 3, status: "draft" },
  { subject: "Ciencias Naturales", section: "4.º A", count: 5, status: "approved" },
];

const EVAL_STATUS: Record<
  (typeof EVAL_PLANS)[number]["status"],
  { label: string; bg: string; fg: string }
> = {
  approved: { label: "Aprobado", bg: color.successBg, fg: color.success },
  review: { label: "En revisión", bg: color.primary100, fg: color.primary },
  draft: { label: "Borrador", bg: color.subtle, fg: color.ink500 },
  changes: { label: "Cambios solicitados", bg: color.dangerBg, fg: color.danger },
};

const TODOS: {
  text: string;
  done: boolean;
  urgent?: boolean;
}[] = [
  { text: "Cargar asistencia de 4.º B (hoy)", done: false, urgent: true },
  { text: "Subir prueba del examen de la Unidad 3 antes del 10 jul 2026", done: false, urgent: true },
  { text: "Registrar notas de la exposición de Petróleo (4.º B)", done: false },
  { text: "Atender cambios solicitados en el plan de Química 5.º B", done: false },
  { text: "Enviar el plan de evaluación de Biología al evaluador", done: true },
];

/* ------------------------------------------------------------------ */
/* Subcomponentes                                                      */
/* ------------------------------------------------------------------ */

function SectionCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">{title}</h3>
        {action && <span className="text-[0.8rem] text-edu-primary cursor-pointer font-medium">{action}</span>}
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

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function DocenteDashboard() {
  return (
    <div className="flex flex-col gap-5">
      {/* Fila de KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {KPIS.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className={`bg-edu-surface rounded-edu-card p-5 flex flex-col gap-3 ${kpi.alert ? "border border-edu-warning-bg" : "border border-edu-border-soft"}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-edu-ink-500 text-[0.75rem] font-medium m-0 uppercase tracking-[0.05em]">
                    {kpi.label}
                  </p>
                  <p className={`text-[1.6rem] font-bold mt-1.5 m-0 ${kpi.alert ? "text-edu-warning" : "text-edu-ink"}`}>{kpi.value}</p>
                </div>
                <div
                  className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0"
                  style={{ backgroundColor: kpi.ac.bg }}
                >
                  <Icon style={{ width: "20px", height: "20px", color: kpi.ac.fg }} />
                </div>
              </div>
              <p className="text-edu-ink-400 text-[0.75rem] m-0 flex items-center gap-[5px]">
                {kpi.alert && <AlertTriangle style={{ width: "12px", height: "12px" }} className="text-edu-warning-strong" />}
                {kpi.hint}
              </p>
            </div>
          );
        })}
      </div>

      {/* Acciones rápidas */}
      <div className="flex gap-2.5 flex-wrap">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          const primary = action.primary;
          return (
            <button
              key={action.label}
              className={`inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold cursor-pointer transition-colors ${
                primary
                  ? "border-[1.5px] border-edu-primary bg-edu-primary text-white hover:bg-edu-primary-hover"
                  : "border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 hover:bg-edu-subtle hover:border-edu-ink-300"
              }`}
            >
              <Icon style={{ width: "16px", height: "16px" }} />
              {action.label}
            </button>
          );
        })}
      </div>

      {/* Clases de hoy */}
      <SectionCard title="Clases de hoy" action="Ver horario completo →">
        <div>
          <div className="grid grid-cols-[0.6fr_1.4fr_0.8fr_0.8fr_0.7fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
            {["Hora", "Materia", "Sección", "Aula", "Estado"].map((h) => (
              <Th key={h}>{h}</Th>
            ))}
          </div>
          {TODAY_CLASSES.map((cls, i) => {
            const enCurso = cls.status === "En curso";
            return (
              <div
                key={i}
                className={`grid grid-cols-[0.6fr_1.4fr_0.8fr_0.8fr_0.7fr] px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle ${i < TODAY_CLASSES.length - 1 ? "border-b border-edu-border-soft" : ""}`}
              >
                <div className="flex items-center gap-1.5">
                  <Clock className="text-edu-ink-400 shrink-0" style={{ width: "13px", height: "13px" }} />
                  <span className="text-sm text-edu-ink font-semibold">{cls.time}</span>
                </div>
                <span className="text-sm text-edu-ink-700 font-medium">{cls.subject}</span>
                <span className="text-[0.8125rem] text-edu-ink-500">{cls.section}</span>
                <span className="text-[0.8125rem] text-edu-ink-500">{cls.room}</span>
                <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${enCurso ? "bg-edu-success-bg text-edu-success" : "bg-edu-primary-100 text-edu-primary"}`}>
                  {cls.status}
                </span>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Mis secciones */}
      <SectionCard title="Mis secciones" action="Ver todo →">
        <div className="grid grid-cols-3 gap-3.5 px-5 py-[18px]">
          {SECTIONS.map((sec, i) => (
            <div
              key={i}
              className="border border-edu-border-soft rounded-xl p-4 flex flex-col gap-3.5 transition-colors hover:border-edu-primary-200"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0"
                  style={{ backgroundColor: sec.accent }}
                >
                  <BookOpen className="text-edu-ink-700" style={{ width: "18px", height: "18px" }} />
                </div>
                <div className="min-w-0">
                  <div className="text-[0.9rem] font-semibold text-edu-ink whitespace-nowrap overflow-hidden text-ellipsis">{sec.subject}</div>
                  <div className="text-[0.775rem] text-edu-ink-500 mt-[1px]">{sec.grade}</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[0.775rem] text-edu-ink-500">
                <Users className="text-edu-ink-400" style={{ width: "13px", height: "13px" }} />
                {sec.students} estudiantes
              </div>

              <div className="flex gap-2">
                <div className="flex-1 bg-edu-subtle rounded-edu-chip px-2.5 py-2">
                  <div className="text-[0.65rem] text-edu-ink-400 font-semibold uppercase tracking-[0.04em]">Asistencia</div>
                  <div className={`text-[0.95rem] font-bold mt-0.5 ${sec.attendance >= 90 ? "text-edu-success" : "text-edu-warning"}`}>{sec.attendance} %</div>
                </div>
                <div className="flex-1 bg-edu-subtle rounded-edu-chip px-2.5 py-2">
                  <div className="text-[0.65rem] text-edu-ink-400 font-semibold uppercase tracking-[0.04em]">Evaluaciones</div>
                  <div className="text-[0.95rem] font-bold mt-0.5 text-edu-ink">{sec.evals}</div>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 text-[0.8rem] text-edu-primary font-semibold cursor-pointer">
                Ver estudiantes
                <ChevronRight style={{ width: "14px", height: "14px" }} />
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Planes de evaluación */}
      <SectionCard title="Planes de evaluación" action="Ver todo →">
        <div>
          <div className="grid grid-cols-[1.4fr_0.7fr_0.9fr_1fr_0.6fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
            {["Materia", "Sección", "N.º evaluaciones", "Estado", "Acción"].map((h) => (
              <Th key={h}>{h}</Th>
            ))}
          </div>
          {EVAL_PLANS.map((plan, i) => {
            const st = EVAL_STATUS[plan.status];
            return (
              <div
                key={i}
                className={`px-5 py-[13px] transition-colors hover:bg-edu-subtle ${i < EVAL_PLANS.length - 1 ? "border-b border-edu-border-soft" : ""}`}
              >
                <div className="grid grid-cols-[1.4fr_0.7fr_0.9fr_1fr_0.6fr] items-center">
                  <span className="text-sm text-edu-ink font-medium">{plan.subject}</span>
                  <span className="text-[0.8125rem] text-edu-ink-500">{plan.section}</span>
                  <span className="text-sm text-edu-ink-700 font-semibold">{plan.count}</span>
                  <span
                    className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit"
                    style={{ backgroundColor: st.bg, color: st.fg }}
                  >
                    {st.label}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[0.8rem] text-edu-primary font-semibold cursor-pointer w-fit">
                    <Pencil style={{ width: "13px", height: "13px" }} />
                    Editar
                  </span>
                </div>
                {plan.note && (
                  <div className={`mt-2 flex items-center gap-1.5 text-xs w-fit rounded-edu-chip px-2.5 py-1.5 ${plan.status === "changes" ? "text-edu-danger bg-edu-danger-bg" : "text-edu-ink-500 bg-edu-primary-50"}`}>
                    <AlertTriangle className="shrink-0" style={{ width: "12px", height: "12px" }} />
                    {plan.note}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Pendientes por hacer */}
      <SectionCard title="Pendientes por hacer" action="Ver todo →">
        <div className="flex flex-col">
          {TODOS.map((todo, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-5 py-[13px] cursor-pointer transition-colors hover:bg-edu-subtle ${i < TODOS.length - 1 ? "border-b border-edu-border-soft" : ""}`}
            >
              {todo.done ? (
                <CheckCircle2 className="text-edu-success shrink-0" style={{ width: "18px", height: "18px" }} />
              ) : (
                <Circle
                  className={`shrink-0 ${todo.urgent ? "text-edu-warning-strong" : "text-edu-ink-300"}`}
                  style={{ width: "18px", height: "18px" }}
                />
              )}
              <span className={`flex-1 text-sm ${todo.done ? "text-edu-ink-400 line-through" : "text-edu-ink-700"}`}>
                {todo.text}
              </span>
              {todo.urgent && !todo.done && (
                <span className="inline-flex items-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold bg-edu-warning-bg text-edu-warning">
                  Urgente
                </span>
              )}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
