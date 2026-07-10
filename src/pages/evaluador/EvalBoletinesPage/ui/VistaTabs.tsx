import { LapsoFilter } from "@shared/ui/LapsoFilter";
import { TEAL } from "../functions/useEvalBoletines";

interface Props {
  vista: "estudiante" | "seccion";
  onVista: (v: "estudiante" | "seccion") => void;
}

const TABS = [
  { key: "estudiante" as const, label: "Por estudiante" },
  { key: "seccion" as const, label: "Por año / sección" },
];

export function VistaTabs({ vista, onVista }: Props) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="inline-flex gap-1 bg-edu-subtle rounded-edu-control p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => onVista(t.key)}
            className={`px-4 py-2 rounded-edu-chip text-[0.8125rem] font-semibold transition-colors cursor-pointer border-none ${vista === t.key ? "bg-edu-surface shadow-[0_1px_3px_rgba(0,0,0,0.08)]" : "bg-transparent text-edu-ink-500 hover:text-edu-ink-700"}`}
            style={vista === t.key ? { color: TEAL } : undefined}
          >
            {t.label}
          </button>
        ))}
      </div>
      <LapsoFilter />
    </div>
  );
}
