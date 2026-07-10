import { TrendingUp } from "lucide-react";

type Kpi = {
  label: string;
  value: string;
  hint: string;
  icon: React.FC<{ style?: React.CSSProperties }>;
  ac: { bg: string; fg: string };
  trend?: string;
};

export function KpiCards({ kpis }: { kpis: Kpi[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.label}
            className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                  {kpi.label}
                </p>
                <p className="text-edu-ink text-[1.4rem] font-bold mt-1">{kpi.value}</p>
              </div>
              <div
                className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0"
                style={{ backgroundColor: kpi.ac.bg }}
              >
                <Icon style={{ width: "20px", height: "20px", color: kpi.ac.fg }} />
              </div>
            </div>
            <p className="text-edu-ink-400 text-xs m-0">{kpi.hint}</p>
            {kpi.trend && (
              <span
                className="inline-flex items-center gap-[5px] text-[0.7rem] font-semibold px-[9px] py-[3px] rounded-edu-pill w-fit"
                style={{ color: kpi.ac.fg, backgroundColor: kpi.ac.bg }}
              >
                <TrendingUp style={{ width: "11px", height: "11px" }} />
                {kpi.trend}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
