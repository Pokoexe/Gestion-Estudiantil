/**
 * Actions del dominio Evaluador-Discusión — SDK cliente de los "endpoints"
 * maquetados.
 *
 * La lectura usa `api.get` y devuelve directamente el `data` de la respuesta
 * para que las páginas la consuman con `useFetch`. Los tipos se reexportan
 * desde el módulo de datos para que las páginas importen todo desde aquí.
 */

import { api } from "../client";
import type { StudentRow } from "../data/evaluador-discusion";

export type { StudentRow, Materia, MatStatus } from "../data/evaluador-discusion";

/** GET /evaluador/reparaciones-estudiantes — estudiantes en riesgo académico. */
export async function getEstudiantesReparacion(): Promise<StudentRow[]> {
  const { data } = await api.get<StudentRow[]>("/evaluador/reparaciones-estudiantes");
  return data;
}
