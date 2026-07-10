import { Clock, FileText, MessageSquareWarning, X } from "lucide-react";
import { TEAL, TEAL_50 } from "../functions/useEvalPlanDetalle";

interface Props {
  materia: string;
  seccion: string;
  docente: string;
  obs: string;
  onObs: (v: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export function ObservacionModal({
  materia,
  seccion,
  docente,
  obs,
  onObs,
  onClose,
  onSubmit,
}: Props) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-edu-surface rounded-edu-card w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-edu-control flex items-center justify-center"
              style={{ backgroundColor: TEAL_50 }}
            >
              <MessageSquareWarning className="w-4 h-4" style={{ color: TEAL }} />
            </div>
            <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Marcar en revisión</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-edu-control bg-edu-subtle text-[0.8125rem]">
            <FileText className="w-4 h-4 text-edu-ink-400 shrink-0" />
            <span className="text-edu-ink-700 font-medium">
              {materia} · {seccion}
            </span>
            <span className="text-edu-ink-400">— {docente}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-edu-ink-700 text-sm font-medium">
              Observación para el docente
            </label>
            <textarea
              value={obs}
              onChange={(e) => onObs(e.target.value)}
              rows={4}
              placeholder="Describe los ajustes que debe realizar el docente en el plan…"
              className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full resize-none focus:border-teal-600"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onSubmit}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold border-none cursor-pointer transition-opacity hover:opacity-90"
              style={{ backgroundColor: TEAL }}
            >
              <Clock className="w-4 h-4" />
              Enviar observación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
