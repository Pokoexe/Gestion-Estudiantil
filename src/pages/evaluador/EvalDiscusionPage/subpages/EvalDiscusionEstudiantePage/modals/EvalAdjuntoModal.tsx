import { FileSpreadsheet, Image as ImageIcon, Paperclip, X } from "lucide-react";
import { TEAL, TEAL_50, adjuntoNombre, mockAdjuntoEval } from "../functions/useEvalDiscusionEstudiante";
import { notaColor } from "@shared/services/data/boletines";
import type { EvalNota } from "@shared/services/actions/boletines";

interface Props {
  evalSel: EvalNota;
  tab: string;
  studentName: string;
  onClose: () => void;
}

export function EvalAdjuntoModal({ evalSel, tab, studentName, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-edu-surface rounded-edu-card w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-8 h-8 rounded-edu-control flex items-center justify-center shrink-0"
              style={{ backgroundColor: TEAL_50 }}
            >
              <FileSpreadsheet className="w-4 h-4" style={{ color: TEAL }} />
            </div>
            <div className="min-w-0">
              <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem] truncate">
                {evalSel.nombre}
              </h3>
              <div className="text-[0.75rem] text-edu-ink-500 truncate">
                {tab} · {studentName}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-edu-control border border-edu-border-soft px-3.5 py-3">
              <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">
                Tipo
              </div>
              <div className="text-[0.875rem] text-edu-ink font-semibold mt-0.5">
                {evalSel.tipo}
              </div>
            </div>
            <div className="rounded-edu-control border border-edu-border-soft px-3.5 py-3">
              <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">
                Ponderación
              </div>
              <div className="text-[0.875rem] text-edu-ink font-semibold mt-0.5">
                {evalSel.porcentaje}%
              </div>
            </div>
            <div className="rounded-edu-control border border-edu-border-soft px-3.5 py-3">
              <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">
                Nota
              </div>
              <div className={`text-[0.95rem] font-bold mt-0.5 ${notaColor(evalSel.nota)}`}>
                {evalSel.nota}{" "}
                <span className="text-edu-ink-400 text-[0.75rem] font-medium">/ 20</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Paperclip className="w-3.5 h-3.5 text-edu-ink-400" />
              <span className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">
                Archivo adjunto
              </span>
            </div>
            <div className="rounded-edu-control border border-edu-border-soft overflow-hidden bg-edu-subtle">
              <img
                src={mockAdjuntoEval(evalSel)}
                alt={`Adjunto de ${evalSel.nombre}`}
                className="w-full block"
              />
              <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 border-t border-edu-border-soft bg-edu-surface">
                <div className="flex items-center gap-2 min-w-0">
                  <ImageIcon className="w-4 h-4 text-edu-ink-400 shrink-0" />
                  <span className="text-[0.8125rem] text-edu-ink-700 truncate">
                    {adjuntoNombre(evalSel)}
                  </span>
                </div>
                <span className="text-[0.72rem] text-edu-ink-400 shrink-0">JPG · 1.2 MB</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-3.5 border-t border-edu-border-soft flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer hover:bg-edu-subtle"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
