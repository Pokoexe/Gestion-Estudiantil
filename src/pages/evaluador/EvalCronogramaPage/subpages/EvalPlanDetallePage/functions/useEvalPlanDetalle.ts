import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useFetch } from "@shared/services";
import { getPlanes, type PlanEstado } from "@shared/services/actions/cronograma";
import { ESTADO_LABEL } from "@shared/services/data/cronograma";

export const TEAL = "#0d9488";
export const TEAL_50 = "#f0fdfa";

export const ESTADO_PILL: Record<PlanEstado, string> = {
  "en revisión": "bg-edu-warning-bg text-edu-warning",
  activo: "bg-edu-success-bg text-edu-success",
};

export const PREVIEW_COLS = "grid-cols-[0.8fr_2fr_1fr_0.6fr]";

export function useEvalPlanDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: planes, loading } = useFetch(getPlanes, []);
  const plan = planes.find((p) => String(p.id) === id);

  const [estado, setEstado] = useState<PlanEstado>("activo");
  const [showObs, setShowObs] = useState(false);
  const [obs, setObs] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (plan) setEstado(plan.estado);
  }, [plan]);

  const totalPct = plan ? plan.evaluaciones.reduce((a, e) => a + e.porcentaje, 0) : 0;
  const ordenadas = plan
    ? [...plan.evaluaciones].sort((a, b) => a.fecha.localeCompare(b.fecha))
    : [];

  const enviarObs = () => {
    setEstado("en revisión");
    setShowObs(false);
    setFeedback(`Se marcó el plan en revisión. Observación: ${obs.trim() || "Se solicitaron ajustes."}`);
    setObs("");
  };

  return {
    id,
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
    ESTADO_LABEL,
  };
}
