/**
 * Rutas maquetadas del dominio Docente (contenido estático de las páginas del
 * rol DOCENTE: dashboard, secciones y horario).
 * Se auto-registran en el router mediante `import.meta.glob` (ver ../router.ts).
 *
 * Solo lecturas: cada endpoint devuelve un bloque de datos de dominio. Los mapas
 * presentacionales (iconos, colores, plantillas de grid) NO se exponen aquí.
 */

import { defineRoutes } from "../types";
import {
  TODAY_CLASSES,
  SCHEDULE,
  SECCIONES,
  ESTUDIANTES,
  PLAN,
  PENDIENTES,
  HORARIO,
  SUBJECT_TO_SECTION,
} from "../../data/docente";

export const routes = defineRoutes([
  {
    method: "get",
    path: "/docente/clases-hoy",
    description: "Clases del día del docente (dashboard).",
    handler: () => TODAY_CLASSES,
  },
  {
    method: "get",
    path: "/docente/horario-semanal",
    description: "Horario semanal resumido del docente (dashboard).",
    handler: () => SCHEDULE,
  },
  {
    method: "get",
    path: "/docente/secciones",
    description: "Secciones asignadas al docente.",
    handler: () => SECCIONES,
  },
  {
    method: "get",
    path: "/docente/estudiantes",
    description: "Estudiantes de una sección del docente.",
    handler: () => ESTUDIANTES,
  },
  {
    method: "get",
    path: "/docente/plan-seccion",
    description: "Plan de evaluación de una sección del docente.",
    handler: () => PLAN,
  },
  {
    method: "get",
    path: "/docente/pendientes",
    description: "Entregas pendientes por estudiante de una sección.",
    handler: () => PENDIENTES,
  },
  {
    method: "get",
    path: "/docente/horario",
    description: "Matriz completa del horario semanal del docente.",
    handler: () => HORARIO,
  },
  {
    method: "get",
    path: "/docente/materia-seccion",
    description: "Mapa de materia del horario → id de sección.",
    handler: () => SUBJECT_TO_SECTION,
  },
]);
