/**
 * Rutas maquetadas del dominio Cronograma (planes de evaluación).
 * Se auto-registran en el router mediante `import.meta.glob` (ver ../router.ts).
 */

import { defineRoutes } from "../types";
import { PLANES } from "../../data/cronograma";

export const routes = defineRoutes([
  {
    method: "get",
    path: "/cronograma/planes",
    description: "Lista de planes de evaluación con sus evaluaciones y estado.",
    handler: () => PLANES,
  },
]);
