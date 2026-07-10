import React from "react";

interface KpiItem {
  label: string;
  value: string;
  icon: React.FC<{ style?: React.CSSProperties }>;
  bg: string;
  fg: string;
}

interface KpiRowProps {
  kpis: KpiItem[];
}

export function KpiRow({ kpis }: KpiRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((k) => {
        const Icon = k.icon;
        return (
          <div
            key={k.label}
            className="bg-edu-surface rounded-edu-card p-5 flex justify-between items-start border border-edu-border-soft"
          >
            <div>
              <p className="text-edu-ink-500 text-[0.75rem] font-medium m-0 uppercase tracking-[0.05em]">
                {k.label}
              </p>
              <p className="text-[1.6rem] font-bold mt-1.5 m-0 text-edu-ink">
                {k.value}
              </p>
            </div>
            <div
              className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0"
              style={{ backgroundColor: k.bg }}
            >
              <Icon style={{ width: "20px", height: "20px", color: k.fg }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
