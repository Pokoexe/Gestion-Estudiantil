import { CheckCircle2, MessageSquareWarning } from "lucide-react";
import { Pagination } from "@shared/ui/Pagination";
import type { Revision, RevTipo, RevEstado } from "@shared/services/actions/evaluador";

interface RevisionesTableProps {
  paged: Revision[];
  totalPages: number;
  currentPage: number;
  onPageChange: (p: number) => void;
  cols: string;
  headers: string[];
  estadoMeta: Record<RevEstado, string>;
  tipoMeta: Record<RevTipo, string>;
  teal: string;
  onDetail: (r: Revision) => void;
  onAprobar: (r: Revision) => void;
  onRevision: (r: Revision) => void;
  filtradas: Revision[];
}

export function RevisionesTable({
  paged,
  totalPages,
  currentPage,
  onPageChange,
  cols,
  headers,
  estadoMeta,
  tipoMeta,
  teal,
  onDetail,
  onAprobar,
  onRevision,
  filtradas,
}: RevisionesTableProps) {
  return (
    <>
      <div className="overflow-x-auto">
        <div className="min-w-[860px]">
          <div
            className={`grid ${cols} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}
          >
            {headers.map((h) => (
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
              No hay entregas que coincidan con el filtro.
            </div>
          ) : (
            paged.map((r, i) => (
              <div
                key={r.id}
                className={`${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
              >
                <div
                  onClick={() => onDetail(r)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") && onDetail(r)
                  }
                  className={`grid ${cols} px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle focus:outline-none focus-visible:bg-edu-subtle`}
                >
                  <span className="text-sm text-edu-ink font-medium">
                    {r.docente}
                  </span>
                  <span className="text-[0.8125rem] text-edu-ink-700">
                    {r.materia}
                  </span>
                  <span className="text-[0.8125rem] text-edu-ink-500">
                    {r.seccion}
                  </span>
                  <span
                    className={`text-[0.8125rem] font-bold ${tipoMeta[r.tipo]}`}
                  >
                    {r.tipo}
                  </span>
                  <span className="text-[0.8125rem] text-edu-ink-500">
                    {r.fecha}
                  </span>
                  <span
                    className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${estadoMeta[r.estado]}`}
                  >
                    {r.estado}
                  </span>
                  <div className="flex items-center gap-1.5 justify-end">
                    {r.estado !== "Aprobado" && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAprobar(r);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-edu-chip text-[0.72rem] font-semibold text-white cursor-pointer transition-opacity hover:opacity-90"
                        style={{ backgroundColor: teal }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Aprobar
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRevision(r);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-edu-chip text-[0.72rem] font-semibold border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 cursor-pointer transition-colors hover:bg-edu-subtle"
                    >
                      <MessageSquareWarning className="w-3.5 h-3.5" /> Revisión
                    </button>
                  </div>
                </div>
              </div>
            ))
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
    </>
  );
}
