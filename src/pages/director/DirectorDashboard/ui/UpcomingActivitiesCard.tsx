import { CalendarDays } from "lucide-react";
import { color } from "@themes/tokens";
import { ACTIVITY_META } from "../functions/useDirectorDashboard";
import { SectionHeader } from "./SectionHeader";

interface UpcomingActivitiesCardProps {
  activities: any[];
  activityMeta: typeof ACTIVITY_META;
}

export function UpcomingActivitiesCard({ activities, activityMeta }: UpcomingActivitiesCardProps) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
      <SectionHeader title="Próximas actividades" hint="Julio 2026" />
      <div>
        {activities.map((a, i) => {
          const meta = activityMeta[a.type];
          const Icon = meta.icon;
          return (
            <div
              key={a.name}
              className={`flex items-center gap-3.5 px-5 py-3.5 ${i < activities.length - 1 ? "border-b border-edu-border-soft" : ""}`}
            >
              <div
                className="w-[38px] h-[38px] rounded-edu-control flex items-center justify-center shrink-0"
                style={{ backgroundColor: meta.bg }}
              >
                <Icon style={{ width: "18px", height: "18px", color: meta.fg }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[0.9rem] font-semibold text-edu-ink">{a.name}</span>
                  <span
                    className="text-[0.68rem] font-semibold px-2 py-0.5 rounded-edu-pill"
                    style={{ backgroundColor: meta.bg, color: meta.fg }}
                  >
                    {a.type}
                  </span>
                </div>
                <div className="text-[0.775rem] text-edu-ink-500 mt-[3px]">{a.owner}</div>
              </div>
              <div className="flex items-center gap-[5px] shrink-0">
                <CalendarDays style={{ width: "13px", height: "13px", color: color.ink400 }} />
                <span className="text-[0.8rem] text-edu-ink-700 font-medium">{a.date}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
