interface MainTabsProps {
    mainTab: "info" | "evaluaciones";
    setMainTab: (t: "info" | "evaluaciones") => void;
}

export function MainTabs({ mainTab, setMainTab }: MainTabsProps) {
    return (
        <div className="flex border-b border-edu-border-soft px-5">
            {(["info", "evaluaciones"] as const).map((t) => {
                const label = t === "info" ? "Información" : "Evaluaciones";
                const active = mainTab === t;
                return (
                    <button
                        key={t}
                        type="button"
                        onClick={() => setMainTab(t)}
                        className={`px-4 py-3.5 text-[0.8125rem] font-medium border-b-2 -mb-px transition-colors cursor-pointer bg-transparent ${active ? "border-edu-primary text-edu-primary" : "border-transparent text-edu-ink-500 hover:text-edu-ink-700"}`}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
}
