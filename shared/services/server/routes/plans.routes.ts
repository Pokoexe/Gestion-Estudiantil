/**
 * Rutas maquetadas del dominio Planes (planes de evaluación del docente).
 * Se auto-registran en el router mediante `import.meta.glob` (ver ../router.ts).
 *
 * Los endpoints mutadores reutilizan las funciones que mutan el store en
 * memoria (`addPlan`, `updatePlan`) y devuelven el resultado / estado
 * actualizado de `PLANS`. Las config presentacionales (`LAPSO`, `MIN_EVALS`)
 * NO se exponen como endpoints: las páginas las importan directo de la data.
 */

import { defineRoutes } from "../types";
import {
  PLANS,
  MATERIA_OPTIONS,
  SECCION_OPTIONS,
  getPlanById,
  addPlan,
  updatePlan,
  type PlanEvaluacion,
} from "../../data/plans";

interface PlanInput {
  subject: string;
  section: string;
  evaluations: PlanEvaluacion[];
}

export const routes = defineRoutes([
  {
    method: "get",
    path: "/planes",
    description: "Lista de planes de evaluación del docente.",
    handler: () => PLANS,
  },
  {
    method: "get",
    path: "/planes/materias",
    description: "Materias disponibles para un plan de evaluación.",
    handler: () => MATERIA_OPTIONS,
  },
  {
    method: "get",
    path: "/planes/secciones",
    description: "Secciones disponibles para un plan de evaluación.",
    handler: () => SECCION_OPTIONS,
  },
  {
    method: "get",
    path: "/planes/:id",
    description: "Detalle de un plan de evaluación por id.",
    handler: ({ params }) => getPlanById(params.id),
  },
  {
    method: "post",
    path: "/planes",
    description: "Crea un plan de evaluación (queda en revisión). Devuelve el plan creado.",
    handler: ({ body }) => addPlan(body as PlanInput),
  },
  {
    method: "patch",
    path: "/planes/:id",
    description: "Actualiza un plan de evaluación existente. Devuelve el plan actualizado.",
    handler: ({ params, body }) => {
      updatePlan(Number(params.id), body as PlanInput);
      return getPlanById(params.id);
    },
  },
]);
