import { TYPE_META } from "../functions/useDocenteRevisiones";
import type { RevType } from "../interfaces";

interface RevisionesKpisProps {
    KPIS: RevType[];
    countOf: (t: RevType) => number;
}

export function RevisionesKpis({ KPIS, countOf }: RevisionesKpisProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {KPIS.map((t, index) => {
                const m = TYPE_META[t];
                const Icon = m.icon;
                return (
                    <div key={t} className={`${index + 1 === KPIS.length && "hidden md:block"} bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">{m.block}</p>
                                <p className="text-edu-ink text-[1.4rem] font-bold mt-1">{countOf(t)}</p>
                            </div>
                            <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: m.bg }}>
                                <Icon style={{ width: "20px", height: "20px", color: m.fg }} />
                            </div>
                        </div>
                        <p className="text-edu-ink-400 text-xs m-0">{m.hint}</p>
                    </div>
                );
            })}
        </div>
    );
}
