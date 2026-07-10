import { useDirectorDashboard } from "./functions/useDirectorDashboard";
import { ExecutiveBanner } from "./ui/ExecutiveBanner";
import { KpiRow } from "./ui/KpiRow";
import { FinanceSummaryCard } from "./ui/FinanceSummaryCard";
import { UpcomingActivitiesCard } from "./ui/UpcomingActivitiesCard";

export function DirectorDashboard() {
  const { FINANCE, ACTIVITIES, loading, FINANCE_SERIES, ACTIVITY_META, KPIS } = useDirectorDashboard();

  if (loading)
    return <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">Cargando…</div>;

  return (
    <div className="flex flex-col gap-5">
      {/* Banner ejecutivo */}
      <ExecutiveBanner />

      {/* Fila de 4 KPIs */}
      <KpiRow kpis={KPIS} />

      {/* Resumen financiero + solvencia */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-4 items-stretch">
        <div>
          <FinanceSummaryCard finance={FINANCE} financeSeries={FINANCE_SERIES} />
        </div>

        {/* Próximas actividades */}
        <UpcomingActivitiesCard activities={ACTIVITIES} activityMeta={ACTIVITY_META} />
      </div>

    </div>
  );
}
