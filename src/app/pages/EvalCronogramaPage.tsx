import { useState } from "react";
import { useNavigate } from "react-router";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  CalendarClock,
  Pencil,
  Search,
  X,
  Save,
} from "lucide-react";
import { Pagination } from "../components/Pagination";
import { PLANES, ESTADO_LABEL, fmtFecha, fmtFechaLarga, type PlanEstado } from "../data/cronograma";

/* ------------------------------------------------------------------ */
/* Constantes                                                          */
/* ------------------------------------------------------------------ */

const TEAL = "#0d9488";
const TEAL_BG = "#ccfbf1";
const TEAL_50 = "#f0fdfa";

const ESTADO_PLAN: Record<PlanEstado, string> = {
  "en revisión": "bg-edu-warning-bg text-edu-warning",
  activo: "bg-edu-success-bg text-edu-success",
};

const COLS = "grid-cols-[1.2fr_0.9fr_1.3fr_2.2fr_1fr]";
const HEADERS = ["Materia", "Sección", "Docente", "Fechas de evaluación", "Estado"];
const PER_PAGE = 6;
const TODAY = "2026-07-20";

function diasEntre(a: string, b: string): number {
  const da = new Date(a + "T00:00:00").getTime();
  const db = new Date(b + "T00:00:00").getTime();
  return Math.round((db - da) / 86400000);
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function EvalCronogramaPage() {
  const navigate = useNavigate();

  // Cronograma / lapso en curso
  const [lapso, setLapso] = useState({ nombre: "Lapso II · 2026-I", inicio: "2026-07-01", cierre: "2026-07-31", min: 5, max: 15 });
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState(lapso);

  // Tabla
  const [query, setQuery] = useState("");
  const [estadoFilter, setEstadoFilter] = useState<"todos" | PlanEstado>("todos");
  const [page, setPage] = useState(1);

  // KPIs
  const totalEvals = PLANES.reduce((a, p) => a + p.evaluaciones.length, 0);
  const realizadas = PLANES.reduce((a, p) => a + p.evaluaciones.filter((e) => e.fecha <= TODAY).length, 0);

  const diasTotal = Math.max(1, diasEntre(lapso.inicio, lapso.cierre));
  const diasTrans = Math.min(diasTotal, Math.max(0, diasEntre(lapso.inicio, TODAY)));
  const progreso = Math.round((diasTrans / diasTotal) * 100);

  const KPIS = [
    { label: "Fecha de hoy", value: fmtFechaLarga(TODAY), icon: CalendarDays, foot: lapso.nombre },
    { label: "Tiempo transcurrido del lapso", value: `${progreso} %`, icon: Clock, foot: `Cierra el ${fmtFechaLarga(lapso.cierre)}` },
    { label: "Evaluaciones realizadas", value: String(realizadas), icon: CheckCircle2, foot: `de ${totalEvals} programadas` },
  ];

  // Filtro + paginación
  const filtradas = PLANES.filter((p) => {
    if (estadoFilter !== "todos" && p.estado !== estadoFilter) return false;
    if (query.trim() && !`${p.materia} ${p.seccion} ${p.docente}`.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  });
  const totalPages = Math.max(1, Math.ceil(filtradas.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtradas.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const openEdit = () => { setForm(lapso); setShowEdit(true); };
  const guardar = (e: React.FormEvent) => {
    e.preventDefault();
    setLapso({ ...form, min: Number(form.min) || 0, max: Number(form.max) || 0 });
    setShowEdit(false);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
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

      {/* Cronograma de evaluación (con botón Modificar) */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center gap-3">
          <div>
            <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Cronograma de evaluación</h3>
            <p className="mt-0.5 mb-0 text-edu-ink-400 text-[0.775rem]">Lapso académico en curso</p>
          </div>
          <button
            onClick={openEdit}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-edu-control text-[0.8125rem] font-semibold text-white border-none cursor-pointer transition-opacity hover:opacity-90"
            style={{ backgroundColor: TEAL }}
          >
            <Pencil className="w-3.5 h-3.5" />
            Modificar
          </button>
        </div>
        <div className="p-5 flex flex-col gap-[18px]">
          <div className="flex justify-between items-start flex-wrap gap-2.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[1.1rem] font-bold text-edu-ink">{lapso.nombre}</span>
                <span className="inline-flex items-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold" style={{ backgroundColor: TEAL_BG, color: TEAL }}>En curso</span>
              </div>
              <p className="mt-1 mb-0 text-[0.8rem] text-edu-ink-500">
                Cierre del lapso: <strong className="text-edu-ink-700">{fmtFechaLarga(lapso.cierre)}</strong>
              </p>
            </div>
            <div className="text-right">
              <div className="text-[1.4rem] font-bold" style={{ color: TEAL }}>{progreso} %</div>
              <div className="text-[0.72rem] text-edu-ink-400">del lapso transcurrido</div>
            </div>
          </div>

          {/* Barra de progreso / timeline */}
          <div className="flex flex-col gap-1.5">
            <div className="h-2.5 bg-edu-border-soft rounded-edu-pill overflow-hidden">
              <div className="h-full rounded-edu-pill" style={{ width: `${progreso}%`, backgroundColor: TEAL }} />
            </div>
            <div className="flex justify-between text-[0.7rem] text-edu-ink-400">
              <span>{fmtFecha(lapso.inicio)}</span>
              <span>Hoy · {fmtFecha(TODAY)}</span>
              <span>{fmtFecha(lapso.cierre)}</span>
            </div>
          </div>

          {/* Reglas de tiempo */}
          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-[150px] rounded-edu-chip px-3.5 py-3 flex items-center gap-2.5" style={{ backgroundColor: TEAL_50 }}>
              <CalendarClock style={{ width: "18px", height: "18px", color: TEAL, flexShrink: 0 }} />
              <div>
                <div className="text-[0.72rem] text-edu-ink-500 font-medium">Separación mínima</div>
                <div className="text-[0.9rem] text-edu-ink font-bold">{lapso.min} días entre evaluaciones</div>
              </div>
            </div>
            <div className="flex-1 min-w-[150px] bg-edu-warning-bg rounded-edu-chip px-3.5 py-3 flex items-center gap-2.5">
              <CalendarClock className="text-edu-warning" style={{ width: "18px", height: "18px", flexShrink: 0 }} />
              <div>
                <div className="text-[0.72rem] text-edu-ink-500 font-medium">Separación máxima</div>
                <div className="text-[0.9rem] text-edu-ink font-bold">{lapso.max} días entre evaluaciones</div>
              </div>
            </div>
          </div>
          <p className="m-0 text-[0.775rem] text-edu-ink-400">
            Regla vigente: Mín. {lapso.min} días · Máx. {lapso.max} días entre evaluaciones.
          </p>
        </div>
      </div>

      {/* Calendario por materia y sección */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
          <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Calendario por materia y sección</h3>
          <span className="text-[0.8rem] text-edu-ink-400 font-medium">{filtradas.length} programaciones</span>
        </div>

        {/* Buscador y filtro */}
        <div className="px-5 py-3 flex gap-2 items-center flex-wrap border-b border-edu-border-soft">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Buscar materia, sección o docente…"
              className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-teal-600"
            />
          </div>
          <select
            value={estadoFilter}
            onChange={(e) => { setEstadoFilter(e.target.value as "todos" | PlanEstado); setPage(1); }}
            className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-teal-600"
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="en revisión">En revisión</option>
          </select>
        </div>

        {/* Cabecera de tabla */}
        <div className={`grid ${COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
          {HEADERS.map((h) => (
            <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
          ))}
        </div>

        {paged.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-edu-ink-400">No hay programaciones que coincidan con el filtro.</div>
        ) : (
          paged.map((p, i) => {
            const ordenadas = [...p.evaluaciones].sort((a, b) => a.fecha.localeCompare(b.fecha));
            return (
              <div
                key={p.id}
                onClick={() => navigate(`/evaluador/cronograma/${p.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && navigate(`/evaluador/cronograma/${p.id}`)}
                className={`grid ${COLS} px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle focus:outline-none focus-visible:bg-edu-subtle ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
              >
                <span className="text-sm text-edu-ink font-medium">{p.materia}</span>
                <span className="text-[0.8125rem] text-edu-ink-500">{p.seccion}</span>
                <span className="text-[0.8125rem] text-edu-ink-500">{p.docente}</span>
                <div className="flex flex-wrap gap-1.5">
                  {ordenadas.map((e) => (
                    <span
                      key={e.fecha}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-edu-chip text-[0.72rem] font-medium border border-edu-border-soft bg-edu-subtle text-edu-ink-700"
                    >
                      <CalendarDays className="w-3 h-3" />
                      {fmtFecha(e.fecha)}
                    </span>
                  ))}
                </div>
                <span className={`inline-flex items-center justify-center px-2.5 py-[4px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${ESTADO_PLAN[p.estado]}`}>
                  {ESTADO_LABEL[p.estado]}
                </span>
              </div>
            );
          })
        )}

        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-edu-border-soft">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* Modal: modificar cronograma */}
      {showEdit && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowEdit(false)}>
          <div className="bg-edu-surface rounded-edu-card w-full max-w-md shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: TEAL_50 }}>
                  <Pencil className="w-4 h-4" style={{ color: TEAL }} />
                </div>
                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Modificar cronograma</h3>
              </div>
              <button onClick={() => setShowEdit(false)} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={guardar} className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-edu-ink-700 text-sm font-medium">Nombre del lapso</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-teal-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-edu-ink-700 text-sm font-medium">Inicio</label>
                  <input
                    type="date"
                    value={form.inicio}
                    onChange={(e) => setForm({ ...form, inicio: e.target.value })}
                    className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-teal-600"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-edu-ink-700 text-sm font-medium">Cierre</label>
                  <input
                    type="date"
                    value={form.cierre}
                    onChange={(e) => setForm({ ...form, cierre: e.target.value })}
                    className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-teal-600"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-edu-ink-700 text-sm font-medium">Separación mínima (días)</label>
                  <input
                    type="number"
                    min={1}
                    value={form.min}
                    onChange={(e) => setForm({ ...form, min: Number(e.target.value) })}
                    className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-teal-600"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-edu-ink-700 text-sm font-medium">Separación máxima (días)</label>
                  <input
                    type="number"
                    min={1}
                    value={form.max}
                    onChange={(e) => setForm({ ...form, max: Number(e.target.value) })}
                    className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-teal-600"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <button type="button" onClick={() => setShowEdit(false)} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle">
                  Cancelar
                </button>
                <button type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold border-none cursor-pointer transition-opacity hover:opacity-90" style={{ backgroundColor: TEAL }}>
                  <Save className="w-4 h-4" />
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
