import { accent } from "@themes/tokens";
import type { ProgActionKey } from "@shared/services/actions/misc";

type AccentKey = keyof typeof accent;

interface ActionItem {
  key: ProgActionKey;
  label: string;
}

interface QuickActionsProps {
  quickActions: ActionItem[];
  ACTION_STYLE: Record<ProgActionKey, { icon: React.FC<{ style?: React.CSSProperties }>; tone: AccentKey }>;
}

export function QuickActions({ quickActions, ACTION_STYLE }: QuickActionsProps) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-4">
      <p className="text-edu-ink-500 text-[0.72rem] font-semibold mb-3 uppercase tracking-[0.05em]">
        Acciones rápidas
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {quickActions.map((action) => {
          const style = ACTION_STYLE[action.key];
          const Icon = style.icon;
          const tone = accent[style.tone];
          return (
            <button
              key={action.label}
              className="flex items-center gap-2.5 px-3.5 py-3 rounded-edu-control border border-edu-border bg-edu-surface cursor-pointer text-left transition-colors hover:bg-edu-subtle hover:border-edu-ink-300"
            >
              <div
                className="w-[34px] h-[34px] rounded-edu-chip flex items-center justify-center shrink-0"
                style={{ backgroundColor: tone.bg }}
              >
                <Icon style={{ width: "17px", height: "17px", color: tone.fg }} />
              </div>
              <span className="text-sm font-semibold text-edu-ink">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
