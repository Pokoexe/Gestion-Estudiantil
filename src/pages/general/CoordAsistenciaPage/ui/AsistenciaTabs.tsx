import { color, accent } from "@themes/tokens";
import type { Tab } from "../interfaces";

interface AsistenciaTabsProps {
    tab: Tab;
    setTab: (t: Tab) => void;
    tabs: { key: Tab; label: string; icon: React.FC<{ className?: string }> }[];
}

export function AsistenciaTabs({ tab, setTab, tabs }: AsistenciaTabsProps) {
    return (
        <div className="flex gap-1 border-b border-edu-border-soft">
            {tabs.map((t) => {
                const active = tab === t.key;
                const TabIcon = t.icon;
                return (
                    <button
                        key={t.key}
                        type="button"
                        onClick={() => setTab(t.key)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-[0.8125rem] font-medium border-b-2 -mb-px cursor-pointer bg-transparent transition-colors"
                        style={active ? { borderColor: accent.purple.fg, color: accent.purple.fg } : { borderColor: "transparent", color: color.ink500 }}
                    >
                        <TabIcon className="w-4 h-4" />
                        {t.label}
                    </button>
                );
            })}
        </div>
    );
}
