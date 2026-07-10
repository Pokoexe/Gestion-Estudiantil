interface ScheduleClass {
  time: string;
  subject: string;
  section: string;
  color: string;
}

interface ScheduleDay {
  day: string;
  classes: ScheduleClass[];
}

interface Props {
  SCHEDULE: ScheduleDay[];
  activeDay: string;
}

export function WeeklySchedule({ SCHEDULE, activeDay }: Props) {
  return (
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
  );
}
