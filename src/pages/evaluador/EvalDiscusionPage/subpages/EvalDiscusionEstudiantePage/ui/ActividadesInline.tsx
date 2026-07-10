import { Award } from "lucide-react";
import { TEAL, TEAL_50 } from "../functions/useEvalDiscusionEstudiante";

interface Props {
  actividades: string[];
}

export function ActividadesInline({ actividades }: Props) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-4 flex items-center gap-2.5 flex-wrap">
      <span className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-semibold">
        Actividades:
      </span>
      {actividades.length > 0 ? (
        actividades.map((a) => (
          <span
            key={a}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-edu-chip text-[0.75rem] font-medium"
            style={{ backgroundColor: TEAL_50, color: TEAL }}
          >
            <Award className="w-3.5 h-3.5" /> {a}
          </span>
        ))
      ) : (
        <span className="text-[0.8125rem] text-edu-ink-400">Sin actividades registradas.</span>
      )}
    </div>
  );
}
