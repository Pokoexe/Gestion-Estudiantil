import {
  Layers,
  Users,
  CalendarClock,
  ClipboardList,
  PlusCircle,
  FileSpreadsheet,
  Upload,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router";
import { accent } from "../theme/tokens";
import { useFetch } from "../datos_maquetados";
import { getClasesHoy, getHorarioSemanal } from "../datos_maquetados/actions/docente";

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
  to: string;
  primary?: boolean;
}[] = [
    { label: "Añadir calificaciones", icon: FileSpreadsheet, to: "/docente/calificaciones", primary: true },
    { label: "Crear plan de evaluación", icon: PlusCircle, to: "/docente/planes/nuevo" },
    { label: "Subir prueba de examen", icon: Upload, to: "/docente/revisiones" },
  ];

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function DocenteDashboard() {
  const navigate = useNavigate();
  const { data: TODAY_CLASSES } = useFetch(getClasesHoy, []);
  const { data: SCHEDULE } = useFetch(getHorarioSemanal, []);
  const today = new Date();
  const dayIndex = today.getDay();
  const weekdays = ["Lun", "Mar", "Mié", "Jue", "Vie"];
  const activeDay = dayIndex >= 1 && dayIndex <= 5 ? weekdays[dayIndex - 1] : "Lun";

  return (
    <div className="flex flex-col gap-5">
      {/* Fila de KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIS.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className={`${index + 1 === KPIS.length && "hidden md:block"} bg-edu-surface rounded-edu-card p-5 flex flex-col gap-3 ${kpi.alert ? "border border-edu-warning-bg" : "border border-edu-border-soft"}`}
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
      <div className="grid md:grid-cols-3 gap-4">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          const primary = action.primary;
          return (
            <button
              key={action.label}
              onClick={() => navigate(action.to)}
              className={`w-full justify-center inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold cursor-pointer transition-colors ${primary
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

      {/* Horario semanal (2 col) + Clases de hoy (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {/* Horario */}
        <div className="lg:col-span-2 bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
            <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Horario</h3>
            <span className="text-[0.8rem] text-edu-primary cursor-pointer font-medium">Ver horario completo →</span>
          </div>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-5 min-w-[640px]">
              {SCHEDULE.map(({ day, classes }) => {
                const isToday = day === activeDay;
                return (
                  <div
                    key={day}
                    className={`px-3 py-3.5 ${day !== "Vie" ? "border-r border-edu-border-soft" : ""}`}
                  >
                    <div
                      className={`text-xs font-bold uppercase tracking-[0.06em] mb-2.5 flex items-center gap-[5px] ${isToday ? "text-edu-primary" : "text-edu-ink-400"}`}
                    >
                      {day}
                      {isToday && <span className="w-1.5 h-1.5 rounded-full bg-edu-primary inline-block" />}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {classes.map((cls, i) => (
                        <div
                          key={i}
                          className="rounded-edu-chip px-2.5 py-2"
                          style={{ backgroundColor: cls.color }}
                        >
                          <div className="text-[0.7rem] text-edu-ink-500 font-medium">{cls.time}</div>
                          <div className="text-[0.8rem] text-edu-ink font-semibold mt-px">{cls.subject}</div>
                          <div className="text-[0.7rem] text-edu-ink-500 mt-px">{cls.section}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Clases de hoy */}
        <div>

          <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
              <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Clases de hoy</h3>
              <span className="text-[0.8rem] text-edu-ink-400 font-medium">{TODAY_CLASSES.length}</span>
            </div>
            <div className="flex flex-col">
              {TODAY_CLASSES.map((cls, i) => {
                const enCurso = cls.status === "En curso";
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 px-5 py-3.5 cursor-pointer transition-colors hover:bg-edu-subtle ${i < TODAY_CLASSES.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                  >
                    <div className="flex flex-col items-center justify-center shrink-0 w-11">
                      <Clock className="text-edu-ink-400" style={{ width: "13px", height: "13px" }} />
                      <span className="text-[0.8rem] text-edu-ink font-semibold mt-0.5">{cls.time}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-edu-ink font-semibold truncate">{cls.subject}</div>
                      <div className="text-[0.775rem] text-edu-ink-500 mt-px">{cls.section} · {cls.room}</div>
                    </div>
                    <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold shrink-0 ${enCurso ? "bg-edu-success-bg text-edu-success" : "bg-edu-primary-100 text-edu-primary"}`}>
                      {cls.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
