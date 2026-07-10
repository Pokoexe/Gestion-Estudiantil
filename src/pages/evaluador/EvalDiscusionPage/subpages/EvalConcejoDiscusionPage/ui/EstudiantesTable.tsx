import { ChevronRight, Search } from "lucide-react";
import { Pagination } from "@shared/ui/Pagination";
import { notaColor } from "@shared/services/data/boletines";
import type { Boletin } from "@shared/services/actions/boletines";
import { COLS, HEADERS } from "../functions/useEvalConcejoDiscusion";

interface Props {
  selAnio: string;
  paged: Boletin[];
  filtrados: Boletin[];
  totalPages: number;
  currentPage: number;
  query: string;
  onQuery: (q: string) => void;
  onPageChange: (p: number) => void;
  onAbrir: (b: Boletin) => void;
  estaPostulado: (b: Boletin) => boolean;
  promedio: (notas: number[]) => number;
}

export function EstudiantesTable({
  selAnio,
  paged,
  filtrados,
  totalPages,
  currentPage,
  query,
  onQuery,
  onPageChange,
  onAbrir,
  estaPostulado,
  promedio,
}: Props) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">
          Estudiantes · {selAnio}
        </h3>
        <span className="text-[0.8rem] text-edu-ink-400 font-medium">
          {filtrados.length} estudiante{filtrados.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="px-5 py-3 border-b border-edu-border-soft">
        <div className="relative">
          <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Buscar estudiante…"
            className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-teal-600"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[680px]">
          <div
            className={`grid ${COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}
          >
            {HEADERS.map((h, i) => (
              <span
                key={i}
                className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]"
              >
                {h}
              </span>
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
                  onClick={() => onAbrir(b)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onAbrir(b)}
                  className={`grid ${COLS} px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle focus:outline-none focus-visible:bg-edu-subtle ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                >
                  <span className="text-sm text-edu-ink font-medium">{b.student}</span>
                  <span className="text-[0.8125rem] text-edu-ink-500">{b.seccion}</span>
                  <span className={`text-[0.9rem] font-bold ${notaColor(prom)}`}>
                    {prom.toFixed(2)}
                  </span>
                  <span
                    className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${postulado ? "bg-edu-success-bg text-edu-success" : "bg-edu-subtle text-edu-ink-500"}`}
                  >
                    {postulado ? "Postulado" : "Sin postular"}
                  </span>
                  <ChevronRight className="w-4 h-4 text-edu-ink-300 justify-self-end" />
                </div>
              );
            })
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="px-5 py-4 border-t border-edu-border-soft">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
