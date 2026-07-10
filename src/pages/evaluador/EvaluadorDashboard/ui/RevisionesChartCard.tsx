import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { color, shadow } from "@themes/tokens";
import { SectionCard } from "./SectionCard";

export function RevisionesChartCard({
  chartData,
}: {
  chartData: Array<{ estado: string; cantidad: number; fill: string }>;
}) {
  return (
    <SectionCard title="Revisiones por estado" subtitle="Distribución del lapso">
      <div className="px-3 pt-4 pb-2.5">
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={color.borderSoft} vertical={false} />
            <XAxis
              dataKey="estado"
              tick={{ fontSize: 11, fill: color.ink500 }}
              axisLine={{ stroke: color.border }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: color.ink400 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: color.subtle }}
              contentStyle={{
                borderRadius: "var(--radius-chip, 8px)",
                border: `1px solid ${color.border}`,
                fontSize: "0.8rem",
                boxShadow: shadow.menu,
              }}
            />
            <Bar dataKey="cantidad" radius={[6, 6, 0, 0]} maxBarSize={54}>
              {chartData.map((d) => (
                <Cell key={d.estado} fill={d.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
