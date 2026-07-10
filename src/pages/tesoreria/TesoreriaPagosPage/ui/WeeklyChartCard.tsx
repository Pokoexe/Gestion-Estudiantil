import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { color } from "@themes/tokens";

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-edu-surface border border-edu-border rounded-edu-chip shadow-[0_4px_16px_rgba(0,0,0,0.08)] px-3 py-2">
      <div style={{ fontSize: "0.7rem", color: color.ink400, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
      <div style={{ fontSize: "0.9rem", color: color.ink, fontWeight: 700, marginTop: "2px" }}>$ {payload[0].value.toLocaleString("es-ES")}</div>
    </div>
  );
}

export function WeeklyChartCard({ data }: { data: any[] }) {
  return (
    <div className="lg:col-span-2 bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-edu-border-soft">
        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Pagos de julio 2026</h3>
        <p className="mt-0.5 text-edu-ink-400 text-[0.78rem]">Recaudo semanal en USD equivalente</p>
      </div>
      <div className="px-4 pt-5 pb-3">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 8, right: 12, left: 4, bottom: 0 }} barCategoryGap="32%">
            <CartesianGrid vertical={false} stroke={color.borderSoft} />
            <XAxis dataKey="dia" tickLine={false} axisLine={{ stroke: color.border }} tick={{ fill: color.ink400, fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: color.ink400, fontSize: 12 }} tickFormatter={(v) => `$ ${(v / 1000).toLocaleString("es-ES")}k`} width={48} />
            <Tooltip cursor={{ fill: color.successBg }} content={<ChartTooltip />} />
            <Bar dataKey="monto" radius={[6, 6, 0, 0]} maxBarSize={54}>
              {data.map((_, i) => (
                <Cell key={i} fill={i === data.length - 1 ? color.success : "#86efac"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
