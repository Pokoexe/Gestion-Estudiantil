/**
 * Rutas maquetadas del dominio Precios (panel del Director).
 * Se auto-registran en el router mediante `import.meta.glob` (ver ../router.ts).
 *
 * Solo lectura: el historial de cuadros de precios. La config presentacional
 * (`PRECIO_ESTADO_META`) NO se expone como endpoint; la página la importa direct.
 */

import { defineRoutes } from "../types";
import { PRECIOS_HISTORIAL } from "../../data/precios";

export const routes = defineRoutes([
  {
    method: "get",
    path: "/precios",
    description: "Historial de cuadros de precios del panel del Director.",
    handler: () => PRECIOS_HISTORIAL,
  },
]);
