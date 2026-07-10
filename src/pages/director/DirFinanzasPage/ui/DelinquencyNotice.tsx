import { AlertTriangle } from "lucide-react";
import { color } from "@themes/tokens";

export function DelinquencyNotice() {
  return (
    <div className="px-4 py-3 bg-edu-warning-bg rounded-edu-control flex items-center gap-2.5">
      <AlertTriangle style={{ width: "18px", height: "18px", color: color.warning, flexShrink: 0 }} />
      <span className="text-[0.82rem] text-edu-ink-700">
        Representantes sin solvencia: <strong className="text-edu-warning">134</strong> · Monto adeudado estimado:{" "}
        <strong className="text-edu-warning">$ 12.400 USD</strong>
      </span>
    </div>
  );
}
