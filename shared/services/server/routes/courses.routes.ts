/**
 * Rutas maquetadas del dominio Courses (cursos extracurriculares).
 * Se auto-registran en el router mediante `import.meta.glob` (ver ../router.ts).
 *
 * Solo lecturas: el catálogo completo y el detalle por id (reutilizando
 * `getCourseById`).
 */

import { defineRoutes } from "../types";
import { EXTRA_COURSES, getCourseById } from "../../data/courses";

export const routes = defineRoutes([
  {
    method: "get",
    path: "/cursos-extra",
    description: "Catálogo de cursos extracurriculares.",
    handler: () => EXTRA_COURSES,
  },
  {
    method: "get",
    path: "/cursos-extra/:id",
    description: "Detalle de un curso extracurricular por id.",
    handler: ({ params }) => getCourseById(params.id),
  },
]);
