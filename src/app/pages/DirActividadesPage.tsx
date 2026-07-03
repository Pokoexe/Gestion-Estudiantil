import { useState } from "react";
import {
  Trophy,
  Palette,
  FlaskConical,
  Music,
  Plus,
  CheckCircle2,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { color, accent } from "../theme/tokens";

/* ------------------------------------------------------------------ */
/* Datos ficticios                                                     */
/* ------------------------------------------------------------------ */

type ActType = "Deportiva" | "Cultural" | "Académica" | "Curso";
type ActStatus = "Activa" | "Por aceptar";

interface Activity {
  id: number;
  name: string;
  type: ActType;
  teacher: string;
  enrolled: number;
  capacity: number;
  status: ActStatus;
}

const INITIAL: Activity[] = [
  { id: 1, name: "Escuela de fútbol", type: "Deportiva", teacher: "Prof. Ricardo Salas", enrolled: 28, capacity: 30, status: "Activa" },
  { id: 2, name: "Coro estudiantil", type: "Cultural", teacher: "Prof. Daniela Herrera", enrolled: 22, capacity: 25, status: "Activa" },
  { id: 3, name: "Club de robótica", type: "Académica", teacher: "Prof. Alejandro Morales", enrolled: 18, capacity: 20, status: "Activa" },
  { id: 4, name: "Curso de nivelación de Matemática", type: "Curso", teacher: "Prof. Carmen Villalobos", enrolled: 15, capacity: 24, status: "Activa" },
  { id: 5, name: "Taller de teatro", type: "Cultural", teacher: "Prof. Gustavo Peña", enrolled: 9, capacity: 20, status: "Por aceptar" },
  { id: 6, name: "Ajedrez competitivo", type: "Deportiva", teacher: "Prof. Marisol Rangel", enrolled: 12, capacity: 16, status: "Por aceptar" },
];

const TYPE_META: Record<ActType, { bg: string; fg: string; icon: React.FC<{ style?: React.CSSProperties }> }> = {
  Deportiva: { bg: accent.green.bg, fg: accent.green.fg, icon: Trophy },
  Cultural: { bg: accent.purple.bg, fg: accent.purple.fg, icon: Palette },
  Académica: { bg: accent.blue.bg, fg: accent.blue.fg, icon: FlaskConical },
  Curso: { bg: accent.amber.bg, fg: accent.amber.fg, icon: Music },
};

const FILTERS: (ActType | "Todas")[] = ["Todas", "Deportiva", "Cultural", "Académica", "Curso"];

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function DirActividadesPage() {
  const [items, setItems] = useState<Activity[]>(INITIAL);
  const [filter, setFilter] = useState<(ActType | "Todas")>("Todas");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<{ name: string; type: ActType; teacher: string; capacity: string }>({
    name: "",
    type: "Deportiva",
    teacher: "",
    capacity: "20",
  });

  const visible = items.filter((a) => filter === "Todas" || a.type === filter);

  const accept = (id: number) =>
    setItems((list) => list.map((a) => (a.id === id ? { ...a, status: "Activa" } : a)));
  const remove = (id: number) => setItems((list) => list.filter((a) => a.id !== id));

  const create = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Activity = {
      id: Date.now(),
      name: form.name.trim() || "Nueva actividad",
      type: form.type,
      teacher: form.teacher.trim() || "Por asignar",
      enrolled: 0,
      capacity: Number(form.capacity) || 20,
      status: "Por aceptar",
    };
    setItems((list) => [next, ...list]);
    setShowModal(false);
    setForm({ name: "", type: "Deportiva", teacher: "", capacity: "20" });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Encabezado de sección */}
      <div className="flex justify-between items-end flex-wrap gap-3">
        <div>
          <h2 className="m-0 text-edu-ink font-bold text-xl">Cursos y actividades extracurriculares</h2>
          <p className="m-0 mt-1 text-edu-ink-400 text-[0.85rem]">
            Inscripciones, cupos y aprobación de nuevas actividades · Período 2026-I
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold text-white border-none cursor-pointer transition-colors hover:opacity-90"
          style={{ backgroundColor: color.warning }}
        >
          <Plus className="w-4 h-4" /> Crear actividad
        </button>
      </div>

      {/* Filtro por tipo */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-edu-pill text-[0.8rem] font-semibold border cursor-pointer transition-colors ${
                active ? "text-white border-transparent" : "bg-edu-surface text-edu-ink-500 border-edu-border hover:bg-edu-subtle"
              }`}
              style={active ? { backgroundColor: color.warning } : undefined}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Tarjetas de actividades */}
      <div className="grid grid-cols-3 gap-4">
        {visible.map((a) => {
          const meta = TYPE_META[a.type];
          const Icon = meta.icon;
          const pct = Math.round((a.enrolled / a.capacity) * 100);
          const full = a.enrolled >= a.capacity;
          return (
            <div key={a.id} className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-4 flex flex-col gap-3.5">
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
        })}
      </div>

      {visible.length === 0 && (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-12 flex flex-col items-center gap-2 text-center">
          <FlaskConical className="w-8 h-8 text-edu-ink-300" />
          <span className="text-sm text-edu-ink-500">No hay actividades de este tipo.</span>
        </div>
      )}

      {/* Modal de crear actividad */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-edu-surface rounded-edu-card w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: accent.amber.bg }}>
                  <Plus className="w-4 h-4" style={{ color: color.warning }} />
                </div>
                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Crear actividad</h3>
              </div>
              <button onClick={() => setShowModal(false)} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={create} className="p-5 flex flex-col gap-4">
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
                  onClick={() => setShowModal(false)}
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
      )}
    </div>
  );
}
