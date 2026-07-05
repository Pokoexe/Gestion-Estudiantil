import { useState } from "react";
import { useNavigate } from "react-router";
import { Gavel, ArrowLeft, ChevronRight, Search, Users } from "lucide-react";
import { Pagination } from "../components/Pagination";
import { POSTULACIONES } from "../data/discusiones";
import { BOLETINES, ANIOS, promedio, notaColor, type Boletin } from "../data/boletines";

const TEAL = "#0d9488";
const TEAL_BG = "#ccfbf1";
const TEAL_50 = "#f0fdfa";

const COLS = "grid-cols-[1.8fr_0.8fr_0.8fr_1fr_0.5fr]";
const HEADERS = ["Estudiante", "Sección", "Promedio", "Estado", ""];
const PER_PAGE = 8;

export function EvalConcejoDiscusionPage() {
  const navigate = useNavigate();
  const [selAnio, setSelAnio] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  // Basta con elegir el año para mostrar la lista de estudiantes.
  const listo = selAnio !== "";

  // Estudiantes del año elegido (todas las secciones), estén o no postulados.
  const estudiantes = listo ? BOLETINES.filter((b) => b.anio === selAnio) : [];
  const filtrados = estudiantes.filter(
    (b) => !query.trim() || b.student.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtrados.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtrados.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const estaPostulado = (b: Boletin) =>
    POSTULACIONES.some(
      (p) => p.estudiante === b.student && p.anio === `${b.anio} ${b.seccion}`,
    );

  const abrirEstudiante = (b: Boletin) =>
    navigate(`/evaluador/discusion/concejo/${b.id}`);

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
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex items-center gap-4 flex-wrap">
        <div className="w-14 h-14 rounded-edu-card flex items-center justify-center shrink-0" style={{ backgroundColor: TEAL_BG }}>
          <Gavel className="w-7 h-7" style={{ color: TEAL }} />
        </div>
        <div>
          <p className="text-edu-ink text-[1.05rem] font-bold m-0">Concejo de Profesores</p>
          <p className="text-edu-ink-500 text-[0.85rem] m-0 mt-0.5">
            Elige un año para revisar a los estudiantes y postularlos al Concejo
          </p>
        </div>
      </div>

      {/* Selección obligatoria: año */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-4 flex gap-3 items-end flex-wrap">
        <div className="flex flex-col gap-1.5">
          <label className="text-edu-ink-700 text-[0.8125rem] font-medium">Año</label>
          <select
            value={selAnio}
            onChange={(e) => { setSelAnio(e.target.value); setPage(1); }}
            className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-teal-600 min-w-[160px]"
          >
            <option value="">Selecciona un año…</option>
            {ANIOS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      {!listo ? (
        /* Estado vacío: aún no se ha elegido año */
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-14 text-center flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: TEAL_50 }}>
            <Users className="w-6 h-6" style={{ color: TEAL }} />
          </div>
          <p className="text-edu-ink font-semibold text-[0.95rem] m-0">Selecciona un año</p>
          <p className="text-edu-ink-400 text-[0.8125rem] m-0 max-w-sm">
            Para ver la lista de estudiantes y decidir a quiénes postular al Concejo, primero elige un año.
          </p>
        </div>
      ) : (
        /* Tabla de estudiantes (diseño estándar con buscador + paginación) */
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
            <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">
              Estudiantes · {selAnio}
            </h3>
            <span className="text-[0.8rem] text-edu-ink-400 font-medium">
              {filtrados.length} estudiante{filtrados.length === 1 ? "" : "s"}
            </span>
          </div>

          {/* Buscador */}
          <div className="px-5 py-3 border-b border-edu-border-soft">
            <div className="relative">
              <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Buscar estudiante…"
                className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-teal-600"
              />
            </div>
          </div>

          {/* Cabecera de tabla */}
          <div className={`grid ${COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
            {HEADERS.map((h, i) => (
              <span key={i} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
            ))}
          </div>

          {paged.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-edu-ink-400">
              No hay estudiantes que coincidan con la búsqueda.
            </div>
          ) : (
            paged.map((b, i) => {
              const prom = promedio(b.notas);
              const postulado = estaPostulado(b);
              return (
                <div
                  key={b.id}
                  onClick={() => abrirEstudiante(b)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && abrirEstudiante(b)}
                  className={`grid ${COLS} px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle focus:outline-none focus-visible:bg-edu-subtle ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                >
                  <span className="text-sm text-edu-ink font-medium">{b.student}</span>
                  <span className="text-[0.8125rem] text-edu-ink-500">{b.seccion}</span>
                  <span className={`text-[0.9rem] font-bold ${notaColor(prom)}`}>{prom.toFixed(2)}</span>
                  <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${postulado ? "bg-edu-success-bg text-edu-success" : "bg-edu-subtle text-edu-ink-500"}`}>
                    {postulado ? "Postulado" : "Sin postular"}
                  </span>
                  <ChevronRight className="w-4 h-4 text-edu-ink-300 justify-self-end" />
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
      )}
    </div>
  );
}
