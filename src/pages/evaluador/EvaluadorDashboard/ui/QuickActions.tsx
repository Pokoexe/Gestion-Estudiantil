export function QuickActions({
  quickActions,
  navigate,
}: {
  quickActions: {
    label: string;
    icon: React.FC<{ style?: React.CSSProperties }>;
    primary: boolean;
    to: string;
  }[];
  navigate: (to: string) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-3">
      {quickActions.map((qa) => {
        const Icon = qa.icon;
        return (
          <button
            key={qa.label}
            onClick={() => navigate(qa.to)}
            className={`w-full inline-flex justify-center items-center gap-[9px] px-5 py-[11px] rounded-edu-control text-sm font-semibold cursor-pointer transition-colors ${qa.primary
              ? "border-none bg-edu-primary text-white hover:bg-edu-primary-hover"
              : "border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 hover:bg-edu-subtle"
              }`}
          >
            <Icon style={{ width: "16px", height: "16px" }} />
            {qa.label}
          </button>
        );
      })}
    </div>
  );
}
