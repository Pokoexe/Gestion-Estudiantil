import { Clock } from "lucide-react";

interface TodayClass {
  time: string;
  subject: string;
  section: string;
  room: string;
  status: string;
}

interface Props {
  TODAY_CLASSES: TodayClass[];
}

export function TodayClasses({ TODAY_CLASSES }: Props) {
  return (
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
  );
}
