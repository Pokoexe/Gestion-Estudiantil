import { X, FileText, Paperclip } from "lucide-react";
import type { Revision, RevTipo, RevEstado } from "@shared/services/actions/evaluador";

interface DetalleEntregaModalProps {
  detail: Revision;
  onClose: () => void;
  estadoMeta: Record<RevEstado, string>;
  tipoMeta: Record<RevTipo, string>;
  teal: string;
  tealBg: string;
  teal50: string;
}

export function DetalleEntregaModal({
  detail,
  onClose,
  estadoMeta,
  tipoMeta,
  teal,
  tealBg: _tealBg,
  teal50,
}: DetalleEntregaModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-edu-surface rounded-edu-card w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-edu-control flex items-center justify-center"
              style={{ backgroundColor: teal50 }}
            >
              <FileText className="w-4 h-4" style={{ color: teal }} />
            </div>
            <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">
              Detalle de la entrega
            </h3>
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
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold bg-edu-subtle ${tipoMeta[detail.tipo]}`}
            >
              {detail.tipo}
            </span>
            <span
              className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold ${estadoMeta[detail.estado]}`}
            >
              {detail.estado}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">
                Docente
              </div>
              <div className="text-[0.875rem] text-edu-ink font-medium">
                {detail.docente}
              </div>
            </div>
            <div>
              <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">
                Materia
              </div>
              <div className="text-[0.875rem] text-edu-ink font-medium">
                {detail.materia}
              </div>
            </div>
            <div>
              <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">
                Sección
              </div>
              <div className="text-[0.875rem] text-edu-ink font-medium">
                {detail.seccion}
              </div>
            </div>
            <div>
              <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">
                Fecha de envío
              </div>
              <div className="text-[0.875rem] text-edu-ink font-medium">
                {detail.fecha}
              </div>
            </div>
          </div>
          <div>
            <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium mb-1">
              Adjunto
            </div>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-edu-control bg-edu-subtle border border-edu-border-soft text-[0.8125rem] transition-colors hover:bg-edu-tint"
            >
              <Paperclip className="w-4 h-4 text-edu-ink-400 shrink-0" />
              <span className="text-edu-ink-700 font-medium truncate">
                {detail.adjunto}
              </span>
            </a>
          </div>
          {detail.observacion && (
            <div className="px-3.5 py-2.5 bg-edu-danger-bg rounded-edu-chip border-l-[3px] border-edu-danger">
              <span className="text-[0.7rem] font-bold text-edu-danger">
                Observación:{" "}
              </span>
              <span className="text-[0.8125rem] text-edu-ink-700 leading-[1.5]">
                {detail.observacion}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
