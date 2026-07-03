import { useState } from "react";
import {
  LayoutTemplate,
  Upload,
  Plus,
  Trash2,
  FileText,
  CalendarClock,
  Eye,
  CheckCircle2,
  GripVertical,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Tipos y datos ficticios                                             */
/* ------------------------------------------------------------------ */

const TEAL = "#0d9488";
const TEAL_BG = "#ccfbf1";
const TEAL_50 = "#f0fdfa";

type CampoTipo = "Texto" | "Número" | "Fecha" | "Selección" | "Sí / No";

interface Campo {
  id: number;
  nombre: string;
  tipo: CampoTipo;
  obligatorio: boolean;
}

const TIPOS: CampoTipo[] = ["Texto", "Número", "Fecha", "Selección", "Sí / No"];

const CAMPOS_INI: Campo[] = [
  { id: 1, nombre: "Materia", tipo: "Texto", obligatorio: true },
  { id: 2, nombre: "Sección", tipo: "Selección", obligatorio: true },
  { id: 3, nombre: "Docente responsable", tipo: "Texto", obligatorio: true },
  { id: 4, nombre: "Lapso", tipo: "Selección", obligatorio: true },
  { id: 5, nombre: "Objetivo / competencia", tipo: "Texto", obligatorio: true },
  { id: 6, nombre: "Tipo de evaluación", tipo: "Selección", obligatorio: true },
  { id: 7, nombre: "Ponderación (%)", tipo: "Número", obligatorio: true },
  { id: 8, nombre: "Fecha de aplicación", tipo: "Fecha", obligatorio: true },
  { id: 9, nombre: "Instrumento anexo", tipo: "Sí / No", obligatorio: false },
];

const REGLAS_TIEMPO = [
  { label: "Separación mínima entre evaluaciones", value: "7 días" },
  { label: "Separación máxima entre evaluaciones", value: "20 días" },
  { label: "Evaluaciones por lapso", value: "Mín. 3 · Máx. 6" },
  { label: "Aviso previo al estudiante", value: "5 días hábiles" },
];

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function EvalPlantillasPage() {
  const [campos, setCampos] = useState<Campo[]>(CAMPOS_INI);
  const [archivo, setArchivo] = useState<string | null>(null);
  const [nuevo, setNuevo] = useState<{ nombre: string; tipo: CampoTipo; obligatorio: boolean }>({
    nombre: "",
    tipo: "Texto",
    obligatorio: true,
  });

  const agregarCampo = () => {
    if (!nuevo.nombre.trim()) return;
    setCampos([...campos, { id: Date.now(), nombre: nuevo.nombre.trim(), tipo: nuevo.tipo, obligatorio: nuevo.obligatorio }]);
    setNuevo({ nombre: "", tipo: "Texto", obligatorio: true });
  };

  const eliminarCampo = (id: number) => setCampos((cs) => cs.filter((c) => c.id !== id));

  const toggleObligatorio = (id: number) =>
    setCampos((cs) => cs.map((c) => (c.id === id ? { ...c, obligatorio: !c.obligatorio } : c)));

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setArchivo(file.name);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Encabezado */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-edu-card flex items-center justify-center shrink-0" style={{ backgroundColor: TEAL_BG }}>
          <LayoutTemplate className="w-7 h-7" style={{ color: TEAL }} />
        </div>
        <div>
          <p className="text-edu-ink text-[1.05rem] font-bold m-0">Plantillas de evaluación</p>
          <p className="text-edu-ink-500 text-[0.85rem] m-0 mt-0.5">
            Define el formato de la planilla del plan de evaluación y consulta las reglas del cronograma.
          </p>
        </div>
      </div>

      {/* (a) Planilla del plan de evaluación */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-edu-border-soft flex items-center gap-2">
          <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: TEAL_50 }}>
            <FileText className="w-4 h-4" style={{ color: TEAL }} />
          </div>
          <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Planilla del plan de evaluación</h3>
        </div>

        <div className="px-5 py-[18px] flex flex-col gap-4">
          {/* Subir planilla */}
          <div className="flex flex-col gap-1.5">
            <span className="text-edu-ink-700 text-sm font-medium">Subir planilla base (opcional)</span>
            <label className="border-[1.5px] border-dashed border-edu-border rounded-edu-control px-3.5 py-4 bg-edu-subtle cursor-pointer flex items-center gap-3 transition-colors hover:border-teal-500">
              <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={handleFile} className="sr-only" />
              {archivo ? (
                <>
                  <div className="w-10 h-10 rounded-edu-chip flex items-center justify-center shrink-0" style={{ backgroundColor: TEAL_BG }}>
                    <FileText className="w-5 h-5" style={{ color: TEAL }} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-[0.8125rem] text-edu-ink font-medium truncate">{archivo}</div>
                    <div className="text-[0.72rem]" style={{ color: TEAL }}>Toca para reemplazar el archivo</div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: TEAL }} />
                </>
              ) : (
                <div className="flex flex-col items-center gap-1 w-full text-center">
                  <Upload className="w-5 h-5 text-edu-ink-400" />
                  <span className="text-[0.8125rem] font-medium text-edu-ink-500">Toca para subir la planilla (PDF, Word o Excel)</span>
                  <span className="text-[0.72rem] text-edu-ink-400">Formato de referencia del plantel</span>
                </div>
              )}
            </label>
          </div>

          {/* Campos exigidos (lista editable) */}
          <div className="rounded-edu-control border border-edu-border-soft overflow-hidden">
            <div className="px-3.5 py-2.5 bg-edu-subtle border-b border-edu-border-soft grid grid-cols-[24px_1.8fr_1fr_0.8fr_40px] items-center gap-2">
              <span />
              <span className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">Nombre del campo</span>
              <span className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">Tipo</span>
              <span className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">Obligatorio</span>
              <span />
            </div>
            {campos.map((c, i) => (
              <div key={c.id} className={`px-3.5 py-2.5 grid grid-cols-[24px_1.8fr_1fr_0.8fr_40px] items-center gap-2 transition-colors hover:bg-edu-subtle ${i < campos.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
                <GripVertical className="w-4 h-4 text-edu-ink-300 shrink-0" />
                <input
                  type="text"
                  value={c.nombre}
                  onChange={(e) => setCampos((cs) => cs.map((x) => (x.id === c.id ? { ...x, nombre: e.target.value } : x)))}
                  className="border border-edu-border-soft rounded-edu-chip px-2.5 py-1.5 text-[0.8125rem] text-edu-ink bg-edu-surface outline-none focus:border-teal-500 w-full"
                />
                <select
                  value={c.tipo}
                  onChange={(e) => setCampos((cs) => cs.map((x) => (x.id === c.id ? { ...x, tipo: e.target.value as CampoTipo } : x)))}
                  className="border border-edu-border-soft rounded-edu-chip px-2.5 py-1.5 text-[0.8125rem] text-edu-ink bg-edu-surface outline-none focus:border-teal-500 w-full cursor-pointer"
                >
                  {TIPOS.map((t) => <option key={t}>{t}</option>)}
                </select>
                <button
                  type="button"
                  onClick={() => toggleObligatorio(c.id)}
                  className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit cursor-pointer border ${c.obligatorio ? "text-white border-transparent" : "bg-edu-subtle text-edu-ink-500 border-edu-border"}`}
                  style={c.obligatorio ? { backgroundColor: TEAL } : undefined}
                >
                  {c.obligatorio ? "Sí" : "No"}
                </button>
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
            <div className="px-3.5 py-2.5 grid grid-cols-[24px_1.8fr_1fr_0.8fr_40px] items-center gap-2 bg-edu-subtle border-t border-edu-border-soft">
              <Plus className="w-4 h-4 shrink-0" style={{ color: TEAL }} />
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
                onClick={() => setNuevo({ ...nuevo, obligatorio: !nuevo.obligatorio })}
                className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit cursor-pointer border ${nuevo.obligatorio ? "text-white border-transparent" : "bg-edu-surface text-edu-ink-500 border-edu-border"}`}
                style={nuevo.obligatorio ? { backgroundColor: TEAL } : undefined}
              >
                {nuevo.obligatorio ? "Sí" : "No"}
              </button>
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

      {/* (b) Cronograma de evaluación — reglas */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-edu-border-soft flex items-center gap-2">
          <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: TEAL_50 }}>
            <CalendarClock className="w-4 h-4" style={{ color: TEAL }} />
          </div>
          <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Cronograma de evaluación — reglas de tiempo</h3>
        </div>
        <div className="grid grid-cols-2 gap-3.5 px-5 py-[18px]">
          {REGLAS_TIEMPO.map((r) => (
            <div key={r.label} className="border border-edu-border-soft rounded-edu-control px-4 py-3 flex items-center justify-between">
              <span className="text-[0.8125rem] text-edu-ink-500">{r.label}</span>
              <span className="text-[0.875rem] font-semibold text-edu-ink">{r.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Vista previa de la plantilla */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-edu-border-soft flex items-center gap-2">
          <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: TEAL_50 }}>
            <Eye className="w-4 h-4" style={{ color: TEAL }} />
          </div>
          <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Vista previa de la plantilla</h3>
        </div>
        <div className="px-5 py-[18px]">
          <div className="border border-edu-border-soft rounded-edu-control p-5 bg-edu-subtle">
            <div className="text-center mb-4">
              <p className="text-[0.95rem] font-bold text-edu-ink m-0">Plan de Evaluación</p>
              <p className="text-[0.75rem] text-edu-ink-500 m-0">U.E. Colegio EduGestión · Año escolar 2025-2026</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {campos.map((c) => (
                <div key={c.id} className="flex flex-col gap-1">
                  <span className="text-[0.72rem] text-edu-ink-500 font-medium flex items-center gap-1">
                    {c.nombre}
                    {c.obligatorio && <span className="text-edu-danger">*</span>}
                  </span>
                  <div className="border border-edu-border rounded-edu-chip bg-edu-surface px-2.5 py-2 text-[0.75rem] text-edu-ink-300">
                    {c.tipo === "Sí / No" ? "Sí / No" : c.tipo === "Fecha" ? "dd/mm/aaaa" : `[ ${c.tipo} ]`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
