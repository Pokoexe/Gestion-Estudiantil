/**
 * Actions del dominio Cronograma — SDK cliente de los "endpoints" maquetados.
 *
 * Cada función simula una llamada real a un endpoint usando axios (`api.get`),
 * con la sesión adjunta por el interceptor. Devuelven directamente el `data` de
 * la respuesta para que las páginas las consuman con `useFetch`.
 *
 * Las helpers puras (`fmtFecha`, `fmtFechaLarga`, `ESTADO_LABEL`) NO se
 * envuelven en endpoints: las páginas las siguen importando directamente desde
 * `../data/cronograma`.
 */

import { api } from "@shared/services/client";
import type { PlanEval } from "@shared/services/data/cronograma";

export type { PlanEval, PlanEstado, EvalItem } from "@shared/services/data/cronograma";

/** GET /cronograma/planes — planes de evaluación. */
export async function getPlanes(): Promise<PlanEval[]> {
  const { data } = await api.get<PlanEval[]>("/cronograma/planes");
  return data;
}
