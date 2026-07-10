import { useState, useMemo } from "react";
import { useFetch } from "@shared/services";
import { getProgIntegraciones } from "@shared/services/actions/misc";
import type { IntegracionTipo, IntegracionEstado } from "@shared/services/actions/misc";

const PAGE_SIZE = 6;

export function useIntegracionesPage() {
  const { data: integraciones, loading } = useFetch(getProgIntegraciones, []);
  const [query, setQueryRaw] = useState("");
  const [tipoFilter, setTipoRaw] = useState<IntegracionTipo | "">("");
  const [estadoFilter, setEstadoRaw] = useState<IntegracionEstado | "">("");
  const [page, setPage] = useState(1);

  function setQuery(v: string) { setQueryRaw(v); setPage(1); }
  function setTipoFilter(v: IntegracionTipo | "") { setTipoRaw(v); setPage(1); }
  function setEstadoFilter(v: IntegracionEstado | "") { setEstadoRaw(v); setPage(1); }

  const filtered = useMemo(() => {
    let result = integraciones;
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (i) => i.nombre.toLowerCase().includes(q) || i.proveedor.toLowerCase().includes(q),
      );
    }
    if (tipoFilter) result = result.filter((i) => i.tipo === tipoFilter);
    if (estadoFilter) result = result.filter((i) => i.estado === estadoFilter);
    return result;
  }, [integraciones, query, tipoFilter, estadoFilter]);

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
