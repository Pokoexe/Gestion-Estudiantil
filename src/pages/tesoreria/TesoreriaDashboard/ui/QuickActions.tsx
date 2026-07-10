type Action = {
  label: string;
  icon: React.FC<{ style?: React.CSSProperties }>;
  primary: boolean;
  to: string;
};

type Props = {
  actions: Action[];
  onNavigate: (to: string) => void;
};

export function QuickActions({ actions, onNavigate }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.label}
            onClick={() => onNavigate(action.to)}
            className={`w-full inline-flex justify-center items-center gap-[9px] px-5 py-[11px] rounded-edu-control text-sm font-semibold cursor-pointer transition-colors ${
              action.primary
                ? "border-none bg-edu-primary text-white hover:bg-edu-primary-hover"
                : "border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 hover:bg-edu-subtle"
            }`}
          >
            <Icon style={{ width: "16px", height: "16px" }} />
            {action.label}
          </button>
        );
      })}
    </div>
  );
}
