export function ChartTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-edu-surface border border-edu-border rounded-edu-chip px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
            <div className="text-[0.72rem] font-bold text-edu-ink mb-1">{label}</div>
            {payload.map((p: any) => (
                <div key={p.dataKey} className="flex items-center gap-1.5 text-[0.72rem] text-edu-ink-700">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: p.color }} />
                    {p.name}: <strong>{p.value} est.</strong>
                </div>
            ))}
        </div>
    );
}
