import { CalendarClock } from "lucide-react";
import { color, accent } from "@themes/tokens";
import { SectionCard } from "./SectionCard";
import { Pill } from "./Pill";

export function CronogramaCard() {
  return (
    <SectionCard title="Cronograma de evaluación" subtitle="Lapso académico en curso" action="Ajustar reglas →">
      <div className="p-5 flex flex-col gap-[18px]">
        <div className="flex justify-between items-start flex-wrap gap-2.5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[1.1rem] font-bold text-edu-ink">Lapso II · 2026-I</span>
              <Pill label="En curso" tone={accent.green} />
            </div>
            <p className="mt-1 mb-0 text-[0.8rem] text-edu-ink-500">
              Cierre del lapso: <strong className="text-edu-ink-700">31 jul 2026</strong>
            </p>
          </div>
          <div className="text-right">
            <div className="text-[1.4rem] font-bold text-edu-primary">64 %</div>
            <div className="text-[0.72rem] text-edu-ink-400">del lapso transcurrido</div>
          </div>
        </div>

        {/* Barra de progreso / timeline */}
        <div className="flex flex-col gap-1.5">
          <div className="h-2.5 bg-edu-border-soft rounded-edu-pill overflow-hidden">
            <div className="h-full w-[64%] bg-edu-primary rounded-edu-pill" />
          </div>
          <div className="flex justify-between text-[0.7rem] text-edu-ink-400">
            <span>1 jul</span>
            <span>Hoy · 20 jul</span>
            <span>31 jul</span>
          </div>
        </div>

        {/* Reglas de tiempo */}
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-[150px] bg-edu-primary-50 rounded-edu-chip px-3.5 py-3 flex items-center gap-2.5">
            <CalendarClock style={{ width: "18px", height: "18px", color: color.primary, flexShrink: 0 }} />
            <div>
              <div className="text-[0.72rem] text-edu-ink-500 font-medium">Separación mínima</div>
              <div className="text-[0.9rem] text-edu-ink font-bold">5 días entre evaluaciones</div>
            </div>
          </div>
          <div className="flex-1 min-w-[150px] bg-edu-warning-bg rounded-edu-chip px-3.5 py-3 flex items-center gap-2.5">
            <CalendarClock style={{ width: "18px", height: "18px", color: color.warning, flexShrink: 0 }} />
            <div>
              <div className="text-[0.72rem] text-edu-ink-500 font-medium">Separación máxima</div>
              <div className="text-[0.9rem] text-edu-ink font-bold">15 días entre evaluaciones</div>
            </div>
          </div>
        </div>
        <p className="m-0 text-[0.775rem] text-edu-ink-400">
          Regla vigente: Mín. 5 días · Máx. 15 días entre evaluaciones. Próxima evaluación habilitada desde el 8 jul 2026.
        </p>
      </div>
    </SectionCard>
  );
}
