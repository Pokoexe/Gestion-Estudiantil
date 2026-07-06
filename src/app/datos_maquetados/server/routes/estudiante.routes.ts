/**
 * Rutas maquetadas del rol Estudiante.
 * Se auto-registran en el router mediante `import.meta.glob` (ver ../router.ts).
 */

import { defineRoutes } from "../types";
import {
  MATERIAS_ESTUDIANTE,
  HORARIO_ESTUDIANTE,
  HORARIO_DASHBOARD,
  PENDING_EVALS_DASHBOARD,
  STUDENT_PROFILE,
  PROXIMAS_EVAL_ESTUDIANTE,
  MATERIAS_REPROBADAS_ESTUDIANTE,
  INCIDENCIAS_ESTUDIANTE,
  ACTIVIDADES_ESTUDIANTE,
  COURSE_ESTUDIANTE,
  TEACHER_ESTUDIANTE,
  ASSIGNMENTS_ESTUDIANTE,
  PENDING_SUBJECTS_ESTUDIANTE,
  GRADES_ESTUDIANTE,
  EVALUATIONS_ESTUDIANTE,
  PAYMENTS_ESTUDIANTE,
  ACTIVITIES_ESTUDIANTE,
  REPAIR_SUBJECTS_ESTUDIANTE,
  getRepairSubjectDetail,
} from "../../data/estudiante";

export const routes = defineRoutes([
  {
    method: "get",
    path: "/estudiante/materias",
    description: "Lista de materias del estudiante con promedio, asistencia y estado.",
    handler: () => MATERIAS_ESTUDIANTE,
  },
  {
    method: "get",
    path: "/estudiante/horario",
    description: "Horario semanal de clases del estudiante.",
    handler: () => HORARIO_ESTUDIANTE,
  },
  {
    method: "get",
    path: "/estudiante/dashboard/horario",
    description: "Horario semanal del dashboard (con id de materia por clase).",
    handler: () => HORARIO_DASHBOARD,
  },
  {
    method: "get",
    path: "/estudiante/dashboard/evaluaciones-pendientes",
    description: "Evaluaciones pendientes de la semana (dashboard).",
    handler: () => PENDING_EVALS_DASHBOARD,
  },
  {
    method: "get",
    path: "/estudiante/perfil",
    description: "Datos de perfil del estudiante.",
    handler: () => STUDENT_PROFILE,
  },
  {
    method: "get",
    path: "/estudiante/proximas-evaluaciones",
    description: "Próximas evaluaciones del estudiante (perfil).",
    handler: () => PROXIMAS_EVAL_ESTUDIANTE,
  },
  {
    method: "get",
    path: "/estudiante/materias-reprobadas",
    description: "Materias reprobadas o en riesgo del estudiante (perfil).",
    handler: () => MATERIAS_REPROBADAS_ESTUDIANTE,
  },
  {
    method: "get",
    path: "/estudiante/incidencias",
    description: "Incidencias del estudiante (perfil).",
    handler: () => INCIDENCIAS_ESTUDIANTE,
  },
  {
    method: "get",
    path: "/estudiante/actividades-perfil",
    description: "Participaciones en actividades/cursos del estudiante (perfil).",
    handler: () => ACTIVIDADES_ESTUDIANTE,
  },
  {
    method: "get",
    path: "/estudiante/materia-actual",
    description: "Datos de la materia actual (banner de CoursesPage).",
    handler: () => COURSE_ESTUDIANTE,
  },
  {
    method: "get",
    path: "/estudiante/materia-actual/docente",
    description: "Datos del docente de la materia actual (CoursesPage).",
    handler: () => TEACHER_ESTUDIANTE,
  },
  {
    method: "get",
    path: "/estudiante/materia-actual/evaluaciones",
    description: "Plan de evaluación de la materia actual (CoursesPage).",
    handler: () => ASSIGNMENTS_ESTUDIANTE,
  },
  {
    method: "get",
    path: "/estudiante/materias-pendientes",
    description: "Materias pendientes de años anteriores (MateriasPendientesPage).",
    handler: () => PENDING_SUBJECTS_ESTUDIANTE,
  },
  {
    method: "get",
    path: "/estudiante/calificaciones",
    description: "Calificaciones (evaluaciones realizadas) del estudiante.",
    handler: () => GRADES_ESTUDIANTE,
  },
  {
    method: "get",
    path: "/estudiante/evaluaciones",
    description: "Evaluaciones por hacer del estudiante.",
    handler: () => EVALUATIONS_ESTUDIANTE,
  },
  {
    method: "get",
    path: "/estudiante/pagos",
    description: "Historial de pagos del estudiante.",
    handler: () => PAYMENTS_ESTUDIANTE,
  },
  {
    method: "get",
    path: "/estudiante/actividades",
    description: "Actividades extracurriculares del estudiante (CoursesActivitiesPage).",
    handler: () => ACTIVITIES_ESTUDIANTE,
  },
  {
    method: "get",
    path: "/estudiante/reparacion-materias",
    description: "Listado de materias en reparación/pendientes/reprobadas (RepairPage).",
    handler: () => REPAIR_SUBJECTS_ESTUDIANTE,
  },
  {
    method: "get",
    path: "/estudiante/reparacion/:id",
    description: "Detalle de una materia en reparación por id, con sus etapas.",
    handler: ({ params }) => getRepairSubjectDetail(params.id),
  },
]);
