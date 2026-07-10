import { Pencil, X, Save } from "lucide-react";
import { type LocalLapso } from "../interfaces";

const TEAL = "#0d9488";
const TEAL_50 = "#f0fdfa";

interface EditCierreModalProps {
  editTarget: number;
  lapsos: LocalLapso[];
  editInicio: string;
  setEditInicio: (v: string) => void;
  editCierre: string;
  setEditCierre: (v: string) => void;
  guardarCierre: (e: React.FormEvent) => void;
  setEditTarget: (v: number | null) => void;
}

export function EditCierreModal({
  editTarget,
  lapsos,
  editInicio,
  setEditInicio,
  editCierre,
  setEditCierre,
  guardarCierre,
  setEditTarget,
}: EditCierreModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={() => setEditTarget(null)}
    >
      <div
        className="bg-edu-surface rounded-edu-card w-full max-w-sm max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-edu-control flex items-center justify-center"
              style={{ backgroundColor: TEAL_50 }}
            >
              <Pencil className="w-4 h-4" style={{ color: TEAL }} />
            </div>
            <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Modificar fechas del lapso</h3>
          </div>
          <button
            onClick={() => setEditTarget(null)}
            aria-label="Cerrar"
            className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={guardarCierre} className="p-5 flex flex-col gap-4">
          <div className="px-3.5 py-2.5 rounded-edu-control bg-edu-subtle border border-edu-border-soft text-[0.8125rem] text-edu-ink-700">
            {lapsos.find((l) => l.id === editTarget)?.fullLabel}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-edu-ink-700 text-sm font-medium">Inicio</label>
              <input
                type="date"
                value={editInicio}
                onChange={(e) => setEditInicio(e.target.value)}
                required
                className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-teal-600"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-edu-ink-700 text-sm font-medium">Cierre</label>
              <input
                type="date"
                value={editCierre}
                onChange={(e) => setEditCierre(e.target.value)}
                required
                className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-teal-600"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <button
              type="button"
              onClick={() => setEditTarget(null)}
              className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold border-none cursor-pointer transition-opacity hover:opacity-90"
              style={{ backgroundColor: TEAL }}
            >
              <Save className="w-4 h-4" />
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
