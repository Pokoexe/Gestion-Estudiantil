import { Phone, CheckCircle2 } from "lucide-react";
import { SectionCard } from "./SectionCard";
import { Th } from "./Th";

export function DebtorsTable({
  DEBTORS,
  contacted,
  contact,
}: {
  DEBTORS: any[];
  contacted: number[];
  contact: (id: number) => void;
}) {
  return (
    <SectionCard title="Representantes deudores" hint={`${DEBTORS.length} sin solvencia`}>
      <div className="overflow-x-auto">
        <div className="min-w-[680px]">
          <div className="grid grid-cols-[1.2fr_1.4fr_0.7fr_0.8fr_0.9fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
            {["Representante", "Estudiante", "Meses", "Monto", "Acción"].map((h) => (
              <Th key={h}>{h}</Th>
            ))}
          </div>
          {DEBTORS.map((d, i) => {
            const done = contacted.includes(d.id);
            return (
              <div
                key={d.id}
                className={`grid grid-cols-[1.2fr_1.4fr_0.7fr_0.8fr_0.9fr] px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < DEBTORS.length - 1 ? "border-b border-edu-border-soft" : ""}`}
              >
                <span className="text-sm text-edu-ink font-semibold">{d.name}</span>
                <span className="text-[0.8125rem] text-edu-ink-500">{d.student}</span>
                <span className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit bg-edu-danger-bg text-edu-danger">{d.months} mes{d.months > 1 ? "es" : ""}</span>
                <span className="text-sm text-edu-ink-700 font-semibold">{d.amount}</span>
                <button
                  onClick={() => contact(d.id)}
                  disabled={done}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-edu-control text-[0.8rem] font-semibold border-none cursor-pointer transition-colors w-fit ${
                    done ? "bg-edu-success-bg text-edu-success cursor-default" : "bg-edu-primary text-white hover:bg-edu-primary-hover"
                  }`}
                >
                  {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
                  {done ? "Contactado" : "Contactar"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </SectionCard>
  );
}
