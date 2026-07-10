export function PieTooltipBox({ active, payload }: any) {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0];
  return (
    <div className="bg-edu-surface border border-edu-border rounded-edu-chip px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-1.5 text-[0.72rem] text-edu-ink-700">
        <span className="w-2 h-2 rounded-[3px] inline-block" style={{ backgroundColor: p.payload.fill }} />
        {p.name}: <strong>{p.value} %</strong>
      </div>
    </div>
  );
}
