/* ------------------------------------------------------------------ */
/* Donut SVG                                                           */
/* ------------------------------------------------------------------ */
export function DonutChart({ pct, size = 76, fillColor, trackColor = "#e9edf2" }: {
    pct: number; size?: number; fillColor: string; trackColor?: string;
}) {
    const sw = Math.round(size * 0.13);
    const r = (size - sw) / 2;
    const circ = 2 * Math.PI * r;
    const dash = Math.max(0, Math.min(pct, 1)) * circ;
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={sw} />
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={fillColor} strokeWidth={sw}
                strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
        </svg>
    );
}
