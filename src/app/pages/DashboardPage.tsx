import { Clock, CheckCircle2, AlertCircle, ClipboardCheck } from "lucide-react";
import { useNavigate } from "react-router";
import { useFetch } from "../datos_maquetados";
import {
  getHorarioDashboard,
  getEvaluacionesPendientesDashboard,
} from "../datos_maquetados/actions/estudiante";

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: schedule } = useFetch(getHorarioDashboard, []);
  const { data: pendingEvals } = useFetch(getEvaluacionesPendientesDashboard, []);

  const today = new Date();
  const dayIndex = today.getDay();
  const weekdays = ["Lun", "Mar", "Mié", "Jue", "Vie"];
  const activeDay =
    dayIndex >= 1 && dayIndex <= 5 ? weekdays[dayIndex - 1] : "Lun";

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
            <div className="grid grid-cols-5 min-w-[420px]">
              {schedule.map(({ day, classes }) => {
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
                      {isToday && (
                        <span className="w-1.5 h-1.5 rounded-full bg-edu-primary inline-block" />
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {classes.map((cls, i) => (
                        <div
                          key={i}
                          className="rounded-edu-chip px-2.5 py-2 cursor-pointer hover:brightness-95 transition-[filter]"
                          style={{ backgroundColor: cls.color }}
                          onClick={() => navigate(`/estudiante/materias/${cls.id}`)}
                        >
                          <div className="text-[0.7rem] text-edu-ink-500 font-medium">
                            {cls.time}
                          </div>
                          <div className="text-[0.8rem] text-edu-ink font-semibold mt-px truncate">
                            {cls.subject}
                          </div>
                          <div className="text-[0.7rem] text-edu-ink-500 mt-px">
                            {cls.teacher}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
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
          {/* Móvil: tarjetas apiladas (más legibles que una tabla con scroll) */}
          <div className="sm:hidden divide-y divide-edu-border-soft">
            {pendingEvals.map((ev) => (
              <div key={ev.id} className="px-4 py-3 flex flex-col gap-1.5">
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
          {/* Móvil: tarjetas apiladas */}
          <div className="sm:hidden divide-y divide-edu-border-soft">
            {pendingEvals.map((ev) => (
              <div key={ev.id} className="px-4 py-3 flex flex-col gap-1.5">
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
                  <span className="text-[0.8125rem] font-semibold text-edu-ink-700 shrink-0">
                    {ev.weight}
                  </span>
                </div>
                <span className="text-[0.8125rem] text-edu-ink-700">{ev.type}</span>
                <span className="flex items-center gap-1 text-[0.8125rem] text-edu-ink-500">
                  <Clock className="w-3 h-3 text-edu-ink-400 shrink-0" />
                  {ev.dueDate}
                </span>
              </div>
            ))}
          </div>
          <div className="hidden sm:block overflow-x-auto">
            <div className="min-w-[360px]">
              <div className="grid grid-cols-[1fr_1.2fr_1fr_0.5fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                {["Materia", "Evaluación", "Fecha", "Calificación"].map((h) => (
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
                  className={`grid grid-cols-[1fr_1.2fr_1fr_0.5fr] px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle ${i < pendingEvals.length - 1 ? "border-b border-edu-border-soft" : ""}`}
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
