import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Award, FileSpreadsheet, User, Gavel, Send, CalendarClock } from "lucide-react";
import { postularEstudiante } from "../data/discusiones";
import { BOLETINES, MATERIAS, promedio, notaColor, desglose, actividadesDe } from "../data/boletines";

const TEAL = "#0d9488";
const TEAL_BG = "#ccfbf1";
const TEAL_50 = "#f0fdfa";

const EVAL_COLS = "grid-cols-[2fr_1fr_0.7fr_0.7fr]";

export function EvalPostularEstudiantePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const b = BOLETINES.find((x) => String(x.id) === id);

  // Índice de la materia con nota más baja (probable caso a discutir)
  const idxMenor = b ? b.notas.reduce((m, n, i, a) => (n < a[m] ? i : m), 0) : 0;

  const [materia, setMateria] = useState(b ? MATERIAS[idxMenor] : MATERIAS[0]);
  const [nota, setNota] = useState(b ? String(b.notas[idxMenor]) : "");
  const [motivo, setMotivo] = useState("");
  const [fecha, setFecha] = useState("");

  if (!b) {
    return (
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-12 text-center">
        <p className="text-edu-ink-500 text-sm m-0">No se encontró el estudiante.</p>
        <button
          onClick={() => navigate("/evaluador/discusion/concejo")}
          className="inline-flex items-center gap-1.5 mt-4 text-[0.8125rem] font-semibold cursor-pointer bg-transparent border-none"
          style={{ color: TEAL }}
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Concejo
        </button>
      </div>
    );
  }

  const actividades = actividadesDe(b.id);
  const prom = promedio(b.notas);

  const cambiarMateria = (m: string) => {
    setMateria(m);
    setNota(String(b.notas[MATERIAS.indexOf(m)]));
  };

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    postularEstudiante({
      estudiante: b.student,
      materia,
      anio: `${b.anio} ${b.seccion}`,
      nota: Number(nota) || 0,
      motivo: motivo.trim() || "—",
      actividades,
      fechaPresentacion: fecha || undefined,
    });
    navigate("/evaluador/discusion/concejo");
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Barra superior */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={() => navigate("/evaluador/discusion/concejo")}
          className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-edu-ink-500 hover:text-edu-ink-700 bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Concejo
        </button>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-edu-pill text-[0.78rem] font-semibold" style={{ backgroundColor: TEAL_BG, color: TEAL }}>
          <Gavel className="w-3.5 h-3.5" /> Postulación al Concejo
        </span>
      </div>

      {/* Cabecera del estudiante */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex items-center gap-4 flex-wrap">
        <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: TEAL_BG }}>
          <User className="w-7 h-7" style={{ color: TEAL }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-edu-ink text-[1.1rem] font-bold m-0">{b.student}</p>
          <p className="text-edu-ink-500 text-[0.85rem] m-0 mt-0.5">
            {b.anio} · Sección {b.seccion} · {b.cedula}
          </p>
          <p className="text-edu-ink-400 text-[0.78rem] m-0 mt-0.5">Representante: {b.representante}</p>
        </div>
        <div className="text-right">
          <div className="text-[0.72rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Promedio general</div>
          <div className={`text-[1.6rem] font-bold leading-none mt-1 ${prom >= 10 ? "text-edu-success" : "text-edu-danger"}`}>{prom.toFixed(2)}</div>
        </div>
      </div>

      {/* Actividades extracurriculares */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-edu-border-soft flex items-center gap-2">
          <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: TEAL_50 }}>
            <Award className="w-4 h-4" style={{ color: TEAL }} />
          </div>
          <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Actividades extracurriculares</h3>
        </div>
        <div className="p-5">
          {actividades.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {actividades.map((a) => (
                <span key={a} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-edu-chip text-[0.75rem] font-medium" style={{ backgroundColor: TEAL_50, color: TEAL }}>
                  <Award className="w-3.5 h-3.5" />
                  {a}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[0.8125rem] text-edu-ink-400 m-0">Sin actividades registradas.</p>
          )}
        </div>
      </div>

      {/* Formulario de postulación / petición */}
      <form onSubmit={enviar} className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-edu-border-soft flex items-center gap-2">
          <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: TEAL_50 }}>
            <Gavel className="w-4 h-4" style={{ color: TEAL }} />
          </div>
          <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Postular al Concejo de Profesores</h3>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div className="flex gap-3 flex-wrap">
            <div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
              <label className="text-edu-ink-700 text-sm font-medium">Materia en discusión</label>
              <select
                value={materia}
                onChange={(e) => cambiarMateria(e.target.value)}
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
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-teal-600"
              />
            </div>
            <div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
              <label className="text-edu-ink-700 text-sm font-medium flex items-center gap-1.5">
                <CalendarClock className="w-3.5 h-3.5 text-edu-ink-400" /> Fecha de presentación al Concejo
              </label>
              <input
                type="date"
                required
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-teal-600"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-edu-ink-700 text-sm font-medium">Justificación de la petición</label>
            <textarea
              rows={3}
              required
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Motivo por el que se postula al estudiante ante el Concejo…"
              className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full resize-none focus:border-teal-600"
            />
          </div>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="m-0 text-[0.78rem] text-edu-ink-400 max-w-md">
              Al enviar, la postulación quedará pendiente. Aparecerá en el Concejo y serán los docentes quienes decidan aceptarla o rechazarla.
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

      {/* Sábana de notas: todas las materias y sus evaluaciones */}
      <div className="flex items-center gap-2 mt-1">
        <FileSpreadsheet className="w-4 h-4 text-edu-ink-400" />
        <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Sábana de notas</h3>
      </div>

      {MATERIAS.map((m, i) => {
        const evals = desglose(b.notas[i]);
        const def = b.notas[i];
        const enDiscusion = m === materia;
        return (
          <div key={m} className={`bg-edu-surface rounded-edu-card border overflow-hidden ${enDiscusion ? "border-edu-warning" : "border-edu-border-soft"}`}>
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center gap-3">
              <div className="flex items-center gap-2">
                <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">{m}</h3>
                {enDiscusion && (
                  <span className="inline-flex items-center px-2 py-[2px] rounded-edu-pill text-[0.65rem] font-semibold bg-edu-warning-bg text-edu-warning">En discusión</span>
                )}
              </div>
              <span className="text-[0.8125rem] text-edu-ink-500">
                Definitiva: <strong className={`text-[0.95rem] ${notaColor(def)}`}>{def}</strong>
                <span className="text-edu-ink-400"> / 20</span>
              </span>
            </div>
            <div className={`grid ${EVAL_COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
              {["Evaluación", "Tipo", "%", "Nota"].map((h, j) => (
                <span key={h} className={`text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em] ${j >= 2 ? "text-right" : ""}`}>{h}</span>
              ))}
            </div>
            {evals.map((e, j) => (
              <div key={j} className={`grid ${EVAL_COLS} px-5 py-[11px] items-center ${j < evals.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
                <span className="text-[0.875rem] text-edu-ink font-medium">{e.nombre}</span>
                <span className="text-[0.8125rem] text-edu-ink-700">{e.tipo}</span>
                <span className="text-[0.8125rem] text-edu-ink-500 text-right">{e.porcentaje}%</span>
                <span className={`text-[0.9rem] font-bold text-right ${notaColor(e.nota)}`}>{e.nota}</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
