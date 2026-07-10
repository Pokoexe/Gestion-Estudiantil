import type { TabOpt } from "../interfaces";

interface RevisionesTabsProps {
  tabs: TabOpt[];
  tab: TabOpt;
  onTabChange: (t: TabOpt) => void;
  teal: string;
}

export function RevisionesTabs({
  tabs,
  tab,
  onTabChange,
  teal,
}: RevisionesTabsProps) {
  return (
    <div className="px-5 pt-3 border-b border-edu-border-soft">
      <div className="flex gap-1 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onTabChange(t)}
            className="px-3.5 py-2.5 text-[0.8125rem] font-medium border-b-2 -mb-px transition-colors cursor-pointer bg-transparent"
            style={
              tab === t
                ? { borderColor: teal, color: teal }
                : { borderColor: "transparent", color: "#6b7280" }
            }
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
