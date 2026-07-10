import React from "react";

type KpiItem = {
    label: string;
    value: string;
    note: string;
    ac: { bg: string; fg: string };
    Icon: React.FC<{ style?: React.CSSProperties }>;
    hideOnPhone: boolean;
};

interface PostulacionesKpisProps {
    KPIS: KpiItem[];
}

export function PostulacionesKpis({ KPIS }: PostulacionesKpisProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {KPIS.map((k) => (
                <div key={k.label} className={`bg-edu-surface rounded-edu-card border border-edu-border-soft p-4 gap-3 items-start ${k.hideOnPhone ? "hidden sm:flex" : "flex"}`}>
                    <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: k.ac.bg }}>
                        <k.Icon style={{ width: 20, height: 20, color: k.ac.fg }} />
                    </div>
                    <div className="min-w-0">
                        <div className="text-[0.7rem] text-edu-ink-400 uppercase tracking-[0.05em] font-semibold leading-tight">{k.label}</div>
                        <div className="text-[1.45rem] font-bold text-edu-ink leading-tight mt-0.5">{k.value}</div>
                        <div className="text-[0.74rem] text-edu-ink-500 mt-0.5 leading-tight">{k.note}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
