import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Gavel,
  UserPlus,
  Award,
  X,
  MessageSquare,
  ArrowLeft,
  ChevronRight,
  CalendarClock,
  Eye,
  Search,
} from "lucide-react";
import { POSTULACIONES, fmtFechaPost, ANIOS_DISCUSION, type PostEstado } from "../data/discusiones";
import { BOLETINES, ANIOS, SECCIONES, promedio } from "../data/boletines";

const TEAL = "#0d9488";
const TEAL_BG = "#ccfbf1";
const TEAL_50 = "#f0fdfa";

const ESTADO_META: Record<PostEstado, string> = {
  Pendiente: "bg-edu-warning-bg text-edu-warning",
  Aceptada: "bg-edu-success-bg text-edu-success",
  Rechazada: "bg-edu-danger-bg text-edu-danger",
};

/* Año y sección por separado, derivados de ANIOS_DISCUSION ("4.º Año A") */
const anioDe = (s: string) => s.split(" ").slice(0, -1).join(" ");
const seccionDe = (s: string) => s.split(" ").slice(-1)[0];
const ANIOS_SOLO = Array.from(new Set(ANIOS_DISCUSION.map(anioDe)));
const SECCIONES_SOLO = Array.from(new Set(ANIOS_DISCUSION.map(seccionDe)));

export function EvalConcejoDiscusionPage() {
  const navigate = useNavigate();
  const [selAnio, setSelAnio] = useState("todos");
  const [selSeccion, setSelSeccion] = useState("todas");

  // Selector para postular un estudiante
  const [showPicker, setShowPicker] = useState(false);
  const [pickAnio, setPickAnio] = useState(ANIOS[0]);
  const [pickSeccion, setPickSeccion] = useState(SECCIONES[0]);
  const [pickQuery, setPickQuery] = useState("");

  const filtradas = POSTULACIONES.filter((p) => {
    if (selAnio !== "todos" && anioDe(p.anio) !== selAnio) return false;
    if (selSeccion !== "todas" && seccionDe(p.anio) !== selSeccion) return false;
    return true;
  });

  const pendientes = filtradas.filter((p) => p.estado === "Pendiente").length;

  // Estudiantes del año / sección elegidos en el selector
  const estudiantesPicker = BOLETINES.filter(
    (b) =>
      b.anio === pickAnio &&
      b.seccion === pickSeccion &&
      (!pickQuery.trim() || b.student.toLowerCase().includes(pickQuery.trim().toLowerCase())),
  );

  const abrirPicker = () => {
    setShowPicker(true);
    setPickQuery("");
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Barra superior */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={() => navigate("/evaluador/discusion")}
          className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-edu-ink-500 hover:text-edu-ink-700 bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a discusión de notas
        </button>
      </div>

      {/* Encabezado */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-edu-card flex items-center justify-center shrink-0" style={{ backgroundColor: TEAL_BG }}>
            <Gavel className="w-7 h-7" style={{ color: TEAL }} />
          </div>
          <div>
            <p className="text-edu-ink text-[1.05rem] font-bold m-0">Concejo de Profesores</p>
            <p className="text-edu-ink-500 text-[0.85rem] m-0 mt-0.5">
              {pendientes} postulacion{pendientes === 1 ? "" : "es"} en espera de la decisión de los docentes
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={abrirPicker}
          className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold text-white border-none cursor-pointer transition-opacity hover:opacity-90"
          style={{ backgroundColor: TEAL }}
        >
          <UserPlus className="w-4 h-4" />
          Postular estudiante
        </button>
      </div>

      {/* Filtros por año / sección */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-3 flex gap-2 items-center flex-wrap">
        <span className="text-[0.8125rem] text-edu-ink-500 font-medium mr-1">Filtrar por:</span>
        <select
          value={selAnio}
          onChange={(e) => setSelAnio(e.target.value)}
          className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-teal-600"
        >
          <option value="todos">Todos los años</option>
          {ANIOS_SOLO.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <select
          value={selSeccion}
          onChange={(e) => setSelSeccion(e.target.value)}
          className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-teal-600"
        >
          <option value="todas">Todas las secciones</option>
          {SECCIONES_SOLO.map((s) => <option key={s} value={s}>Sección {s}</option>)}
        </select>
        <span className="text-[0.8rem] text-edu-ink-400 ml-auto">{filtradas.length} postulaciones</span>
      </div>

      {/* Lista de postulaciones (clic → detalle del estudiante) */}
      <div className="flex flex-col gap-3.5">
        {filtradas.length === 0 && (
          <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-10 text-center text-edu-ink-400 text-sm">
            No hay postulaciones para el filtro seleccionado.
          </div>
        )}
        {filtradas.map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/evaluador/discusion/concejo/${p.id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && navigate(`/evaluador/discusion/concejo/${p.id}`)}
            className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex flex-col gap-3 cursor-pointer transition-colors hover:border-edu-primary-200 focus:outline-none focus-visible:border-edu-primary-200"
          >
            <div className="flex justify-between items-start gap-3 flex-wrap">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-[0.95rem] font-semibold text-edu-ink">{p.estudiante}</span>
                  <span className="text-[0.8125rem] text-edu-ink-500">{p.materia} · {p.anio}</span>
                  <span className="inline-flex items-center px-2 py-[2px] rounded-edu-chip text-[0.72rem] font-semibold bg-edu-danger-bg text-edu-danger">Nota: {p.nota}</span>
                </div>
                <p className="text-[0.85rem] text-edu-ink-700 m-0 mt-2 max-w-2xl">{p.motivo}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${ESTADO_META[p.estado]}`}>{p.estado}</span>
                <ChevronRight className="w-4 h-4 text-edu-ink-300" />
              </div>
            </div>

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

            {p.estado === "Pendiente" && p.fechaPresentacion && (
              <div className="inline-flex items-center gap-1.5 text-[0.78rem] text-edu-ink-500 w-fit">
                <CalendarClock className="w-3.5 h-3.5 text-edu-ink-400" />
                Se presentará al Concejo el <strong className="text-edu-ink-700">{fmtFechaPost(p.fechaPresentacion)}</strong>
              </div>
            )}

            {p.observacion && (
              <div className={`flex items-start gap-1.5 text-xs rounded-edu-chip px-2.5 py-1.5 w-fit ${p.estado === "Rechazada" ? "text-edu-danger bg-edu-danger-bg" : "text-edu-success bg-edu-success-bg"}`}>
                <MessageSquare className="w-3.5 h-3.5 shrink-0 mt-px" />
                {p.observacion}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal: seleccionar estudiante para postular */}
      {showPicker && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowPicker(false)}>
          <div className="bg-edu-surface rounded-edu-card w-full max-w-lg max-h-[90vh] flex flex-col shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: TEAL_50 }}>
                  <UserPlus className="w-4 h-4" style={{ color: TEAL }} />
                </div>
                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Postular estudiante</h3>
              </div>
              <button onClick={() => setShowPicker(false)} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Selección de año / sección */}
            <div className="px-5 py-3 border-b border-edu-border-soft flex flex-col gap-2.5">
              <p className="m-0 text-[0.8125rem] text-edu-ink-500">Elige el año y la sección para ver la lista de estudiantes.</p>
              <div className="flex gap-2 flex-wrap">
                <select
                  value={pickAnio}
                  onChange={(e) => setPickAnio(e.target.value)}
                  className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-teal-600"
                >
                  {ANIOS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
                <select
                  value={pickSeccion}
                  onChange={(e) => setPickSeccion(e.target.value)}
                  className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-teal-600"
                >
                  {SECCIONES.map((s) => <option key={s} value={s}>Sección {s}</option>)}
                </select>
                <div className="relative flex-1 min-w-[150px]">
                  <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={pickQuery}
                    onChange={(e) => setPickQuery(e.target.value)}
                    placeholder="Buscar estudiante…"
                    className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-teal-600"
                  />
                </div>
              </div>
            </div>

            {/* Lista de estudiantes */}
            <div className="overflow-y-auto flex-1">
              {estudiantesPicker.length === 0 ? (
                <div className="px-5 py-10 text-center text-sm text-edu-ink-400">
                  No hay estudiantes en {pickAnio} · Sección {pickSeccion}.
                </div>
              ) : (
                estudiantesPicker.map((b, i, arr) => (
                  <div key={b.id} className={`px-5 py-3 flex items-center justify-between gap-3 ${i < arr.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-[0.78rem] font-bold shrink-0" style={{ backgroundColor: TEAL_50, color: TEAL }}>
                        {b.student.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-edu-ink truncate">{b.student}</div>
                        <div className="text-[0.78rem] text-edu-ink-500">
                          {b.anio} · Sección {b.seccion} · Prom. {promedio(b.notas).toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(`/evaluador/discusion/postular/${b.id}`)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-edu-control text-[0.8125rem] font-semibold text-white border-none cursor-pointer transition-opacity hover:opacity-90 shrink-0"
                      style={{ backgroundColor: TEAL }}
                    >
                      <Eye className="w-4 h-4" />
                      Ver
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
