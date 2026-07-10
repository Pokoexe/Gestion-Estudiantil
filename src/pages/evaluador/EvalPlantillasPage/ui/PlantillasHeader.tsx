import { Eye, LayoutTemplate } from "lucide-react";
import { TEAL, TEAL_BG } from "../functions/useEvalPlantillas";
import type { Campo } from "@shared/services/actions/plantilla";

interface Props {
  campos: Campo[];
  onPreview: () => void;
}

export function PlantillasHeader({ campos, onPreview }: Props) {
  return (
    <div className="flex justify-between items-center gap-4 flex-wrap bg-edu-surface rounded-edu-card border border-edu-border-soft p-5">
      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-edu-card flex items-center justify-center shrink-0"
          style={{ backgroundColor: TEAL_BG }}
        >
          <LayoutTemplate className="w-7 h-7" style={{ color: TEAL }} />
        </div>
        <div>
          <p className="text-edu-ink text-[1.05rem] font-bold m-0">Plantillas de evaluación</p>
          <p className="text-edu-ink-500 text-[0.85rem] m-0 mt-0.5">
            Define los campos del plan de evaluación y previsualiza el archivo Excel con los datos
            cargados.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onPreview}
        className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold text-white border-none cursor-pointer transition-opacity hover:opacity-90"
        style={{ backgroundColor: TEAL }}
      >
        <Eye className="w-4 h-4" />
        Ver vista previa
      </button>
    </div>
  );
}
