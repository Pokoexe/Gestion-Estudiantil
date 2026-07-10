/**
 * Rutas maquetadas del dominio Planificaciones (planificaciones del docente).
 * Se auto-registran en el router mediante `import.meta.glob` (ver ../router.ts).
 *
 * Los endpoints mutadores reutilizan las funciones que mutan el store en
 * memoria (`addPlanif`, `updatePlanif`) y devuelven el resultado / estado
 * actualizado de `PLANIFICACIONES`. Las config presentacionales
 * (`LAPSO`, `MIN_SESIONES`) NO se exponen como endpoints.
 */

import { defineRoutes } from "../types";
import {
  PLANIFICACIONES,
  getPlanifById,
  addPlanif,
  updatePlanif,
  type PlanifSesion,
} from "../../data/planificaciones";

interface PlanifInput {
  subject: string;
  section: string;
  sessions: PlanifSesion[];
}

export const routes = defineRoutes([
  {
    method: "get",
    path: "/planificaciones",
    description: "Lista de planificaciones del docente.",
    handler: () => PLANIFICACIONES,
  },
  {
    method: "get",
    path: "/planificaciones/:id",
    description: "Detalle de una planificación por id.",
    handler: ({ params }) => getPlanifById(params.id),
  },
  {
    method: "post",
    path: "/planificaciones",
    description: "Crea una planificación (queda en revisión). Devuelve la planificación creada.",
    handler: ({ body }) => addPlanif(body as PlanifInput),
  },
  {
    method: "patch",
    path: "/planificaciones/:id",
    description: "Actualiza una planificación existente. Devuelve la planificación actualizada.",
    handler: ({ params, body }) => {
      updatePlanif(Number(params.id), body as PlanifInput);
      return getPlanifById(params.id);
    },
  },
]);
