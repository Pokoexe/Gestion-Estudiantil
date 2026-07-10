import { X, Paperclip, Download } from "lucide-react";
import type { Pendiente } from "../interfaces";

interface Props {
    evidence: Pendiente;
    onClose: () => void;
}

export function EvidenceModal({ evidence, onClose }: Props) {
    return (
        <div
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-edu-surface rounded-edu-card w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-start gap-3">
                    <div className="min-w-0">
                        <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Evidencia entregada</h3>
                        <div className="text-[0.8rem] text-edu-ink-500 mt-0.5 truncate">{evidence.student} · {evidence.evaluation}</div>
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
                    {evidence.evidenceUrl && (
                        <img
                            src={evidence.evidenceUrl}
                            alt={`Evidencia de ${evidence.student}`}
                            className="w-full max-h-[60vh] object-contain rounded-edu-control border border-edu-border-soft bg-edu-subtle"
                        />
                    )}
                    <div className="flex items-center gap-3 p-3 rounded-edu-control border border-edu-border-soft bg-edu-subtle">
                        <div className="w-10 h-10 rounded-edu-chip bg-edu-primary-50 flex items-center justify-center shrink-0">
                            <Paperclip className="w-5 h-5 text-edu-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-edu-ink truncate">Prueba adjunta</div>
                            <div className="text-xs text-edu-ink-400">Entregada por el estudiante</div>
                        </div>
                        <button
                            type="button"
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-edu-control border-[1.5px] border-edu-primary-200 bg-edu-primary-50 text-edu-primary text-[0.8125rem] font-semibold cursor-pointer transition-colors hover:bg-edu-primary-100 shrink-0"
                        >
                            <Download className="w-3.5 h-3.5" />
                            Descargar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
