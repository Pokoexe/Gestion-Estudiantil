import { Link } from "react-router";
import { color } from "@themes/tokens";
import { Pill } from "./Pill";
import type { LogLevel } from "@shared/services/actions/misc";

interface LogPreviewItem {
  time: string;
  level: LogLevel;
  message: string;
}

const LOG_STYLE: Record<LogLevel, { bg: string; fg: string }> = {
  INFO:        { bg: color.primary50, fg: color.primary },
  ADVERTENCIA: { bg: color.warningBg, fg: color.warning },
  ERROR:       { bg: color.dangerBg,  fg: color.danger  },
};

export function LogsPreview({ logs }: { logs: LogPreviewItem[] }) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Registros recientes</h3>
        <Link to="/programador/registros" className="text-[0.8rem] text-edu-primary font-medium hover:underline">
          Ver todos →
        </Link>
      </div>
      <div>
        {logs.map((log, i) => {
          const lvl = LOG_STYLE[log.level];
          return (
            <div
              key={i}
              className={`flex items-center gap-3 px-5 py-[11px] transition-colors hover:bg-edu-subtle ${i < logs.length - 1 ? "border-b border-edu-border-soft" : ""}`}
            >
              <span className="font-mono text-[0.78rem] text-edu-ink-400 shrink-0 w-[62px]">
                {log.time}
              </span>
              <span className="shrink-0 w-[100px]">
                <Pill bg={lvl.bg} fg={lvl.fg}>{log.level}</Pill>
              </span>
              <span className="font-mono text-[0.78rem] text-edu-ink-700 leading-[1.5] truncate">
                {log.message}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
