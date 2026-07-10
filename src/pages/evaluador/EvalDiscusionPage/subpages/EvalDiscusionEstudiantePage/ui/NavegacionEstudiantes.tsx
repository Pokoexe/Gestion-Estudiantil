import { ArrowLeft, ArrowRight } from "lucide-react";
import { TEAL } from "../functions/useEvalDiscusionEstudiante";
import type { Boletin } from "@shared/services/actions/boletines";

interface Props {
  anterior: Boletin | null;
  siguiente: Boletin | null;
  onAnterior: () => void;
  onSiguiente: () => void;
}

export function NavegacionEstudiantes({ anterior, siguiente, onAnterior, onSiguiente }: Props) {
  return (
    <div className="flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={onAnterior}
        disabled={!anterior}
        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold transition-colors enabled:cursor-pointer enabled:hover:bg-edu-subtle disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ArrowLeft className="w-4 h-4" /> Atrás
      </button>
      <button
        type="button"
        onClick={onSiguiente}
        disabled={!siguiente}
        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold transition-opacity enabled:cursor-pointer enabled:hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ backgroundColor: TEAL }}
      >
        Siguiente <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
