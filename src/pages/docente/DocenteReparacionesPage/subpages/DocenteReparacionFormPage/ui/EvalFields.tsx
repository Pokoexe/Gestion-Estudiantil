import { Trash2, Upload, FileText, X } from "lucide-react";
import { LAPSO, MIN_REP } from "@shared/services/data/reparaciones";
import type { ReparacionEval } from "@shared/services/actions/reparaciones";
import { inputCls, labelCls } from "../functions/useDocenteReparacionForm";

interface EvalFieldsProps {
    rows: ReparacionEval[];
    activeTab: number;
    updateRow: (rid: number, field: keyof ReparacionEval, value: string) => void;
    removeRow: (index: number) => void;
    addFiles: (rid: number, files: FileList) => void;
    removeFile: (rid: number, idx: number) => void;
}

export function EvalFields({ rows, activeTab, updateRow, removeRow, addFiles, removeFile }: EvalFieldsProps) {
    if (!rows[activeTab]) return null;

    return (
        <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
                <span className="text-edu-ink-700 text-sm font-semibold">Evaluación {activeTab + 1}</span>
                <button
                    type="button"
                    onClick={() => removeRow(activeTab)}
                    disabled={rows.length <= MIN_REP}
                    className="inline-flex items-center gap-1 text-[0.8rem] text-edu-danger font-medium cursor-pointer bg-transparent border-none p-0 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    Eliminar
                </button>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Nombre de la evaluación</label>
                <input
                    type="text"
                    value={rows[activeTab].content}
                    onChange={(e) => updateRow(rows[activeTab].id, "content", e.target.value)}
                    placeholder="Ej. Examen final de recuperación"
                    className={inputCls}
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Descripción</label>
                <textarea
                    value={rows[activeTab].description}
                    onChange={(e) => updateRow(rows[activeTab].id, "description", e.target.value)}
                    placeholder="Describe la evaluación de recuperación…"
                    rows={2}
                    className={`${inputCls} resize-none`}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Fecha</label>
                    <input
                        type="date"
                        min={LAPSO.start}
                        max={LAPSO.end}
                        value={rows[activeTab].date}
                        onChange={(e) => updateRow(rows[activeTab].id, "date", e.target.value)}
                        className={inputCls}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Horario</label>
                    <input
                        type="text"
                        value={rows[activeTab].horario}
                        onChange={(e) => updateRow(rows[activeTab].id, "horario", e.target.value)}
                        placeholder="Ej. Lun · 07:00 – 08:30"
                        className={inputCls}
                    />
                </div>
            </div>

            {/* Archivos opcionales (uno o varios) */}
            <div className="flex flex-col gap-1.5">
                <label className={labelCls}>
                    Archivos <span className="text-edu-ink-400 font-normal">(opcional · uno o varios)</span>
                </label>
                <label className="border-[1.5px] border-dashed border-edu-border rounded-edu-control px-3.5 py-3 bg-edu-subtle cursor-pointer flex items-center justify-center gap-2 transition-colors hover:border-edu-primary-200 text-edu-ink-500 text-[0.8125rem]">
                    <input
                        type="file"
                        multiple
                        onChange={(e) => e.target.files && addFiles(rows[activeTab].id, e.target.files)}
                        className="sr-only"
                    />
                    <Upload className="w-4 h-4" />
                    Adjuntar material de la evaluación
                </label>
                {rows[activeTab].files.length > 0 && (
                    <div className="flex flex-col gap-1.5 mt-0.5">
                        {rows[activeTab].files.map((f, fi) => (
                            <div key={fi} className="flex items-center gap-2 px-2.5 py-1.5 rounded-edu-chip bg-edu-subtle border border-edu-border-soft">
                                <FileText className="w-3.5 h-3.5 text-edu-primary shrink-0" />
                                <span className="text-[0.8rem] text-edu-ink flex-1 truncate">{f}</span>
                                <button
                                    type="button"
                                    onClick={() => removeFile(rows[activeTab].id, fi)}
                                    aria-label="Quitar archivo"
                                    className="text-edu-ink-400 hover:text-edu-danger bg-transparent border-none cursor-pointer p-0 flex items-center"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
