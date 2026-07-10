import { color } from "@themes/tokens";

export function InfoField({ icon: Icon, label, value }: { icon: React.FC<any>; label: string; value: string }) {
  return (
    <div className="bg-edu-subtle rounded-edu-control px-3.5 py-2.5 flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <Icon style={{ width: 13, height: 13, color: color.ink400 }} />
        <span className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.04em]">{label}</span>
      </div>
      <span className="text-[0.8125rem] text-edu-ink-700 font-medium">{value}</span>
    </div>
  );
}
