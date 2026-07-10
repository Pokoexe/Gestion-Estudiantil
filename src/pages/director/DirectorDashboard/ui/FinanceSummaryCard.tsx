import { AlertTriangle } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { color, accent } from "@themes/tokens";
import { FINANCE_SERIES } from "../functions/useDirectorDashboard";
import { SectionHeader } from "./SectionHeader";
import { TooltipBox } from "./TooltipBox";

interface FinanceSummaryCardProps {
  finance: any[];
  financeSeries: typeof FINANCE_SERIES;
}

export function FinanceSummaryCard({ finance, financeSeries }: FinanceSummaryCardProps) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
      <SectionHeader title="Resumen financiero" hint="Recaudado por moneda vs. sin pagar" />
      <div className="px-3 pt-[18px] pb-3 flex-1">
        <div className="flex flex-wrap gap-x-[18px] gap-y-1.5 px-2.5 pb-2">
          {financeSeries.map((s) => (
            <span key={s.key} className="inline-flex items-center gap-1.5 text-xs text-edu-ink-500">
              <span className="w-2.5 h-2.5 rounded-[3px]" style={{ backgroundColor: s.stroke }} /> {s.name}
            </span>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={finance} margin={{ top: 6, right: 12, left: -8, bottom: 0 }}>
            <defs>
              {financeSeries.map((s) => (
                <linearGradient key={s.key} id={`fin-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={s.stroke} stopOpacity={0.22} />
                  <stop offset="95%" stopColor={s.stroke} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={color.borderSoft} vertical={false} />
            <XAxis dataKey="mes" tick={{ fontSize: 12, fill: color.ink500 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: color.ink400 }} axisLine={false} tickLine={false} width={44} />
            <Tooltip content={<TooltipBox />} cursor={{ stroke: color.ink300, strokeWidth: 1 }} />
            {financeSeries.map((s) => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.stroke}
                strokeWidth={2}
                fill={`url(#fin-${s.key})`}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mx-4 mb-4 px-4 py-3 bg-edu-warning-bg rounded-edu-control flex items-center gap-2.5">
        <AlertTriangle style={{ width: "18px", height: "18px", color: accent.amber.fg, flexShrink: 0 }} />
        <span className="text-[0.82rem] text-edu-ink-700">
          Representantes sin solvencia: <strong className="text-edu-warning">14</strong>
        </span>
      </div>
    </div>
  );
}
