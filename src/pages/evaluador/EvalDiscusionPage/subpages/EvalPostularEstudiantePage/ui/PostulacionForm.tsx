import { CalendarClock, Send } from "lucide-react";
import { TEAL } from "../functions/useEvalPostularEstudiante";

interface Props {
  materia: string;
  nota: string;
  motivo: string;
  fecha: string;
  MATERIAS: string[];
  onCambiarMateria: (m: string) => void;
  onNota: (n: string) => void;
  onMotivo: (m: string) => void;
  onFecha: (f: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function PostulacionForm({
  materia,
  nota,
  motivo,
  fecha,
  MATERIAS,
  onCambiarMateria,
  onNota,
  onMotivo,
  onFecha,
  onSubmit,
}: Props) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-edu-border-soft flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-edu-control flex items-center justify-center"
          style={{ backgroundColor: "#f0fdfa" }}
        >
          <Send className="w-4 h-4" style={{ color: TEAL }} />
        </div>
        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">
          Postular al Concejo de Profesores
        </h3>
      </div>
      <div className="p-5 flex flex-col gap-4">
        <div className="flex gap-3 flex-wrap">
          <div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
            <label className="text-edu-ink-700 text-sm font-medium">Materia en discusión</label>
            <select
              value={materia}
              onChange={(e) => onCambiarMateria(e.target.value)}
              className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-teal-600"
            >
              {MATERIAS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5 w-28">
            <label className="text-edu-ink-700 text-sm font-medium">Nota actual</label>
            <input
              type="number"
              min={1}
              max={20}
              required
              value={nota}
              onChange={(e) => onNota(e.target.value)}
              className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-teal-600"
            />
          </div>
          <div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
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
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-edu-ink-700 text-sm font-medium">
            Justificación de la petición
          </label>
          <textarea
            rows={3}
            required
            value={motivo}
            onChange={(e) => onMotivo(e.target.value)}
            placeholder="Motivo por el que se postula al estudiante ante el Concejo…"
            className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full resize-none focus:border-teal-600"
          />
        </div>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className="m-0 text-[0.78rem] text-edu-ink-400 max-w-md">
            Al enviar, la postulación quedará pendiente. Aparecerá en el Concejo y serán los
            docentes quienes decidan aceptarla o rechazarla.
          </p>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold text-white border-none cursor-pointer transition-opacity hover:opacity-90"
            style={{ backgroundColor: TEAL }}
          >
            <Send className="w-4 h-4" />
            Enviar postulación
          </button>
        </div>
      </div>
    </form>
  );
}
