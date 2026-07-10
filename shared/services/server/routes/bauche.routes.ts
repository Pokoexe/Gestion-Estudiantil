/**
 * Rutas maquetadas del dominio Bauche (imagen del comprobante / bauche).
 * Se auto-registran en el router mediante `import.meta.glob` (ver ../router.ts).
 *
 * Solo lectura: la imagen de prueba del bauche como data-URI (SVG embebido).
 */

import { defineRoutes } from "../types";
import { BAUCHE_MOCK } from "../../data/baucheMock";

export const routes = defineRoutes([
  {
    method: "get",
    path: "/bauche",
    description: "Imagen de prueba del bauche / comprobante (data-URI SVG).",
    handler: () => BAUCHE_MOCK,
  },
]);
