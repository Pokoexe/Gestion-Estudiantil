import { useEvaluadorDashboard } from "./functions/useEvaluadorDashboard";
import { KpiCard } from "./ui/KpiCard";
import { QuickActions } from "./ui/QuickActions";
import { CronogramaCard } from "./ui/CronogramaCard";
import { RevisionesChartCard } from "./ui/RevisionesChartCard";

export function EvaluadorDashboard() {
  const { navigate, kpis, chartData, loading, QUICK_ACTIONS } = useEvaluadorDashboard();

  if (loading) {
    return (
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">
        Cargando…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Fila de KPIs — cada bloque redirige a su página */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.key} kpi={kpi} navigate={navigate} />
        ))}
      </div>

      {/* Acciones rápidas (estilo botones) */}
      <QuickActions quickActions={QUICK_ACTIONS} navigate={navigate} />

      {/* Cronograma + gráfico */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5 items-stretch">
        <CronogramaCard />
        <RevisionesChartCard chartData={chartData} />
      </div>
    </div>
  );
}
