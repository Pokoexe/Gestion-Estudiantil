import {
  CalendarClock,
  ClipboardList,
  Sparkles,
  AlertTriangle,
  CalendarPlus,
  Plus,
  FileWarning,
  BookPlus,
  Trophy,
  Music,
  Brain,
} from "lucide-react";
import { color, accent } from "@themes/tokens";
import { useFetch } from "@shared/services";
import {
  getDashboardIncidencias,
  getDashboardActividades,
  type DashActivityType,
} from "@shared/services/actions/coordinador";
import type { Severity } from "../interfaces";

const KPIS = [
  { label: "Próxima reunión", value: "3 jul 2026, 10:00", ac: accent.blue, icon: CalendarClock, note: "Docentes · Ajuste de plan de evaluación" },
  { label: "Planificaciones por revisar", value: "4", ac: accent.amber, icon: ClipboardList, note: "2 vencen esta semana" },
  { label: "Actividades activas", value: "6", ac: accent.green, icon: Sparkles, note: "Deportivas, culturales y académicas" },
  { label: "Incidencias del mes", value: "9", ac: accent.red, icon: AlertTriangle, note: "3 más que el mes anterior" },
];

// Declarado pero no renderizado — conservar
const QUICK_ACTIONS = [
  { label: "Crear reunión", icon: CalendarPlus, primary: true },
  { label: "Nueva actividad", icon: Plus, primary: false },
  { label: "Registrar incidencia", icon: FileWarning, primary: false },
  { label: "Agregar sección/materia", icon: BookPlus, primary: false },
];

const ACTIVITY_META: Record<DashActivityType, { bg: string; fg: string; icon: React.FC<{ style?: React.CSSProperties }> }> = {
  Deportiva: { bg: accent.blue.bg, fg: accent.blue.fg, icon: Trophy },
  Cultural: { bg: accent.purple.bg, fg: accent.purple.fg, icon: Music },
  Académica: { bg: accent.green.bg, fg: accent.green.fg, icon: Brain },
};

const SEVERITY_META: Record<Severity, { bg: string; fg: string }> = {
  Leve: { bg: color.successBg, fg: color.success },
  Moderada: { bg: color.warningBg, fg: color.warning },
  Grave: { bg: color.dangerBg, fg: color.danger },
};

export function useCoordinadorDashboard() {
  const { data: INCIDENTS } = useFetch(getDashboardIncidencias, []);
  const { data: ACTIVITIES } = useFetch(getDashboardActividades, []);

  return { INCIDENTS, ACTIVITIES, KPIS, QUICK_ACTIONS, ACTIVITY_META, SEVERITY_META };
}
