/**
 * Rutas maquetadas del dominio Evaluador-Discusión (estudiantes en riesgo /
 * reparación que revisa el evaluador). Se auto-registran en el router mediante
 * `import.meta.glob` (ver ../router.ts).
 *
 * Solo expone la lectura de la lista de estudiantes; las derivaciones
 * presentacionales (donut, KPIs, conteos) se calculan en la página.
 */

import { defineRoutes } from "../types";
import { ESTUDIANTES_REPARACION } from "../../data/evaluador-discusion";

export const routes = defineRoutes([
  {
    method: "get",
    path: "/evaluador/reparaciones-estudiantes",
    description: "Estudiantes en riesgo académico para la vista de reparaciones del evaluador.",
    handler: () => ESTUDIANTES_REPARACION,
  },
]);
