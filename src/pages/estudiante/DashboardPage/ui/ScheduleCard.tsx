import { ClipboardCheck } from "lucide-react";
import type { DashboardClass } from "@shared/services/actions/estudiante";
import { HORARIO_DIAS } from "../functions/useDashboard";

function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + mins;
  const hh = String(Math.floor(total / 60)).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

interface ScheduleCardProps {
  activeDay: string;
  scheduleTimes: string[];
  scheduleTimeRows: (DashboardClass | null)[][];
  onClassClick: (id: string) => void;
}

/** Sección Horario del lapso: cuadrícula de bloques por hora y día. */
export function ScheduleCard({ activeDay, scheduleTimes, scheduleTimeRows, onClassClick }: ScheduleCardProps) {
  return (
    <div className="lg:col-span-2 bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">

      <div className="px-4 sm:px-5 py-4 border-b border-edu-border-soft flex justify-between items-center gap-2">
        <h3 className="hidden md:block m-0 text-edu-ink font-semibold text-[0.9375rem]">
          Horario del lapso
        </h3>
        <button
          className="w-full md:w-auto justify-center inline-flex items-center gap-2 px-3 sm:px-[18px] py-2 sm:py-2.5 rounded-edu-control text-sm font-semibold cursor-pointer transition-colors border-[1.5px] border-edu-primary bg-edu-primary text-white hover:bg-edu-primary-hover shrink-0"
        >
          <ClipboardCheck style={{ width: "16px", height: "16px" }} />
          <span className="hidden sm:inline">Descargar horario</span>
          <span className="sm:hidden">Descargar</span>
        </button>
      </div>

      <div className="overflow-hidden">

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
                        onClick={() => onClassClick(cls.id)}
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
    </div>
  );
}
