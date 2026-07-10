import type { LogLevel } from "@shared/services/actions/misc";
import { SectionHeader } from "./SectionHeader";
import { Pill } from "./Pill";

interface LogItem {
  time: string;
  level: LogLevel;
  message: string;
}

interface RecentLogsProps {
  logs: LogItem[];
  LOG_STYLE: Record<LogLevel, { bg: string; fg: string }>;
}

export function RecentLogs({ logs, LOG_STYLE }: RecentLogsProps) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <SectionHeader title="Registros recientes (logs)" link="Ver todos los registros" />
      <div>
        {logs.map((log, i) => {
          const lvl = LOG_STYLE[log.level];
          return (
            <div
              key={i}
              className={`flex items-center gap-3.5 px-5 py-[11px] ${i < logs.length - 1 ? "border-b border-edu-border-soft" : ""}`}
            >
              <span className="font-mono text-[0.78rem] text-edu-ink-400 shrink-0 w-[68px]">{log.time}</span>
              <span className="shrink-0 w-[104px]">
                <Pill bg={lvl.bg} fg={lvl.fg}>{log.level}</Pill>
              </span>
              <span className="font-mono text-[0.8rem] text-edu-ink-700 leading-[1.5]">{log.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
