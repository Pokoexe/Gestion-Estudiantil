import { useState } from "react";
import { color } from "@themes/tokens";
import { useFetch } from "@shared/services";
import {
  getHorarioDashboard,
  getEvaluacionesPendientesDashboard,
  getCalificaciones,
  type PendingEval,
  type Grade,
  type EvalType,
} from "@shared/services/actions/estudiante";
import {
  FileText,
  Presentation,
  FlaskConical,
  PenLine,
} from "lucide-react";

export const TYPE_META: Record<EvalType, { icon: React.FC<{ style?: React.CSSProperties }>; bg: string; fg: string; label: string }> = {
  presentation: { icon: Presentation, bg: color.primary50, fg: color.primary, label: "Exposición" },
  exam: { icon: FileText, bg: color.warningBg, fg: color.warning, label: "Examen" },
  lab: { icon: FlaskConical, bg: color.successBg, fg: color.success, label: "Laboratorio" },
  essay: { icon: PenLine, bg: color.purpleBg, fg: color.purple, label: "Ensayo" },
};

export const PASS_MARK = 10;

export const HORARIO_DIAS = [
  { abbr: "Lun", full: "Lunes" },
  { abbr: "Mar", full: "Martes" },
  { abbr: "Mié", full: "Miércoles" },
  { abbr: "Jue", full: "Jueves" },
  { abbr: "Vie", full: "Viernes" },
];

/**
 * Estado y lógica del dashboard del estudiante: fetch de horario, evaluaciones
 * pendientes y calificaciones; selección de modales; cuadrícula del horario y
 * valores derivados.
 */
export function useDashboard() {
  const [selectedPendingEval, setSelectedPendingEval] = useState<PendingEval | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);

  const { data: schedule } = useFetch(getHorarioDashboard, []);
  const { data: pendingEvals } = useFetch(getEvaluacionesPendientesDashboard, []);
  const { data: grades } = useFetch(getCalificaciones, []);

  const recentGrades = grades.slice(0, 4);

  const today = new Date();
  const dayIndex = today.getDay();
  const weekdays = ["Lun", "Mar", "Mié", "Jue", "Vie"];
  const activeDay =
    dayIndex >= 1 && dayIndex <= 5 ? weekdays[dayIndex - 1] : "Lun";

  // Construir la cuadrícula: filas = horas únicas, columnas = días
  const scheduleTimes = [...new Set(schedule.flatMap((d) => d.classes.map((c) => c.time)))].sort();
  const scheduleTimeRows = scheduleTimes.map((time) =>
    HORARIO_DIAS.map(({ abbr }) => {
      const dayData = schedule.find((d) => d.day === abbr);
      return dayData?.classes.find((c) => c.time === time) ?? null;
    }),
  );

  return {
    selectedPendingEval, setSelectedPendingEval,
    selectedGrade, setSelectedGrade,
    pendingEvals,
    recentGrades,
    activeDay,
    scheduleTimes,
    scheduleTimeRows,
  };
}
