import React from "react";

interface Kpi {
    label: string;
    value: string;
    icon: React.FC<{ style?: React.CSSProperties }>;
    ac: { bg: string; fg: string };
}

interface KpiColumnProps {
    KPIS: Kpi[];
}

export function KpiColumn({ KPIS }: KpiColumnProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-3">
            {KPIS.map((kpi) => {
                const Icon = kpi.icon;
                return (
                    <div key={kpi.label} className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-4 flex flex-col gap-2.5">
                        <div className="flex justify-between items-start">
                            <p className="text-edu-ink-500 text-[0.7rem] font-medium m-0 uppercase tracking-[0.05em] leading-tight">{kpi.label}</p>
                            <div className="w-8 h-8 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: kpi.ac.bg }}>
                                <Icon style={{ width: "16px", height: "16px", color: kpi.ac.fg }} />
                            </div>
                        </div>
                        <p className="text-[1.4rem] font-bold m-0 text-edu-ink leading-none">{kpi.value}</p>
                    </div>
                );
            })}
        </div>
    );
}
