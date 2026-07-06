import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  User,
  Gavel,
  Send,
  CalendarClock,
  CheckCircle2,
  FileSpreadsheet,
  Paperclip,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { useFetch } from "../datos_maquetados";
import { getPostulaciones, postularEstudiante, type PostEstado } from "../datos_maquetados/actions/discusiones";
import { getBoletines, getMaterias, type Boletin, type EvalNota } from "../datos_maquetados/actions/boletines";
import { promedio, notaColor, desglose, actividadesDe } from "../datos_maquetados/data/boletines";

const TEAL = "#0d9488";
const TEAL_BG = "#ccfbf1";
const TEAL_50 = "#f0fdfa";

const ESTADO_META: Record<PostEstado, string> = {
  Pendiente: "bg-edu-warning-bg text-edu-warning",
  Aceptada: "bg-edu-success-bg text-edu-success",
  Rechazada: "bg-edu-danger-bg text-edu-danger",
};

const EVAL_COLS = "grid-cols-[2fr_1fr_0.7fr_0.7fr]";

/* Nombre de archivo (mock) del adjunto de una evaluación. */
function adjuntoNombre(e: EvalNota): string {
  const base = e.nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return `${base || "evaluacion"}.jpg`;
}

/* Imagen (mock) adjunta a una evaluación: simula la foto/escaneo del examen corregido. */
function mockAdjuntoEval(e: EvalNota): string {
  const grade = e.nota < 10 ? "#dc2626" : "#16a34a";
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='440' viewBox='0 0 640 440'>` +
    `<rect width='640' height='440' fill='#ece7dc'/>` +
    `<rect x='36' y='26' width='568' height='388' rx='10' fill='#fffdf7' stroke='#ddd6c6' stroke-width='2'/>` +
    `<text x='70' y='80' font-family='Georgia, serif' font-size='23' fill='#3a3a3a' font-weight='bold'>U.E. Colegio San José</text>` +
    `<text x='70' y='108' font-family='Georgia, serif' font-size='15' fill='#7a7a7a'>${e.tipo} · ${e.nombre}</text>` +
    `<line x1='70' y1='126' x2='430' y2='126' stroke='#e0dacb' stroke-width='2'/>` +
    `<circle cx='530' cy='92' r='44' fill='none' stroke='${grade}' stroke-width='4'/>` +
    `<text x='530' y='102' text-anchor='middle' font-family='Georgia, serif' font-size='32' fill='${grade}' font-weight='bold'>${e.nota}</text>` +
    `<text x='530' y='150' text-anchor='middle' font-family='Arial, sans-serif' font-size='12' fill='#9a9a9a'>/ 20</text>` +
    `<line x1='70' y1='182' x2='560' y2='182' stroke='#eae4d5' stroke-width='2'/>` +
    `<line x1='70' y1='216' x2='560' y2='216' stroke='#eae4d5' stroke-width='2'/>` +
    `<line x1='70' y1='250' x2='560' y2='250' stroke='#eae4d5' stroke-width='2'/>` +
    `<line x1='70' y1='284' x2='430' y2='284' stroke='#eae4d5' stroke-width='2'/>` +
    `<path d='M92 174 q30 -22 60 0 t60 0' fill='none' stroke='#5566aa' stroke-width='2.5' opacity='0.7'/>` +
    `<path d='M92 208 q46 -20 92 0 t92 0' fill='none' stroke='#5566aa' stroke-width='2.5' opacity='0.7'/>` +
    `<path d='M92 242 q30 -18 60 0 t80 0' fill='none' stroke='#5566aa' stroke-width='2.5' opacity='0.7'/>` +
    `<text x='396' y='372' font-family='cursive' font-size='22' fill='#2b6cb0'>Prof. ✓</text>` +
    `</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function EvalDiscusionEstudiantePage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [tab, setTab] = useState("");
  const [postulando, setPostulando] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [fecha, setFecha] = useState("");
  const [evalSel, setEvalSel] = useState<EvalNota | null>(null);

  const { data: POSTULACIONES } = useFetch(getPostulaciones, []);
  const { data: BOLETINES, loading: loadingBoletines } = useFetch(getBoletines, []);
  const { data: MATERIAS, loading: loadingMaterias } = useFetch(getMaterias, []);

  const loading = loadingBoletines || loadingMaterias;
  const b = BOLETINES.find((x) => String(x.id) === id);

  // Materia activa (pestaña). Se toma del query param; si no es válida, la primera.
  const materiaParam = searchParams.get("materia") ?? "";
  useEffect(() => {
    if (MATERIAS.length) setTab(MATERIAS.includes(materiaParam) ? materiaParam : MATERIAS[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MATERIAS, materiaParam]);

  if (loading) {
    return <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">Cargando…</div>;
  }

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
  const idxTab = Math.max(0, MATERIAS.indexOf(tab));
  const notaTab = b.notas[idxTab];
  const evals = desglose(notaTab);

  // ¿Ya está postulado en la materia activa?
  const postulacionActiva = POSTULACIONES.find(
    (p) => p.estudiante === b.student && p.materia === tab && p.anio === `${b.anio} ${b.seccion}`,
  );

  // Navegación entre estudiantes del mismo año (mismo orden que la lista del Concejo).
  const lista = BOLETINES.filter((x) => x.anio === b.anio);
  const pos = lista.findIndex((x) => x.id === b.id);
  const anterior = pos > 0 ? lista[pos - 1] : null;
  const siguiente = pos < lista.length - 1 ? lista[pos + 1] : null;

  const irA = (destino: Boletin | null) => {
    if (destino) navigate(`/evaluador/discusion/concejo/${destino.id}?materia=${encodeURIComponent(tab)}`);
    else navigate("/evaluador/discusion/concejo");
  };

  const confirmarPostulacion = async (e: React.FormEvent) => {
    e.preventDefault();
    await postularEstudiante({
      estudiante: b.student,
      materia: tab,
      anio: `${b.anio} ${b.seccion}`,
      nota: notaTab,
      motivo: motivo.trim() || "—",
      actividades,
      fechaPresentacion: fecha || undefined,
    });
    setPostulando(false);
    setMotivo("");
    setFecha("");
    irA(siguiente); // tras postular, avanza al siguiente estudiante (o vuelve a la lista)
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
        <span className="text-[0.8rem] text-edu-ink-400 font-medium">
          Estudiante {pos + 1} de {lista.length}
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
        </div>
        <div className="text-right">
          <div className="text-[0.72rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Promedio general</div>
          <div className={`text-[1.6rem] font-bold leading-none mt-1 ${prom >= 10 ? "text-edu-success" : "text-edu-danger"}`}>
            {prom.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Actividades extracurriculares */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-4 flex items-center gap-2.5 flex-wrap">
        <span className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-semibold">Actividades:</span>
        {actividades.length > 0 ? (
          actividades.map((a) => (
            <span key={a} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-edu-chip text-[0.75rem] font-medium" style={{ backgroundColor: TEAL_50, color: TEAL }}>
              <Award className="w-3.5 h-3.5" /> {a}
            </span>
          ))
        ) : (
          <span className="text-[0.8125rem] text-edu-ink-400">Sin actividades registradas.</span>
        )}
      </div>

      {/* Notas por materia — pestañas para evitar scroll */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-edu-border-soft flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-edu-ink-400" />
          <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Notas por materia</h3>
          <span className="ml-auto text-[0.72rem] text-edu-ink-400 hidden sm:inline">
            Toca una evaluación para ver su archivo adjunto
          </span>
        </div>

        {/* Pestañas de materias */}
        <div className="flex gap-1 px-5 pt-3 border-b border-edu-border-soft overflow-x-auto">
          {MATERIAS.map((m) => {
            const activa = m === tab;
            return (
              <button
                key={m}
                type="button"
                onClick={() => setTab(m)}
                className={`px-3.5 py-2 text-[0.8125rem] font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors cursor-pointer bg-transparent ${activa ? "" : "border-transparent text-edu-ink-500 hover:text-edu-ink-700"}`}
                style={activa ? { color: TEAL, borderColor: TEAL } : undefined}
              >
                {m}
              </button>
            );
          })}
        </div>

        {/* Nota definitiva + estado de postulación de la materia activa */}
        <div className="px-5 pt-4 pb-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-[0.9rem] text-edu-ink font-semibold">{tab}</span>
            {postulacionActiva && (
              <span className={`inline-flex items-center px-2 py-[2px] rounded-edu-pill text-[0.65rem] font-semibold ${ESTADO_META[postulacionActiva.estado]}`}>
                {postulacionActiva.estado === "Pendiente" ? "Postulado · Pendiente" : postulacionActiva.estado}
              </span>
            )}
          </div>
          <span className="text-[0.8125rem] text-edu-ink-500">
            Definitiva: <strong className={`text-[0.95rem] ${notaColor(notaTab)}`}>{notaTab}</strong>
            <span className="text-edu-ink-400"> / 20</span>
          </span>
        </div>

        {/* Desglose de evaluaciones de la materia activa */}
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <div className={`grid ${EVAL_COLS} px-5 py-2.5 bg-edu-subtle border-y border-edu-border-soft`}>
              {["Evaluación", "Tipo", "%", "Nota"].map((h, j) => (
                <span key={h} className={`text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em] ${j >= 2 ? "text-right" : ""}`}>{h}</span>
              ))}
            </div>
            {evals.map((e, j) => (
              <div
                key={j}
                onClick={() => setEvalSel(e)}
                role="button"
                tabIndex={0}
                onKeyDown={(ev) => (ev.key === "Enter" || ev.key === " ") && setEvalSel(e)}
                className={`grid ${EVAL_COLS} px-5 py-[11px] items-center cursor-pointer transition-colors hover:bg-edu-subtle focus:outline-none focus-visible:bg-edu-subtle ${j < evals.length - 1 ? "border-b border-edu-border-soft" : ""}`}
              >
                <span className="text-[0.875rem] text-edu-ink font-medium inline-flex items-center gap-1.5">
                  {e.nombre}
                  <Paperclip className="w-3.5 h-3.5 text-edu-ink-300 shrink-0" />
                </span>
                <span className="text-[0.8125rem] text-edu-ink-700">{e.tipo}</span>
                <span className="text-[0.8125rem] text-edu-ink-500 text-right">{e.porcentaje}%</span>
                <span className={`text-[0.9rem] font-bold text-right ${notaColor(e.nota)}`}>{e.nota}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decisión: postular o dejar como está */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {postulacionActiva ? (
          <div className="inline-flex items-center justify-center gap-2 py-3.5 rounded-edu-card text-sm font-semibold bg-edu-success-bg text-edu-success">
            <CheckCircle2 className="w-5 h-5" /> Ya postulado en {tab}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setPostulando(true)}
            className="inline-flex items-center justify-center gap-2.5 py-3.5 rounded-edu-card text-white text-[0.95rem] font-bold border-none cursor-pointer transition-opacity hover:opacity-90 shadow-[0_2px_8px_rgba(13,148,136,0.25)]"
            style={{ backgroundColor: TEAL }}
          >
            <Gavel className="w-5 h-5" /> Postular al Concejo
          </button>
        )}
        <button
          type="button"
          onClick={() => irA(siguiente)}
          className="inline-flex items-center justify-center gap-2.5 py-3.5 rounded-edu-card text-edu-ink-700 text-[0.95rem] font-bold border-[1.5px] border-edu-border bg-edu-surface cursor-pointer transition-colors hover:bg-edu-subtle"
        >
          Dejar como está
        </button>
      </div>

      {/* Navegación entre estudiantes */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => irA(anterior)}
          disabled={!anterior}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold transition-colors enabled:cursor-pointer enabled:hover:bg-edu-subtle disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" /> Atrás
        </button>
        <button
          type="button"
          onClick={() => irA(siguiente)}
          disabled={!siguiente}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold transition-opacity enabled:cursor-pointer enabled:hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: TEAL }}
        >
          Siguiente <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Modal: postular al Concejo */}
      {postulando && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setPostulando(false)}>
          <form onSubmit={confirmarPostulacion} className="bg-edu-surface rounded-edu-card w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: TEAL_50 }}>
                  <Gavel className="w-4 h-4" style={{ color: TEAL }} />
                </div>
                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Postular al Concejo</h3>
              </div>
              <button type="button" onClick={() => setPostulando(false)} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
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
              <div className="flex flex-col gap-1.5">
                <label className="text-edu-ink-700 text-sm font-medium">Justificación</label>
                <textarea
                  rows={3}
                  required
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Motivo por el que se postula al estudiante ante el Concejo…"
                  className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full resize-none focus:border-teal-600"
                />
              </div>
            </div>
            <div className="px-5 py-3.5 border-t border-edu-border-soft flex gap-2 justify-end">
              <button type="button" onClick={() => setPostulando(false)} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer hover:bg-edu-subtle">
                Cancelar
              </button>
              <button type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold border-none cursor-pointer transition-opacity hover:opacity-90" style={{ backgroundColor: TEAL }}>
                <Send className="w-4 h-4" /> Enviar postulación
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: detalle de la evaluación + archivo adjunto (mock) */}
      {evalSel && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setEvalSel(null)}>
          <div className="bg-edu-surface rounded-edu-card w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
            {/* Encabezado */}
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: TEAL_50 }}>
                  <FileSpreadsheet className="w-4 h-4" style={{ color: TEAL }} />
                </div>
                <div className="min-w-0">
                  <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem] truncate">{evalSel.nombre}</h3>
                  <div className="text-[0.75rem] text-edu-ink-500 truncate">{tab} · {b.student}</div>
                </div>
              </div>
              <button type="button" onClick={() => setEvalSel(null)} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700 shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              {/* Información de la nota */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-edu-control border border-edu-border-soft px-3.5 py-3">
                  <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Tipo</div>
                  <div className="text-[0.875rem] text-edu-ink font-semibold mt-0.5">{evalSel.tipo}</div>
                </div>
                <div className="rounded-edu-control border border-edu-border-soft px-3.5 py-3">
                  <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Ponderación</div>
                  <div className="text-[0.875rem] text-edu-ink font-semibold mt-0.5">{evalSel.porcentaje}%</div>
                </div>
                <div className="rounded-edu-control border border-edu-border-soft px-3.5 py-3">
                  <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Nota</div>
                  <div className={`text-[0.95rem] font-bold mt-0.5 ${notaColor(evalSel.nota)}`}>
                    {evalSel.nota} <span className="text-edu-ink-400 text-[0.75rem] font-medium">/ 20</span>
                  </div>
                </div>
              </div>

              {/* Archivo adjunto (mock) */}
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-edu-ink-400" />
                  <span className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Archivo adjunto</span>
                </div>
                <div className="rounded-edu-control border border-edu-border-soft overflow-hidden bg-edu-subtle">
                  <img src={mockAdjuntoEval(evalSel)} alt={`Adjunto de ${evalSel.nombre}`} className="w-full block" />
                  <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 border-t border-edu-border-soft bg-edu-surface">
                    <div className="flex items-center gap-2 min-w-0">
                      <ImageIcon className="w-4 h-4 text-edu-ink-400 shrink-0" />
                      <span className="text-[0.8125rem] text-edu-ink-700 truncate">{adjuntoNombre(evalSel)}</span>
                    </div>
                    <span className="text-[0.72rem] text-edu-ink-400 shrink-0">JPG · 1.2 MB</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-3.5 border-t border-edu-border-soft flex justify-end">
              <button type="button" onClick={() => setEvalSel(null)} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer hover:bg-edu-subtle">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
