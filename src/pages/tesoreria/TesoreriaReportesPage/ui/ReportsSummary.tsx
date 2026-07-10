import { FileText, Clock, CalendarDays } from "lucide-react";
import { color } from "@themes/tokens";
import type { Report } from "@shared/services/actions/tesoreria";

type Props = {
  total: number;
  last: Report | undefined;
  thisMonth: number;
};

export function ReportsSummary({ total, last, thisMonth }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">Reportes hechos</p>
            <p className="text-edu-ink text-[1.6rem] font-bold mt-1 m-0">{total}</p>
          </div>
          <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: color.primary50 }}>
            <FileText style={{ width: "20px", height: "20px", color: color.primary }} />
          </div>
        </div>
        <p className="text-edu-ink-400 text-xs m-0">Reportes generados en total</p>
      </div>

      <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
        <div className="flex justify-between items-start">
          <div className="min-w-0">
            <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">Último hecho</p>
            <p className="text-edu-ink text-[1.6rem] font-bold mt-1 m-0">{last ? last.date : "—"}</p>
          </div>
          <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: color.warningBg }}>
            <Clock style={{ width: "20px", height: "20px", color: color.warning }} />
          </div>
        </div>
        <p className="text-edu-ink-400 text-xs m-0 truncate" title={last?.title}>
          {last ? last.title : "Sin reportes aún"}
        </p>
      </div>

      <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">Este mes</p>
            <p className="text-edu-ink text-[1.6rem] font-bold mt-1 m-0">{thisMonth}</p>
          </div>
          <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: color.successBg }}>
            <CalendarDays style={{ width: "20px", height: "20px", color: color.success }} />
          </div>
        </div>
        <p className="text-edu-ink-400 text-xs m-0">Generados en julio 2026</p>
      </div>
    </div>
  );
}
