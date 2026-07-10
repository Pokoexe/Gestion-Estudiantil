/**
 * Hook para consumir los "endpoints" maquetados desde las páginas.
 *
 * Estandariza el patrón de carga async y evita repetir useState/useEffect en
 * cada página. Se le pasa una función-action (que internamente llama a
 * `api.get(...)`) y un valor inicial con la MISMA forma que la respuesta
 * (normalmente `[]` o un objeto vacío). Así el render funciona igual durante la
 * carga (lista vacía) y se rellena al resolverse la petición.
 *
 *   const { data: materias, loading } = useFetch(getMaterias, []);
 */

import { useEffect, useRef, useState } from "react";

export interface FetchState<T> {
  data: T;
  loading: boolean;
  error: unknown;
  /** Vuelve a ejecutar la petición. */
  reload: () => void;
}

export function useFetch<T>(
  fn: () => Promise<T>,
  initial: T,
  deps: unknown[] = [],
): FetchState<T> {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [nonce, setNonce] = useState(0);

  // Mantiene la última fn sin forzar a memorizarla en cada página.
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fnRef
      .current()
      .then((result) => {
        if (alive) {
          setData(result);
          setError(null);
        }
      })
      .catch((err) => {
        if (alive) setError(err);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  return { data, loading, error, reload: () => setNonce((n) => n + 1) };
}
