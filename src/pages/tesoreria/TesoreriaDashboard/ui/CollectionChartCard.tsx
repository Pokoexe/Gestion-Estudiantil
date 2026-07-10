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

function SectionHeader({
  title,
  link,
  subtitle,
  onLink,
}: {
  title: string;
  link?: string;
  subtitle?: string;
  onLink?: () => void;
}) {
  return (
    <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
      <div>
        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">{title}</h3>
        {subtitle && <p className="mt-0.5 text-edu-ink-400 text-[0.78rem]">{subtitle}</p>}
      </div>
      {link && (
        <span onClick={onLink} className="text-[0.8rem] text-edu-primary cursor-pointer font-medium hover:underline">
          {link} →
        </span>
      )}
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-edu-surface border border-edu-border rounded-edu-chip shadow-[0_4px_16px_rgba(0,0,0,0.08)] px-3 py-2">
      <div style={{ fontSize: "0.7rem", color: color.ink400, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label} 2026
      </div>
      <div style={{ fontSize: "0.9rem", color: color.ink, fontWeight: 700, marginTop: "2px" }}>
        $ {payload[0].value.toLocaleString("es-ES")}
      </div>
    </div>
  );
}

type Props = {
  data: any[];
  onSeeReport: () => void;
};

export function CollectionChartCard({ data, onSeeReport }: Props) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <SectionHeader
        title="Pagos del mes"
        subtitle="Recaudo en USD · últimos 6 meses"
        link="Ver reporte completo"
        onLink={onSeeReport}
      />
      <div className="px-4 pt-5 pb-3">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 8, right: 12, left: 4, bottom: 0 }} barCategoryGap="32%">
            <CartesianGrid vertical={false} stroke={color.borderSoft} />
            <XAxis
              dataKey="mes"
              tickLine={false}
              axisLine={{ stroke: color.border }}
              tick={{ fill: color.ink400, fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: color.ink400, fontSize: 12 }}
              tickFormatter={(v) => `$ ${(v / 1000).toLocaleString("es-ES")}k`}
              width={48}
            />
            <Tooltip cursor={{ fill: color.primary50 }} content={<CustomTooltip />} />
            <Bar dataKey="monto" radius={[6, 6, 0, 0]} maxBarSize={46}>
              {data.map((_, i) => (
                <Cell key={i} fill={i === data.length - 1 ? color.primary : color.primary200} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
