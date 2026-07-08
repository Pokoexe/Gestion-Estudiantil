/**
 * Actions del dominio Precios — SDK cliente de los "endpoints" maquetados.
 *
 * Lectura (`api.get`): el historial de cuadros de precios del panel del Director.
 * El registro con estado `"vigente"` es la configuración actual (mensualidad,
 * morosidad, inicio de morosidad y descuentos); la página deriva de él los KPIs.
 *
 * La config presentacional (`PRECIO_ESTADO_META`) NO se envuelve en endpoint: la
 * página la importa directamente desde `../data/precios`, igual que en el resto
 * de la maqueta.
 */

import { api } from "../client";
import type { EsquemaPrecio } from "../data/precios";

export type { EsquemaPrecio, PrecioEstado } from "../data/precios";

/** GET /precios — historial de cuadros de precios del panel del Director. */
export async function getPreciosHistorial(): Promise<EsquemaPrecio[]> {
  const { data } = await api.get<EsquemaPrecio[]>("/precios");
  return data;
}
