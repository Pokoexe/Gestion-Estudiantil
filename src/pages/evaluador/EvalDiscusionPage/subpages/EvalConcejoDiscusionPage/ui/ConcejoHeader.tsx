import { ArrowLeft, Gavel } from "lucide-react";
import { TEAL, TEAL_BG } from "../functions/useEvalConcejoDiscusion";

interface Props {
  onVolver: () => void;
}

export function ConcejoHeader({ onVolver }: Props) {
  return (
    <>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={onVolver}
          className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-edu-ink-500 hover:text-edu-ink-700 bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a discusión de notas
        </button>
      </div>

      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex items-center gap-4 flex-wrap">
        <div
          className="w-14 h-14 rounded-edu-card flex items-center justify-center shrink-0"
          style={{ backgroundColor: TEAL_BG }}
        >
          <Gavel className="w-7 h-7" style={{ color: TEAL }} />
        </div>
        <div>
          <p className="text-edu-ink text-[1.05rem] font-bold m-0">Concejo de Profesores</p>
          <p className="text-edu-ink-500 text-[0.85rem] m-0 mt-0.5">
            Elige un año para revisar a los estudiantes y postularlos al Concejo
          </p>
        </div>
      </div>
    </>
  );
}
