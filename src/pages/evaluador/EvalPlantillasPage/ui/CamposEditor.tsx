import { FileText, Trash2, Plus } from "lucide-react";
import { TEAL_50, TEAL, CAMPO_COLS } from "../functions/useEvalPlantillas";
import type { Campo, CampoTipo } from "@shared/services/actions/plantilla";

interface Props {
  campos: Campo[];
  setCampos: (cs: Campo[]) => void;
  nuevo: { nombre: string; tipo: CampoTipo };
  setNuevo: (n: { nombre: string; tipo: CampoTipo }) => void;
  TIPOS: CampoTipo[];
  agregarCampo: () => void;
  eliminarCampo: (id: number) => void;
}

export function CamposEditor({ campos, setCampos, nuevo, setNuevo, TIPOS, agregarCampo, eliminarCampo }: Props) {
  return (
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
                  onChange={(e) => setCampos(campos.map((x) => (x.id === c.id ? { ...x, nombre: e.target.value } : x)))}
                  className="border border-edu-border-soft rounded-edu-chip px-2.5 py-1.5 text-[0.8125rem] text-edu-ink bg-edu-surface outline-none focus:border-teal-500 w-full"
                />
              </div>
              <select
                value={c.tipo}
                onChange={(e) => setCampos(campos.map((x) => (x.id === c.id ? { ...x, tipo: e.target.value as CampoTipo } : x)))}
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
  );
}
