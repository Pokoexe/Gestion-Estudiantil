import type { TabKey } from "../interfaces";

interface TabDef {
    key: TabKey;
    label: string;
    icon: React.FC<{ className?: string }>;
}

interface Props {
    tab: TabKey;
    setTab: (t: TabKey) => void;
    TABS: readonly TabDef[];
}

export function SeccionTabs({ tab, setTab, TABS }: Props) {
    return (
        <div className="px-3 pt-2 border-b border-edu-border-soft flex gap-1 flex-wrap justify-center sm:justify-start">
            {TABS.map((t) => {
                const Icon = t.icon;
                const active = tab === t.key;
                return (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 text-[0.8125rem] font-medium border-b-2 -mb-px transition-colors cursor-pointer bg-transparent ${active
                                ? "border-edu-primary text-edu-primary"
                                : "border-transparent text-edu-ink-500 hover:text-edu-ink-700"
                            }`}
                    >
                        <Icon className="w-3.5 h-3.5" />
                        {t.label}
                    </button>
                );
            })}
        </div>
    );
}
