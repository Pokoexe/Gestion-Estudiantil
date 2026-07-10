import { Pencil } from "lucide-react";
import { Pagination } from "@shared/ui/Pagination";
import { CURRENT_LAPSO_ID } from "@shared/services/data/lapsos";
import { type LocalLapso } from "../interfaces";

const TEAL = "#0d9488";
const TEAL_BG = "#ccfbf1";

interface LapsosTableProps {
  lapsos: LocalLapso[];
  paged: LocalLapso[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onEdit: (id: number) => void;
  fmtFecha: (iso: string) => string;
  COLS: string;
  HEADERS: string[];
}

export function LapsosTable({
  lapsos,
  paged,
  totalPages,
  currentPage,
  onPageChange,
  onEdit,
  fmtFecha,
  COLS,
  HEADERS,
}: LapsosTableProps) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Todos los lapsos</h3>
        <span className="text-[0.8rem] text-edu-ink-400 font-medium">{lapsos.length} lapsos registrados</span>
      </div>

      {/* Cabecera */}
      <div className="overflow-x-auto">
        <div className="min-w-[760px]">
          <div className={`grid ${COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
            {HEADERS.map((h) => (
              <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">
                {h}
              </span>
            ))}
          </div>

          {paged.map((l, i) => {
            const isActual = l.id === CURRENT_LAPSO_ID;
            return (
              <div
                key={l.id}
                className={`grid ${COLS} px-5 py-[13px] items-center ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-edu-ink font-medium">{l.label}</span>
                  {isActual && (
                    <span
                      className="inline-flex items-center px-2 py-[2px] rounded-edu-pill text-[0.65rem] font-semibold"
                      style={{ backgroundColor: TEAL_BG, color: TEAL }}
                    >
                      actual
                    </span>
                  )}
                </div>
                <span className="text-[0.8125rem] text-edu-ink-500">{l.periodo}</span>
                <span className="text-[0.8125rem] text-edu-ink-500">{fmtFecha(l.inicio)}</span>
                <span className="text-[0.8125rem] text-edu-ink-500">{fmtFecha(l.cierre)}</span>
                <span>
                  {l.estado === "en_curso" ? (
                    <span
                      className="inline-flex items-center px-2.5 py-[4px] rounded-edu-pill text-[0.7rem] font-semibold"
                      style={{ backgroundColor: TEAL_BG, color: TEAL }}
                    >
                      En curso
                    </span>
                  ) : l.estado === "finalizado" ? (
                    <span className="inline-flex items-center px-2.5 py-[4px] rounded-edu-pill text-[0.7rem] font-semibold bg-slate-100 text-slate-500">
                      Finalizado
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-[4px] rounded-edu-pill text-[0.7rem] font-semibold bg-edu-warning-bg text-edu-warning">
                      Próximo
                    </span>
                  )}
                </span>
                <button
                  onClick={() => onEdit(l.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-edu-chip text-[0.75rem] font-medium text-edu-ink-600 bg-edu-subtle border border-edu-border-soft cursor-pointer transition-colors hover:bg-edu-border-soft"
                >
                  <Pencil className="w-3 h-3" />
                  Cierre
                </button>
              </div>
            );
          })}
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
