import { color } from "@themes/tokens";
import type { DashIncident } from "@shared/services/actions/coordinador";
import type { Severity } from "../interfaces";
import { SectionHeader } from "./SectionHeader";
import { Pill } from "./Pill";

type Props = {
  incidents: DashIncident[];
  severityMeta: Record<Severity, { bg: string; fg: string }>;
};

export function RecentIncidents({ incidents, severityMeta }: Props) {
  return (
    <div className="lg:col-span-2 bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <SectionHeader title="Incidencias recientes" link="Ver todo →" />
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="grid grid-cols-[1.4fr_1.3fr_0.9fr_0.8fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
            {["Persona", "Tipo", "Fecha", "Gravedad"].map((h) => (
              <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
            ))}
          </div>
          {incidents.map((inc, i) => {
            const sev = severityMeta[inc.severity as Severity];
            const roleMeta = inc.role === "Docente"
              ? { bg: color.purpleBg, fg: color.purple }
              : { bg: color.primary50, fg: color.primary };
            return (
              <div
                key={inc.person + inc.date}
                className={`grid grid-cols-[1.4fr_1.3fr_0.9fr_0.8fr] px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < incidents.length - 1 ? "border-b border-edu-border-soft" : ""}`}
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-[0.875rem] text-edu-ink font-medium">{inc.person}</span>
                  <Pill bg={roleMeta.bg} fg={roleMeta.fg}>{inc.role}</Pill>
                </div>
                <span className="text-[0.8125rem] text-edu-ink-700">{inc.type}</span>
                <span className="text-[0.8125rem] text-edu-ink-500">{inc.date}</span>
                <Pill bg={sev.bg} fg={sev.fg}>{inc.severity}</Pill>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
