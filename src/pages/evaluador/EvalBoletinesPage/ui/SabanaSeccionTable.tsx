import { Download } from "lucide-react";
import { TEAL, GRUPO_COLS } from "../functions/useEvalBoletines";
import type { Grupo } from "../interfaces";

interface Props {
  grupos: Grupo[];
  totalBoletines: number;
  recibidosGlobal: number;
  promGlobal: string;
  onDescargarGrupo: (g: Grupo) => void;
}

export function SabanaSeccionTable({
  grupos,
  totalBoletines,
  recibidosGlobal,
  promGlobal,
  onDescargarGrupo,
}: Props) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">
          Boletines / Sábana de notas
        </h3>
        <span className="text-[0.8rem] text-edu-ink-400 font-medium">
          {grupos.length} secciones
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[680px]">
          <div className="flex gap-0 border-b border-edu-border-soft bg-edu-subtle">
            {[
              { label: "Secciones", value: String(grupos.length), tone: "#0d9488" },
              { label: "Boletines", value: String(totalBoletines), tone: "#16a34a" },
              { label: "Recibidos", value: String(recibidosGlobal), tone: "#7c3aed" },
              { label: "Promedio general", value: promGlobal, tone: "#f59e0b" },
            ].map(({ label, value, tone }, i, arr) => (
              <div
                key={label}
                className={`flex-1 px-5 py-3.5 flex flex-col gap-1 ${i < arr.length - 1 ? "border-r border-edu-border-soft" : ""}`}
              >
                <div className="text-[0.72rem] text-edu-ink-400 font-medium uppercase tracking-[0.05em]">
                  {label}
                </div>
                <div className="inline-flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: tone }}
                  />
                  <span className="text-[1.1rem] font-bold text-edu-ink">{value}</span>
                </div>
              </div>
            ))}
          </div>

          <div
            className={`grid ${GRUPO_COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}
          >
            {["Sección / Año", "Estudiantes", "Promedio", "Estado", "Acciones"].map((h) => (
              <span
                key={h}
                className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]"
              >
                {h}
              </span>
            ))}
          </div>

          {grupos.map((g, i) => {
            const entregado = g.recibidos === g.estudiantes;
            return (
              <div
                key={g.label}
                className={`grid ${GRUPO_COLS} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < grupos.length - 1 ? "border-b border-edu-border-soft" : ""}`}
              >
                <span className="text-[0.875rem] text-edu-ink font-medium">{g.label}</span>
                <span className="text-[0.875rem] text-edu-ink-700">{g.estudiantes}</span>
                <span
                  className={`text-[0.9rem] font-bold ${g.promedio >= 10 ? "text-edu-ink" : "text-edu-danger"}`}
                >
                  {g.promedio.toFixed(2)}
                </span>
                <span
                  className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${entregado ? "bg-edu-success-bg text-edu-success" : "bg-edu-warning-bg text-edu-warning"}`}
                >
                  {entregado ? "Entregado" : `${g.recibidos}/${g.estudiantes} entregados`}
                </span>
                <button
                  type="button"
                  onClick={() => onDescargarGrupo(g)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-edu-control text-[0.775rem] font-semibold text-white justify-self-start cursor-pointer transition-opacity hover:opacity-90"
                  style={{ backgroundColor: TEAL }}
                >
                  <Download className="w-3.5 h-3.5" />
                  Descargar PDFs
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
