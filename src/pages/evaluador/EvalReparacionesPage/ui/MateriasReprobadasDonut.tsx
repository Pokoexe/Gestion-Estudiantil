import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { DONUT_COLORS } from "../functions/useEvalReparaciones";

interface DonutItem { name: string; value: number }

interface Props {
  donutData: DonutItem[];
}

export function MateriasReprobadasDonut({ donutData }: Props) {
  return (
    <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-4">
      <div>
        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Materias con reprobados</h3>
        <p className="m-0 text-edu-ink-400 text-xs mt-0.5">Incluye materias pendientes</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-5 items-center flex-1">
        <div className="shrink-0" style={{ width: 150, height: 150 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                dataKey="value"
                nameKey="name"
                innerRadius="52%"
                outerRadius="82%"
                paddingAngle={3}
                stroke="none"
              >
                {donutData.map((_, i) => (
                  <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: number, n: string) => [`${v} estudiantes`, n]}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {donutData.map((d, i) => (
            <div key={d.name} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                <span className="text-[0.8rem] text-edu-ink-700 truncate">{d.name}</span>
              </div>
              <span className="text-[0.8rem] font-bold text-edu-ink shrink-0">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
