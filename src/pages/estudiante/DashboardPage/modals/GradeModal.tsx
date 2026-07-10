import { X, Download, FileText, Paperclip } from "lucide-react";
import type { Grade } from "@shared/services/actions/estudiante";
import { ImageWithFallback } from "@shared/ui-figma/ImageWithFallback";
import { TYPE_META, PASS_MARK } from "../functions/useDashboard";

interface GradeModalProps {
  selectedGrade: Grade;
  onClose: () => void;
}

/** Modal de resultado de evaluación — diseño del modal de CalificacionPage. */
export function GradeModal({ selectedGrade, onClose }: GradeModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-edu-surface rounded-edu-card w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        {(() => {
          const t = TYPE_META[selectedGrade.type];
          const TypeIcon = t.icon;
          const passed = selectedGrade.grade >= PASS_MARK;
          return (
            <>
              {/* Encabezado */}
              <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-start gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0"
                    style={{ backgroundColor: t.bg }}
                  >
                    <TypeIcon style={{ width: "18px", height: "18px", color: t.fg }} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem] leading-snug">
                      {selectedGrade.title}
                    </h3>
                    <div className="text-[0.8rem] text-edu-ink-500 mt-0.5">
                      {selectedGrade.subject}
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Cerrar"
                  className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700 shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 flex flex-col gap-4">
                {/* Nota destacada */}
                <div className="flex items-center justify-between px-4 py-3 rounded-edu-control bg-edu-subtle">
                  <div>
                    <div className="text-[0.72rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">
                      Calificación
                    </div>
                    <div
                      className={`text-[1.6rem] font-bold leading-none mt-0.5 ${passed ? "text-edu-success" : "text-edu-danger"}`}
                    >
                      {selectedGrade.grade}
                      <span className="text-edu-ink-400 font-normal text-base">/20</span>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center justify-center px-3 py-1.5 rounded-edu-pill text-[0.8rem] font-semibold ${passed ? "bg-edu-success-bg text-edu-success" : "bg-edu-danger-bg text-edu-danger"}`}
                  >
                    {passed ? "Aprobada" : "Reprobada"}
                  </span>
                </div>

                {/* Datos */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {[
                    { label: "Tipo", value: t.label },
                    { label: "Docente", value: selectedGrade.teacher },
                    { label: "Fecha", value: selectedGrade.date },
                    { label: "Peso", value: selectedGrade.weight },
                  ].map((d) => (
                    <div key={d.label}>
                      <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">
                        {d.label}
                      </div>
                      <div className="text-[0.875rem] text-edu-ink font-medium">{d.value}</div>
                    </div>
                  ))}
                </div>

                {/* Descripción */}
                <div>
                  <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium mb-1">
                    Descripción
                  </div>
                  <p className="text-sm text-edu-ink-700 leading-[1.6] m-0">
                    {selectedGrade.description}
                  </p>
                </div>

                {/* Prueba adjunta */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Paperclip className="w-3.5 h-3.5 text-edu-ink-400" />
                    <span className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">
                      Prueba adjunta
                    </span>
                  </div>
                  {selectedGrade.attachment.kind === "image" ? (
                    <a
                      href={selectedGrade.attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-edu-control overflow-hidden border border-edu-border-soft"
                    >
                      <ImageWithFallback
                        src={selectedGrade.attachment.url}
                        alt={selectedGrade.attachment.name}
                        className="w-full max-h-[320px] object-contain bg-edu-subtle"
                      />
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 p-3 rounded-edu-control border border-edu-border-soft bg-edu-subtle">
                      <div className="w-10 h-10 rounded-edu-chip bg-edu-danger-bg flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-edu-danger" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-edu-ink truncate">
                          {selectedGrade.attachment.name}
                        </div>
                        <div className="text-xs text-edu-ink-400">Documento adjunto</div>
                      </div>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-edu-control border-[1.5px] border-edu-primary-200 bg-edu-primary-50 text-edu-primary text-[0.8125rem] font-semibold cursor-pointer transition-colors hover:bg-edu-primary-100 shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Descargar
                      </button>
                    </div>
                  )}
                  <div className="text-[0.72rem] text-edu-ink-400 mt-1.5">
                    {selectedGrade.attachment.name}
                  </div>
                </div>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}
