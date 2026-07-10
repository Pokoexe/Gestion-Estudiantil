export function KpiCard({
  kpi,
  navigate,
}: {
  kpi: {
    key: string;
    label: string;
    value: number;
    foot: string;
    icon: React.FC<{ style?: React.CSSProperties }>;
    tone: { bg: string; fg: string };
    to: string;
  };
  navigate: (to: string) => void;
}) {
  const Icon = kpi.icon;
  return (
    <div
      key={kpi.key}
      onClick={() => navigate(kpi.to)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && navigate(kpi.to)}
      className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5 cursor-pointer transition-colors hover:border-edu-primary-200 focus:outline-none focus-visible:border-edu-primary"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-edu-ink-500 text-[0.75rem] font-medium m-0 uppercase tracking-[0.05em]">
            {kpi.label}
          </p>
          <p className="text-edu-ink text-[1.6rem] font-bold mt-1.5 mb-0">
            {kpi.value}
          </p>
        </div>
        <div
          className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0"
          style={{ backgroundColor: kpi.tone.bg }}
        >
          <Icon style={{ width: "20px", height: "20px", color: kpi.tone.fg }} />
        </div>
      </div>
      <p className="text-edu-ink-400 text-[0.75rem] m-0">{kpi.foot}</p>
    </div>
  );
}
