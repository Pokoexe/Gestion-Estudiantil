import { useNavigate } from "react-router";
import { useDashboard } from "./functions/useDashboard";
import { ScheduleCard } from "./ui/ScheduleCard";
import { SummaryCards } from "./ui/SummaryCards";
import { PendingEvalsCard } from "./ui/PendingEvalsCard";
import { RecentGradesCard } from "./ui/RecentGradesCard";
import { PendingEvalModal } from "./modals/PendingEvalModal";
import { GradeModal } from "./modals/GradeModal";

export function DashboardPage() {
  const navigate = useNavigate();
  const {
    selectedPendingEval, setSelectedPendingEval,
    selectedGrade, setSelectedGrade,
    pendingEvals,
    recentGrades,
    activeDay,
    scheduleTimes,
    scheduleTimeRows,
  } = useDashboard();

  return (
    <>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-2">
        <ScheduleCard
          activeDay={activeDay}
          scheduleTimes={scheduleTimes}
          scheduleTimeRows={scheduleTimeRows}
          onClassClick={(id) => navigate(`/estudiante/materias/${id}`)}
        />
        <SummaryCards
          onNextClassClick={() => navigate("/estudiante/materias/1")}
          onNextEvalClick={() => navigate("/estudiante/materias/2")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <PendingEvalsCard pendingEvals={pendingEvals} onSelect={setSelectedPendingEval} />
        <RecentGradesCard recentGrades={recentGrades} onSelect={setSelectedGrade} />
      </div>

      {selectedPendingEval && (
        <PendingEvalModal
          selectedPendingEval={selectedPendingEval}
          onClose={() => setSelectedPendingEval(null)}
        />
      )}

      {selectedGrade && (
        <GradeModal
          selectedGrade={selectedGrade}
          onClose={() => setSelectedGrade(null)}
        />
      )}
    </>
  );
}
