import {
  Layers,
  Users,
  CalendarClock,
  ClipboardList,
  PlusCircle,
  FileSpreadsheet,
  Upload,
} from "lucide-react";
import { useNavigate } from "react-router";
import { accent } from "@themes/tokens";
import { useFetch } from "@shared/services";
import { getClasesHoy, getHorarioSemanal } from "@shared/services/actions/docente";
import type { DashboardKpi, QuickAction } from "../interfaces";

/* ------------------------------------------------------------------ */
/* Constantes                                                          */
/* ------------------------------------------------------------------ */

const KPIS: DashboardKpi[] = [
  { label: "Secciones asignadas", value: "5", icon: Layers, ac: accent.blue, hint: "Ciclo escolar 2026-I" },
  { label: "Estudiantes", value: "142", icon: Users, ac: accent.green, hint: "En todas tus secciones" },
  { label: "Clases de hoy", value: "3", icon: CalendarClock, ac: accent.purple, hint: "Miércoles 1 jul 2026" },
  { label: "Planes por revisar", value: "1", icon: ClipboardList, ac: accent.amber, hint: "Requiere tu atención", alert: true },
];

const QUICK_ACTIONS: QuickAction[] = [
  { label: "Añadir calificaciones", icon: FileSpreadsheet, to: "/docente/calificaciones", primary: true },
  { label: "Crear plan de evaluación", icon: PlusCircle, to: "/docente/planes/nuevo" },
  { label: "Subir prueba de examen", icon: Upload, to: "/docente/revisiones" },
];

/* ------------------------------------------------------------------ */
/* Hook                                                                */
/* ------------------------------------------------------------------ */

export function useDocenteDashboard() {
  const navigate = useNavigate();
  const { data: TODAY_CLASSES } = useFetch(getClasesHoy, []);
  const { data: SCHEDULE } = useFetch(getHorarioSemanal, []);
  const today = new Date();
  const dayIndex = today.getDay();
  const weekdays = ["Lun", "Mar", "Mié", "Jue", "Vie"];
  const activeDay = dayIndex >= 1 && dayIndex <= 5 ? weekdays[dayIndex - 1] : "Lun";

  return { KPIS, QUICK_ACTIONS, TODAY_CLASSES, SCHEDULE, activeDay, navigate };
}
