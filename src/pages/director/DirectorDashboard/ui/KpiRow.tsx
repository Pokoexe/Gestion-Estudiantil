import { TrendingUp, TrendingDown } from "lucide-react";
import { color } from "@themes/tokens";
import { KPIS } from "../functions/useDirectorDashboard";

interface KpiRowProps {
  kpis: typeof KPIS;
}

export function KpiRow({ kpis }: KpiRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        const Trend = kpi.up ? TrendingUp : TrendingDown;
        const trendColor = kpi.up ? color.success : color.danger;
        return (
          <div key={kpi.label} className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                  {kpi.label}
                </p>
                <p className="text-edu-ink text-2xl font-bold m-0 mt-1.5">{kpi.value}</p>
              </div>
              <div
                className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0"
                style={{ backgroundColor: kpi.tone.bg }}
              >
                <Icon style={{ width: "20px", height: "20px", color: kpi.tone.fg }} />
              </div>
            </div>
            <div className="inline-flex items-center gap-[5px]">
              <Trend style={{ width: "14px", height: "14px", color: trendColor }} />
              <span className="text-xs font-semibold" style={{ color: trendColor }}>
                {kpi.up ? "▲" : "▼"} {kpi.trend}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
