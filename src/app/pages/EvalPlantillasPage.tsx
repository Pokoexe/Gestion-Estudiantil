import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  LayoutTemplate,
  Upload,
  Plus,
  Trash2,
  FileText,
  FileSpreadsheet,
  Eye,
  CheckCircle2,
  Download,
} from "lucide-react";
import { CAMPOS_DEFAULT, TIPOS, type Campo, type CampoTipo } from "../data/plantilla";

/* ------------------------------------------------------------------ */
/* Constantes                                                          */
/* ------------------------------------------------------------------ */

const TEAL = "#0d9488";
const TEAL_BG = "#ccfbf1";
const TEAL_50 = "#f0fdfa";

/** Datos de muestra para la previsualización del archivo subido (mock). */
const SAMPLE: Record<CampoTipo, string[]> = {
  Texto: ["Biología", "Prof. M. Fernández", "Ecosistemas"],
  Número: ["25", "30", "20"],
  Fecha: ["06/07/2026", "15/07/2026", "27/07/2026"],
  Selección: ["5.º Año A", "Lapso II", "Examen"],
  "Sí / No": ["Sí", "No", "Sí"],
};

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function EvalPlantillasPage() {
  const navigate = useNavigate();
  const [campos, setCampos] = useState<Campo[]>(CAMPOS_DEFAULT);
  const [file, setFile] = useState<File | null>(null);
  const [nuevo, setNuevo] = useState<{ nombre: string; tipo: CampoTipo }>({ nombre: "", tipo: "Texto" });

  const fileUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  const agregarCampo = () => {
    if (!nuevo.nombre.trim()) return;
    setCampos([...campos, { id: Date.now(), nombre: nuevo.nombre.trim(), tipo: nuevo.tipo }]);
    setNuevo({ nombre: "", tipo: "Texto" });
  };

  const eliminarCampo = (id: number) => setCampos((cs) => cs.filter((c) => c.id !== id));

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const CAMPO_COLS = "grid-cols-[1.7fr_1fr_40px]";

  return (
    <div className="flex flex-col gap-5">
      {/* Encabezado */}
      <div className="flex justify-between bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 ">

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-edu-card flex items-center justify-center shrink-0" style={{ backgroundColor: TEAL_BG }}>
            <LayoutTemplate className="w-7 h-7" style={{ color: TEAL }} />
          </div>
          <div>
            <p className="text-edu-ink text-[1.05rem] font-bold m-0">Plantillas de evaluación</p>
            <p className="text-edu-ink-500 text-[0.85rem] m-0 mt-0.5">
              Define los campos del plan de evaluación y previsualiza el archivo Excel con los datos cargados.
            </p>
          </div>

        </div>
        <button
          type="button"
          onClick={() => navigate("/evaluador/plantillas/preview", { state: { campos } })}
          className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold text-white border-none cursor-pointer transition-opacity hover:opacity-90"
          style={{ backgroundColor: TEAL }}
        >
          <Eye className="w-4 h-4" />
          Ver vista previa
        </button>
      </div>


      {/* Campos (izquierda) + Previsualización del archivo (derecha) */}
      <div className="grid grid-cols-2 gap-5 items-start">
        {/* Campos que usarán los docentes */}
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-edu-border-soft flex items-center gap-2">
            <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: TEAL_50 }}>
              <FileText className="w-4 h-4" style={{ color: TEAL }} />
            </div>
            <div>
              <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Campos del plan de evaluación</h3>
              <p className="mt-0.5 mb-0 text-edu-ink-400 text-[0.775rem]">Todos los campos son obligatorios (*)</p>
            </div>
          </div>

          <div className="px-5 py-[18px]">
            <div className="rounded-edu-control border border-edu-border-soft overflow-hidden">
              <div className={`px-3.5 py-2.5 bg-edu-subtle border-b border-edu-border-soft grid ${CAMPO_COLS} items-center gap-2`}>
                <span className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">Nombre del campo</span>
                <span className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">Tipo</span>
                <span />
              </div>
              {campos.map((c, i) => (
                <div key={c.id} className={`px-3.5 py-2.5 grid ${CAMPO_COLS} items-center gap-2 transition-colors hover:bg-edu-subtle ${i < campos.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
                  <div className="flex items-center gap-1.5">
                    <span className="text-edu-danger font-bold shrink-0">*</span>
                    <input
                      type="text"
                      value={c.nombre}
                      onChange={(e) => setCampos((cs) => cs.map((x) => (x.id === c.id ? { ...x, nombre: e.target.value } : x)))}
                      className="border border-edu-border-soft rounded-edu-chip px-2.5 py-1.5 text-[0.8125rem] text-edu-ink bg-edu-surface outline-none focus:border-teal-500 w-full"
                    />
                  </div>
                  <select
                    value={c.tipo}
                    onChange={(e) => setCampos((cs) => cs.map((x) => (x.id === c.id ? { ...x, tipo: e.target.value as CampoTipo } : x)))}
                    className="border border-edu-border-soft rounded-edu-chip px-2.5 py-1.5 text-[0.8125rem] text-edu-ink bg-edu-surface outline-none focus:border-teal-500 w-full cursor-pointer"
                  >
                    {TIPOS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                  <button
                    type="button"
                    onClick={() => eliminarCampo(c.id)}
                    aria-label="Eliminar campo"
                    className="w-8 h-8 rounded-edu-chip border border-edu-border bg-edu-surface flex items-center justify-center text-edu-ink-400 cursor-pointer transition-colors hover:text-edu-danger hover:border-edu-danger"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Fila para agregar campo */}
              <div className={`px-3.5 py-2.5 grid ${CAMPO_COLS} items-center gap-2 bg-edu-subtle border-t border-edu-border-soft`}>
                <input
                  type="text"
                  value={nuevo.nombre}
                  onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); agregarCampo(); } }}
                  placeholder="Nuevo campo…"
                  className="border border-edu-border rounded-edu-chip px-2.5 py-1.5 text-[0.8125rem] text-edu-ink bg-edu-surface outline-none focus:border-teal-500 w-full"
                />
                <select
                  value={nuevo.tipo}
                  onChange={(e) => setNuevo({ ...nuevo, tipo: e.target.value as CampoTipo })}
                  className="border border-edu-border rounded-edu-chip px-2.5 py-1.5 text-[0.8125rem] text-edu-ink bg-edu-surface outline-none focus:border-teal-500 w-full cursor-pointer"
                >
                  {TIPOS.map((t) => <option key={t}>{t}</option>)}
                </select>
                <button
                  type="button"
                  onClick={agregarCampo}
                  aria-label="Agregar campo"
                  className="w-8 h-8 rounded-edu-chip flex items-center justify-center text-white cursor-pointer transition-opacity hover:opacity-90"
                  style={{ backgroundColor: TEAL }}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Previsualización del archivo subido */}
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-edu-border-soft flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: TEAL_50 }}>
                <FileSpreadsheet className="w-4 h-4" style={{ color: TEAL }} />
              </div>
              <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Previsualización del archivo</h3>
            </div>
            {file && fileUrl && (
              <a
                href={fileUrl}
                download={file.name}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-edu-control text-[0.8125rem] font-semibold text-white cursor-pointer transition-opacity hover:opacity-90"
                style={{ backgroundColor: TEAL }}
              >
                <Download className="w-3.5 h-3.5" />
                Descargar
              </a>
            )}
          </div>

          <div className="px-5 py-[18px] flex flex-col gap-4">
            {/* Subir Excel */}
            <label className="border-[1.5px] border-dashed border-edu-border rounded-edu-control px-3.5 py-4 bg-edu-subtle cursor-pointer flex items-center gap-3 transition-colors hover:border-teal-500">
              <input type="file" accept=".xls,.xlsx,.csv" onChange={handleFile} className="sr-only" />
              {file ? (
                <>
                  <div className="w-10 h-10 rounded-edu-chip flex items-center justify-center shrink-0" style={{ backgroundColor: TEAL_BG }}>
                    <FileSpreadsheet className="w-5 h-5" style={{ color: TEAL }} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-[0.8125rem] text-edu-ink font-medium truncate">{file.name}</div>
                    <div className="text-[0.72rem]" style={{ color: TEAL }}>Toca para reemplazar el archivo</div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: TEAL }} />
                </>
              ) : (
                <div className="flex flex-col items-center gap-1 w-full text-center">
                  <Upload className="w-5 h-5 text-edu-ink-400" />
                  <span className="text-[0.8125rem] font-medium text-edu-ink-500">Toca para subir el Excel (.xls, .xlsx, .csv)</span>
                  <span className="text-[0.72rem] text-edu-ink-400">Los datos se colocan automáticamente en la plantilla</span>
                </div>
              )}
            </label>

            {/* Previsualización de los datos */}
            {file ? (
              <div className="overflow-x-auto rounded-edu-control border border-edu-border-soft">
                <div className="min-w-max">
                  <div className="grid bg-edu-subtle border-b border-edu-border-soft" style={{ gridTemplateColumns: `repeat(${campos.length}, minmax(120px, 1fr))` }}>
                    {campos.map((c) => (
                      <span key={c.id} className="px-3 py-2 text-[0.68rem] font-semibold text-edu-ink-500 uppercase tracking-[0.04em] border-r border-edu-border-soft last:border-r-0 truncate">{c.nombre}</span>
                    ))}
                  </div>
                  {[0, 1, 2].map((r) => (
                    <div key={r} className={`grid ${r < 2 ? "border-b border-edu-border-soft" : ""}`} style={{ gridTemplateColumns: `repeat(${campos.length}, minmax(120px, 1fr))` }}>
                      {campos.map((c) => (
                        <span key={c.id} className="px-3 py-2 text-[0.8125rem] text-edu-ink-700 border-r border-edu-border-soft last:border-r-0 truncate">{SAMPLE[c.tipo][r]}</span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="border border-edu-border-soft rounded-edu-control px-5 py-10 text-center bg-edu-subtle">
                <FileSpreadsheet className="w-8 h-8 mx-auto text-edu-ink-300" />
                <p className="text-edu-ink-500 text-sm mt-3 m-0">Sube un archivo Excel para previsualizar los datos cargados.</p>
              </div>
            )}
          </div>
        </div>
      </div>


    </div>
  );
}
