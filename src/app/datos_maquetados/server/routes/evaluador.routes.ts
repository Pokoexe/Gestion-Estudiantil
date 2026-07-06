/**
 * Rutas maquetadas del dominio Evaluador (dashboard + cola de revisiones).
 * Se auto-registran en el router mediante `import.meta.glob` (ver ../router.ts).
 */

import { defineRoutes } from "../types";
import { DASHBOARD, REVISIONES } from "../../data/evaluador";

export const routes = defineRoutes([
  {
    method: "get",
    path: "/evaluador/dashboard",
    description: "Métricas (KPIs) y distribución de revisiones del dashboard del evaluador.",
    handler: () => DASHBOARD,
  },
  {
    method: "get",
    path: "/evaluador/revisiones",
    description: "Cola de revisiones (material enviado por los docentes para validación).",
    handler: () => REVISIONES,
  },
]);
