import { Search } from "lucide-react";
import { color } from "@themes/tokens";
import { Pagination } from "@shared/ui/Pagination";
import { useRegistrosPage } from "./functions/useRegistrosPage";
import type { LogLevel, LogTipo } from "@shared/services/actions/misc";

const LOG_COLS = "grid-cols-[88px_120px_150px_1fr]";

const LOG_STYLE: Record<LogLevel, { bg: string; fg: string }> = {
  INFO:        { bg: color.primary50,  fg: color.primary  },
  ADVERTENCIA: { bg: color.warningBg,  fg: color.warning  },
  ERROR:       { bg: color.dangerBg,   fg: color.danger   },
};

const TIPO_STYLE: Record<LogTipo, { bg: string; fg: string }> = {
  docente:   { bg: color.successBg, fg: color.success },
  evaluador: { bg: color.warningBg, fg: color.warning },
  sistema:   { bg: color.subtle,    fg: color.ink500  },
};

export function ProgramadorRegistrosPage() {
  const {
    loading,
    query,
    setQuery,
    tipoFilter,
    setTipoFilter,
    estadoFilter,
    setEstadoFilter,
    currentPage,
    totalPages,
    paged,
    setPage,
  } = useRegistrosPage();

  if (loading) {
    return (
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">
        Cargando…
      </div>
    );
  }

  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-edu-border-soft">
        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Registros recientes (logs)</h3>
        <p className="mt-0.5 text-edu-ink-400 text-[0.78rem]">Historial de actividad del sistema</p>
      </div>

      <div className="px-5 py-3 border-b border-edu-border-soft flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[160px]">
          <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar en mensajes…"
            className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
          />
        </div>
        <select
          value={tipoFilter}
          onChange={(e) => setTipoFilter(e.target.value as LogTipo | "")}
          className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary cursor-pointer"
        >
          <option value="">Tipo: todos</option>
          <option value="docente">Docente</option>
          <option value="evaluador">Evaluador</option>
        </select>
        <select
          value={estadoFilter}
          onChange={(e) => setEstadoFilter(e.target.value as LogLevel | "")}
          className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary cursor-pointer"
        >
          <option value="">Estado: todos</option>
          <option value="INFO">Info</option>
          <option value="ERROR">Error</option>
          <option value="ADVERTENCIA">Advertencia</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className={`grid ${LOG_COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
            {["Hora", "Tipo", "Estado", "Mensaje"].map((h) => (
              <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">
                {h}
              </span>
            ))}
          </div>

          {paged.length === 0 ? (
            <p className="text-[0.8125rem] text-edu-ink-400 m-0 px-5 py-10 text-center">
              No hay registros que coincidan con los filtros.
            </p>
          ) : (
            paged.map((log, i) => {
              const lvl = LOG_STYLE[log.level];
              const tipo = TIPO_STYLE[log.tipo];
              return (
                <div
                  key={i}
                  className={`grid ${LOG_COLS} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                >
                  <span className="font-mono text-[0.78rem] text-edu-ink-400">{log.time}</span>
                  <span
                    className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit capitalize"
                    style={{ backgroundColor: tipo.bg, color: tipo.fg }}
                  >
                    {log.tipo}
                  </span>
                  <span
                    className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit"
                    style={{ backgroundColor: lvl.bg, color: lvl.fg }}
                  >
                    {log.level}
                  </span>
                  <span className="font-mono text-[0.8rem] text-edu-ink-700 leading-[1.5]">{log.message}</span>
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
  );
}
