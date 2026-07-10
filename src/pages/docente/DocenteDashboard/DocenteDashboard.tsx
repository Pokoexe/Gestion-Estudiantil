import { useDocenteDashboard } from "./functions/useDocenteDashboard";
import { KpiCards } from "./ui/KpiCards";
import { QuickActions } from "./ui/QuickActions";
import { WeeklySchedule } from "./ui/WeeklySchedule";
import { TodayClasses } from "./ui/TodayClasses";

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function DocenteDashboard() {
  const { KPIS, QUICK_ACTIONS, TODAY_CLASSES, SCHEDULE, activeDay, navigate } = useDocenteDashboard();

  return (
    <div className="flex flex-col gap-5">
      {/* Fila de KPIs */}
      <KpiCards KPIS={KPIS} />

      {/* Acciones rápidas */}
      <QuickActions QUICK_ACTIONS={QUICK_ACTIONS} navigate={navigate} />

      {/* Horario semanal (2 col) + Clases de hoy (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {/* Horario */}
        <WeeklySchedule SCHEDULE={SCHEDULE} activeDay={activeDay} />

        {/* Clases de hoy */}
        <TodayClasses TODAY_CLASSES={TODAY_CLASSES} />
      </div>
    </div>
  );
}
