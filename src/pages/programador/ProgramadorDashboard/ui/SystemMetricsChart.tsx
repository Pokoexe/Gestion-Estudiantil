import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { color } from "@themes/tokens";
import type { SystemMetricPoint } from "@shared/services/actions/misc";

export function SystemMetricsChart({ data }: { data: SystemMetricPoint[] }) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-edu-border-soft">
        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">
          Actividad del sistema · últimas 24 h
        </h3>
        <p className="mt-0.5 text-edu-ink-400 text-[0.78rem]">
          Usuarios activos, uptime y errores por hora
        </p>
      </div>

      <div className="px-4 pt-4 pb-1 h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 4, right: 54, bottom: 0, left: -4 }}>
            <CartesianGrid vertical={false} stroke={color.borderSoft} />
            <XAxis
              dataKey="hora"
              tick={{ fontSize: 11, fill: color.ink400 }}
              axisLine={{ stroke: color.border }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 11, fill: color.ink400 }}
              axisLine={false}
              tickLine={false}
              width={36}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[97, 100.5]}
              tick={{ fontSize: 11, fill: color.ink400 }}
              axisLine={false}
              tickLine={false}
              width={52}
              tickFormatter={(v: number) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "var(--radius-control)",
                border: `1px solid ${color.border}`,
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                fontSize: "0.8rem",
              }}
              formatter={(value: number, name: string) => {
                if (name === "usuarios") return [`${value}`, "Usuarios activos"];
                if (name === "uptime")   return [`${value}%`, "Uptime"];
                if (name === "errores")  return [`${value}`, "Errores"];
                return [`${value}`, name];
              }}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="usuarios"
              name="usuarios"
              fill={color.primary50}
              stroke={color.primary}
              strokeWidth={2}
              fillOpacity={0.85}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Bar
              yAxisId="left"
              dataKey="errores"
              name="errores"
              fill={color.danger}
              opacity={0.75}
              radius={[3, 3, 0, 0]}
              maxBarSize={10}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="uptime"
              name="uptime"
              fill={color.successBg}
              stroke={color.success}
              strokeWidth={2}
              fillOpacity={0.5}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 px-5 pb-4">
        <span className="flex items-center gap-1.5 text-[0.75rem] text-edu-ink-500">
          <span className="w-3 h-[2px] inline-block rounded" style={{ backgroundColor: color.primary }} />
          Usuarios activos
        </span>
        <span className="flex items-center gap-1.5 text-[0.75rem] text-edu-ink-500">
          <span className="w-3 h-[2px] inline-block rounded" style={{ backgroundColor: color.success }} />
          Uptime (%)
        </span>
        <span className="flex items-center gap-1.5 text-[0.75rem] text-edu-ink-500">
          <span className="w-2.5 h-2 inline-block rounded-[2px]" style={{ backgroundColor: color.danger }} />
          Errores
        </span>
      </div>
    </div>
  );
}
