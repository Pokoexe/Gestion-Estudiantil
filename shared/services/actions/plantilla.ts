/**
 * Actions del dominio Plantilla — SDK cliente de los "endpoints" maquetados.
 *
 * Cada función simula una llamada real a un endpoint usando axios (`api.get`),
 * con la sesión adjunta por el interceptor. Devuelven directamente el `data` de
 * la respuesta para que las páginas las consuman con `useFetch`.
 */

import { api } from "@shared/services/client";
import type { Campo, CampoTipo } from "@shared/services/data/plantilla";

export type { Campo, CampoTipo } from "@shared/services/data/plantilla";

/** GET /plantillas/campos — campos por defecto de la plantilla. */
export async function getCampos(): Promise<Campo[]> {
  const { data } = await api.get<Campo[]>("/plantillas/campos");
  return data;
}

/** GET /plantillas/tipos — tipos de campo disponibles. */
export async function getTipos(): Promise<CampoTipo[]> {
  const { data } = await api.get<CampoTipo[]>("/plantillas/tipos");
  return data;
}
