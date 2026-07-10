/**
 * Rutas maquetadas del rol Director.
 * Se auto-registran en el router mediante `import.meta.glob` (ver ../router.ts).
 *
 * Solo lecturas: series y registros estáticos del dashboard ejecutivo, panorama
 * académico, finanzas globales, actividades extracurriculares y personal. Los
 * mapas presentacionales (acentos, íconos, metadatos de estado) NO se exponen
 * como endpoints: las páginas los importan directo.
 */

import { defineRoutes } from "../types";
import {
  ENROLLMENT,
  FINANCE,
  ACTIVITIES,
  MILESTONES,
  SECTIONS,
  PERFORMANCE,
  RENDIMIENTO_LAPSO,
  ASISTENCIA_MES,
  ACADEMICO_LAPSO_AJUSTES,
  INCIDENTS,
  MONTHLY,
  DEBTORS,
  PENDING,
  ACTIVIDADES,
  TEACHERS,
  MEETINGS,
  SCHEDULE,
} from "../../data/director";

export const routes = defineRoutes([
  /* ---------------------------- Dashboard ejecutivo -------------------------- */
  {
    method: "get",
    path: "/director/dashboard/matricula",
    description: "Serie mensual de matrícula y asistencia (dashboard del director).",
    handler: () => ENROLLMENT,
  },
  {
    method: "get",
    path: "/director/dashboard/finanzas",
    description: "Serie financiera por moneda vs. sin pagar (dashboard del director).",
    handler: () => FINANCE,
  },
  {
    method: "get",
    path: "/director/dashboard/actividades",
    description: "Próximas actividades mostradas en el dashboard del director.",
    handler: () => ACTIVITIES,
  },
  {
    method: "get",
    path: "/director/dashboard/hitos",
    description: "Hitos del cierre de lapso (dashboard del director).",
    handler: () => MILESTONES,
  },

  /* ---------------------------- Panorama académico -------------------------- */
  {
    method: "get",
    path: "/director/academico/secciones",
    description: "Tabla de secciones por año (panorama académico).",
    handler: () => SECTIONS,
  },
  {
    method: "get",
    path: "/director/academico/rendimiento",
    description: "Rendimiento promedio por año (panorama académico).",
    handler: () => PERFORMANCE,
  },
  {
    method: "get",
    path: "/director/academico/rendimiento-lapso",
    description: "Rendimiento promedio por lapso (panorama académico).",
    handler: () => RENDIMIENTO_LAPSO,
  },
  {
    method: "get",
    path: "/director/academico/asistencia-mes",
    description: "Asistencia promedio mensual (panorama académico).",
    handler: () => ASISTENCIA_MES,
  },
  {
    method: "get",
    path: "/director/academico/ajustes-lapso",
    description: "Ajustes agregados de promedio/asistencia según el lapso seleccionado.",
    handler: () => ACADEMICO_LAPSO_AJUSTES,
  },
  {
    method: "get",
    path: "/director/academico/incidencias",
    description: "Incidencias recientes de docentes y estudiantes (panorama académico).",
    handler: () => INCIDENTS,
  },

  /* ---------------------------- Finanzas globales --------------------------- */
  {
    method: "get",
    path: "/director/finanzas/ingresos",
    description: "Serie de ingresos mensuales en equivalente USD (finanzas globales).",
    handler: () => MONTHLY,
  },
  {
    method: "get",
    path: "/director/finanzas/deudores",
    description: "Representantes deudores sin solvencia (finanzas globales).",
    handler: () => DEBTORS,
  },
  {
    method: "get",
    path: "/director/finanzas/pagos-pendientes",
    description: "Pagos por confirmar en revisión (finanzas globales).",
    handler: () => PENDING,
  },

  /* -------------------- Actividades extracurriculares ----------------------- */
  {
    method: "get",
    path: "/director/actividades",
    description: "Cursos y actividades extracurriculares del director.",
    handler: () => ACTIVIDADES,
  },

  /* ---------------------------- Gestión de personal ------------------------- */
  {
    method: "get",
    path: "/director/personal/docentes",
    description: "Plantilla docente del plantel (gestión de personal).",
    handler: () => TEACHERS,
  },
  {
    method: "get",
    path: "/director/personal/reuniones",
    description: "Reuniones de personal institucionales (gestión de personal).",
    handler: () => MEETINGS,
  },
  {
    method: "get",
    path: "/director/personal/horario",
    description: "Asignación de docentes por hora (resumen semanal).",
    handler: () => SCHEDULE,
  },
]);
