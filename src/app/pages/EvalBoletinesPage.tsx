import { useState } from "react";
import { useNavigate } from "react-router";
import {
  FileText,
  FileSpreadsheet,
  Gauge,
  Clock,
  CheckCircle2,
  Download,
  Search,
  X,
  User,
  Users,
  Phone,
} from "lucide-react";
import { Pagination } from "../components/Pagination";
import { useFetch } from "../datos_maquetados";
import { getBoletines, getAnios, getSecciones, getMaterias, type Boletin } from "../datos_maquetados/actions/boletines";
import { promedio, notaColor, notasDe } from "../datos_maquetados/data/boletines";
import { LapsoFilter } from "../components/LapsoFilter";
import { useLapso } from "../context/LapsoContext";
import type { LapsoId } from "../datos_maquetados/data/lapsos";

/* ------------------------------------------------------------------ */
/* Constantes                                                          */
/* ------------------------------------------------------------------ */

const TEAL = "#0d9488";
const TEAL_BG = "#ccfbf1";
const TEAL_50 = "#f0fdfa";

/* Agrupación por año + sección (para la pestaña "Por año / sección") */
interface Grupo {
  label: string;
  estudiantes: number;
  promedio: number;
  recibidos: number;
}

function buildGrupos(boletines: Boletin[], lapso: LapsoId): Grupo[] {
  const map = new Map<string, Boletin[]>();
  for (const b of boletines) {
    const key = `${b.anio} ${b.seccion}`;
    const arr = map.get(key);
    if (arr) arr.push(b);
    else map.set(key, [b]);
  }
  return Array.from(map.entries()).map(([label, items]) => ({
    label,
    estudiantes: items.length,
    promedio: items.reduce((a, b) => a + promedio(notasDe(b, lapso)), 0) / items.length,
    recibidos: items.filter((b) => b.retirado).length,
  }));
}

const GRUPO_COLS = "grid-cols-[2fr_1fr_1fr_1.1fr_1fr]";

const COLS = "grid-cols-[1.7fr_0.9fr_0.7fr_0.8fr_0.9fr_1.5fr]";
const HEADERS = ["Estudiante", "Año", "Sección", "Promedio", "Estado", "Acciones"];
const PER_PAGE = 8;

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function EvalBoletinesPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selAnio, setSelAnio] = useState("todos");
  const [selSeccion, setSelSeccion] = useState("todas");
  const [selMateria, setSelMateria] = useState("todas");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Boletin | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [vista, setVista] = useState<"estudiante" | "seccion">("estudiante");

  const { data: BOLETINES } = useFetch(getBoletines, []);
  const { data: ANIOS } = useFetch(getAnios, []);
  const { data: SECCIONES } = useFetch(getSecciones, []);
  const { data: MATERIAS } = useFetch(getMaterias, []);

  const { selectedId } = useLapso();
  const GRUPOS = buildGrupos(BOLETINES, selectedId);

  // Totales globales (para la sábana por año / sección)
  const recibidosGlobal = BOLETINES.filter((b) => b.retirado).length;
  const promGlobal = BOLETINES.length
    ? (BOLETINES.reduce((a, b) => a + promedio(notasDe(b, selectedId)), 0) / BOLETINES.length).toFixed(2)
    : "—";
  const descargarGrupo = (g: Grupo) => setFeedback(`Se generaron ${g.estudiantes} boletines de ${g.label} en un solo archivo PDF.`);

  // Filtro por selects (año / sección / materia) — base de los KPIs y de la descarga masiva
  const porSelects = BOLETINES.filter((b) => {
    if (selAnio !== "todos" && b.anio !== selAnio) return false;
    if (selSeccion !== "todas" && b.seccion !== selSeccion) return false;
    // Todo boletín incluye todas las materias; el filtro de materia se mantiene disponible.
    if (selMateria !== "todas" && !MATERIAS.includes(selMateria)) return false;
    return true;
  });

  // Búsqueda dentro del filtro
  const filtradas = porSelects.filter(
    (b) => !query.trim() || `${b.student} ${b.representante}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtradas.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtradas.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  // KPIs sobre el filtro seleccionado
  const total = porSelects.length;
  const prom = total ? (porSelects.reduce((a, b) => a + promedio(notasDe(b, selectedId)), 0) / total).toFixed(2) : "—";
  const recibidos = porSelects.filter((b) => b.retirado).length;
  const porEntregar = total - recibidos;

  const KPIS = [
    { label: "Boletines", value: String(total), icon: FileText, foot: "en el filtro actual" },
    { label: "Promedio", value: prom, icon: Gauge, foot: "general del grupo" },
    { label: "Por entregar", value: String(porEntregar), icon: Clock, foot: "aún no retirados" },
    { label: "Recibidos", value: String(recibidos), icon: CheckCircle2, foot: "ya retirados" },
  ];

  const scopeLabel = () => {
    const parts = [selAnio !== "todos" ? selAnio : null, selSeccion !== "todas" ? `Sección ${selSeccion}` : null].filter(Boolean);
    return parts.length ? parts.join(" · ") : "todas las secciones";
  };

  const descargar = (b: Boletin) => setFeedback(`Descargando el boletín de ${b.student} (${b.anio} ${b.seccion}) en PDF…`);
  const descargarTodos = () =>
    setFeedback(`Se generaron ${porSelects.length} boletín(es) de ${scopeLabel()} en un solo archivo PDF.`);

  return (
    <div className="flex flex-col gap-5">
      {/* Aviso de descarga (mock) */}
      {feedback && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-edu-control text-sm font-medium" style={{ backgroundColor: TEAL_50, color: TEAL }}>
          <Download className="w-4 h-4 shrink-0" />
          <span className="flex-1">{feedback}</span>
          <button onClick={() => setFeedback(null)} aria-label="Cerrar" className="bg-transparent border-none cursor-pointer p-0 flex items-center opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Pestañas + filtro de lapso */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="inline-flex gap-1 bg-edu-subtle rounded-edu-control p-1 w-fit">
        {([
          { key: "estudiante", label: "Por estudiante" },
          { key: "seccion", label: "Por año / sección" },
        ] as const).map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setVista(t.key)}
            className={`px-4 py-2 rounded-edu-chip text-[0.8125rem] font-semibold transition-colors cursor-pointer border-none ${vista === t.key ? "bg-edu-surface shadow-[0_1px_3px_rgba(0,0,0,0.08)]" : "bg-transparent text-edu-ink-500 hover:text-edu-ink-700"}`}
            style={vista === t.key ? { color: TEAL } : undefined}
          >
            {t.label}
          </button>
        ))}
      </div>
        <LapsoFilter />
      </div>

      {vista === "estudiante" && (
        <>
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIS.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-edu-ink-500 text-[0.75rem] font-medium m-0 uppercase tracking-[0.05em]">{k.label}</p>
                  <p className="text-[1.6rem] font-bold mt-1.5 m-0 text-edu-ink">{k.value}</p>
                </div>
                <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: TEAL_BG }}>
                  <Icon style={{ width: "20px", height: "20px", color: TEAL }} />
                </div>
              </div>
              <p className="text-edu-ink-400 text-[0.75rem] m-0">{k.foot}</p>
            </div>
          );
        })}
      </div>

      {/* Tabla de boletines */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
          <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Boletines de estudiantes</h3>
          <span className="text-[0.8rem] text-edu-ink-400 font-medium">{filtradas.length} boletines</span>
        </div>

        {/* Buscador + selects + descargar todos */}
        <div className="px-5 py-3 flex gap-2 items-center flex-wrap border-b border-edu-border-soft">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Buscar estudiante o representante…"
              className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-teal-600"
            />
          </div>
          <select
            value={selAnio}
            onChange={(e) => { setSelAnio(e.target.value); setPage(1); }}
            className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-teal-600"
          >
            <option value="todos">Todos los años</option>
            {ANIOS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <select
            value={selSeccion}
            onChange={(e) => { setSelSeccion(e.target.value); setPage(1); }}
            className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-teal-600"
          >
            <option value="todas">Todas las secciones</option>
            {SECCIONES.map((s) => <option key={s} value={s}>Sección {s}</option>)}
          </select>
          <select
            value={selMateria}
            onChange={(e) => { setSelMateria(e.target.value); setPage(1); }}
            className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-teal-600"
          >
            <option value="todas">Todas las materias</option>
            {MATERIAS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <button
            type="button"
            onClick={descargarTodos}
            disabled={porSelects.length === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-edu-control text-[0.8125rem] font-semibold text-white border-none cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: TEAL }}
          >
            <Download className="w-4 h-4" />
            Descargar todos
          </button>
        </div>

        {/* Cabecera + filas (scroll horizontal en móvil) */}
        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
        {/* Cabecera de tabla */}
        <div className={`grid ${COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
          {HEADERS.map((h) => (
            <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
          ))}
        </div>

        {paged.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-edu-ink-400">No hay boletines que coincidan con el filtro.</div>
        ) : (
          paged.map((b, i) => {
            const p = promedio(notasDe(b, selectedId));
            return (
              <div
                key={b.id}
                onClick={() => setSelected(b)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelected(b)}
                className={`grid ${COLS} px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle focus:outline-none focus-visible:bg-edu-subtle ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
              >
                <span className="text-sm text-edu-ink font-medium">{b.student}</span>
                <span className="text-[0.8125rem] text-edu-ink-500">{b.anio}</span>
                <span className="text-[0.8125rem] text-edu-ink-500">{b.seccion}</span>
                <span className={`text-[0.9rem] font-bold ${p >= 10 ? "text-edu-ink" : "text-edu-danger"}`}>{p.toFixed(2)}</span>
                <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${b.retirado ? "bg-edu-success-bg text-edu-success" : "bg-edu-warning-bg text-edu-warning"}`}>
                  {b.retirado ? "Recibido" : "Por entregar"}
                </span>
                <div className="flex items-center gap-1.5 justify-end">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); navigate(`/evaluador/boletines/${b.id}/sabana`); }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-edu-chip text-[0.72rem] font-semibold cursor-pointer transition-colors border-[1.5px] bg-edu-surface hover:bg-edu-subtle"
                    style={{ borderColor: TEAL, color: TEAL }}
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    Sábana
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); descargar(b); }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-edu-chip text-[0.72rem] font-semibold text-white cursor-pointer transition-opacity hover:opacity-90"
                    style={{ backgroundColor: TEAL }}
                  >
                    <Download className="w-3.5 h-3.5" />
                    PDF
                  </button>
                </div>
              </div>
            );
          })
        )}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-edu-border-soft">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>
        </>
      )}

      {/* Pestaña: Boletines / Sábana de notas por año y sección */}
      {vista === "seccion" && (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
            <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Boletines / Sábana de notas</h3>
            <span className="text-[0.8rem] text-edu-ink-400 font-medium">{GRUPOS.length} secciones</span>
          </div>

          {/* Resumen + tabla (scroll horizontal en móvil) */}
          <div className="overflow-x-auto">
            <div className="min-w-[680px]">
          {/* Resumen */}
          <div className="flex gap-0 border-b border-edu-border-soft bg-edu-subtle">
            {[
              { label: "Secciones", value: String(GRUPOS.length), tone: "#0d9488" },
              { label: "Boletines", value: String(BOLETINES.length), tone: "#16a34a" },
              { label: "Recibidos", value: String(recibidosGlobal), tone: "#7c3aed" },
              { label: "Promedio general", value: promGlobal, tone: "#f59e0b" },
            ].map(({ label, value, tone }, i, arr) => (
              <div key={label} className={`flex-1 px-5 py-3.5 flex flex-col gap-1 ${i < arr.length - 1 ? "border-r border-edu-border-soft" : ""}`}>
                <div className="text-[0.72rem] text-edu-ink-400 font-medium uppercase tracking-[0.05em]">{label}</div>
                <div className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ backgroundColor: tone }} />
                  <span className="text-[1.1rem] font-bold text-edu-ink">{value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Tabla agrupada por año / sección */}
          <div className={`grid ${GRUPO_COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
            {["Sección / Año", "Estudiantes", "Promedio", "Estado", "Acciones"].map((h) => (
              <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
            ))}
          </div>
          {GRUPOS.map((g, i) => {
            const entregado = g.recibidos === g.estudiantes;
            return (
              <div key={g.label} className={`grid ${GRUPO_COLS} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < GRUPOS.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
                <span className="text-[0.875rem] text-edu-ink font-medium">{g.label}</span>
                <span className="text-[0.875rem] text-edu-ink-700">{g.estudiantes}</span>
                <span className={`text-[0.9rem] font-bold ${g.promedio >= 10 ? "text-edu-ink" : "text-edu-danger"}`}>{g.promedio.toFixed(2)}</span>
                <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${entregado ? "bg-edu-success-bg text-edu-success" : "bg-edu-warning-bg text-edu-warning"}`}>
                  {entregado ? "Entregado" : `${g.recibidos}/${g.estudiantes} entregados`}
                </span>
                <button
                  type="button"
                  onClick={() => descargarGrupo(g)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-edu-control text-[0.775rem] font-semibold text-white justify-self-start cursor-pointer transition-opacity hover:opacity-90"
                  style={{ backgroundColor: TEAL }}
                >
                  <Download className="w-3.5 h-3.5" />
                  Descargar PDFs
                </button>
              </div>
            );
          })}
            </div>
          </div>
        </div>
      )}

      {/* Modal: detalle del boletín */}
      {selected && (() => {
        const notasSel = notasDe(selected, selectedId);
        const p = promedio(notasSel);
        return (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
            <div className="bg-edu-surface rounded-edu-card w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
              {/* Encabezado */}
              <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: TEAL_BG }}>
                    <User className="w-5 h-5" style={{ color: TEAL }} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem] truncate">{selected.student}</h3>
                    <div className="text-[0.8rem] text-edu-ink-500 mt-0.5">{selected.anio} · Sección {selected.seccion} · {selected.cedula}</div>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700 shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 flex flex-col gap-4">
                {/* Promedio + estado */}
                <div className="flex items-center justify-between px-4 py-3 rounded-edu-control bg-edu-subtle">
                  <div>
                    <div className="text-[0.72rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Promedio</div>
                    <div className={`text-[1.6rem] font-bold leading-none mt-0.5 ${p >= 10 ? "text-edu-success" : "text-edu-danger"}`}>{p.toFixed(2)}</div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-edu-pill text-[0.8rem] font-semibold ${selected.retirado ? "bg-edu-success-bg text-edu-success" : "bg-edu-warning-bg text-edu-warning"}`}>
                    {selected.retirado ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    {selected.retirado ? "Recibido" : "Por entregar"}
                  </span>
                </div>

                {/* Datos del estudiante y representante */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                  <div className="flex items-start gap-2">
                    <Users className="w-4 h-4 text-edu-ink-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Representante</div>
                      <div className="text-[0.875rem] text-edu-ink font-medium">{selected.representante}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-edu-ink-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Teléfono</div>
                      <div className="text-[0.875rem] text-edu-ink font-medium">{selected.telefono}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Cédula</div>
                    <div className="text-[0.875rem] text-edu-ink font-medium">{selected.cedula}</div>
                  </div>
                  <div>
                    <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">¿Retirado?</div>
                    <div className="text-[0.875rem] text-edu-ink font-medium">{selected.retirado ? "Sí, ya lo retiró" : "No, pendiente de entrega"}</div>
                  </div>
                </div>

                {/* Notas por materia */}
                <div>
                  <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium mb-1.5">Notas por materia</div>
                  <div className="rounded-edu-control border border-edu-border-soft overflow-hidden">
                    {MATERIAS.map((m, i) => (
                      <div key={m} className={`flex items-center justify-between px-3.5 py-2 text-[0.8125rem] ${i < MATERIAS.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
                        <span className="text-edu-ink-700">{m}</span>
                        <span className={`font-semibold ${notaColor(notasSel[i])}`}>{notasSel[i]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => descargar(selected)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-edu-control text-sm font-semibold text-white border-none cursor-pointer transition-opacity hover:opacity-90"
                    style={{ backgroundColor: TEAL }}
                  >
                    <Download className="w-4 h-4" />
                    Descargar boletín (PDF)
                  </button>
                  <button
                    onClick={() => navigate(`/evaluador/boletines/${selected.id}/sabana`)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-edu-control text-sm font-semibold border-[1.5px] bg-edu-surface cursor-pointer transition-colors hover:bg-edu-subtle"
                    style={{ borderColor: TEAL, color: TEAL }}
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Sábana de notas
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
