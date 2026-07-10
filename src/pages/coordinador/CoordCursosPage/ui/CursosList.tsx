import { Search, Users, CheckCircle2, XCircle, ImageIcon } from "lucide-react";
import { color, accent } from "@themes/tokens";
import { Pagination } from "@shared/ui/Pagination";
import type { CoordCurso, CursoStatus } from "@shared/services/actions/coordinador";

type StatusMeta = Record<CursoStatus, { label: string; bg: string; fg: string }>;

type Props = {
  query: string;
  setQuery: (v: string) => void;
  statusFilter: "todos" | CursoStatus;
  setStatusFilter: (v: "todos" | CursoStatus) => void;
  setPage: (p: number) => void;
  filtered: CoordCurso[];
  paged: CoordCurso[];
  currentPage: number;
  totalPages: number;
  statusMeta: StatusMeta;
  onSelect: (curso: CoordCurso) => void;
  onAction: (id: number, action: "aceptar" | "rechazar", e?: React.MouseEvent) => void;
};

export function CursosList({
  query, setQuery, statusFilter, setStatusFilter, setPage,
  filtered, paged, currentPage, totalPages,
  statusMeta, onSelect, onAction,
}: Props) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Cursos</h3>
        <span className="text-[0.8rem] text-edu-ink-400 font-medium">
          {filtered.length} curso{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="px-5 py-3 flex gap-2 items-center flex-wrap border-b border-edu-border-soft">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Buscar por nombre, código o profesor…"
            className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as typeof statusFilter); setPage(1); }}
          className="w-full md:w-auto border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
        >
          <option value="todos">Todos los estados</option>
          <option value="creado">Creados</option>
          <option value="solicitado">Solicitados</option>
          <option value="en_espera">En espera</option>
          <option value="en_proceso">En proceso</option>
          <option value="aceptado">Aceptados</option>
          <option value="rechazado">Rechazados</option>
        </select>
      </div>

      <div className="p-5">
        {filtered.length === 0 ? (
          <div className="py-10 text-center text-edu-ink-400 text-sm">No hay cursos que coincidan con el filtro.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paged.map((curso) => {
              const st = statusMeta[curso.status];
              const enProceso = curso.status === "en_proceso";
              const pct = Math.round((curso.enrolledCount / curso.cupos) * 100);
              const full = curso.enrolledCount >= curso.cupos;
              return (
                <div
                  key={curso.id}
                  onClick={() => onSelect(curso)}
                  className="bg-edu-surface rounded-edu-card border border-edu-border-soft flex flex-col overflow-hidden cursor-pointer transition-shadow hover:shadow-md"
                >
                  {curso.image ? (
                    <img src={curso.image} alt={curso.title} className="w-full h-32 object-cover" />
                  ) : (
                    <div className="w-full h-20 flex items-center justify-center" style={{ backgroundColor: accent.blue.bg }}>
                      <ImageIcon style={{ width: 28, height: 28, color: accent.blue.fg }} />
                    </div>
                  )}

                  <div className="p-4 flex flex-col gap-3 flex-1">
                    <div>
                      <div className="text-[0.875rem] font-semibold text-edu-ink leading-snug">{curso.title}</div>
                      <span className="text-[0.72rem] text-edu-ink-400 font-mono">{curso.code}</span>
                    </div>

                    <div className="text-[0.8rem] text-edu-ink-500">{curso.profesor}</div>

                    <div>
                      <div className="flex justify-between items-baseline mb-1.5">
                        <span className="inline-flex items-center gap-1 text-[0.78rem] text-edu-ink-500">
                          <Users className="w-3.5 h-3.5" /> {curso.enrolledCount} / {curso.cupos} inscritos
                        </span>
                        <span className={`text-[0.78rem] font-semibold ${full ? "text-edu-danger" : "text-edu-ink-700"}`}>
                          {full ? "Cupo lleno" : `${pct} %`}
                        </span>
                      </div>
                      <div className="h-1.5 bg-edu-border-soft rounded-edu-pill overflow-hidden">
                        <div
                          className="h-full rounded-edu-pill"
                          style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: full ? color.danger : color.primary }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-edu-border-soft mt-0.5">
                      <span
                        className="inline-flex items-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold"
                        style={{ backgroundColor: st.bg, color: st.fg }}
                      >
                        {st.label}
                      </span>
                      {enProceso && (
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => onAction(curso.id, "aceptar", e)}
                            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-edu-control text-[0.72rem] font-semibold border-none cursor-pointer text-white transition-colors hover:brightness-95"
                            style={{ backgroundColor: color.success }}
                          >
                            <CheckCircle2 style={{ width: 11, height: 11 }} />
                            Aceptar
                          </button>
                          <button
                            onClick={(e) => onAction(curso.id, "rechazar", e)}
                            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-edu-control text-[0.72rem] font-semibold border-none cursor-pointer text-white transition-colors hover:brightness-95"
                            style={{ backgroundColor: color.danger }}
                          >
                            <XCircle style={{ width: 11, height: 11 }} />
                            Rechazar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pt-5 mt-5 border-t border-edu-border-soft">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}
