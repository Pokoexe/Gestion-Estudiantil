/**
 * Rutas maquetadas del dominio Boletines (boletines de estudiantes).
 * Se auto-registran en el router mediante `import.meta.glob` (ver ../router.ts).
 */

import { defineRoutes } from "../types";
import { BOLETINES, ANIOS, SECCIONES, MATERIAS } from "../../data/boletines";

export const routes = defineRoutes([
  {
    method: "get",
    path: "/boletines",
    description: "Lista de boletines de estudiantes con notas por materia.",
    handler: () => BOLETINES,
  },
  {
    method: "get",
    path: "/boletines/anios",
    description: "Años académicos disponibles para filtrar boletines.",
    handler: () => ANIOS,
  },
  {
    method: "get",
    path: "/boletines/secciones",
    description: "Secciones disponibles para filtrar boletines.",
    handler: () => SECCIONES,
  },
  {
    method: "get",
    path: "/boletines/materias",
    description: "Materias que componen el boletín (orden de las notas).",
    handler: () => MATERIAS,
  },
]);
