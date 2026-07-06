import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  FileText,
  MessageSquareWarning,
  X,
  Clock,
} from "lucide-react";
import { useFetch } from "../datos_maquetados";
import { getPlanes, type PlanEstado } from "../datos_maquetados/actions/cronograma";
import { ESTADO_LABEL, fmtFecha, fmtFechaLarga } from "../datos_maquetados/data/cronograma";

const TEAL = "#0d9488";
const TEAL_50 = "#f0fdfa";

const ESTADO_PILL: Record<PlanEstado, string> = {
  "en revisión": "bg-edu-warning-bg text-edu-warning",
  activo: "bg-edu-success-bg text-edu-success",
};

const PREVIEW_COLS = "grid-cols-[0.8fr_2fr_1fr_0.6fr]";

export function EvalPlanDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: planes, loading } = useFetch(getPlanes, []);
  const plan = planes.find((p) => String(p.id) === id);

  const [estado, setEstado] = useState<PlanEstado>("activo");
  const [showObs, setShowObs] = useState(false);
  const [obs, setObs] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  // Sincroniza el estado editable con el plan una vez cargado.
  useEffect(() => {
    if (plan) setEstado(plan.estado);
  }, [plan]);

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

  const totalPct = plan.evaluaciones.reduce((a, e) => a + e.porcentaje, 0);
  const ordenadas = [...plan.evaluaciones].sort((a, b) => a.fecha.localeCompare(b.fecha));

  const enviarObs = () => {
    setEstado("en revisión");
    setShowObs(false);
    setFeedback(`Se marcó el plan en revisión. Observación: ${obs.trim() || "Se solicitaron ajustes."}`);
    setObs("");
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Barra superior */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={() => navigate("/evaluador/cronograma")}
          className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-edu-ink-500 hover:text-edu-ink-700 bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al cronograma
        </button>
        <div>
          <h2 className="m-0 text-edu-ink font-bold text-[1.2rem]">{plan.materia} · {plan.seccion}</h2>
          <p className="m-0 mt-0.5 text-edu-ink-500 text-[0.85rem]">Plan de evaluación — {plan.docente}</p>
        </div>
      </div>

      {feedback && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-edu-control text-sm font-medium bg-edu-warning-bg text-edu-warning">
          <MessageSquareWarning className="w-4 h-4 shrink-0" />
          <span className="flex-1">{feedback}</span>
          <button onClick={() => setFeedback(null)} aria-label="Cerrar" className="bg-transparent border-none cursor-pointer p-0 flex items-center opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Contenido: previsualización (izq) + información (der) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5 items-start">
        {/* Previsualización según plantilla */}
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-edu-border-soft flex items-center gap-2">
            <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: TEAL_50 }}>
              <FileText className="w-4 h-4" style={{ color: TEAL }} />
            </div>
            <div>
              <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Previsualización</h3>
              <p className="mt-0.5 mb-0 text-edu-ink-400 text-[0.775rem]">Según la plantilla: {plan.plantilla}</p>
            </div>
          </div>

          {/* Hoja de la plantilla */}
          <div className="p-6 bg-edu-subtle">
            <div className="mx-auto max-w-[640px] bg-edu-surface rounded-edu-card border border-edu-border-soft shadow-[0_6px_20px_rgba(0,0,0,0.06)] p-6">
              <div className="text-center border-b border-edu-border-soft pb-4">
                <h4 className="m-0 text-edu-ink font-bold text-[1rem]">Plan de evaluación</h4>
                <p className="m-0 mt-1 text-[0.85rem] text-edu-ink-700 font-medium">{plan.materia} · {plan.seccion}</p>
                <p className="m-0 text-[0.78rem] text-edu-ink-400">{plan.docente}</p>
              </div>

              {/* Cabecera de la tabla */}
              <div className="overflow-x-auto">
                <div className="min-w-[600px]">
              <div className={`grid ${PREVIEW_COLS} px-2 py-2 mt-4 bg-edu-subtle rounded-edu-chip text-[0.68rem] font-semibold text-edu-ink-400 uppercase tracking-[0.04em]`}>
                <span>Fecha</span>
                <span>Evaluación</span>
                <span>Tipo</span>
                <span className="text-right">%</span>
              </div>
              {ordenadas.map((e, i) => (
                <div key={i} className={`grid ${PREVIEW_COLS} px-2 py-2.5 items-center border-b border-edu-border-soft text-[0.8125rem]`}>
                  <span className="text-edu-ink-500">{fmtFecha(e.fecha)}</span>
                  <span className="text-edu-ink font-medium">{e.evaluacion}</span>
                  <span className="text-edu-ink-700">{e.tipo}</span>
                  <span className="text-right text-edu-ink font-semibold">{e.porcentaje}%</span>
                </div>
              ))}
              <div className={`grid ${PREVIEW_COLS} px-2 py-2.5 items-center text-[0.8125rem] font-bold`}>
                <span />
                <span />
                <span className="text-right text-edu-ink-500">Total</span>
                <span className={`text-right ${totalPct === 100 ? "text-edu-success" : "text-edu-danger"}`}>{totalPct}%</span>
              </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Información del plan */}
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-edu-border-soft">
            <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Información del plan</h3>
          </div>
          <div className="p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between px-4 py-3 rounded-edu-control bg-edu-subtle">
              <span className="text-[0.72rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Estado</span>
              <span className={`inline-flex items-center justify-center px-3 py-1 rounded-edu-pill text-[0.8rem] font-semibold ${ESTADO_PILL[estado]}`}>
                {ESTADO_LABEL[estado]}
              </span>
            </div>

            {[
              { label: "Materia", value: plan.materia },
              { label: "Sección", value: plan.seccion },
              { label: "Docente", value: plan.docente },
              { label: "Plantilla", value: plan.plantilla },
              { label: "Evaluaciones", value: `${plan.evaluaciones.length} evaluaciones` },
              { label: "Ponderación total", value: `${totalPct}%` },
              { label: "Primera evaluación", value: fmtFechaLarga(ordenadas[0].fecha) },
              { label: "Última evaluación", value: fmtFechaLarga(ordenadas[ordenadas.length - 1].fecha) },
            ].map((f) => (
              <div key={f.label} className="flex items-start justify-between gap-3">
                <span className="text-[0.72rem] text-edu-ink-400 uppercase tracking-[0.04em] shrink-0">{f.label}</span>
                <span className="text-[0.875rem] text-edu-ink font-medium text-right">{f.value}</span>
              </div>
            ))}

            <button
              onClick={() => { setObs(""); setShowObs(true); }}
              className="mt-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-edu-control text-sm font-semibold text-white border-none cursor-pointer transition-opacity hover:opacity-90"
              style={{ backgroundColor: TEAL }}
            >
              <MessageSquareWarning className="w-4 h-4" />
              En revisión
            </button>
          </div>
        </div>
      </div>

      {/* Modal: escribir observación */}
      {showObs && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowObs(false)}>
          <div className="bg-edu-surface rounded-edu-card w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: TEAL_50 }}>
                  <MessageSquareWarning className="w-4 h-4" style={{ color: TEAL }} />
                </div>
                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Marcar en revisión</h3>
              </div>
              <button onClick={() => setShowObs(false)} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-edu-control bg-edu-subtle text-[0.8125rem]">
                <FileText className="w-4 h-4 text-edu-ink-400 shrink-0" />
                <span className="text-edu-ink-700 font-medium">{plan.materia} · {plan.seccion}</span>
                <span className="text-edu-ink-400">— {plan.docente}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-edu-ink-700 text-sm font-medium">Observación para el docente</label>
                <textarea
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  rows={4}
                  placeholder="Describe los ajustes que debe realizar el docente en el plan…"
                  className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full resize-none focus:border-teal-600"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowObs(false)} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle">
                  Cancelar
                </button>
                <button type="button" onClick={enviarObs} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold border-none cursor-pointer transition-opacity hover:opacity-90" style={{ backgroundColor: TEAL }}>
                  <Clock className="w-4 h-4" />
                  Enviar observación
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
