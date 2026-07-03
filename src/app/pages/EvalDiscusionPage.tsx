import { useState } from "react";
import {
  Gavel,
  UserPlus,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  X,
  MessageSquare,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Tipos y datos ficticios                                             */
/* ------------------------------------------------------------------ */

const TEAL = "#0d9488";
const TEAL_BG = "#ccfbf1";
const TEAL_50 = "#f0fdfa";

type PostEstado = "Pendiente" | "Aceptada" | "Rechazada";

interface Postulacion {
  id: number;
  estudiante: string;
  materia: string;
  nota: number;
  motivo: string;
  actividades: string[];
  estado: PostEstado;
  observacion?: string;
}

const POSTULACIONES_INI: Postulacion[] = [
  {
    id: 1,
    estudiante: "Carlos Bracho",
    materia: "Matemáticas",
    nota: 9,
    motivo: "Reprobó por 1 punto tras mejorar notablemente en el 3.º lapso.",
    actividades: ["Selección de baloncesto (2 pts.)", "Ayudante de laboratorio (1 pt.)"],
    estado: "Pendiente",
  },
  {
    id: 2,
    estudiante: "Eduardo Marín",
    materia: "Física",
    nota: 7,
    motivo: "Situación familiar durante el 2.º lapso; recuperó en actividades finales.",
    actividades: ["Grupo de teatro (2 pts.)"],
    estado: "Pendiente",
  },
  {
    id: 3,
    estudiante: "Jesús Alvarado",
    materia: "Química",
    nota: 8,
    motivo: "Constancia en las asignaciones prácticas de la última unidad.",
    actividades: ["Coro institucional (1 pt.)", "Brigada ecológica (2 pts.)"],
    estado: "Aceptada",
    observacion: "Se aprueba con nota mínima considerando las actividades extracurriculares.",
  },
  {
    id: 4,
    estudiante: "Gustavo Linares",
    materia: "Historia",
    nota: 9,
    motivo: "Solicita revisión de la ponderación del proyecto final.",
    actividades: ["Periódico escolar (1 pt.)"],
    estado: "Rechazada",
    observacion: "No alcanza los objetivos mínimos; se mantiene la nota.",
  },
];

const ESTADO_META: Record<PostEstado, string> = {
  Pendiente: "bg-edu-warning-bg text-edu-warning",
  Aceptada: "bg-edu-success-bg text-edu-success",
  Rechazada: "bg-edu-danger-bg text-edu-danger",
};

const MATERIAS = ["Castellano", "Matemáticas", "Biología", "Química", "Física", "Historia", "Inglés"];

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function EvalDiscusionPage() {
  const [posts, setPosts] = useState<Postulacion[]>(POSTULACIONES_INI);
  const [showNueva, setShowNueva] = useState(false);
  const [decisionId, setDecisionId] = useState<number | null>(null);
  const [decisionTipo, setDecisionTipo] = useState<"Aceptada" | "Rechazada">("Aceptada");
  const [obs, setObs] = useState("");
  const [form, setForm] = useState({ estudiante: "", materia: MATERIAS[0], nota: "", motivo: "", actividades: "" });

  const abrirDecision = (id: number, tipo: "Aceptada" | "Rechazada") => {
    setDecisionId(id);
    setDecisionTipo(tipo);
    setObs("");
  };

  const confirmarDecision = () => {
    if (decisionId === null) return;
    setPosts((ps) =>
      ps.map((p) =>
        p.id === decisionId
          ? { ...p, estado: decisionTipo, observacion: obs.trim() || (decisionTipo === "Aceptada" ? "Aprobada por el Concejo." : "Rechazada por el Concejo.") }
          : p,
      ),
    );
    setDecisionId(null);
    setObs("");
  };

  const crearPostulacion = (e: React.FormEvent) => {
    e.preventDefault();
    const nueva: Postulacion = {
      id: Date.now(),
      estudiante: form.estudiante.trim() || "Estudiante sin nombre",
      materia: form.materia,
      nota: Number(form.nota) || 0,
      motivo: form.motivo.trim() || "—",
      actividades: form.actividades.split(",").map((a) => a.trim()).filter(Boolean),
      estado: "Pendiente",
    };
    setPosts([nueva, ...posts]);
    setShowNueva(false);
    setForm({ estudiante: "", materia: MATERIAS[0], nota: "", motivo: "", actividades: "" });
  };

  const pendientes = posts.filter((p) => p.estado === "Pendiente").length;

  return (
    <div className="flex flex-col gap-5">
      {/* Encabezado */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-edu-card flex items-center justify-center shrink-0" style={{ backgroundColor: TEAL_BG }}>
            <Gavel className="w-7 h-7" style={{ color: TEAL }} />
          </div>
          <div>
            <p className="text-edu-ink text-[1.05rem] font-bold m-0">Discusión de notas — Concejo de Profesores</p>
            <p className="text-edu-ink-500 text-[0.85rem] m-0 mt-0.5">
              {pendientes} postulacion{pendientes === 1 ? "" : "es"} pendiente{pendientes === 1 ? "" : "s"} de decisión
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowNueva(true)}
          className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold text-white border-none cursor-pointer transition-opacity hover:opacity-90"
          style={{ backgroundColor: TEAL }}
        >
          <UserPlus className="w-4 h-4" />
          Postular estudiante
        </button>
      </div>

      {/* Lista de postulaciones */}
      <div className="flex flex-col gap-3.5">
        {posts.map((p) => (
          <div key={p.id} className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex flex-col gap-3">
            <div className="flex justify-between items-start gap-3 flex-wrap">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-[0.95rem] font-semibold text-edu-ink">{p.estudiante}</span>
                  <span className="text-[0.8125rem] text-edu-ink-500">{p.materia}</span>
                  <span className="inline-flex items-center px-2 py-[2px] rounded-edu-chip text-[0.72rem] font-semibold bg-edu-danger-bg text-edu-danger">
                    Nota: {p.nota}
                  </span>
                </div>
                <p className="text-[0.85rem] text-edu-ink-700 m-0 mt-2 max-w-2xl">{p.motivo}</p>
              </div>
              <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit shrink-0 ${ESTADO_META[p.estado]}`}>
                {p.estado}
              </span>
            </div>

            {/* Actividades extracurriculares */}
            {p.actividades.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {p.actividades.map((a) => (
                  <span key={a} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-edu-chip text-[0.72rem] font-medium" style={{ backgroundColor: TEAL_50, color: TEAL }}>
                    <Award className="w-3 h-3" />
                    {a}
                  </span>
                ))}
              </div>
            )}

            {/* Observación del concejo */}
            {p.observacion && (
              <div className={`flex items-start gap-1.5 text-xs rounded-edu-chip px-2.5 py-1.5 w-fit ${p.estado === "Rechazada" ? "text-edu-danger bg-edu-danger-bg" : "text-edu-success bg-edu-success-bg"}`}>
                <MessageSquare className="w-3.5 h-3.5 shrink-0 mt-px" />
                {p.observacion}
              </div>
            )}

            {/* Acciones del concejo */}
            {p.estado === "Pendiente" && (
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => abrirDecision(p.id, "Aceptada")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-edu-control text-[0.8125rem] font-semibold text-white border-none cursor-pointer transition-opacity hover:opacity-90"
                  style={{ backgroundColor: TEAL }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Aceptar
                </button>
                <button
                  type="button"
                  onClick={() => abrirDecision(p.id, "Rechazada")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-edu-control text-[0.8125rem] font-semibold border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 cursor-pointer transition-colors hover:bg-edu-subtle"
                >
                  <XCircle className="w-4 h-4" />
                  Rechazar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal: nueva postulación */}
      {showNueva && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowNueva(false)}>
          <div className="bg-edu-surface rounded-edu-card w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: TEAL_50 }}>
                  <UserPlus className="w-4 h-4" style={{ color: TEAL }} />
                </div>
                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Postular estudiante</h3>
              </div>
              <button onClick={() => setShowNueva(false)} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={crearPostulacion} className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-edu-ink-700 text-sm font-medium">Estudiante</label>
                <input
                  type="text"
                  required
                  value={form.estudiante}
                  onChange={(e) => setForm({ ...form, estudiante: e.target.value })}
                  placeholder="Ej. Carlos Bracho"
                  className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-teal-600"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-edu-ink-700 text-sm font-medium">Materia</label>
                  <select
                    value={form.materia}
                    onChange={(e) => setForm({ ...form, materia: e.target.value })}
                    className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-teal-600"
                  >
                    {MATERIAS.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5 w-28">
                  <label className="text-edu-ink-700 text-sm font-medium">Nota actual</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    required
                    value={form.nota}
                    onChange={(e) => setForm({ ...form, nota: e.target.value })}
                    placeholder="9"
                    className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-teal-600"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-edu-ink-700 text-sm font-medium">Justificación</label>
                <textarea
                  rows={3}
                  value={form.motivo}
                  onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                  placeholder="Motivo de la postulación ante el Concejo…"
                  className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full resize-none focus:border-teal-600"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-edu-ink-700 text-sm font-medium">Actividades extracurriculares</label>
                <input
                  type="text"
                  value={form.actividades}
                  onChange={(e) => setForm({ ...form, actividades: e.target.value })}
                  placeholder="Separadas por coma. Ej. Baloncesto (2 pts.), Coro (1 pt.)"
                  className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-teal-600"
                />
                <span className="text-[0.72rem] text-edu-ink-400">Suman puntos a considerar por el Concejo.</span>
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <button type="button" onClick={() => setShowNueva(false)} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle">
                  Cancelar
                </button>
                <button type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold border-none cursor-pointer transition-opacity hover:opacity-90" style={{ backgroundColor: TEAL }}>
                  <UserPlus className="w-4 h-4" />
                  Postular
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: decisión del concejo */}
      {decisionId !== null && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setDecisionId(null)}>
          <div className="bg-edu-surface rounded-edu-card w-full max-w-md shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-edu-control flex items-center justify-center ${decisionTipo === "Aceptada" ? "bg-edu-success-bg" : "bg-edu-danger-bg"}`}>
                  {decisionTipo === "Aceptada" ? <CheckCircle2 className="w-4 h-4 text-edu-success" /> : <XCircle className="w-4 h-4 text-edu-danger" />}
                </div>
                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">
                  {decisionTipo === "Aceptada" ? "Aceptar postulación" : "Rechazar postulación"}
                </h3>
              </div>
              <button onClick={() => setDecisionId(null)} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-edu-ink-700 text-sm font-medium">Observación del Concejo</label>
                <textarea
                  rows={4}
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  placeholder="Fundamenta la decisión del Concejo de Profesores…"
                  className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full resize-none focus:border-teal-600"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setDecisionId(null)} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle">
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmarDecision}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold border-none cursor-pointer transition-colors ${decisionTipo === "Aceptada" ? "bg-edu-success hover:opacity-90" : "bg-edu-danger hover:opacity-90"}`}
                >
                  {decisionTipo === "Aceptada" ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
