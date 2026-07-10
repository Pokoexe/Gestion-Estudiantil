/**
 * Actions del dominio Reparaciones — SDK cliente de los "endpoints" maquetados.
 *
 * Las lecturas usan `api.get`; la mutación usa `api.post` y su handler reutiliza
 * la función mutadora original que muta el store en memoria (`saveReparacion`),
 * devolviendo la reparación actualizada.
 *
 * La config presentacional (`LAPSO`, `MIN_REP`) NO se envuelve en endpoint: las
 * páginas la siguen importando directamente desde `../data/reparaciones`.
 */

import { api } from "@shared/services/client";
import type { Reparacion, ReparacionEval } from "@shared/services/data/reparaciones";

export type { Reparacion, ReparacionEval, ReparacionEstado } from "@shared/services/data/reparaciones";

/** GET /reparaciones — reparaciones del docente. */
export async function getReparaciones(): Promise<Reparacion[]> {
  const { data } = await api.get<Reparacion[]>("/reparaciones");
  return data;
}

/** GET /reparaciones/:id — detalle de una reparación por id. */
export async function getReparacionById(
  id: string | number,
): Promise<Reparacion | undefined> {
  const { data } = await api.get<Reparacion | undefined>(`/reparaciones/${id}`);
  return data;
}

/**
 * POST /reparaciones/:id/evaluaciones — guarda las evaluaciones de una
 * reparación. Devuelve la reparación actualizada.
 */
export async function guardarReparacion(
  id: number,
  evaluations: ReparacionEval[],
): Promise<Reparacion | undefined> {
  const { data } = await api.post<Reparacion | undefined>(
    `/reparaciones/${id}/evaluaciones`,
    { evaluations },
  );
  return data;
}
