import { useNavigate } from "react-router";
import { CalendarDays, Search } from "lucide-react";
import { Pagination } from "@shared/ui/Pagination";
import { fmtFecha } from "@shared/services/data/cronograma";
import type { PlanEstado } from "@shared/services/actions/cronograma";
import { ESTADO_PLAN, COLS, HEADERS } from "../functions/useEvalCronograma";
import { ESTADO_LABEL } from "@shared/services/data/cronograma";

interface Plan {
  id: number;
  materia: string;
  seccion: string;
  docente: string;
  estado: PlanEstado;
  evaluaciones: { fecha: string }[];
}

interface Props {
  paged: Plan[];
  filtradas: Plan[];
  totalPages: number;
  currentPage: number;
  query: string;
  estadoFilter: "todos" | PlanEstado;
  onQuery: (q: string) => void;
  onEstado: (e: "todos" | PlanEstado) => void;
  onPageChange: (p: number) => void;
}

export function CalendarioTable({
  paged,
  filtradas,
  totalPages,
  currentPage,
  query,
  estadoFilter,
  onQuery,
  onEstado,
  onPageChange,
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">
          Calendario por materia y sección
        </h3>
        <span className="text-[0.8rem] text-edu-ink-400 font-medium">
          {filtradas.length} programaciones
        </span>
      </div>

      <div className="px-5 py-3 flex gap-2 items-center flex-wrap border-b border-edu-border-soft">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Buscar materia, sección o docente…"
            className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-teal-600"
          />
        </div>
        <select
          value={estadoFilter}
          onChange={(e) => onEstado(e.target.value as "todos" | PlanEstado)}
          className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-teal-600"
        >
          <option value="todos">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="en revisión">En revisión</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[680px]">
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
              No hay programaciones que coincidan con el filtro.
            </div>
          ) : (
            paged.map((p, i) => {
              const ordenadas = [...p.evaluaciones].sort((a, b) =>
                a.fecha.localeCompare(b.fecha),
              );
              return (
                <div
                  key={p.id}
                  onClick={() => navigate(`/evaluador/cronograma/${p.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") &&
                    navigate(`/evaluador/cronograma/${p.id}`)
                  }
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
                  <span
                    className={`inline-flex items-center justify-center px-2.5 py-[4px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${ESTADO_PLAN[p.estado]}`}
                  >
                    {ESTADO_LABEL[p.estado]}
                  </span>
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
