/**
 * Actions del dominio Planes — SDK cliente de los "endpoints" maquetados.
 *
 * Las lecturas usan `api.get`; las mutaciones usan `api.post` / `api.patch` y
 * su handler reutiliza la función mutadora original que muta el store en
 * memoria (`addPlan`, `updatePlan`), devolviendo el plan resultante.
 *
 * Las config presentacionales (`LAPSO`, `MIN_EVALS`) NO se envuelven en
 * endpoint: las páginas las siguen importando directamente desde
 * `../data/plans`.
 */

import { api } from "@shared/services/client";
import type { Plan, PlanEvaluacion } from "@shared/services/data/plans";

export type { Plan, PlanEvaluacion, PlanEstado } from "@shared/services/data/plans";

interface PlanInput {
  subject: string;
  section: string;
  evaluations: PlanEvaluacion[];
}

/** GET /planes — planes de evaluación del docente. */
export async function getPlanes(): Promise<Plan[]> {
  const { data } = await api.get<Plan[]>("/planes");
  return data;
}

/** GET /planes/materias — materias disponibles para un plan. */
export async function getMateriaOptions(): Promise<string[]> {
  const { data } = await api.get<string[]>("/planes/materias");
  return data;
}

/** GET /planes/secciones — secciones disponibles para un plan. */
export async function getSeccionOptions(): Promise<string[]> {
  const { data } = await api.get<string[]>("/planes/secciones");
  return data;
}

/** GET /planes/:id — detalle de un plan de evaluación por id. */
export async function getPlanById(id: string | number): Promise<Plan | undefined> {
  const { data } = await api.get<Plan | undefined>(`/planes/${id}`);
  return data;
}

/**
 * POST /planes — crea un plan de evaluación (queda en revisión).
 * Devuelve el plan creado.
 */
export async function crearPlan(input: PlanInput): Promise<Plan> {
  const { data } = await api.post<Plan>("/planes", input);
  return data;
}

/**
 * PATCH /planes/:id — actualiza un plan de evaluación existente.
 * Devuelve el plan actualizado.
 */
export async function actualizarPlan(id: number, input: PlanInput): Promise<Plan | undefined> {
  const { data } = await api.patch<Plan | undefined>(`/planes/${id}`, input);
  return data;
}
