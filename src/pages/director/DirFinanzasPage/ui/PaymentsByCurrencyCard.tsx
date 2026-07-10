import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { SectionCard } from "./SectionCard";
import { PieTooltipBox } from "./PieTooltipBox";

type PagoMoneda = { name: string; value: number; fill: string };

export function PaymentsByCurrencyCard({ PAGOS_MONEDA }: { PAGOS_MONEDA: PagoMoneda[] }) {
  return (
    <SectionCard title="Pagos por moneda" hint="% del total recaudado">
      <div className="px-3 pt-2 pb-3 flex-1 flex flex-col items-center justify-center">
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie data={PAGOS_MONEDA} dataKey="value" nameKey="name" innerRadius="52%" outerRadius="80%" paddingAngle={3} stroke="none">
              {PAGOS_MONEDA.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<PieTooltipBox />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col gap-1.5 mt-1 w-full px-2">
          {PAGOS_MONEDA.map((m) => (
            <span key={m.name} className="inline-flex items-center gap-1.5 text-[0.75rem] text-edu-ink-500">
              <span className="w-2.5 h-2.5 rounded-[3px]" style={{ backgroundColor: m.fill }} /> {m.name} · {m.value} %
            </span>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
