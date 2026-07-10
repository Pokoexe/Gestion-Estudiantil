import { accent } from "@themes/tokens";
import type { Tab } from "../interfaces";

interface Props {
    tab: Tab;
    setTab: (t: Tab) => void;
    TABS: { key: Tab; label: string }[];
}

export function SeccionesTabs({ tab, setTab, TABS }: Props) {
    return (
        <div className="flex gap-1 border-b border-edu-border-soft">
            {TABS.map((t) => {
                const active = tab === t.key;
                return (
                    <button
                        key={t.key}
                        type="button"
                        onClick={() => setTab(t.key)}
                        className="px-3.5 py-2.5 text-[0.8125rem] font-medium border-b-2 -mb-px cursor-pointer bg-transparent transition-colors"
                        style={active ? { borderColor: accent.purple.fg, color: accent.purple.fg } : { borderColor: "transparent", color: "#6b7280" }}
                    >
                        {t.label}
                    </button>
                );
            })}
        </div>
    );
}
