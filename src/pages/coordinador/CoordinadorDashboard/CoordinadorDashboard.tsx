import { useCoordinadorDashboard } from "./functions/useCoordinadorDashboard";
import { DashboardKpis } from "./ui/DashboardKpis";
import { RecentIncidents } from "./ui/RecentIncidents";
import { OngoingActivities } from "./ui/OngoingActivities";

export function CoordinadorDashboard() {
  const { INCIDENTS, ACTIVITIES, KPIS, ACTIVITY_META, SEVERITY_META } = useCoordinadorDashboard();

  return (
    <div className="flex flex-col gap-5">
      <DashboardKpis kpis={KPIS} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <RecentIncidents incidents={INCIDENTS} severityMeta={SEVERITY_META} />
        <OngoingActivities activities={ACTIVITIES} activityMeta={ACTIVITY_META} />
      </div>
    </div>
  );
}
