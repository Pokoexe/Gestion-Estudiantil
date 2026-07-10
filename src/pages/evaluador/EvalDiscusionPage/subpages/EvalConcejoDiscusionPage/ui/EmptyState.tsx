import { Users } from "lucide-react";
import { TEAL, TEAL_50 } from "../functions/useEvalConcejoDiscusion";

export function EmptyState() {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-14 text-center flex flex-col items-center gap-2">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ backgroundColor: TEAL_50 }}
      >
        <Users className="w-6 h-6" style={{ color: TEAL }} />
      </div>
      <p className="text-edu-ink font-semibold text-[0.95rem] m-0">Selecciona un año</p>
      <p className="text-edu-ink-400 text-[0.8125rem] m-0 max-w-sm">
        Para ver la lista de estudiantes y decidir a quiénes postular al Concejo, primero elige un
        año.
      </p>
    </div>
  );
}
