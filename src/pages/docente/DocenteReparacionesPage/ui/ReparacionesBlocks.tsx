import type { ElementType } from "react";

interface Block {
    label: string;
    value: number;
    icon: ElementType;
    bg: string;
    fg: string;
    hint: string;
}

interface ReparacionesBlocksProps {
    BLOCKS: Block[];
}

export function ReparacionesBlocks({ BLOCKS }: ReparacionesBlocksProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BLOCKS.map((s) => {
                const Icon = s.icon;
                return (
                    <div key={s.label} className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">{s.label}</p>
                                <p className="text-edu-ink text-[1.4rem] font-bold mt-1">{s.value}</p>
                            </div>
                            <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: s.bg }}>
                                <Icon className="w-5 h-5" style={{ color: s.fg }} />
                            </div>
                        </div>
                        <p className="text-edu-ink-400 text-xs m-0">{s.hint}</p>
                    </div>
                );
            })}
        </div>
    );
}
