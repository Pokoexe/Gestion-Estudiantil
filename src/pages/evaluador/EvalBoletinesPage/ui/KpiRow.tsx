import type { ElementType } from "react";
import { TEAL, TEAL_BG } from "../functions/useEvalBoletines";

interface KpiItem {
  label: string;
  value: string;
  icon: ElementType;
  foot: string;
}

export function KpiRow({ kpis }: { kpis: KpiItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((k) => {
        const Icon = k.icon;
        return (
          <div
            key={k.label}
            className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-edu-ink-500 text-[0.75rem] font-medium m-0 uppercase tracking-[0.05em]">
                  {k.label}
                </p>
                <p className="text-[1.6rem] font-bold mt-1.5 m-0 text-edu-ink">{k.value}</p>
              </div>
              <div
                className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0"
                style={{ backgroundColor: TEAL_BG }}
              >
                <Icon style={{ width: "20px", height: "20px", color: TEAL }} />
              </div>
            </div>
            <p className="text-edu-ink-400 text-[0.75rem] m-0">{k.foot}</p>
          </div>
        );
      })}
    </div>
  );
}
