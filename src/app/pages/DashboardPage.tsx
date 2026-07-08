import { useState } from "react";
import {
  Clock,
  AlertCircle,
  ClipboardCheck,
  X,
  Download,
  FileText,
  Presentation,
  FlaskConical,
  PenLine,
  Paperclip,
} from "lucide-react";
import { useNavigate } from "react-router";
import { color } from "../theme/tokens";
import { useFetch } from "../datos_maquetados";
import {
  getHorarioDashboard,
  getEvaluacionesPendientesDashboard,
  getCalificaciones,
  type PendingEval,
  type Grade,
  type EvalType,
} from "../datos_maquetados/actions/estudiante";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const TYPE_META: Record<EvalType, { icon: React.FC<{ style?: React.CSSProperties }>; bg: string; fg: string; label: string }> = {
  presentation: { icon: Presentation, bg: color.primary50, fg: color.primary, label: "Exposición" },
  exam: { icon: FileText, bg: color.warningBg, fg: color.warning, label: "Examen" },
  lab: { icon: FlaskConical, bg: color.successBg, fg: color.success, label: "Laboratorio" },
  essay: { icon: PenLine, bg: color.purpleBg, fg: color.purple, label: "Ensayo" },
};

const PASS_MARK = 10;

function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + mins;
  const hh = String(Math.floor(total / 60)).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

const HORARIO_DIAS = [
  { abbr: "Lun", full: "Lunes" },
  { abbr: "Mar", full: "Martes" },
  { abbr: "Mié", full: "Miércoles" },
  { abbr: "Jue", full: "Jueves" },
  { abbr: "Vie", full: "Viernes" },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const [selectedPendingEval, setSelectedPendingEval] = useState<PendingEval | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);

  const { data: schedule } = useFetch(getHorarioDashboard, []);
  const { data: pendingEvals } = useFetch(getEvaluacionesPendientesDashboard, []);
  const { data: grades } = useFetch(getCalificaciones, []);

  const recentGrades = grades.slice(0, 4);

  const today = new Date();
  const dayIndex = today.getDay();
  const weekdays = ["Lun", "Mar", "Mié", "Jue", "Vie"];
  const activeDay =
    dayIndex >= 1 && dayIndex <= 5 ? weekdays[dayIndex - 1] : "Lun";

  // Construir la cuadrícula: filas = horas únicas, columnas = días
  const scheduleTimes = [...new Set(schedule.flatMap((d) => d.classes.map((c) => c.time)))].sort();
  const scheduleTimeRows = scheduleTimes.map((time) =>
    HORARIO_DIAS.map(({ abbr }) => {
      const dayData = schedule.find((d) => d.day === abbr);
      return dayData?.classes.find((c) => c.time === time) ?? null;
    }),
  );

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-2">
        {/* Horario */}
        <div className="lg:col-span-2 bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
          <div className="px-4 sm:px-5 py-4 border-b border-edu-border-soft flex justify-between items-center gap-2 flex-wrap">
            <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">
              Horario
            </h3>
            <button
              className="inline-flex items-center gap-2 px-3 sm:px-[18px] py-2 sm:py-2.5 rounded-edu-control text-sm font-semibold cursor-pointer transition-colors border-[1.5px] border-edu-primary bg-edu-primary text-white hover:bg-edu-primary-hover shrink-0"
            >
              <ClipboardCheck style={{ width: "16px", height: "16px" }} />
              <span className="hidden sm:inline">Descargar horario</span>
              <span className="sm:hidden">Descargar</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[860px]">
              {/* Cabecera de días */}
              <div className="grid grid-cols-[0.9fr_repeat(5,1fr)] bg-edu-subtle border-b border-edu-border-soft">
                <span className="px-4 py-3 text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">
                  Hora
                </span>
                {HORARIO_DIAS.map(({ abbr, full }) => (
                  <span
                    key={abbr}
                    className={`px-4 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.05em] text-center flex items-center justify-center gap-[5px] ${abbr === activeDay ? "text-edu-primary" : "text-edu-ink-400"}`}
                  >
                    {full}
                    {abbr === activeDay && (
                      <span className="w-1.5 h-1.5 rounded-full bg-edu-primary inline-block" />
                    )}
                  </span>
                ))}
              </div>

              {/* Filas por bloque horario */}
              {scheduleTimeRows.map((row, bi) => (
                <div
                  key={scheduleTimes[bi]}
                  className={`grid grid-cols-[0.9fr_repeat(5,1fr)] ${bi < scheduleTimeRows.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                >
                  <div className="px-4 py-3 flex items-center bg-edu-subtle/50">
                    <span className="text-[0.75rem] font-semibold text-edu-ink-700">
                      {scheduleTimes[bi]} - {addMinutes(scheduleTimes[bi], 40)}
                    </span>
                  </div>
                  {row.map((cls, di) => (
                    <div key={di} className="p-2 border-l border-edu-border-soft min-h-[74px]">
                      {cls ? (
                        <button
                          onClick={() => navigate(`/estudiante/materias/${cls.id}`)}
                          className="w-full h-full text-left rounded-edu-chip px-2.5 py-2 flex flex-col gap-1 cursor-pointer border-none transition-[filter] hover:brightness-95"
                          style={{ backgroundColor: cls.color }}
                        >
                          <span
                            className="text-[0.75rem] font-semibold leading-tight"
                            style={{ color: cls.fg }}
                          >
                            {cls.subject}
                          </span>
                          <span className="text-[0.68rem] font-medium text-edu-ink-700">{cls.teacher}</span>
                          <span className={`text-[0.68rem] font-medium ${cls.hasEval ? "text-edu-primary" : "text-edu-ink-500"}`}>
                            {cls.hasEval ? "CON evaluación" : "SIN evaluación"}
                          </span>
                        </button>
                      ) : (
                        <div className="h-full rounded-edu-chip flex items-center justify-center">
                          <span className="text-[0.7rem] text-edu-ink-300">Libre</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tarjetas de resumen */}
        <div className="space-y-2">
          {/* Asistencia general */}
          <div className="bg-edu-surface rounded-edu-card p-4 sm:p-5 border border-edu-border-soft flex flex-col gap-2.5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                  Asistencia general
                </p>
                <p className="text-edu-ink text-[1.4rem] font-bold mt-1">
                  92,4 %
                </p>
              </div>
              <div className="w-10 h-10 rounded-edu-control bg-edu-warning-bg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-edu-warning-strong" />
              </div>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-1.5 rounded-edu-pill ${i < 18 ? "bg-edu-primary" : "bg-edu-danger-bg"}`}
                />
              ))}
            </div>
            <p className="text-edu-ink-400 text-xs m-0">
              2 inasistencias este lapso · Mínimo exigido: 75 %
            </p>
          </div>

          {/* Próxima clase */}
          <div className="bg-edu-surface rounded-edu-card p-4 sm:p-5 border border-edu-border-soft flex flex-col gap-2.5 cursor-pointer hover:bg-edu-subtle transition-colors" onClick={() => navigate("/estudiante/materias/1")}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                  Próxima clase
                </p>
                <p className="text-edu-ink text-[1.1rem] font-bold mt-1">
                  Física
                </p>
              </div>
              <div className="w-10 h-10 rounded-edu-control bg-edu-primary-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-edu-primary" />
              </div>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <span className="bg-edu-primary-50 text-edu-primary text-[0.7rem] font-semibold px-2 py-[3px] rounded-[6px]">
                Hoy · 11:00
              </span>
            </div>
            <p className="text-edu-ink-400 text-xs m-0">
              Prof. Jonny · Comienza en 1 h 20 min
            </p>
          </div>

          {/* Próxima evaluación */}
          <div className="bg-edu-surface rounded-edu-card p-4 sm:p-5 border border-edu-border-soft flex flex-col gap-2.5 cursor-pointer hover:bg-edu-subtle transition-colors" onClick={() => navigate("/estudiante/materias/2")}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                  Próxima evaluación
                </p>
                <p className="text-edu-ink text-[1.1rem] font-bold mt-1">
                  Matemática - Examen
                </p>
                <p className="text-edu-ink-400 text-xs m-0">
                  Limites y Derivadas
                </p>
              </div>
              <div className="w-10 h-10 rounded-edu-control bg-edu-primary-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-edu-primary" />
              </div>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <span className="bg-edu-primary-50 text-edu-primary text-[0.7rem] font-semibold px-2 py-[3px] rounded-[6px]">
                Hoy · 12:20
              </span>
            </div>
            <p className="text-edu-ink-400 text-xs m-0">
              Prof. Ramírez · Comienza en 3 h 20 min
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Evaluaciones pendientes */}
        <div className="md:col-span-2 bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
          <div className="px-4 sm:px-5 py-4 border-b border-edu-border-soft flex justify-between items-center gap-2">
            <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">
              Evaluaciones pendientes de la semana
            </h3>
            <span className="text-[0.8rem] text-edu-primary cursor-pointer font-medium shrink-0">
              Ver todas →
            </span>
          </div>
          {/* Móvil */}
          <div className="sm:hidden divide-y divide-edu-border-soft">
            {pendingEvals.map((ev) => (
              <div
                key={ev.id}
                className="px-4 py-3 flex flex-col gap-1.5 cursor-pointer hover:bg-edu-subtle transition-colors"
                onClick={() => setSelectedPendingEval(ev)}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: ev.dot }}
                    />
                    <span className="text-sm text-edu-ink font-semibold truncate">
                      {ev.subject}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold shrink-0 ${ev.status === "late" ? "bg-edu-danger-bg text-edu-danger" : "bg-edu-warning-bg text-edu-warning"}`}
                  >
                    {ev.status === "late" ? "Atrasada" : "Próxima"}
                  </span>
                </div>
                <span className="text-[0.8125rem] text-edu-ink-700">{ev.type}</span>
                <div className="flex items-center justify-between gap-2 text-edu-ink-500">
                  <span className="flex items-center gap-1 text-[0.8125rem]">
                    <Clock className="w-3 h-3 text-edu-ink-400 shrink-0" />
                    {ev.dueDate}
                  </span>
                  <span className="text-[0.8125rem] font-semibold text-edu-ink-700">
                    {ev.weight}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {/* Desktop */}
          <div className="hidden sm:block overflow-x-auto">
            <div className="min-w-[480px]">
              <div className="grid grid-cols-[1fr_1.2fr_1fr_0.5fr_0.8fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                {["Materia", "Evaluación", "Fecha", "Porcentaje", "Estado"].map((h) => (
                  <span
                    key={h}
                    className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]"
                  >
                    {h}
                  </span>
                ))}
              </div>
              {pendingEvals.map((ev, i) => (
                <div
                  key={ev.id}
                  onClick={() => setSelectedPendingEval(ev)}
                  className={`grid grid-cols-[1fr_1.2fr_1fr_0.5fr_0.8fr] px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle ${i < pendingEvals.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: ev.dot }}
                    />
                    <span className="text-[0.875rem] text-edu-ink font-medium">
                      {ev.subject}
                    </span>
                  </div>
                  <span className="text-[0.875rem] text-edu-ink-700">
                    {ev.type}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-edu-ink-400 shrink-0" />
                    <span className="text-[0.8125rem] text-edu-ink-500">
                      {ev.dueDate}
                    </span>
                  </div>
                  <span className="text-[0.875rem] text-edu-ink-700 font-semibold">
                    {ev.weight}
                  </span>
                  <span
                    className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${ev.status === "late" ? "bg-edu-danger-bg text-edu-danger" : "bg-edu-warning-bg text-edu-warning"}`}
                  >
                    {ev.status === "late" ? "Atrasada" : "Próxima"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resultados de evaluaciones */}
        <div className="md:col-span-2 bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
          <div className="px-4 sm:px-5 py-4 border-b border-edu-border-soft flex justify-between items-center gap-2">
            <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">
              Resultados de evaluaciones
            </h3>
            <span className="text-[0.8rem] text-edu-primary cursor-pointer font-medium shrink-0">
              Ver todas →
            </span>
          </div>
          {/* Móvil */}
          <div className="sm:hidden divide-y divide-edu-border-soft">
            {recentGrades.map((g) => {
              const t = TYPE_META[g.type];
              const passed = g.grade >= PASS_MARK;
              return (
                <div
                  key={g.id}
                  className="px-4 py-3 flex flex-col gap-1.5 cursor-pointer hover:bg-edu-subtle transition-colors"
                  onClick={() => setSelectedGrade(g)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: t.fg }}
                      />
                      <span className="text-sm text-edu-ink font-semibold truncate">
                        {g.subject}
                      </span>
                    </div>
                    <span className={`text-[0.8125rem] font-bold shrink-0 ${passed ? "text-edu-ink" : "text-edu-danger"}`}>
                      {g.grade}<span className="text-edu-ink-400 font-normal text-xs">/20</span>
                    </span>
                  </div>
                  <span className="text-[0.8125rem] text-edu-ink-700">{g.title}</span>
                  <span className="flex items-center gap-1 text-[0.8125rem] text-edu-ink-500">
                    <Clock className="w-3 h-3 text-edu-ink-400 shrink-0" />
                    {g.date}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Desktop */}
          <div className="hidden sm:block overflow-x-auto">
            <div className="min-w-[360px]">
              <div className="grid grid-cols-[1fr_1.4fr_1fr_0.5fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                {["Materia", "Evaluación", "Fecha", "Nota"].map((h) => (
                  <span
                    key={h}
                    className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]"
                  >
                    {h}
                  </span>
                ))}
              </div>
              {recentGrades.map((g, i) => {
                const t = TYPE_META[g.type];
                const passed = g.grade >= PASS_MARK;
                return (
                  <div
                    key={g.id}
                    onClick={() => setSelectedGrade(g)}
                    className={`grid grid-cols-[1fr_1.4fr_1fr_0.5fr] px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle ${i < recentGrades.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                  >
                    <span className="text-[0.875rem] text-edu-ink font-medium truncate pr-2">
                      {g.subject}
                    </span>
                    <div className="min-w-0 pr-2">
                      <div className="text-[0.875rem] text-edu-ink-700 truncate">{g.title}</div>
                      <span
                        className="inline-flex mt-0.5 text-[0.62rem] font-semibold px-1.5 py-px rounded-edu-pill"
                        style={{ backgroundColor: t.bg, color: t.fg }}
                      >
                        {t.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-edu-ink-400 shrink-0" />
                      <span className="text-[0.8125rem] text-edu-ink-500">{g.date}</span>
                    </div>
                    <span className={`text-[0.9rem] font-bold ${passed ? "text-edu-ink" : "text-edu-danger"}`}>
                      {g.grade}<span className="text-edu-ink-400 font-normal text-[0.75rem]">/20</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Evaluación pendiente — diseño accordeón expandido de CoursesPage */}
      {selectedPendingEval && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setSelectedPendingEval(null)}
        >
          <div
            className="bg-edu-surface rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)] border-[1.5px] border-edu-primary-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Encabezado — como la cabecera del AssignmentCard */}
            <div className="flex items-center gap-3.5 px-[18px] py-4">
              <div
                className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0"
                style={{ backgroundColor: color.primary50 }}
              >
                <ClipboardCheck style={{ width: "18px", height: "18px", color: color.primary }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[0.9rem] font-semibold text-edu-ink">
                    {selectedPendingEval.type}
                  </span>
                </div>
                <div className="flex gap-3 mt-1 flex-wrap">
                  <span className="text-[0.775rem] text-edu-ink-500">
                    {selectedPendingEval.subject}
                  </span>
                  <span className="text-[0.775rem] text-edu-ink-500 flex items-center gap-1">
                    <Clock style={{ width: "11px", height: "11px" }} />
                    {selectedPendingEval.dueDate}
                  </span>
                  <span className="text-[0.775rem] text-edu-ink-500">
                    Peso: <strong className="text-edu-ink-700">{selectedPendingEval.weight}</strong>
                  </span>
                </div>
              </div>

              <span
                className={`text-[0.7rem] font-semibold px-2.5 py-[3px] rounded-edu-pill shrink-0 ${
                  selectedPendingEval.status === "late"
                    ? "bg-edu-danger-bg text-edu-danger"
                    : "bg-edu-warning-bg text-edu-warning"
                }`}
              >
                {selectedPendingEval.status === "late" ? "Atrasada" : "Próxima"}
              </span>

              <button
                onClick={() => setSelectedPendingEval(null)}
                className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700 shrink-0"
              >
                <X style={{ width: "16px", height: "16px" }} />
              </button>
            </div>

            {/* Contenido expandido — mismo diseño que el acordeón abierto en CoursesPage */}
            <div className="border-t border-edu-border-soft px-[18px] py-5 bg-edu-tint flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[0.78rem] font-semibold text-edu-ink-500 uppercase tracking-[0.05em] m-0 mb-1.5">
                    Fecha de entrega
                  </p>
                  <div className="flex items-center gap-1.5 text-sm text-edu-ink-700">
                    <Clock style={{ width: "13px", height: "13px" }} className="text-edu-ink-400" />
                    {selectedPendingEval.dueDate}
                  </div>
                </div>
                <div>
                  <p className="text-[0.78rem] font-semibold text-edu-ink-500 uppercase tracking-[0.05em] m-0 mb-1.5">
                    Porcentaje
                  </p>
                  <p className="text-sm font-semibold text-edu-ink-700 m-0">
                    {selectedPendingEval.weight}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[0.78rem] font-semibold text-edu-ink-500 uppercase tracking-[0.05em] m-0 mb-1.5">
                  Materia
                </p>
                <p className="text-sm text-edu-ink-700 leading-[1.65] m-0">
                  {selectedPendingEval.subject}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Resultado de evaluación — diseño del modal de CalificacionPage */}
      {selectedGrade && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setSelectedGrade(null)}
        >
          <div
            className="bg-edu-surface rounded-edu-card w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const t = TYPE_META[selectedGrade.type];
              const TypeIcon = t.icon;
              const passed = selectedGrade.grade >= PASS_MARK;
              return (
                <>
                  {/* Encabezado */}
                  <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-start gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0"
                        style={{ backgroundColor: t.bg }}
                      >
                        <TypeIcon style={{ width: "18px", height: "18px", color: t.fg }} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem] leading-snug">
                          {selectedGrade.title}
                        </h3>
                        <div className="text-[0.8rem] text-edu-ink-500 mt-0.5">
                          {selectedGrade.subject}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedGrade(null)}
                      aria-label="Cerrar"
                      className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700 shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 flex flex-col gap-4">
                    {/* Nota destacada */}
                    <div className="flex items-center justify-between px-4 py-3 rounded-edu-control bg-edu-subtle">
                      <div>
                        <div className="text-[0.72rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">
                          Calificación
                        </div>
                        <div
                          className={`text-[1.6rem] font-bold leading-none mt-0.5 ${passed ? "text-edu-success" : "text-edu-danger"}`}
                        >
                          {selectedGrade.grade}
                          <span className="text-edu-ink-400 font-normal text-base">/20</span>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center justify-center px-3 py-1.5 rounded-edu-pill text-[0.8rem] font-semibold ${passed ? "bg-edu-success-bg text-edu-success" : "bg-edu-danger-bg text-edu-danger"}`}
                      >
                        {passed ? "Aprobada" : "Reprobada"}
                      </span>
                    </div>

                    {/* Datos */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                      {[
                        { label: "Tipo", value: t.label },
                        { label: "Docente", value: selectedGrade.teacher },
                        { label: "Fecha", value: selectedGrade.date },
                        { label: "Peso", value: selectedGrade.weight },
                      ].map((d) => (
                        <div key={d.label}>
                          <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">
                            {d.label}
                          </div>
                          <div className="text-[0.875rem] text-edu-ink font-medium">{d.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Descripción */}
                    <div>
                      <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium mb-1">
                        Descripción
                      </div>
                      <p className="text-sm text-edu-ink-700 leading-[1.6] m-0">
                        {selectedGrade.description}
                      </p>
                    </div>

                    {/* Prueba adjunta */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Paperclip className="w-3.5 h-3.5 text-edu-ink-400" />
                        <span className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">
                          Prueba adjunta
                        </span>
                      </div>
                      {selectedGrade.attachment.kind === "image" ? (
                        <a
                          href={selectedGrade.attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block rounded-edu-control overflow-hidden border border-edu-border-soft"
                        >
                          <ImageWithFallback
                            src={selectedGrade.attachment.url}
                            alt={selectedGrade.attachment.name}
                            className="w-full max-h-[320px] object-contain bg-edu-subtle"
                          />
                        </a>
                      ) : (
                        <div className="flex items-center gap-3 p-3 rounded-edu-control border border-edu-border-soft bg-edu-subtle">
                          <div className="w-10 h-10 rounded-edu-chip bg-edu-danger-bg flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-edu-danger" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-edu-ink truncate">
                              {selectedGrade.attachment.name}
                            </div>
                            <div className="text-xs text-edu-ink-400">Documento adjunto</div>
                          </div>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-edu-control border-[1.5px] border-edu-primary-200 bg-edu-primary-50 text-edu-primary text-[0.8125rem] font-semibold cursor-pointer transition-colors hover:bg-edu-primary-100 shrink-0"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Descargar
                          </button>
                        </div>
                      )}
                      <div className="text-[0.72rem] text-edu-ink-400 mt-1.5">
                        {selectedGrade.attachment.name}
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </>
  );
}
