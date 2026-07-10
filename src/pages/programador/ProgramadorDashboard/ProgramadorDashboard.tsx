import { useProgramadorDashboard } from "./functions/useProgramadorDashboard";
import { SystemMetricsChart } from "./ui/SystemMetricsChart";
import { KpiRow } from "./ui/KpiRow";
import { QuickActions } from "./ui/QuickActions";
import { UsersPreview } from "./ui/UsersPreview";
import { LogsPreview } from "./ui/LogsPreview";

export function ProgramadorDashboard() {
  const {
    loadingKpis,
    kpis,
    quickActions,
    systemMetrics,
    previewUsers,
    previewLogs,
    KPI_STYLE,
    ACTION_STYLE,
    ROLE_STYLE,
    STATE_STYLE,
  } = useProgramadorDashboard();

  if (loadingKpis) {
    return (
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">
        Cargando…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <SystemMetricsChart data={systemMetrics} />
      <KpiRow kpis={kpis} KPI_STYLE={KPI_STYLE} />
      <QuickActions quickActions={quickActions} ACTION_STYLE={ACTION_STYLE} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <UsersPreview users={previewUsers} ROLE_STYLE={ROLE_STYLE} STATE_STYLE={STATE_STYLE} />
        <LogsPreview logs={previewLogs} />
      </div>
    </div>
  );
}
