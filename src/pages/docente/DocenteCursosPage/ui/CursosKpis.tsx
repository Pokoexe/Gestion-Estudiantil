interface KpiItem {
    label: string;
    value: string;
    icon: React.ElementType;
    ac: { bg: string; fg: string };
    hint: string;
}

interface CursosKpisProps {
    kpis: KpiItem[];
}

export function CursosKpis({ kpis }: CursosKpisProps) {
    return (
        <div className="flex flex-col gap-3">
            {kpis.map((kpi) => {
                const Icon = kpi.icon;
                return (
                    <div key={kpi.label} className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex flex-col gap-3 flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-edu-ink-500 text-[0.72rem] font-medium m-0 uppercase tracking-[0.05em]">{kpi.label}</p>
                                <p className="text-[1.5rem] font-bold mt-1.5 m-0 text-edu-ink">{kpi.value}</p>
                            </div>
                            <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: kpi.ac.bg }}>
                                <Icon style={{ width: "20px", height: "20px", color: kpi.ac.fg }} />
                            </div>
                        </div>
                        <p className="text-edu-ink-400 text-[0.72rem] m-0">{kpi.hint}</p>
                    </div>
                );
            })}
        </div>
    );
}
