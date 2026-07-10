/**
 * Rutas maquetadas del dominio Reparaciones (reparaciones del docente).
 * Se auto-registran en el router mediante `import.meta.glob` (ver ../router.ts).
 *
 * El endpoint mutador reutiliza la función que muta el store en memoria
 * (`saveReparacion`) y devuelve la reparación actualizada. La config
 * presentacional (`LAPSO`, `MIN_REP`) NO se expone como endpoint.
 */

import { defineRoutes } from "../types";
import {
  REPARACIONES,
  getReparacionById,
  saveReparacion,
  type ReparacionEval,
} from "../../data/reparaciones";

export const routes = defineRoutes([
  {
    method: "get",
    path: "/reparaciones",
    description: "Lista de reparaciones del docente.",
    handler: () => REPARACIONES,
  },
  {
    method: "get",
    path: "/reparaciones/:id",
    description: "Detalle de una reparación por id.",
    handler: ({ params }) => getReparacionById(params.id),
  },
  {
    method: "post",
    path: "/reparaciones/:id/evaluaciones",
    description: "Guarda las evaluaciones de una reparación. Devuelve la reparación actualizada.",
    handler: ({ params, body }) => {
      saveReparacion(Number(params.id), (body as { evaluations: ReparacionEval[] }).evaluations);
      return getReparacionById(params.id);
    },
  },
]);
