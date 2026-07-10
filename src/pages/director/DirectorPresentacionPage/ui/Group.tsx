import { ChevronDown, Type } from "lucide-react";

export function Group({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
  sectionEnabled,
  onToggle,
}: {
  title: string;
  icon: typeof Type;
  children: React.ReactNode;
  defaultOpen?: boolean;
  sectionEnabled?: boolean;
  onToggle?: () => void;
}) {
  return (
    <details open={defaultOpen} className="group overflow-hidden rounded-edu-control border border-edu-border-soft bg-edu-surface">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-2.5 text-[0.82rem] font-semibold text-edu-ink select-none [&::-webkit-details-marker]:hidden">
        <Icon className="h-4 w-4 text-edu-primary" />
        {title}
        <span className="ml-auto flex items-center gap-2">
          {onToggle !== undefined && sectionEnabled !== undefined && (
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggle(); }}
              role="switch"
              aria-checked={sectionEnabled}
              title={sectionEnabled ? "Ocultar sección" : "Mostrar sección"}
              className={`relative h-5 w-9 shrink-0 rounded-full transition-colors cursor-pointer border-none ${sectionEnabled ? "bg-edu-primary" : "bg-edu-border"}`}
            >
              <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${sectionEnabled ? "left-[18px]" : "left-0.5"}`} />
            </button>
          )}
          <ChevronDown className="h-4 w-4 text-edu-ink-400 transition-transform group-open:rotate-180" />
        </span>
      </summary>
      <div className="flex flex-col gap-2.5 px-3.5 pb-3.5 pt-1">{children}</div>
    </details>
  );
}
