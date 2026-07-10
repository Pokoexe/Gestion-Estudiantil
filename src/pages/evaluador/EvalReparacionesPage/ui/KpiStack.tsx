import { Users, CircleAlert } from "lucide-react";
import { TEAL, TEAL_BG } from "../functions/useEvalReparaciones";

interface Props {
  pendienteCount: number;
  totalReprobadas: number;
}

export function KpiStack({ pendienteCount, totalReprobadas }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5 flex-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
              Estudiantes con mat. pendiente
            </p>
            <p className="text-edu-ink text-[1.4rem] font-bold mt-1 m-0">{pendienteCount}</p>
          </div>
          <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: TEAL_BG }}>
            <Users style={{ width: "20px", height: "20px", color: TEAL }} />
          </div>
        </div>
        <p className="text-edu-ink-400 text-xs m-0">Con al menos una materia sin nota definitiva</p>
      </div>
      <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5 flex-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">Materias reprobadas</p>
            <p className="text-edu-ink text-[1.4rem] font-bold mt-1 m-0">{totalReprobadas}</p>
          </div>
          <div className="w-10 h-10 rounded-edu-control bg-edu-danger-bg flex items-center justify-center shrink-0">
            <CircleAlert className="w-5 h-5 text-edu-danger" />
          </div>
        </div>
        <p className="text-edu-ink-400 text-xs m-0">Total de materias reprobadas en el lapso actual</p>
      </div>
    </div>
  );
}
