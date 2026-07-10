import { useState, useMemo } from "react";
import { useFetch } from "@shared/services";
import { getProgServices } from "@shared/services/actions/misc";
import type { ServiceState, ServiceTipo } from "@shared/services/actions/misc";

export function useEstadoPage() {
  const { data: services, loading } = useFetch(getProgServices, []);
  const [query, setQueryRaw] = useState("");
  const [estadoFilter, setEstadoRaw] = useState<ServiceState | "">("");
  const [tipoFilter, setTipoRaw] = useState<ServiceTipo | "">("");

  function setQuery(v: string) { setQueryRaw(v); }
  function setEstadoFilter(v: ServiceState | "") { setEstadoRaw(v); }
  function setTipoFilter(v: ServiceTipo | "") { setTipoRaw(v); }

  const filtered = useMemo(() => {
    let result = services;
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(q));
    }
    if (estadoFilter) result = result.filter((s) => s.state === estadoFilter);
    if (tipoFilter) result = result.filter((s) => s.tipo === tipoFilter);
    return result;
  }, [services, query, estadoFilter, tipoFilter]);

  return {
    loading,
    query,
    setQuery,
    estadoFilter,
    setEstadoFilter,
    tipoFilter,
    setTipoFilter,
    filtered,
  };
}
