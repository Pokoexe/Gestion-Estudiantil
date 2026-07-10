import { Trash2, Upload, FileText, X } from "lucide-react";
import type { EvalRow } from "../interfaces";

interface EvalFieldsProps {
    evalRows: EvalRow[];
    evalTab: number;
    updateEval: (rid: number, field: keyof EvalRow, value: string) => void;
    removeEval: (idx: number) => void;
    addArchivos: (rid: number, files: FileList) => void;
    removeArchivo: (rid: number, idx: number) => void;
    MIN_EVALS: number;
    inputCls: string;
    labelCls: string;
}

export function EvalFields({
    evalRows, evalTab,
    updateEval, removeEval,
    addArchivos, removeArchivo,
    MIN_EVALS, inputCls, labelCls,
}: EvalFieldsProps) {
    if (!evalRows[evalTab]) return null;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <span className="text-edu-ink-700 text-sm font-semibold">Evaluación {evalTab + 1}</span>
                <button
                    type="button"
                    onClick={() => removeEval(evalTab)}
                    disabled={evalRows.length <= MIN_EVALS}
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
                    value={evalRows[evalTab].nombre}
                    onChange={(e) => updateEval(evalRows[evalTab].id, "nombre", e.target.value)}
                    placeholder="Ej. Proyecto final · Unidad 1"
                    className={inputCls}
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Descripción</label>
                <textarea
                    value={evalRows[evalTab].descripcion}
                    onChange={(e) => updateEval(evalRows[evalTab].id, "descripcion", e.target.value)}
                    placeholder="Describe en qué consiste la evaluación…"
                    rows={3}
                    className={`${inputCls} resize-none`}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Ponderación (%)</label>
                    <input
                        type="number"
                        min={0}
                        max={100}
                        value={evalRows[evalTab].ponderacion}
                        onChange={(e) => updateEval(evalRows[evalTab].id, "ponderacion", e.target.value)}
                        placeholder="20"
                        className={inputCls}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Fecha</label>
                    <input
                        type="date"
                        value={evalRows[evalTab].fecha}
                        onChange={(e) => updateEval(evalRows[evalTab].id, "fecha", e.target.value)}
                        className={inputCls}
                    />
                </div>
            </div>

            {/* Archivos */}
            <div className="flex flex-col gap-1.5">
                <label className={labelCls}>
                    Archivos <span className="text-edu-ink-400 font-normal">(opcional · uno o varios)</span>
                </label>
                <label className="border-[1.5px] border-dashed border-edu-border rounded-edu-control px-3.5 py-3 bg-edu-subtle cursor-pointer flex items-center justify-center gap-2 transition-colors hover:border-edu-primary text-edu-ink-500 text-[0.8125rem]">
                    <input
                        type="file"
                        multiple
                        onChange={(e) => e.target.files && addArchivos(evalRows[evalTab].id, e.target.files)}
                        className="sr-only"
                    />
                    <Upload className="w-4 h-4" />
                    Adjuntar archivos de apoyo
                </label>
                {evalRows[evalTab].archivos.length > 0 && (
                    <div className="flex flex-col gap-1.5 mt-0.5">
                        {evalRows[evalTab].archivos.map((f, fi) => (
                            <div key={fi} className="flex items-center gap-2 px-2.5 py-1.5 rounded-edu-chip bg-edu-subtle border border-edu-border-soft">
                                <FileText className="w-3.5 h-3.5 text-edu-primary shrink-0" />
                                <span className="text-[0.8rem] text-edu-ink flex-1 truncate">{f}</span>
                                <button
                                    type="button"
                                    onClick={() => removeArchivo(evalRows[evalTab].id, fi)}
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
