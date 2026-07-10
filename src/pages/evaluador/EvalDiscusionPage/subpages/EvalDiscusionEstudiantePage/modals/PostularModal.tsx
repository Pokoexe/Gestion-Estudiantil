import { CalendarClock, Gavel, Send, X } from "lucide-react";
import { TEAL, TEAL_50 } from "../functions/useEvalDiscusionEstudiante";
import { notaColor } from "@shared/services/data/boletines";
import type { Boletin } from "@shared/services/actions/boletines";

interface Props {
  b: Boletin;
  tab: string;
  notaTab: number;
  motivo: string;
  fecha: string;
  onMotivo: (m: string) => void;
  onFecha: (f: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function PostularModal({
  b,
  tab,
  notaTab,
  motivo,
  fecha,
  onMotivo,
  onFecha,
  onClose,
  onSubmit,
}: Props) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <form
        onSubmit={onSubmit}
        className="bg-edu-surface rounded-edu-card w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-edu-control flex items-center justify-center"
              style={{ backgroundColor: TEAL_50 }}
            >
              <Gavel className="w-4 h-4" style={{ color: TEAL }} />
            </div>
            <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">
              Postular al Concejo
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div className="px-3.5 py-2.5 rounded-edu-control bg-edu-subtle border border-edu-border-soft text-[0.8125rem] text-edu-ink-700">
            <strong>{b.student}</strong> · {b.anio} {b.seccion} — {tab}: nota actual{" "}
            <strong className={notaColor(notaTab)}>{notaTab}</strong>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-edu-ink-700 text-sm font-medium flex items-center gap-1.5">
              <CalendarClock className="w-3.5 h-3.5 text-edu-ink-400" />
              Fecha de presentación al Concejo
            </label>
            <input
              type="date"
              required
              value={fecha}
              onChange={(e) => onFecha(e.target.value)}
              className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-teal-600"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-edu-ink-700 text-sm font-medium">Justificación</label>
            <textarea
              rows={3}
              required
              value={motivo}
              onChange={(e) => onMotivo(e.target.value)}
              placeholder="Motivo por el que se postula al estudiante ante el Concejo…"
              className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full resize-none focus:border-teal-600"
            />
          </div>
        </div>
        <div className="px-5 py-3.5 border-t border-edu-border-soft flex gap-2 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer hover:bg-edu-subtle"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold border-none cursor-pointer transition-opacity hover:opacity-90"
            style={{ backgroundColor: TEAL }}
          >
            <Send className="w-4 h-4" /> Enviar postulación
          </button>
        </div>
      </form>
    </div>
  );
}
