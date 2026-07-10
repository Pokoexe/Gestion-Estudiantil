import { useEvalSabanaEstudiante, TEAL } from "./functions/useEvalSabanaEstudiante";
import { ResumenEstudiante } from "./ui/ResumenEstudiante";
import { MateriaEvalCard } from "./ui/MateriaEvalCard";

export function EvalSabanaEstudiantePage() {
  const { navigate, loading, b, MATERIAS, notas, prom } = useEvalSabanaEstudiante();

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
          ← Volver a boletines
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <ResumenEstudiante
        b={b}
        prom={prom}
        onVolver={() => navigate("/evaluador/boletines")}
      />

      {MATERIAS.map((m, i) => (
        <MateriaEvalCard key={m} materia={m} nota={notas[i]} />
      ))}
    </div>
  );
}
