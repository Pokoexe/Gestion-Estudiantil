/**
 * Actions del dominio Bauche — SDK cliente de los "endpoints" maquetados.
 *
 * Solo lectura (`api.get`): la imagen de prueba del bauche / comprobante como
 * data-URI (SVG embebido). Devuelve directamente el `data` de la respuesta para
 * que las páginas la usen como `src` de un `<img>`.
 */

import { api } from "../client";

/** GET /bauche — imagen de prueba del bauche / comprobante (data-URI SVG). */
export async function getBauche(): Promise<string> {
  const { data } = await api.get<string>("/bauche");
  return data;
}
