import { color } from "@themes/tokens";
import type { DashActivity, DashActivityType } from "@shared/services/actions/coordinador";
import { SectionHeader } from "./SectionHeader";
import { Pill } from "./Pill";

type ActivityMeta = Record<DashActivityType, { bg: string; fg: string; icon: React.FC<{ style?: React.CSSProperties }> }>;

type Props = {
  activities: DashActivity[];
  activityMeta: ActivityMeta;
};

export function OngoingActivities({ activities, activityMeta }: Props) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <SectionHeader title="Actividades académicas y culturales en curso" link="Ver todo →" />
      <div className="px-5 py-4 grid gap-3.5">
        {activities.map((act) => {
          const meta = activityMeta[act.type];
          const Icon = meta.icon;
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
              <Pill bg={act.statusOk ? color.successBg : color.warningBg} fg={act.statusOk ? color.success : color.warning}>
                {act.status}
              </Pill>
            </div>
          );
        })}
      </div>
    </div>
  );
}
