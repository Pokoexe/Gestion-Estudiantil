import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { color } from "@themes/tokens";
import { SectionCard } from "./SectionCard";
import { TooltipBox } from "./TooltipBox";
import { LapsoDot } from "./LapsoDot";

export function PerformanceByLapsoCard({
  rendimientoLapso,
  selectedId,
}: {
  rendimientoLapso: any[];
  selectedId: number;
}) {
  return (
    <SectionCard title="Rendimiento por lapso" hint="Promedio 0 – 20">
      <div className="px-3 pt-[18px] pb-3 flex-1">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={rendimientoLapso} margin={{ top: 6, right: 16, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={color.borderSoft} vertical={false} />
            <XAxis dataKey="lapso" tick={{ fontSize: 12, fill: color.ink500 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: color.ink400 }} axisLine={false} tickLine={false} width={40} domain={[14, 17]} />
            <Tooltip content={<TooltipBox />} />
            <Line type="monotone" dataKey="promedio" name="Promedio" stroke={color.warning} strokeWidth={2.5} dot={(p: any) => <LapsoDot key={p.index} {...p} selectedIndex={selectedId - 1} />} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
