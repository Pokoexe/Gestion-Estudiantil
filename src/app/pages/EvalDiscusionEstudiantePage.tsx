import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Award, FileSpreadsheet, User, Gavel } from "lucide-react";
import { POSTULACIONES, type PostEstado } from "../data/discusiones";
import { BOLETINES, MATERIAS, promedio, notaColor, desglose } from "../data/boletines";

const TEAL = "#0d9488";
const TEAL_BG = "#ccfbf1";
const TEAL_50 = "#f0fdfa";

const ESTADO_META: Record<PostEstado, string> = {
  Pendiente: "bg-edu-warning-bg text-edu-warning",
  Aceptada: "bg-edu-success-bg text-edu-success",
  Rechazada: "bg-edu-danger-bg text-edu-danger",
};

const EVAL_COLS = "grid-cols-[2fr_1fr_0.7fr_0.7fr]";

export function EvalDiscusionEstudiantePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = POSTULACIONES.find((p) => String(p.id) === id);

  if (!post) {
    return (
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-12 text-center">
        <p className="text-edu-ink-500 text-sm m-0">No se encontró la postulación.</p>
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

  const boletin = BOLETINES.find((b) => b.student === post.estudiante);

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
        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-edu-pill text-[0.8rem] font-semibold ${ESTADO_META[post.estado]}`}>
          {post.estado}
        </span>
      </div>

      {/* Cabecera del estudiante */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex items-center gap-4 flex-wrap">
        <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: TEAL_BG }}>
          <User className="w-7 h-7" style={{ color: TEAL }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-edu-ink text-[1.1rem] font-bold m-0">{post.estudiante}</p>
          <p className="text-edu-ink-500 text-[0.85rem] m-0 mt-0.5">
            {post.anio}{boletin ? ` · ${boletin.cedula}` : ""}
          </p>
        </div>
        {boletin && (
          <div className="text-right">
            <div className="text-[0.72rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Promedio general</div>
            <div className={`text-[1.6rem] font-bold leading-none mt-1 ${promedio(boletin.notas) >= 10 ? "text-edu-success" : "text-edu-danger"}`}>
              {promedio(boletin.notas).toFixed(2)}
            </div>
          </div>
        )}
      </div>

      {/* Caso en discusión */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-edu-border-soft flex items-center gap-2">
          <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: TEAL_50 }}>
            <Gavel className="w-4 h-4" style={{ color: TEAL }} />
          </div>
          <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Caso en discusión</h3>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[0.8125rem] text-edu-ink-500">Materia:</span>
            <span className="text-[0.875rem] text-edu-ink font-semibold">{post.materia}</span>
            <span className="inline-flex items-center px-2 py-[2px] rounded-edu-chip text-[0.72rem] font-semibold bg-edu-danger-bg text-edu-danger">Nota actual: {post.nota}</span>
          </div>
          <div>
            <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium mb-1">Justificación</div>
            <p className="text-[0.875rem] text-edu-ink-700 leading-[1.55] m-0">{post.motivo}</p>
          </div>

          {/* Actividades en las que ha participado */}
          <div>
            <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium mb-1.5">Actividades en las que ha participado</div>
            {post.actividades.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {post.actividades.map((a) => (
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

          {post.observacion && (
            <div className={`text-[0.8125rem] rounded-edu-chip px-3 py-2 w-fit ${post.estado === "Rechazada" ? "text-edu-danger bg-edu-danger-bg" : "text-edu-success bg-edu-success-bg"}`}>
              <strong>Decisión del Concejo:</strong> {post.observacion}
            </div>
          )}
        </div>
      </div>

      {/* Notas de todas las materias y sus evaluaciones */}
      <div className="flex items-center gap-2 mt-1">
        <FileSpreadsheet className="w-4 h-4 text-edu-ink-400" />
        <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Notas de todas las materias</h3>
      </div>

      {!boletin ? (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-8 text-center text-edu-ink-400 text-sm">
          No hay un boletín asociado a este estudiante para mostrar sus notas.
        </div>
      ) : (
        MATERIAS.map((m, i) => {
          const evals = desglose(boletin.notas[i]);
          const def = boletin.notas[i];
          const enDiscusion = m === post.materia;
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
        })
      )}
    </div>
  );
}
