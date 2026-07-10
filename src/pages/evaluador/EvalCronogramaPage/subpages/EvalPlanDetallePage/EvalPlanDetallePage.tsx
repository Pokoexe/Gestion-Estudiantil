import { ArrowLeft } from "lucide-react";
import { useEvalPlanDetalle, TEAL } from "./functions/useEvalPlanDetalle";
import { PlanDetalleHeader } from "./ui/PlanDetalleHeader";
import { FeedbackBanner } from "./ui/FeedbackBanner";
import { PreviewPlan } from "./ui/PreviewPlan";
import { InfoPlan } from "./ui/InfoPlan";
import { ObservacionModal } from "./modals/ObservacionModal";

export function EvalPlanDetallePage() {
  const {
    navigate,
    plan,
    loading,
    estado,
    showObs,
    setShowObs,
    obs,
    setObs,
    feedback,
    setFeedback,
    totalPct,
    ordenadas,
    enviarObs,
  } = useEvalPlanDetalle();

  if (loading) {
    return (
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">
        Cargando…
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-12 text-center">
        <p className="text-edu-ink-500 text-sm m-0">No se encontró el plan de evaluación.</p>
        <button
          onClick={() => navigate("/evaluador/cronograma")}
          className="inline-flex items-center gap-1.5 mt-4 text-[0.8125rem] font-semibold cursor-pointer bg-transparent border-none"
          style={{ color: TEAL }}
        >
          <ArrowLeft className="w-4 h-4" /> Volver al cronograma
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <PlanDetalleHeader
        materia={plan.materia}
        seccion={plan.seccion}
        docente={plan.docente}
        onVolver={() => navigate("/evaluador/cronograma")}
      />
      {feedback && (
        <FeedbackBanner message={feedback} onClose={() => setFeedback(null)} />
      )}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5 items-start">
        <PreviewPlan
          materia={plan.materia}
          seccion={plan.seccion}
          docente={plan.docente}
          plantilla={plan.plantilla}
          ordenadas={ordenadas}
          totalPct={totalPct}
        />
        <InfoPlan
          materia={plan.materia}
          seccion={plan.seccion}
          docente={plan.docente}
          plantilla={plan.plantilla}
          estado={estado}
          totalPct={totalPct}
          ordenadas={ordenadas}
          evalCount={plan.evaluaciones.length}
          onEnRevision={() => { setObs(""); setShowObs(true); }}
        />
      </div>
      {showObs && (
        <ObservacionModal
          materia={plan.materia}
          seccion={plan.seccion}
          docente={plan.docente}
          obs={obs}
          onObs={setObs}
          onClose={() => setShowObs(false)}
          onSubmit={enviarObs}
        />
      )}
    </div>
  );
}
