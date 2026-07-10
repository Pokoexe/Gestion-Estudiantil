import { ClipboardCheck, Clock, X } from "lucide-react";
import { color } from "@themes/tokens";
import type { PendingEval } from "@shared/services/actions/estudiante";

interface PendingEvalModalProps {
  selectedPendingEval: PendingEval;
  onClose: () => void;
}

/** Modal de evaluación pendiente — diseño accordeón expandido de CoursesPage. */
export function PendingEvalModal({ selectedPendingEval, onClose }: PendingEvalModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-edu-surface rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)] border-[1.5px] border-edu-primary-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado — como la cabecera del AssignmentCard */}
        <div className="flex items-center gap-3.5 px-[18px] py-4">
          <div
            className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0"
            style={{ backgroundColor: color.primary50 }}
          >
            <ClipboardCheck style={{ width: "18px", height: "18px", color: color.primary }} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[0.9rem] font-semibold text-edu-ink">
                {selectedPendingEval.type}
              </span>
            </div>
            <div className="flex gap-3 mt-1 flex-wrap">
              <span className="text-[0.775rem] text-edu-ink-500">
                {selectedPendingEval.subject}
              </span>
              <span className="text-[0.775rem] text-edu-ink-500 flex items-center gap-1">
                <Clock style={{ width: "11px", height: "11px" }} />
                {selectedPendingEval.dueDate}
              </span>
              <span className="text-[0.775rem] text-edu-ink-500">
                Peso: <strong className="text-edu-ink-700">{selectedPendingEval.weight}</strong>
              </span>
            </div>
          </div>

          <span
            className={`text-[0.7rem] font-semibold px-2.5 py-[3px] rounded-edu-pill shrink-0 ${selectedPendingEval.status === "late"
              ? "bg-edu-danger-bg text-edu-danger"
              : "bg-edu-warning-bg text-edu-warning"
              }`}
          >
            {selectedPendingEval.status === "late" ? "Atrasada" : "Próxima"}
          </span>

          <button
            onClick={onClose}
            className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700 shrink-0"
          >
            <X style={{ width: "16px", height: "16px" }} />
          </button>
        </div>

        {/* Contenido expandido — mismo diseño que el acordeón abierto en CoursesPage */}
        <div className="border-t border-edu-border-soft px-[18px] py-5 bg-edu-tint flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[0.78rem] font-semibold text-edu-ink-500 uppercase tracking-[0.05em] m-0 mb-1.5">
                Fecha de entrega
              </p>
              <div className="flex items-center gap-1.5 text-sm text-edu-ink-700">
                <Clock style={{ width: "13px", height: "13px" }} className="text-edu-ink-400" />
                {selectedPendingEval.dueDate}
              </div>
            </div>
            <div>
              <p className="text-[0.78rem] font-semibold text-edu-ink-500 uppercase tracking-[0.05em] m-0 mb-1.5">
                Porcentaje
              </p>
              <p className="text-sm font-semibold text-edu-ink-700 m-0">
                {selectedPendingEval.weight}
              </p>
            </div>
          </div>
          <div>
            <p className="text-[0.78rem] font-semibold text-edu-ink-500 uppercase tracking-[0.05em] m-0 mb-1.5">
              Materia
            </p>
            <p className="text-sm text-edu-ink-700 leading-[1.65] m-0">
              {selectedPendingEval.subject}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
