import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { color } from "@themes/tokens";
import { SectionCard } from "./SectionCard";
import { TooltipBox } from "./TooltipBox";

export function MonthlyIncomeCard({ MONTHLY }: { MONTHLY: any[] }) {
  return (
    <SectionCard title="Ingresos mensuales" hint="Equivalente en USD · últimos 6 meses">
      <div className="px-3 pt-[18px] pb-3 flex-1">
        <ResponsiveContainer width="100%" height={230}>
          <AreaChart data={MONTHLY} margin={{ top: 6, right: 12, left: -6, bottom: 0 }}>
            <defs>
              <linearGradient id="gradIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color.warning} stopOpacity={0.28} />
                <stop offset="100%" stopColor={color.warning} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={color.borderSoft} vertical={false} />
            <XAxis dataKey="mes" tick={{ fontSize: 12, fill: color.ink500 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: color.ink400 }} axisLine={false} tickLine={false} width={48} />
            <Tooltip content={<TooltipBox />} />
            <Area type="monotone" dataKey="ingresos" name="Ingresos" stroke={color.warning} strokeWidth={2.5} fill="url(#gradIngresos)" dot={{ r: 3, fill: color.warning, strokeWidth: 0 }} activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
