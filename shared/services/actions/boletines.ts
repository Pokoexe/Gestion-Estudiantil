/**
 * Actions del dominio Boletines — SDK cliente de los "endpoints" maquetados.
 *
 * Cada función simula una llamada real a un endpoint usando axios (`api.get`),
 * con la sesión adjunta por el interceptor. Devuelven directamente el `data` de
 * la respuesta para que las páginas las consuman con `useFetch`.
 *
 * Las helpers puras (`promedio`, `notaColor`, `notasDe`, `desglose`,
 * `actividadesDe`) NO se envuelven en endpoints: las páginas las siguen
 * importando directamente desde `../data/boletines`.
 */

import { api } from "@shared/services/client";
import type { Boletin } from "@shared/services/data/boletines";

export type { Boletin, EvalNota } from "@shared/services/data/boletines";

/** GET /boletines — lista de boletines de estudiantes. */
export async function getBoletines(): Promise<Boletin[]> {
  const { data } = await api.get<Boletin[]>("/boletines");
  return data;
}

/** GET /boletines/anios — años académicos disponibles. */
export async function getAnios(): Promise<string[]> {
  const { data } = await api.get<string[]>("/boletines/anios");
  return data;
}

/** GET /boletines/secciones — secciones disponibles. */
export async function getSecciones(): Promise<string[]> {
  const { data } = await api.get<string[]>("/boletines/secciones");
  return data;
}

/** GET /boletines/materias — materias que componen el boletín. */
export async function getMaterias(): Promise<string[]> {
  const { data } = await api.get<string[]>("/boletines/materias");
  return data;
}
