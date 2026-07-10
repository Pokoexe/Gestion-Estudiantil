import { AlertTriangle } from "lucide-react";
import type { DashboardKpi } from "../interfaces";

interface Props {
  KPIS: DashboardKpi[];
}

export function KpiCards({ KPIS }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {KPIS.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.label}
            className={`${index + 1 === KPIS.length && "hidden md:block"} bg-edu-surface rounded-edu-card p-5 flex flex-col gap-3 ${kpi.alert ? "border border-edu-warning-bg" : "border border-edu-border-soft"}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-edu-ink-500 text-[0.75rem] font-medium m-0 uppercase tracking-[0.05em]">
                  {kpi.label}
                </p>
                <p className={`text-[1.6rem] font-bold mt-1.5 m-0 ${kpi.alert ? "text-edu-warning" : "text-edu-ink"}`}>{kpi.value}</p>
              </div>
              <div
                className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0"
                style={{ backgroundColor: kpi.ac.bg }}
              >
                <Icon style={{ width: "20px", height: "20px", color: kpi.ac.fg }} />
              </div>
            </div>
            <p className="text-edu-ink-400 text-[0.75rem] m-0 flex items-center gap-[5px]">
              {kpi.alert && <AlertTriangle style={{ width: "12px", height: "12px" }} className="text-edu-warning-strong" />}
              {kpi.hint}
            </p>
          </div>
        );
      })}
    </div>
  );
}
