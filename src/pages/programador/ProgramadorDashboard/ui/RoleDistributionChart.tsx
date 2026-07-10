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
import { SectionHeader } from "./SectionHeader";

interface RoleDistributionItem {
  role: string;
  usuarios: number;
  fill: string;
}

interface RoleDistributionChartProps {
  roleDistribution: RoleDistributionItem[];
  totalUsuarios: number;
}

export function RoleDistributionChart({ roleDistribution, totalUsuarios }: RoleDistributionChartProps) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <SectionHeader title="Distribución de usuarios por rol" link={`${totalUsuarios} usuarios en total`} />
      <div className="px-5 py-[18px] h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={roleDistribution} layout="vertical" margin={{ top: 4, right: 24, bottom: 4, left: 12 }} barCategoryGap="28%">
            <CartesianGrid horizontal={false} stroke={color.borderSoft} />
            <XAxis type="number" tick={{ fontSize: 11, fill: color.ink400 }} axisLine={{ stroke: color.border }} tickLine={false} />
            <YAxis
              type="category"
              dataKey="role"
              width={92}
              tick={{ fontSize: 12, fill: color.ink700 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: color.subtle }}
              contentStyle={{ borderRadius: "var(--radius-control)", border: `1px solid ${color.border}`, boxShadow: shadow.menu, fontSize: "0.8rem" }}
              labelStyle={{ color: color.ink, fontWeight: 600 }}
              formatter={(value: number) => [`${value} usuarios`, "Cantidad"]}
            />
            <Bar dataKey="usuarios" radius={[0, 6, 6, 0]} maxBarSize={22}>
              {roleDistribution.map((entry) => (
                <Cell key={entry.role} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
