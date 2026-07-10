import { CheckCircle2, Trash2, Users } from "lucide-react";
import { color } from "@themes/tokens";
import type { Activity, ActType } from "@shared/services/actions/director";

interface ActividadCardProps {
  a: Activity;
  meta: { bg: string; fg: string; icon: React.FC<{ style?: React.CSSProperties }> };
  accept: (id: number) => void;
  remove: (id: number) => void;
}

export function ActividadCard({ a, meta, accept, remove }: ActividadCardProps) {
  const Icon = meta.icon;
  const pct = Math.round((a.enrolled / a.capacity) * 100);
  const full = a.enrolled >= a.capacity;

  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-4 flex flex-col gap-3.5">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: meta.bg }}>
          <Icon style={{ width: "22px", height: "22px", color: meta.fg }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[0.9rem] font-semibold text-edu-ink whitespace-nowrap overflow-hidden text-ellipsis">{a.name}</div>
          <span className="text-[0.68rem] font-semibold px-2 py-0.5 rounded-edu-pill mt-1 inline-block" style={{ backgroundColor: meta.bg, color: meta.fg }}>{a.type}</span>
        </div>
      </div>

      <div className="text-[0.8rem] text-edu-ink-500">{a.teacher}</div>

      <div>
        <div className="flex justify-between items-baseline mb-1.5">
          <span className="inline-flex items-center gap-1 text-[0.78rem] text-edu-ink-500">
            <Users className="w-3.5 h-3.5" /> {a.enrolled} / {a.capacity} inscritos
          </span>
          <span className={`text-[0.78rem] font-semibold ${full ? "text-edu-danger" : "text-edu-ink-700"}`}>{full ? "Cupo lleno" : `${pct} %`}</span>
        </div>
        <div className="h-1.5 bg-edu-border-soft rounded-edu-pill overflow-hidden">
          <div className="h-full rounded-edu-pill" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: full ? color.danger : color.warning }} />
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-edu-border-soft mt-0.5">
        <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${a.status === "Activa" ? "bg-edu-success-bg text-edu-success" : "bg-edu-warning-bg text-edu-warning"}`}>{a.status}</span>
        <div className="flex items-center gap-1.5">
          {a.status === "Por aceptar" && (
            <button
              onClick={() => accept(a.id)}
              title="Aceptar"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-edu-control text-[0.75rem] font-semibold bg-edu-success text-white border-none cursor-pointer transition-colors hover:opacity-90"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Aceptar
            </button>
          )}
          <button
            onClick={() => remove(a.id)}
            title="Eliminar"
            aria-label="Eliminar"
            className="w-8 h-8 rounded-edu-chip border border-edu-border bg-edu-surface flex items-center justify-center text-edu-danger cursor-pointer transition-colors hover:bg-edu-danger-bg hover:border-edu-danger-bg"
          >
            <Trash2 style={{ width: "15px", height: "15px" }} />
          </button>
        </div>
      </div>
    </div>
  );
}
