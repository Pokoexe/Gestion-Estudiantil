import { accent } from "@themes/tokens";
import type { ProgKpiKey } from "@shared/services/actions/misc";

type AccentKey = keyof typeof accent;

interface KpiItem {
  key: ProgKpiKey;
  label: string;
  value: string | number;
  hint: string;
}

interface KpiRowProps {
  kpis: KpiItem[];
  KPI_STYLE: Record<ProgKpiKey, { icon: React.FC<{ style?: React.CSSProperties }>; tone: AccentKey }>;
}

export function KpiRow({ kpis, KPI_STYLE }: KpiRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
        const style = KPI_STYLE[kpi.key];
        const Icon = style.icon;
        const tone = accent[style.tone];
        return (
          <div key={kpi.label} className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                  {kpi.label}
                </p>
                <p className="text-edu-ink text-[1.4rem] font-bold mt-[6px] mb-0">{kpi.value}</p>
              </div>
              <div
                className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0"
                style={{ backgroundColor: tone.bg }}
              >
                <Icon style={{ width: "20px", height: "20px", color: tone.fg }} />
              </div>
            </div>
            <p className="text-edu-ink-400 text-xs m-0">{kpi.hint}</p>
          </div>
        );
      })}
    </div>
  );
}
