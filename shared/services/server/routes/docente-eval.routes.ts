/**
 * Rutas maquetadas del dominio Docente-Eval (evaluación / cursos del docente).
 * Se auto-registran en el router mediante `import.meta.glob` (ver ../router.ts).
 *
 * Solo se exponen las SERIES DE DATOS. La config presentacional (metadatos de
 * estado/tipo, plantillas de columnas, opciones de <select>) NO se expone: las
 * páginas la siguen definiendo localmente.
 */

import { defineRoutes } from "../types";
import {
  ACTIVIDADES_INICIALES,
  ESTUDIANTES_DISPONIBLES,
  CALIFICACIONES,
  DOCENTE_CURSOS,
  CURSOS_CHART_DATA,
  DOCENTE_ACTUAL,
} from "../../data/docente-eval";

export const routes = defineRoutes([
  {
    method: "get",
    path: "/docente/postulaciones",
    description: "Actividades extracurriculares asignadas al docente y sus estudiantes postulados.",
    handler: () => ACTIVIDADES_INICIALES,
  },
  {
    method: "get",
    path: "/docente/postulaciones-estudiantes",
    description: "Estudiantes disponibles para postular a una actividad.",
    handler: () => ESTUDIANTES_DISPONIBLES,
  },
  {
    method: "get",
    path: "/docente/calificaciones-seccion",
    description: "Calificaciones por lapso: años, materias, plan y estudiantes por lapso, y asistencia.",
    handler: () => CALIFICACIONES,
  },
  {
    method: "get",
    path: "/docente/cursos",
    description: "Cursos extracurriculares solicitados y aceptados por el docente.",
    handler: () => DOCENTE_CURSOS,
  },
  {
    method: "get",
    path: "/docente/cursos-inscripciones",
    description: "Serie mensual de inscripciones por curso (gráfico de área).",
    handler: () => CURSOS_CHART_DATA,
  },
  {
    method: "get",
    path: "/docente/cursos-docente-actual",
    description: "Datos del docente a cargo mostrados al solicitar un curso.",
    handler: () => DOCENTE_ACTUAL,
  },
]);
