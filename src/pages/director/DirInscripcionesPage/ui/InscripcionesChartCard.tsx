import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import { color } from "@themes/tokens";
import { ChartTooltip } from "./ChartTooltip";

interface Area {
    dataKey: string;
    name: string;
    color: string;
}

interface InscripcionesChartCardProps {
    chart: any[];
    AREAS: Area[];
}

export function InscripcionesChartCard({ chart, AREAS }: InscripcionesChartCardProps) {
    return (
        <div className="lg:col-span-2 bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Nuevos vs. reinscritos</h3>
                <span className="text-[0.8rem] text-edu-ink-400 font-medium">Acumulado del período</span>
            </div>
            <div className="px-3 pt-5 pb-3 flex-1">
                <ResponsiveContainer width="100%" height={230}>
                    <AreaChart data={chart} margin={{ top: 6, right: 16, left: -14, bottom: 0 }}>
                        <defs>
                            {AREAS.map((a) => (
                                <linearGradient key={a.dataKey} id={`igrad-${a.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={a.color} stopOpacity={0.25} />
                                    <stop offset="100%" stopColor={a.color} stopOpacity={0.02} />
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={color.borderSoft} vertical={false} />
                        <XAxis dataKey="mes" tick={{ fontSize: 12, fill: color.ink500 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: color.ink400 }} axisLine={false} tickLine={false} width={30} />
                        <Tooltip content={<ChartTooltip />} />
                        <Legend wrapperStyle={{ fontSize: "0.75rem", paddingTop: "10px" }} />
                        {AREAS.map((a) => (
                            <Area
                                key={a.dataKey}
                                type="monotone"
                                dataKey={a.dataKey}
                                name={a.name}
                                stroke={a.color}
                                strokeWidth={2.5}
                                fill={`url(#igrad-${a.dataKey})`}
                                dot={{ r: 3, fill: a.color, strokeWidth: 0 }}
                                activeDot={{ r: 5 }}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
