import { ArrowRight, Gavel } from "lucide-react";
import { TEAL, TEAL_BG } from "../functions/useEvalDiscusion";

interface Props {
  onConcejo: () => void;
}

export function DiscusionHeader({ onConcejo }: Props) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex justify-between items-center flex-wrap gap-4">
      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-edu-card flex items-center justify-center shrink-0"
          style={{ backgroundColor: TEAL_BG }}
        >
          <Gavel className="w-7 h-7" style={{ color: TEAL }} />
        </div>
        <div>
          <p className="text-edu-ink text-[1.05rem] font-bold m-0">Discusión de notas</p>
          <p className="text-edu-ink-500 text-[0.85rem] m-0 mt-0.5">
            Modificaciones de notas hechas a los estudiantes
          </p>
        </div>
      </div>
      <button
        onClick={onConcejo}
        className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold text-white border-none cursor-pointer transition-opacity hover:opacity-90"
        style={{ backgroundColor: TEAL }}
      >
        <Gavel className="w-4 h-4" />
        Discusión de notas — Concejo de profesores
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
