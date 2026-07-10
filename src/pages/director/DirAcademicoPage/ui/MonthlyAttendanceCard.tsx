import React from "react";
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

export function MonthlyAttendanceCard({ asistenciaMes }: { asistenciaMes: any[] }) {
  return (
    <SectionCard title="Asistencia mensual" hint="% promedio · últimos 6 meses">
      <div className="px-3 pt-[18px] pb-3 flex-1">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={asistenciaMes} margin={{ top: 6, right: 12, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="gradAsistAcad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color.success} stopOpacity={0.28} />
                <stop offset="100%" stopColor={color.success} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={color.borderSoft} vertical={false} />
            <XAxis dataKey="mes" tick={{ fontSize: 12, fill: color.ink500 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: color.ink400 }} axisLine={false} tickLine={false} width={40} domain={[80, 100]} />
            <Tooltip content={<TooltipBox suffix=" %" />} />
            <Area type="monotone" dataKey="asistencia" name="Asistencia" stroke={color.success} strokeWidth={2.5} fill="url(#gradAsistAcad)" dot={{ r: 3, fill: color.success, strokeWidth: 0 }} activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
