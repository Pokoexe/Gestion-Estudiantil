import { useState } from "react";
import { useNavigate } from "react-router";
import { Gavel, ArrowRight, Search } from "lucide-react";
import { Pagination } from "../components/Pagination";
import { POSTULACIONES, type PostEstado } from "../data/discusiones";
import { LapsoFilter } from "../components/LapsoFilter";
import { useLapso } from "../context/LapsoContext";
import { CURRENT_LAPSO_ID } from "../data/lapsos";

const TEAL = "#0d9488";
const TEAL_BG = "#ccfbf1";

const ESTADO_META: Record<PostEstado, string> = {
  Pendiente: "bg-edu-warning-bg text-edu-warning",
  Aceptada: "bg-edu-success-bg text-edu-success",
  Rechazada: "bg-edu-danger-bg text-edu-danger",
};

const COLS = "grid-cols-[1.6fr_1.2fr_1fr_0.7fr_0.9fr]";
const HEADERS = ["Estudiante", "Materia", "Año", "Nota", "Estado"];
const PER_PAGE = 8;

export function EvalDiscusionPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const { selectedId } = useLapso();
  const enLapso = POSTULACIONES.filter((p) => (p.lapso ?? CURRENT_LAPSO_ID) === selectedId);

  const q = query.trim().toLowerCase();
  const filtrado = enLapso.filter(
    (p) => !q || `${p.estudiante} ${p.materia} ${p.anio}`.toLowerCase().includes(q),
  );

  const totalPages = Math.max(1, Math.ceil(filtrado.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtrado.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

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

      {/* Tabla de postulaciones (diseño estándar con buscador + paginación) */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
          <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Estudiantes postulados al Concejo</h3>
          <span className="text-[0.8rem] text-edu-ink-400 font-medium">
            {filtrado.length} caso{filtrado.length === 1 ? "" : "s"}
          </span>
        </div>

        {/* Buscador + filtro de lapso */}
        <div className="px-5 py-3 border-b border-edu-border-soft flex gap-2 items-center flex-wrap">
          <LapsoFilter />
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Buscar por estudiante, materia o año…"
              className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-teal-600"
            />
          </div>
        </div>

        {/* Cabecera de tabla */}
        <div className={`grid ${COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
          {HEADERS.map((h) => (
            <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
          ))}
        </div>

        {paged.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-edu-ink-400">
            {enLapso.length === 0
              ? "Aún no hay estudiantes postulados al Concejo en este lapso."
              : "No hay registros que coincidan con la búsqueda."}
          </div>
        ) : (
          paged.map((p, i) => (
            <div
              key={p.id}
              className={`grid ${COLS} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
            >
              <span className="text-sm text-edu-ink font-medium">{p.estudiante}</span>
              <span className="text-[0.8125rem] text-edu-ink-500">{p.materia}</span>
              <span className="text-[0.8125rem] text-edu-ink-500">{p.anio}</span>
              <span className="text-sm text-edu-ink-700 font-semibold">{p.nota}</span>
              <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${ESTADO_META[p.estado]}`}>
                {p.estado}
              </span>
            </div>
          ))
        )}

        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-edu-border-soft">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}
