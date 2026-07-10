import { useNavigate } from "react-router";
import {
  ClipboardList,
  FileCheck2,
  FileBarChart2,
  Upload,
  CalendarClock,
  FilePlus2,
  MessageSquarePlus,
} from "lucide-react";
import { color, accent } from "@themes/tokens";
import { useFetch } from "@shared/services";
import { getDashboard, type DashboardKpiKey } from "@shared/services/actions/evaluador";

/* ------------------------------------------------------------------ */
/* Presentación (label/icono/tono/ruta) — los VALORES vienen del fetch */
/* ------------------------------------------------------------------ */

const KPI_META: Record<
  DashboardKpiKey,
  { label: string; icon: React.FC<{ style?: React.CSSProperties }>; tone: { bg: string; fg: string }; to: string }
> = {
  revisiones: { label: "Revisiones pendientes", icon: ClipboardList, tone: accent.amber, to: "/evaluador/revisiones" },
  examenes: { label: "Exámenes por aprobar", icon: FileCheck2, tone: accent.blue, to: "/evaluador/revisiones" },
  boletines: { label: "Boletines generados", icon: FileBarChart2, tone: accent.green, to: "/evaluador/boletines" },
};

/** Color de cada barra del gráfico, por estado. */
const CHART_FILL: Record<string, string> = {
  Pendiente: color.primary,
  Aprobado: color.success,
  Cambios: color.danger,
};

const QUICK_ACTIONS: {
  label: string;
  icon: React.FC<{ style?: React.CSSProperties }>;
  primary: boolean;
  to: string;
}[] = [
  { label: "Subir planilla de evaluación", icon: Upload, primary: true, to: "/evaluador/revisiones" },
  { label: "Asignar cronograma", icon: CalendarClock, primary: false, to: "/evaluador/cronograma" },
  { label: "Generar boletín", icon: FilePlus2, primary: false, to: "/evaluador/boletines" },
  { label: "Nueva discusión de notas", icon: MessageSquarePlus, primary: false, to: "/evaluador/discusion" },
];

export function useEvaluadorDashboard() {
  const navigate = useNavigate();
  const { data, loading } = useFetch(getDashboard, { kpis: [], chart: [] });

  const kpis = data.kpis.map((k) => ({ ...k, ...KPI_META[k.key] }));
  const chartData = data.chart.map((c) => ({ ...c, fill: CHART_FILL[c.estado] ?? color.primary }));

  return { navigate, kpis, chartData, loading, QUICK_ACTIONS };
}
