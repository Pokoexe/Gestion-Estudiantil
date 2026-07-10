import { PlusCircle, Trash2, Upload, FileText, X, ClipboardCheck, CheckCircle2 } from "lucide-react";
import { color } from "@themes/tokens";
import type { EvalRow } from "../interfaces";

type Props = {
  evalRows: EvalRow[];
  evalTab: number | "review";
  setEvalTab: (t: number | "review") => void;
  addEval: () => void;
  removeEval: (idx: number) => void;
  updateEval: (rid: number, field: keyof EvalRow, value: string) => void;
  addArchivos: (rid: number, files: FileList) => void;
  removeArchivo: (rid: number, idx: number) => void;
  totalPond: number;
  weightOk: boolean;
  evalsOk: boolean;
  infoOk: string | boolean;
  MIN_EVALS: number;
  inputCls: string;
  labelCls: string;
};

export function EvaluationsTab({
  evalRows, evalTab, setEvalTab,
  addEval, removeEval, updateEval, addArchivos, removeArchivo,
  totalPond, weightOk, evalsOk, infoOk,
  MIN_EVALS, inputCls, labelCls,
}: Props) {
  return (
    <div className="p-5 flex flex-col gap-4">
      {/* Sub-tabs */}
      <div className="flex items-center gap-1 flex-wrap border-b border-edu-border-soft -mx-5 px-5">
        {evalRows.map((r, i) => {
          const active = evalTab === i;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setEvalTab(i)}
              className={`px-3 py-2.5 text-[0.8rem] font-medium border-b-2 -mb-px transition-colors cursor-pointer bg-transparent ${active ? "border-edu-primary text-edu-primary" : "border-transparent text-edu-ink-500 hover:text-edu-ink-700"}`}
            >
              Evaluación {i + 1}
            </button>
          );
        })}
        <button
          type="button"
          onClick={addEval}
          title="Añadir evaluación"
          className="px-2 py-2.5 -mb-px text-edu-primary cursor-pointer bg-transparent border-none flex items-center"
        >
          <PlusCircle className="w-4 h-4" />
        </button>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => setEvalTab("review")}
          className={`px-3 py-2.5 text-[0.8rem] font-semibold border-b-2 -mb-px inline-flex items-center gap-1.5 transition-colors cursor-pointer bg-transparent ${evalTab === "review" ? "border-edu-primary text-edu-primary" : "border-transparent text-edu-ink-500 hover:text-edu-ink-700"}`}
        >
          <ClipboardCheck className="w-3.5 h-3.5" />
          Datos colocados
        </button>
      </div>

      {/* Formulario de la evaluación activa */}
      {typeof evalTab === "number" && evalRows[evalTab] && (
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
      )}

      {/* Pestaña "Datos colocados" */}
      {evalTab === "review" && (
        <div className="flex flex-col gap-4">
          <div className="rounded-edu-control border border-edu-border-soft overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-[520px]">
                <div className="grid grid-cols-[0.4fr_1.6fr_0.6fr_1fr_0.7fr] px-3 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                  {["#", "Evaluación", "%", "Fecha", "Archivos"].map((h) => (
                    <span key={h} className="text-[0.65rem] font-semibold text-edu-ink-400 uppercase tracking-[0.04em]">{h}</span>
                  ))}
                </div>
                {evalRows.map((r, i) => (
                  <div
                    key={r.id}
                    className={`grid grid-cols-[0.4fr_1.6fr_0.6fr_1fr_0.7fr] px-3 py-2.5 items-center ${i < evalRows.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                  >
                    <span className="text-[0.8rem] text-edu-ink-500 font-semibold">{i + 1}</span>
                    <span className="text-[0.8rem] text-edu-ink font-medium truncate pr-2">
                      {r.nombre || <span className="text-edu-danger">Sin nombre</span>}
                    </span>
                    <span className="text-[0.8rem] text-edu-ink-700 font-semibold">{r.ponderacion || "—"} %</span>
                    <span className="text-[0.78rem] text-edu-ink-500">{r.fecha || "—"}</span>
                    <span className="text-[0.78rem] text-edu-ink-500">{r.archivos.length} arch.</span>
                  </div>
                ))}
                <div className="px-3 py-2.5 bg-edu-subtle border-t border-edu-border-soft flex justify-between text-[0.8125rem]">
                  <span className="text-edu-ink-500">Ponderación total</span>
                  <span className={`font-semibold ${weightOk ? "text-edu-success" : "text-edu-warning"}`}>{totalPond} %</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {[
              { ok: infoOk, text: "Información del curso completa (título, cupos, docente)" },
              { ok: evalsOk, text: "Todas las evaluaciones tienen nombre y ponderación" },
              { ok: weightOk, text: `La ponderación total es 100 % (actual: ${totalPond} %)` },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-2 text-[0.8125rem]">
                {c.ok
                  ? <CheckCircle2 className="w-4 h-4 text-edu-success shrink-0" />
                  : <div className="w-4 h-4 rounded-full border-2 shrink-0" style={{ borderColor: color.warning }} />
                }
                <span className={c.ok ? "text-edu-ink-700" : "text-edu-warning"}>{c.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
