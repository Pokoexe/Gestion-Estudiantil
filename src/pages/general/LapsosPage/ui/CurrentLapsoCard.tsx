import { Pencil, Plus } from "lucide-react";
import { type LocalLapso } from "../interfaces";

const TEAL = "#0d9488";
const TEAL_BG = "#ccfbf1";

interface CurrentLapsoCardProps {
  current: LocalLapso;
  progreso: number;
  onEdit: (id: number) => void;
  onNuevo: () => void;
  fmtFecha: (iso: string) => string;
  TODAY: string;
}

export function CurrentLapsoCard({ current, progreso, onEdit, onNuevo, fmtFecha, TODAY }: CurrentLapsoCardProps) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center gap-3 flex-wrap">
        <div>
          <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Lapso académico en curso</h3>
          <p className="mt-0.5 mb-0 text-edu-ink-400 text-[0.775rem]">Gestión y fechas del período vigente</p>
        </div>
        <div className="w-full md:w-auto grid grid-cols-2 md:flex gap-2">
          <button
            onClick={() => onEdit(current.id)}
            className="w-full justify-center md:justify-start md:w-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-edu-control text-[0.8125rem] font-semibold border-[1.5px] border-edu-border text-edu-ink-700 bg-edu-surface cursor-pointer transition-colors hover:bg-edu-subtle"
          >
            <Pencil className="w-3.5 h-3.5" />
            Modificar cierre
          </button>
          <button
            onClick={onNuevo}
            className="w-full justify-center md:justify-start md:w-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-edu-control text-[0.8125rem] font-semibold text-white border-none cursor-pointer transition-opacity hover:opacity-90"
            style={{ backgroundColor: TEAL }}
          >
            <Plus className="w-3.5 h-3.5" />
            Nuevo lapso
          </button>
        </div>
      </div>
      <div className="p-5 flex flex-col gap-[18px]">
        <div className="flex justify-between items-start flex-wrap gap-2.5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[1.1rem] font-bold text-edu-ink">{current.fullLabel}</span>
              <span
                className="inline-flex items-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold"
                style={{ backgroundColor: TEAL_BG, color: TEAL }}
              >
                En curso
              </span>
            </div>
            <p className="mt-1 mb-0 text-[0.8rem] text-edu-ink-500">
              Cierre del lapso:{" "}
              <strong className="text-edu-ink-700">{current.cierreLabel}</strong>
            </p>
          </div>
          <div className="text-right">
            <div className="text-[1.4rem] font-bold" style={{ color: TEAL }}>
              {progreso} %
            </div>
            <div className="text-[0.72rem] text-edu-ink-400">del lapso transcurrido</div>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="flex flex-col gap-1.5">
          <div className="h-2.5 bg-edu-border-soft rounded-edu-pill overflow-hidden">
            <div
              className="h-full rounded-edu-pill"
              style={{ width: `${progreso}%`, backgroundColor: TEAL }}
            />
          </div>
          <div className="flex justify-between text-[0.7rem] text-edu-ink-400">
            <span>{fmtFecha(current.inicio)}</span>
            <span>Hoy · {fmtFecha(TODAY)}</span>
            <span>{fmtFecha(current.cierre)}</span>
          </div>
        </div>

        <p className="m-0 text-[0.775rem] text-edu-ink-400">
          Inicio: <strong className="text-edu-ink-700">{current.inicioLabel}</strong>
          {" — "}
          Cierre: <strong className="text-edu-ink-700">{current.cierreLabel}</strong>
        </p>
      </div>
    </div>
  );
}
