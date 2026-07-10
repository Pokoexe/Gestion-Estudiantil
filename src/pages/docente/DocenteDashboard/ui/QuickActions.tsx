import { NavigateFunction } from "react-router";
import type { QuickAction } from "../interfaces";

interface Props {
  QUICK_ACTIONS: QuickAction[];
  navigate: NavigateFunction;
}

export function QuickActions({ QUICK_ACTIONS, navigate }: Props) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {QUICK_ACTIONS.map((action) => {
        const Icon = action.icon;
        const primary = action.primary;
        return (
          <button
            key={action.label}
            onClick={() => navigate(action.to)}
            className={`w-full justify-center inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold cursor-pointer transition-colors ${primary
              ? "border-[1.5px] border-edu-primary bg-edu-primary text-white hover:bg-edu-primary-hover"
              : "border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 hover:bg-edu-subtle hover:border-edu-ink-300"
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
