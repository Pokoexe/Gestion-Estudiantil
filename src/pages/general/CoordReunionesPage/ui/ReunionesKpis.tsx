import type { LucideIcon } from "lucide-react";

interface Kpi {
    label: string;
    value: string | number;
    icon: LucideIcon;
    ac: { bg: string; fg: string };
}

interface ReunionesKpisProps {
    kpis: Kpi[];
}

export function ReunionesKpis({ kpis }: ReunionesKpisProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {kpis.map((kpi) => {
                const Icon = kpi.icon;
                return (
                    <div key={kpi.label} className="bg-edu-surface rounded-edu-card p-5 flex justify-between items-start border border-edu-border-soft">
                        <div>
                            <p className="text-edu-ink-500 text-[0.75rem] font-medium m-0 uppercase tracking-[0.05em]">{kpi.label}</p>
                            <p className="text-[1.6rem] font-bold mt-1.5 m-0 text-edu-ink">{kpi.value}</p>
                        </div>
                        <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: kpi.ac.bg }}>
                            <Icon style={{ width: 20, height: 20, color: kpi.ac.fg }} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
