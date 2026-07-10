import { ArrowLeft } from "lucide-react";

interface Props {
  materia: string;
  seccion: string;
  docente: string;
  onVolver: () => void;
}

export function PlanDetalleHeader({ materia, seccion, docente, onVolver }: Props) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <button
        onClick={onVolver}
        className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-edu-ink-500 hover:text-edu-ink-700 bg-transparent border-none cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Volver al cronograma
      </button>
      <div>
        <h2 className="m-0 text-edu-ink font-bold text-[1.2rem]">
          {materia} · {seccion}
        </h2>
        <p className="m-0 mt-0.5 text-edu-ink-500 text-[0.85rem]">
          Plan de evaluación — {docente}
        </p>
      </div>
    </div>
  );
}
