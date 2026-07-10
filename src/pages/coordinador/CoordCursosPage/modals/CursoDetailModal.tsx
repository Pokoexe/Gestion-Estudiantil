import { BookOpen, UserSquare2, CalendarDays, Clock, Users, ClipboardList, X, CheckCircle2, XCircle } from "lucide-react";
import { color, accent } from "@themes/tokens";
import type { CoordCurso, CursoStatus } from "@shared/services/actions/coordinador";
import { InfoField } from "../ui/InfoField";

type StatusMeta = Record<CursoStatus, { label: string; bg: string; fg: string }>;

type Props = {
  curso: CoordCurso;
  statusMeta: StatusMeta;
  onClose: () => void;
  onAction: (action: "aceptar" | "rechazar") => void;
};

export function CursoDetailModal({ curso, statusMeta, onClose, onAction }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-edu-surface rounded-edu-card w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        {curso.image && (
          <div className="overflow-hidden rounded-t-edu-card" style={{ height: "180px" }}>
            <img src={curso.image} alt={curso.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-start">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: accent.blue.bg }}>
              <BookOpen style={{ width: 17, height: 17, color: accent.blue.fg }} />
            </div>
            <div className="min-w-0">
              <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem] leading-snug">{curso.title}</h3>
              <span className="text-[0.75rem] text-edu-ink-400 font-mono">{curso.code}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700 ml-3 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[0.8rem] text-edu-ink-500 font-medium">Estado actual</span>
            <span
              className="inline-flex items-center px-2.5 py-1 rounded-edu-pill text-[0.72rem] font-semibold"
              style={{ backgroundColor: statusMeta[curso.status].bg, color: statusMeta[curso.status].fg }}
            >
              {statusMeta[curso.status].label}
            </span>
          </div>

          <div>
            <p className="text-[0.75rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em] m-0 mb-1">Descripción</p>
            <p className="text-[0.875rem] text-edu-ink-700 m-0 leading-relaxed">{curso.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoField icon={UserSquare2} label="Profesor asignado" value={curso.profesor} />
            <InfoField icon={CalendarDays} label="Fecha de inicio" value={curso.fecha} />
            <InfoField icon={Clock} label="Horario" value={curso.schedule} />
            <InfoField icon={Users} label="Cupos" value={`${curso.enrolledCount} inscritos / ${curso.cupos} totales`} />
          </div>

          <div>
            <p className="text-[0.75rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em] m-0 mb-2">Evaluaciones</p>
            {curso.evaluaciones.length === 0 ? (
              <p className="text-[0.8125rem] text-edu-ink-400 m-0">Sin evaluaciones registradas.</p>
            ) : (
              <ul className="m-0 p-0 list-none flex flex-col gap-1.5">
                {curso.evaluaciones.map((ev, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <ClipboardList style={{ width: 14, height: 14, color: color.ink400 }} />
                    <span className="text-[0.8125rem] text-edu-ink-700">{ev}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {curso.status === "en_proceso" && (
            <div className="flex gap-2 pt-2 border-t border-edu-border-soft">
              <button
                onClick={() => onAction("rechazar")}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-edu-control text-sm font-semibold border-none cursor-pointer text-white hover:brightness-95"
                style={{ backgroundColor: color.danger }}
              >
                <XCircle className="w-4 h-4" />
                Rechazar solicitud
              </button>
              <button
                onClick={() => onAction("aceptar")}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-edu-control text-sm font-semibold border-none cursor-pointer text-white hover:brightness-95"
                style={{ backgroundColor: color.success }}
              >
                <CheckCircle2 className="w-4 h-4" />
                Aceptar solicitud
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
