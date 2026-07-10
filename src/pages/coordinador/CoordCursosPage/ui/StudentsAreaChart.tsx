import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { color } from "@themes/tokens";

type Area = { dataKey: string; name: string; color: string };

function ChartTooltip({ active, payload, label }: any) {
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

export function StudentsAreaChart({ data, areas }: { data: any[]; areas: Area[] }) {
  return (
    <div className="lg:col-span-2 bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Estudiantes por curso</h3>
        <span className="text-[0.8rem] text-edu-ink-400 font-medium">Cursos activos · 2026-I</span>
      </div>
      <div className="px-3 pt-5 pb-3 flex-1">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 6, right: 16, left: -14, bottom: 0 }}>
            <defs>
              {areas.map((a) => (
                <linearGradient key={a.dataKey} id={`cgrad-${a.dataKey}`} x1="0" y1="0" x2="0" y2="1">
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
            {areas.map((a) => (
              <Area
                key={a.dataKey}
                type="monotone"
                dataKey={a.dataKey}
                name={a.name}
                stroke={a.color}
                strokeWidth={2.5}
                fill={`url(#cgrad-${a.dataKey})`}
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
