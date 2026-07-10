import { useNavigate } from "react-router";
import { Download, FileSpreadsheet, Search } from "lucide-react";
import { Pagination } from "@shared/ui/Pagination";
import { promedio, notasDe } from "@shared/services/data/boletines";
import type { Boletin } from "@shared/services/actions/boletines";
import type { LapsoId } from "@shared/services/data/lapsos";
import { TEAL, COLS, HEADERS } from "../functions/useEvalBoletines";

interface Props {
  paged: Boletin[];
  filtradas: Boletin[];
  totalPages: number;
  currentPage: number;
  selectedId: LapsoId;
  query: string;
  selAnio: string;
  selSeccion: string;
  selMateria: string;
  ANIOS: string[];
  SECCIONES: string[];
  MATERIAS: string[];
  porSelectsLength: number;
  onQuery: (q: string) => void;
  onAnio: (a: string) => void;
  onSeccion: (s: string) => void;
  onMateria: (m: string) => void;
  onPageChange: (p: number) => void;
  onDescargar: (b: Boletin) => void;
  onDescargarTodos: () => void;
  onSelect: (b: Boletin) => void;
}

export function BoletinesTable({
  paged,
  filtradas,
  totalPages,
  currentPage,
  selectedId,
  query,
  selAnio,
  selSeccion,
  selMateria,
  ANIOS,
  SECCIONES,
  MATERIAS,
  porSelectsLength,
  onQuery,
  onAnio,
  onSeccion,
  onMateria,
  onPageChange,
  onDescargar,
  onDescargarTodos,
  onSelect,
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Boletines de estudiantes</h3>
        <span className="text-[0.8rem] text-edu-ink-400 font-medium">
          {filtradas.length} boletines
        </span>
      </div>

      <div className="px-5 py-3 flex gap-2 items-center flex-wrap border-b border-edu-border-soft">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Buscar estudiante o representante…"
            className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-teal-600"
          />
        </div>
        <select
          value={selAnio}
          onChange={(e) => onAnio(e.target.value)}
          className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-teal-600"
        >
          <option value="todos">Todos los años</option>
          {ANIOS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <select
          value={selSeccion}
          onChange={(e) => onSeccion(e.target.value)}
          className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-teal-600"
        >
          <option value="todas">Todas las secciones</option>
          {SECCIONES.map((s) => (
            <option key={s} value={s}>
              Sección {s}
            </option>
          ))}
        </select>
        <select
          value={selMateria}
          onChange={(e) => onMateria(e.target.value)}
          className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-teal-600"
        >
          <option value="todas">Todas las materias</option>
          {MATERIAS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={onDescargarTodos}
          disabled={porSelectsLength === 0}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-edu-control text-[0.8125rem] font-semibold text-white border-none cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: TEAL }}
        >
          <Download className="w-4 h-4" />
          Descargar todos
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[760px]">
          <div className={`grid ${COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
            {HEADERS.map((h) => (
              <span
                key={h}
                className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]"
              >
                {h}
              </span>
            ))}
          </div>

          {paged.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-edu-ink-400">
              No hay boletines que coincidan con el filtro.
            </div>
          ) : (
            paged.map((b, i) => {
              const p = promedio(notasDe(b, selectedId));
              return (
                <div
                  key={b.id}
                  onClick={() => onSelect(b)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(b)}
                  className={`grid ${COLS} px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle focus:outline-none focus-visible:bg-edu-subtle ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                >
                  <span className="text-sm text-edu-ink font-medium">{b.student}</span>
                  <span className="text-[0.8125rem] text-edu-ink-500">{b.anio}</span>
                  <span className="text-[0.8125rem] text-edu-ink-500">{b.seccion}</span>
                  <span
                    className={`text-[0.9rem] font-bold ${p >= 10 ? "text-edu-ink" : "text-edu-danger"}`}
                  >
                    {p.toFixed(2)}
                  </span>
                  <span
                    className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${b.retirado ? "bg-edu-success-bg text-edu-success" : "bg-edu-warning-bg text-edu-warning"}`}
                  >
                    {b.retirado ? "Recibido" : "Por entregar"}
                  </span>
                  <div className="flex items-center gap-1.5 justify-end">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/evaluador/boletines/${b.id}/sabana`);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-edu-chip text-[0.72rem] font-semibold cursor-pointer transition-colors border-[1.5px] bg-edu-surface hover:bg-edu-subtle"
                      style={{ borderColor: TEAL, color: TEAL }}
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      Sábana
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDescargar(b);
                      }}
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
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
}
