import { useNavigate } from "react-router";
import { Gavel, ArrowRight, Award } from "lucide-react";
import { POSTULACIONES, type PostEstado } from "../data/discusiones";

const TEAL = "#0d9488";
const TEAL_BG = "#ccfbf1";
const TEAL_50 = "#f0fdfa";

const ESTADO_META: Record<PostEstado, string> = {
  Pendiente: "bg-edu-warning-bg text-edu-warning",
  Aceptada: "bg-edu-success-bg text-edu-success",
  Rechazada: "bg-edu-danger-bg text-edu-danger",
};

export function EvalDiscusionPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-5">
      {/* Encabezado + acceso al Concejo */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-edu-card flex items-center justify-center shrink-0" style={{ backgroundColor: TEAL_BG }}>
            <Gavel className="w-7 h-7" style={{ color: TEAL }} />
          </div>
          <div>
            <p className="text-edu-ink text-[1.05rem] font-bold m-0">Discusión de notas</p>
            <p className="text-edu-ink-500 text-[0.85rem] m-0 mt-0.5">Modificaciones de notas hechas a los estudiantes</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/evaluador/discusion/concejo")}
          className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold text-white border-none cursor-pointer transition-opacity hover:opacity-90"
          style={{ backgroundColor: TEAL }}
        >
          <Gavel className="w-4 h-4" />
          Discusión de notas — Concejo de profesores
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Lista de discusiones (diseño de tarjetas) */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
          <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Estudiantes postulados al Concejo</h3>
          <span className="text-[0.8rem] text-edu-ink-400 font-medium">{POSTULACIONES.length} casos</span>
        </div>
        <div className="flex flex-col">
          {POSTULACIONES.map((p, i, arr) => (
            <div key={p.id} className={`px-5 py-4 flex gap-3.5 items-start ${i < arr.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
              <div className="w-[42px] h-[42px] rounded-full flex items-center justify-center text-[0.85rem] font-bold shrink-0" style={{ backgroundColor: TEAL_50, color: TEAL }}>
                {p.estudiante.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[0.9rem] font-bold text-edu-ink">{p.estudiante}</span>
                  <span className="text-[0.7rem] font-semibold px-2 py-0.5 rounded-edu-pill bg-edu-subtle text-edu-ink-500">{p.anio} · {p.materia}</span>
                  <span className="inline-flex items-center px-2 py-[2px] rounded-edu-chip text-[0.72rem] font-semibold bg-edu-danger-bg text-edu-danger">Nota: {p.nota}</span>
                </div>
                <p className="mt-1.5 mb-0 text-[0.8125rem] text-edu-ink-700 leading-[1.55]">{p.motivo}</p>
                {p.actividades.length > 0 && (
                  <div className="flex gap-1.5 mt-2.5 flex-wrap items-center">
                    <span className="text-[0.7rem] text-edu-ink-400 font-medium">Actividades:</span>
                    {p.actividades.map((a) => (
                      <span key={a} className="inline-flex items-center gap-[5px] px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold" style={{ backgroundColor: TEAL_50, color: TEAL }}>
                        <Award className="w-3 h-3" /> {a}
                      </span>
                    ))}
                  </div>
                )}
                {p.observacion && (
                  <div className={`mt-2.5 text-xs rounded-edu-chip px-2.5 py-1.5 w-fit ${p.estado === "Rechazada" ? "text-edu-danger bg-edu-danger-bg" : "text-edu-success bg-edu-success-bg"}`}>
                    {p.observacion}
                  </div>
                )}
              </div>
              <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit shrink-0 ${ESTADO_META[p.estado]}`}>{p.estado}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
