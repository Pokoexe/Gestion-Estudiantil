import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { color } from "@themes/tokens";
import { SectionCard } from "./SectionCard";
import { TooltipBox } from "./TooltipBox";

export function PerformanceByYearCard({ performance }: { performance: any[] }) {
  return (
    <SectionCard title="Rendimiento por año" hint="Promedio institucional 0 – 20">
      <div className="px-3 pt-[18px] pb-3 flex-1">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={performance} margin={{ top: 6, right: 12, left: -14, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={color.borderSoft} vertical={false} />
            <XAxis dataKey="anio" tick={{ fontSize: 12, fill: color.ink500 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: color.ink400 }} axisLine={false} tickLine={false} domain={[0, 20]} width={40} />
            <Tooltip content={<TooltipBox />} cursor={{ fill: color.subtle }} />
            <Bar dataKey="promedio" name="Promedio" fill={color.warning} radius={[5, 5, 0, 0]} maxBarSize={44} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
