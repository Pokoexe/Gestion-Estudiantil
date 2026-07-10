import { Award } from "lucide-react";
import { TEAL, TEAL_50 } from "../functions/useEvalPostularEstudiante";

interface Props {
  actividades: string[];
}

export function ActividadesCard({ actividades }: Props) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-edu-border-soft flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-edu-control flex items-center justify-center"
          style={{ backgroundColor: TEAL_50 }}
        >
          <Award className="w-4 h-4" style={{ color: TEAL }} />
        </div>
        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">
          Actividades extracurriculares
        </h3>
      </div>
      <div className="p-5">
        {actividades.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {actividades.map((a) => (
              <span
                key={a}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-edu-chip text-[0.75rem] font-medium"
                style={{ backgroundColor: TEAL_50, color: TEAL }}
              >
                <Award className="w-3.5 h-3.5" />
                {a}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-[0.8125rem] text-edu-ink-400 m-0">
            Sin actividades registradas.
          </p>
        )}
      </div>
    </div>
  );
}
