import { X, Paperclip, Save, FileText } from "lucide-react";
import type { Estudiante, EvaluacionPlan } from "../interfaces";

interface Props {
    gradeStudent: Estudiante;
    gradeIsChange: boolean;
    gradePrev: string | null;
    gradeValue: string;
    setGradeValue: (v: string) => void;
    gradeFile: { url: string; name: string; isImage: boolean } | null;
    onGradeFile: (ev: React.ChangeEvent<HTMLInputElement>) => void;
    selectedEval: EvaluacionPlan | undefined;
    onSave: () => void;
    onClose: () => void;
    notaColor: (n: number) => string;
}

export function GradeUploadModal({
    gradeStudent,
    gradeIsChange,
    gradePrev,
    gradeValue,
    setGradeValue,
    gradeFile,
    onGradeFile,
    selectedEval,
    onSave,
    onClose,
    notaColor,
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
                <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-start gap-3">
                    <div className="min-w-0">
                        <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">{gradeIsChange ? "Cambiar nota" : "Subir nota"}</h3>
                        <div className="text-[0.8rem] text-edu-ink-500 mt-0.5 truncate">{gradeStudent.name}</div>
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
                    <div className="px-3.5 py-2.5 rounded-edu-control bg-edu-primary-50 text-[0.8125rem] text-edu-primary">
                        Evaluación: <strong>{selectedEval?.name}</strong> ({selectedEval?.weight} %)
                    </div>

                    {gradeIsChange && (
                        <div className="flex items-center justify-between px-3.5 py-2.5 rounded-edu-control bg-edu-subtle border border-edu-border-soft">
                            <span className="text-[0.8125rem] text-edu-ink-500 font-medium">Nota anterior</span>
                            <span className={`text-[1.1rem] font-bold ${notaColor(Number(gradePrev))}`}>
                                {gradePrev}<span className="text-edu-ink-400 font-normal text-[0.75rem]">/20</span>
                            </span>
                        </div>
                    )}

                    <div>
                        <label className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium block mb-1">
                            {gradeIsChange ? "Nota nueva (0 – 20)" : "Nota (0 – 20)"}
                        </label>
                        <input
                            type="number"
                            min={0}
                            max={20}
                            step="0.1"
                            value={gradeValue}
                            onChange={(ev) => setGradeValue(ev.target.value)}
                            placeholder="Ej. 15.5"
                            className="w-full border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-edu-ink outline-none bg-edu-subtle text-sm focus:border-edu-primary"
                        />
                    </div>

                    <div>
                        <label className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium block mb-1">
                            {gradeIsChange ? "Adjuntar imagen" : "Prueba adjunta"}
                        </label>
                        <label className="flex items-center gap-2 px-3.5 py-2.5 rounded-edu-control border-[1.5px] border-dashed border-edu-border bg-edu-subtle cursor-pointer text-edu-ink-500 text-[0.8125rem] hover:border-edu-primary transition-colors">
                            <input type="file" accept={gradeIsChange ? "image/*" : "image/*,.pdf,.doc,.docx"} className="sr-only" onChange={onGradeFile} />
                            <Paperclip className="w-4 h-4 shrink-0" />
                            {gradeFile ? "Cambiar archivo" : gradeIsChange ? "Adjuntar imagen" : "Adjuntar imagen o documento"}
                        </label>

                        {gradeFile && (
                            <div className="mt-3">
                                {gradeFile.isImage ? (
                                    <img
                                        src={gradeFile.url}
                                        alt={gradeFile.name}
                                        className="max-h-48 w-full object-contain rounded-edu-control border border-edu-border-soft bg-edu-subtle"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-edu-control border border-edu-border-soft bg-edu-subtle">
                                        <FileText className="w-4 h-4 text-edu-primary shrink-0" />
                                        <span className="text-[0.8125rem] text-edu-ink truncate">{gradeFile.name}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-5 py-3.5 border-t border-edu-border-soft flex items-center justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onSave}
                        className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold bg-edu-primary text-white hover:bg-edu-primary-hover border-none cursor-pointer"
                    >
                        <Save className="w-4 h-4" />
                        {gradeIsChange ? "Guardar cambios" : "Guardar nota"}
                    </button>
                </div>
            </div>
        </div>
    );
}
