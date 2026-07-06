/**
 * Actions del dominio Planificaciones — SDK cliente de los "endpoints" maquetados.
 *
 * Las lecturas usan `api.get`; las mutaciones usan `api.post` / `api.patch` y
 * su handler reutiliza la función mutadora original que muta el store en
 * memoria (`addPlanif`, `updatePlanif`), devolviendo la planificación resultante.
 *
 * Las config presentacionales (`LAPSO`, `MIN_SESIONES`) NO se envuelven en
 * endpoint: las páginas las siguen importando directamente desde
 * `../data/planificaciones`.
 */

import { api } from "../client";
import type { Planificacion, PlanifSesion } from "../data/planificaciones";

export type { Planificacion, PlanifSesion, PlanifEstado } from "../data/planificaciones";

interface PlanifInput {
  subject: string;
  section: string;
  sessions: PlanifSesion[];
}

/** GET /planificaciones — planificaciones del docente. */
export async function getPlanificaciones(): Promise<Planificacion[]> {
  const { data } = await api.get<Planificacion[]>("/planificaciones");
  return data;
}

/** GET /planificaciones/:id — detalle de una planificación por id. */
export async function getPlanificacionById(
  id: string | number,
): Promise<Planificacion | undefined> {
  const { data } = await api.get<Planificacion | undefined>(`/planificaciones/${id}`);
  return data;
}

/**
 * POST /planificaciones — crea una planificación (queda en revisión).
 * Devuelve la planificación creada.
 */
export async function crearPlanificacion(input: PlanifInput): Promise<Planificacion> {
  const { data } = await api.post<Planificacion>("/planificaciones", input);
  return data;
}

/**
 * PATCH /planificaciones/:id — actualiza una planificación existente.
 * Devuelve la planificación actualizada.
 */
export async function actualizarPlanificacion(
  id: number,
  input: PlanifInput,
): Promise<Planificacion | undefined> {
  const { data } = await api.patch<Planificacion | undefined>(`/planificaciones/${id}`, input);
  return data;
}
