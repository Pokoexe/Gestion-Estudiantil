import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

function DonutTooltip({ active, payload }: any) {
    if (!active || !payload || payload.length === 0) return null;
    const p = payload[0];
    return (
        <div className="bg-edu-surface border border-edu-border rounded-edu-chip px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-1.5 text-[0.72rem] text-edu-ink-700">
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: p.payload.fill }} />
                {p.name}: <strong>{p.value}</strong>
            </div>
        </div>
    );
}

interface SeccionEntry {
    seccion: string;
    estudiantes: number;
    fill: string;
}

interface SeccionesDonutProps {
    SECCIONES_DATA: SeccionEntry[];
    TOTAL_SECCIONES: number;
}

export function SeccionesDonut({ SECCIONES_DATA, TOTAL_SECCIONES }: SeccionesDonutProps) {
    return (
        <div className="lg:col-span-2 bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Estudiantes por sección</h3>
                <span className="text-[0.8rem] text-edu-ink-400 font-medium">Distribución por año</span>
            </div>
            <div className="flex items-center gap-6 p-5 max-sm:flex-col">
                <div className="relative w-[180px] h-[180px] shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={SECCIONES_DATA} dataKey="estudiantes" nameKey="seccion" cx="50%" cy="50%" innerRadius={58} outerRadius={82} paddingAngle={2} stroke="none">
                                {SECCIONES_DATA.map((s) => (
                                    <Cell key={s.seccion} fill={s.fill} />
                                ))}
                            </Pie>
                            <Tooltip content={<DonutTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-[1.5rem] font-bold text-edu-ink leading-none">{TOTAL_SECCIONES}</span>
                        <span className="text-[0.7rem] text-edu-ink-400 font-medium mt-1">estudiantes</span>
                    </div>
                </div>
                <div className="flex-1 flex flex-col gap-2.5 w-full">
                    {SECCIONES_DATA.map((s) => {
                        const pct = Math.round((s.estudiantes / TOTAL_SECCIONES) * 100);
                        return (
                            <div key={s.seccion} className="flex items-center gap-2.5">
                                <span className="w-2.5 h-2.5 rounded-[3px] shrink-0" style={{ backgroundColor: s.fill }} />
                                <span className="text-[0.8125rem] text-edu-ink-700 flex-1">{s.seccion}</span>
                                <span className="text-[0.8125rem] text-edu-ink font-semibold">{s.estudiantes}</span>
                                <span className="text-[0.75rem] text-edu-ink-400 w-9 text-right">{pct} %</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
