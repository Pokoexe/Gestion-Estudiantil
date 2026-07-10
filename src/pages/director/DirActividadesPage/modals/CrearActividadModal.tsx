import { Plus, X } from "lucide-react";
import { color, accent } from "@themes/tokens";
import type { ActType } from "@shared/services/actions/director";

interface CrearActividadModalProps {
  form: { name: string; type: ActType; teacher: string; capacity: string };
  setForm: (v: { name: string; type: ActType; teacher: string; capacity: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export function CrearActividadModal({ form, setForm, onSubmit, onClose }: CrearActividadModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-edu-surface rounded-edu-card w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: accent.amber.bg }}>
              <Plus className="w-4 h-4" style={{ color: color.warning }} />
            </div>
            <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Crear actividad</h3>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-edu-ink-700 text-sm font-medium">Nombre de la actividad</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ej. Club de lectura"
              className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-warning"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-edu-ink-700 text-sm font-medium">Tipo</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as ActType })}
              className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-edu-warning"
            >
              {(["Deportiva", "Cultural", "Académica", "Curso"] as ActType[]).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-edu-ink-700 text-sm font-medium">Docente responsable</label>
            <input
              type="text"
              value={form.teacher}
              onChange={(e) => setForm({ ...form, teacher: e.target.value })}
              placeholder="Ej. Prof. Ana Beltrán"
              className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-warning"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-edu-ink-700 text-sm font-medium">Cupo máximo</label>
            <input
              type="number"
              min={1}
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-warning"
            />
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold border-none cursor-pointer transition-colors hover:opacity-90"
              style={{ backgroundColor: color.warning }}
            >
              <Plus className="w-4 h-4" /> Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
