import { useState, useMemo } from "react";
import { useFetch } from "@shared/services";
import { getProgLogs } from "@shared/services/actions/misc";
import type { LogLevel, LogTipo } from "@shared/services/actions/misc";

const PAGE_SIZE = 8;

export function useRegistrosPage() {
  const { data: logs, loading } = useFetch(getProgLogs, []);
  const [query, setQueryRaw] = useState("");
  const [tipoFilter, setTipoRaw] = useState<LogTipo | "">("");
  const [estadoFilter, setEstadoRaw] = useState<LogLevel | "">("");
  const [page, setPage] = useState(1);

  function setQuery(v: string) { setQueryRaw(v); setPage(1); }
  function setTipoFilter(v: LogTipo | "") { setTipoRaw(v); setPage(1); }
  function setEstadoFilter(v: LogLevel | "") { setEstadoRaw(v); setPage(1); }

  const filtered = useMemo(() => {
    let result = logs;
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter((l) => l.message.toLowerCase().includes(q));
    }
    if (tipoFilter) result = result.filter((l) => l.tipo === tipoFilter);
    if (estadoFilter) result = result.filter((l) => l.level === estadoFilter);
    return result;
  }, [logs, query, tipoFilter, estadoFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return {
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
  };
}
