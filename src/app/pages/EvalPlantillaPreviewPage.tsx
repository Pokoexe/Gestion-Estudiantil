import { useLocation, useNavigate } from "react-router";
import { ArrowLeft, FileText, Save } from "lucide-react";
import { CAMPOS_DEFAULT, type Campo } from "../data/plantilla";

const TEAL = "#0d9488";
const TEAL_50 = "#f0fdfa";

function CampoPreview({ campo }: { campo: Campo }) {
  const base =
    "border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-teal-600";
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-edu-ink-700 text-sm font-medium flex items-center gap-1">
        {campo.nombre} <span className="text-edu-danger">*</span>
      </label>
      {campo.tipo === "Fecha" ? (
        <input type="date" required className={`${base} cursor-pointer`} />
      ) : campo.tipo === "Número" ? (
        <input type="number" required placeholder="0" className={base} />
      ) : campo.tipo === "Selección" ? (
        <select required className={`${base} cursor-pointer`}>
          <option value="">Seleccionar…</option>
        </select>
      ) : campo.tipo === "Sí / No" ? (
        <select required className={`${base} cursor-pointer`}>
          <option value="">Seleccionar…</option>
          <option>Sí</option>
          <option>No</option>
        </select>
      ) : (
        <input type="text" required placeholder={`Ingresar ${campo.nombre.toLowerCase()}`} className={base} />
      )}
    </div>
  );
}

export function EvalPlantillaPreviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const campos = ((location.state as { campos?: Campo[] } | null)?.campos ?? CAMPOS_DEFAULT);

  return (
    <div className="flex flex-col gap-5">
      {/* Barra superior */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={() => navigate("/evaluador/plantillas")}
          className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-edu-ink-500 hover:text-edu-ink-700 bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a plantillas
        </button>
        <div>
          <h2 className="m-0 text-edu-ink font-bold text-[1.2rem]">Vista previa de la plantilla</h2>
          <p className="m-0 mt-0.5 text-edu-ink-500 text-[0.85rem]">Así verán y llenarán el plan de evaluación los docentes.</p>
        </div>
      </div>

      {/* Formulario que usarán los docentes */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-edu-border-soft flex items-center gap-2">
          <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: TEAL_50 }}>
            <FileText className="w-4 h-4" style={{ color: TEAL }} />
          </div>
          <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Plan de Evaluación</h3>
        </div>

        <div className="p-6">
          <div className="mx-auto max-w-[760px] bg-edu-surface rounded-edu-card border border-edu-border-soft p-6 shadow-[0_6px_20px_rgba(0,0,0,0.05)]">
            <div className="text-center border-b border-edu-border-soft pb-4 mb-5">
              <p className="text-[1rem] font-bold text-edu-ink m-0">Plan de Evaluación</p>
              <p className="text-[0.78rem] text-edu-ink-500 m-0 mt-0.5">U.E. Colegio EduGestión · Año escolar 2025-2026</p>
              <p className="text-[0.72rem] text-edu-ink-400 m-0 mt-1">Los campos con <span className="text-edu-danger font-semibold">*</span> son obligatorios.</p>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              {campos.map((c) => (
                <CampoPreview key={c.id} campo={c} />
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="button"
                disabled
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold border-none opacity-60 cursor-not-allowed"
                style={{ backgroundColor: TEAL }}
              >
                <Save className="w-4 h-4" />
                Guardar plan (vista previa)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
