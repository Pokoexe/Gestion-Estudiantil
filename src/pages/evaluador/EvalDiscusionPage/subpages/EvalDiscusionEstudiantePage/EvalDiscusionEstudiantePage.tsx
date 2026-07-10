import { ArrowLeft } from "lucide-react";
import { useEvalDiscusionEstudiante, TEAL } from "./functions/useEvalDiscusionEstudiante";
import { EstudianteHeader } from "./ui/EstudianteHeader";
import { ActividadesInline } from "./ui/ActividadesInline";
import { NotasPorMateria } from "./ui/NotasPorMateria";
import { DecisionButtons } from "./ui/DecisionButtons";
import { NavegacionEstudiantes } from "./ui/NavegacionEstudiantes";
import { PostularModal } from "./modals/PostularModal";
import { EvalAdjuntoModal } from "./modals/EvalAdjuntoModal";

export function EvalDiscusionEstudiantePage() {
  const {
    navigate,
    loading,
    b,
    MATERIAS,
    tab,
    setTab,
    postulando,
    setPostulando,
    motivo,
    setMotivo,
    fecha,
    setFecha,
    evalSel,
    setEvalSel,
    actividades,
    prom,
    notaTab,
    evals,
    postulacionActiva,
    lista,
    pos,
    anterior,
    siguiente,
    irA,
    confirmarPostulacion,
  } = useEvalDiscusionEstudiante();

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
        pos={pos}
        listaLength={lista.length}
        onVolver={() => navigate("/evaluador/discusion/concejo")}
      />
      <ActividadesInline actividades={actividades} />
      <NotasPorMateria
        MATERIAS={MATERIAS}
        tab={tab}
        notaTab={notaTab}
        evals={evals}
        postulacionActiva={postulacionActiva}
        onTabChange={setTab}
        onEvalSel={setEvalSel}
      />
      <DecisionButtons
        postulacionActiva={!!postulacionActiva}
        tab={tab}
        siguiente={siguiente}
        onPostular={() => setPostulando(true)}
        onDejar={() => irA(siguiente)}
      />
      <NavegacionEstudiantes
        anterior={anterior}
        siguiente={siguiente}
        onAnterior={() => irA(anterior)}
        onSiguiente={() => irA(siguiente)}
      />
      {postulando && (
        <PostularModal
          b={b}
          tab={tab}
          notaTab={notaTab}
          motivo={motivo}
          fecha={fecha}
          onMotivo={setMotivo}
          onFecha={setFecha}
          onClose={() => setPostulando(false)}
          onSubmit={confirmarPostulacion}
        />
      )}
      {evalSel && (
        <EvalAdjuntoModal
          evalSel={evalSel}
          tab={tab}
          studentName={b.student}
          onClose={() => setEvalSel(null)}
        />
      )}
    </div>
  );
}
