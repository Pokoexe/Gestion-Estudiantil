import { CheckCircle2, Gavel } from "lucide-react";
import { TEAL } from "../functions/useEvalDiscusionEstudiante";
import type { Boletin } from "@shared/services/actions/boletines";

interface Props {
  postulacionActiva: boolean;
  tab: string;
  siguiente: Boletin | null;
  onPostular: () => void;
  onDejar: () => void;
}

export function DecisionButtons({
  postulacionActiva,
  tab,
  onPostular,
  onDejar,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {postulacionActiva ? (
        <div className="inline-flex items-center justify-center gap-2 py-3.5 rounded-edu-card text-sm font-semibold bg-edu-success-bg text-edu-success">
          <CheckCircle2 className="w-5 h-5" /> Ya postulado en {tab}
        </div>
      ) : (
        <button
          type="button"
          onClick={onPostular}
          className="inline-flex items-center justify-center gap-2.5 py-3.5 rounded-edu-card text-white text-[0.95rem] font-bold border-none cursor-pointer transition-opacity hover:opacity-90 shadow-[0_2px_8px_rgba(13,148,136,0.25)]"
          style={{ backgroundColor: TEAL }}
        >
          <Gavel className="w-5 h-5" /> Postular al Concejo
        </button>
      )}
      <button
        type="button"
        onClick={onDejar}
        className="inline-flex items-center justify-center gap-2.5 py-3.5 rounded-edu-card text-edu-ink-700 text-[0.95rem] font-bold border-[1.5px] border-edu-border bg-edu-surface cursor-pointer transition-colors hover:bg-edu-subtle"
      >
        Dejar como está
      </button>
    </div>
  );
}
