import { ArrowLeft, FileSpreadsheet } from "lucide-react";
import { useEvalPostularEstudiante, TEAL } from "./functions/useEvalPostularEstudiante";
import { EstudianteHeader } from "./ui/EstudianteHeader";
import { ActividadesCard } from "./ui/ActividadesCard";
import { PostulacionForm } from "./ui/PostulacionForm";
import { MateriaSabanaCard } from "./ui/MateriaSabanaCard";

export function EvalPostularEstudiantePage() {
  const {
    navigate,
    loading,
    b,
    MATERIAS,
    materia,
    nota,
    setNota,
    motivo,
    setMotivo,
    fecha,
    setFecha,
    prom,
    actividades,
    cambiarMateria,
    enviar,
    desglose,
  } = useEvalPostularEstudiante();

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
        <p className="text-edu-ink-500 text-sm m-0">No se encontró el estudiante.</p>
        <button
          onClick={() => navigate("/evaluador/discusion/concejo")}
          className="inline-flex items-center gap-1.5 mt-4 text-[0.8125rem] font-semibold cursor-pointer bg-transparent border-none"
          style={{ color: TEAL }}
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Concejo
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <EstudianteHeader
        b={b}
        prom={prom}
        onVolver={() => navigate("/evaluador/discusion/concejo")}
      />
      <ActividadesCard actividades={actividades} />
      <PostulacionForm
        materia={materia}
        nota={nota}
        motivo={motivo}
        fecha={fecha}
        MATERIAS={MATERIAS}
        onCambiarMateria={cambiarMateria}
        onNota={setNota}
        onMotivo={setMotivo}
        onFecha={setFecha}
        onSubmit={enviar}
      />
      <div className="flex items-center gap-2 mt-1">
        <FileSpreadsheet className="w-4 h-4 text-edu-ink-400" />
        <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Sábana de notas</h3>
      </div>
      {MATERIAS.map((m, i) => (
        <MateriaSabanaCard
          key={m}
          materia={m}
          nota={b.notas[i]}
          enDiscusion={m === materia}
          evals={desglose(b.notas[i])}
        />
      ))}
    </div>
  );
}
