/**
 * Rutas maquetadas del dominio Plantilla (configuración del plan de evaluación).
 * Se auto-registran en el router mediante `import.meta.glob` (ver ../router.ts).
 */

import { defineRoutes } from "../types";
import { CAMPOS_DEFAULT, TIPOS } from "../../data/plantilla";

export const routes = defineRoutes([
  {
    method: "get",
    path: "/plantillas/campos",
    description: "Campos por defecto de la plantilla del plan de evaluación.",
    handler: () => CAMPOS_DEFAULT,
  },
  {
    method: "get",
    path: "/plantillas/tipos",
    description: "Tipos de campo disponibles para la plantilla.",
    handler: () => TIPOS,
  },
]);
