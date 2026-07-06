import { useNavigate, useParams } from "react-router";
import { ArrowLeft, FileSpreadsheet, User } from "lucide-react";
import { useFetch } from "../datos_maquetados";
import { getBoletines, getMaterias } from "../datos_maquetados/actions/boletines";
import { promedio, notaColor, desglose, notasDe } from "../datos_maquetados/data/boletines";
import { LapsoFilter } from "../components/LapsoFilter";
import { useLapso } from "../context/LapsoContext";

const TEAL = "#0d9488";
const TEAL_BG = "#ccfbf1";
const TEAL_50 = "#f0fdfa";

const EVAL_COLS = "grid-cols-[2fr_1fr_0.7fr_0.7fr]";

export function EvalSabanaEstudiantePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedId } = useLapso();
  const { data: boletines, loading } = useFetch(getBoletines, []);
  const { data: MATERIAS } = useFetch(getMaterias, []);
  const b = boletines.find((x) => String(x.id) === id);

  if (loading) {
    return (
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">
        Cargando…
      </div>
    );
  }

  if (!b) {
    return (
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-12 text-center">
        <p className="text-edu-ink-500 text-sm m-0">No se encontró el boletín del estudiante.</p>
        <button
          onClick={() => navigate("/evaluador/boletines")}
          className="inline-flex items-center gap-1.5 mt-4 text-[0.8125rem] font-semibold cursor-pointer bg-transparent border-none"
          style={{ color: TEAL }}
        >
          <ArrowLeft className="w-4 h-4" /> Volver a boletines
        </button>
      </div>
    );
  }

  const notas = notasDe(b, selectedId);
  const prom = promedio(notas);

  return (
    <div className="flex flex-col gap-5">
      {/* Barra superior */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={() => navigate("/evaluador/boletines")}
          className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-edu-ink-500 hover:text-edu-ink-700 bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a boletines
        </button>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <h2 className="m-0 text-edu-ink font-bold text-[1.2rem]">Sábana de notas</h2>
            <p className="m-0 mt-0.5 text-edu-ink-500 text-[0.85rem]">Todas las evaluaciones de todas las materias</p>
          </div>
          <LapsoFilter />
        </div>
      </div>

      {/* Resumen del estudiante */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: TEAL_BG }}>
            <User className="w-6 h-6" style={{ color: TEAL }} />
          </div>
          <div>
            <div className="text-edu-ink font-bold text-[1rem]">{b.student}</div>
            <div className="text-edu-ink-500 text-[0.85rem]">{b.anio} · Sección {b.seccion} · {b.cedula}</div>
            <div className="text-edu-ink-400 text-[0.78rem] mt-0.5">Representante: {b.representante}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[0.72rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Promedio general</div>
          <div className={`text-[1.8rem] font-bold leading-none mt-1 ${prom >= 10 ? "text-edu-success" : "text-edu-danger"}`}>{prom.toFixed(2)}</div>
        </div>
      </div>

      {/* Por cada materia: sus evaluaciones y notas */}
      {MATERIAS.map((m, i) => {
        const evals = desglose(notas[i]);
        const def = notas[i];
        return (
          <div key={m} className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: TEAL_50 }}>
                  <FileSpreadsheet className="w-4 h-4" style={{ color: TEAL }} />
                </div>
                <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">{m}</h3>
              </div>
              <span className="text-[0.8125rem] text-edu-ink-500">
                Definitiva:{" "}
                <strong className={`text-[0.95rem] ${notaColor(def)}`}>{def}</strong>
                <span className="text-edu-ink-400"> / 20</span>
              </span>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
            <div className={`grid ${EVAL_COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
              {["Evaluación", "Tipo", "%", "Nota"].map((h, j) => (
                <span key={h} className={`text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em] ${j >= 2 ? "text-right" : ""}`}>{h}</span>
              ))}
            </div>
            {evals.map((e, j) => (
              <div key={j} className={`grid ${EVAL_COLS} px-5 py-[11px] items-center ${j < evals.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
                <span className="text-[0.875rem] text-edu-ink font-medium">{e.nombre}</span>
                <span className="text-[0.8125rem] text-edu-ink-700">{e.tipo}</span>
                <span className="text-[0.8125rem] text-edu-ink-500 text-right">{e.porcentaje}%</span>
                <span className={`text-[0.9rem] font-bold text-right ${notaColor(e.nota)}`}>{e.nota}</span>
              </div>
            ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
