import { TrendingDown } from "lucide-react";

type SummaryItem = {
  label: string;
  value: string;
  icon: React.FC<{ style?: React.CSSProperties }>;
  ac: { bg: string; fg: string };
  hint: string;
  trend?: string;
};

export function SolvencySummary({ summary }: { summary: SummaryItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {summary.map((k) => {
        const Icon = k.icon;
        return (
          <div key={k.label} className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">{k.label}</p>
                <p className="text-edu-ink text-[1.6rem] font-bold mt-1 m-0">{k.value}</p>
              </div>
              <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: k.ac.bg }}>
                <Icon style={{ width: "20px", height: "20px", color: k.ac.fg }} />
              </div>
            </div>
            <p className="text-edu-ink-400 text-xs m-0">{k.hint}</p>
            {k.trend && (
              <span className="inline-flex items-center gap-[5px] text-[0.7rem] font-semibold px-[9px] py-[3px] rounded-edu-pill w-fit bg-edu-danger-bg text-edu-danger">
                <TrendingDown style={{ width: "11px", height: "11px" }} />
                {k.trend}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
