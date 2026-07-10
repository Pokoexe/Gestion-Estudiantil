/**
 * Rutas maquetadas del rol Coordinador.
 * Se auto-registran en el router mediante `import.meta.glob` (ver ../router.ts).
 */

import { defineRoutes } from "../types";
import {
  DASHBOARD_MEETINGS,
  DASHBOARD_PLANS,
  DASHBOARD_ACTIVITIES,
  DASHBOARD_INCIDENTS,
  DASHBOARD_INCIDENTS_BY_MONTH,
  REUNIONES,
  ACTIVIDADES,
  ACTIVIDADES_AGENDA,
  DOCENTES,
  PLANIFICACIONES,
  INCIDENCIAS,
  CAMPOS_FORMATO_INCIDENCIAS,
  SECCIONES,
  MATERIAS,
  BLOQUES,
  DOCENTES_SECCIONES,
  ASISTENCIA_ESTUDIANTES,
  ASISTENCIA_DOCENTES,
  PERSONAS_ESTUDIANTES,
  PERSONAS_DOCENTES,
  PERSONAS_POR_SECCION,
  COORD_CURSOS,
  COORD_CURSOS_CHART,
  CURSOS_DOCENTES_OPCIONES,
} from "../../data/coordinador";

export const routes = defineRoutes([
  /* -------------------------------- Dashboard -------------------------------- */
  {
    method: "get",
    path: "/coordinador/dashboard/reuniones",
    description: "Reuniones recientes mostradas en el dashboard del coordinador.",
    handler: () => DASHBOARD_MEETINGS,
  },
  {
    method: "get",
    path: "/coordinador/dashboard/planificaciones",
    description: "Planificaciones por revisar mostradas en el dashboard.",
    handler: () => DASHBOARD_PLANS,
  },
  {
    method: "get",
    path: "/coordinador/dashboard/actividades",
    description: "Actividades académicas y culturales en curso (dashboard).",
    handler: () => DASHBOARD_ACTIVITIES,
  },
  {
    method: "get",
    path: "/coordinador/dashboard/incidencias",
    description: "Incidencias recientes mostradas en el dashboard.",
    handler: () => DASHBOARD_INCIDENTS,
  },
  {
    method: "get",
    path: "/coordinador/dashboard/incidencias-por-mes",
    description: "Serie de incidencias por mes (gráfica del dashboard).",
    handler: () => DASHBOARD_INCIDENTS_BY_MONTH,
  },

  /* -------------------------------- Reuniones -------------------------------- */
  {
    method: "get",
    path: "/coordinador/reuniones",
    description: "Agenda de reuniones del coordinador.",
    handler: () => REUNIONES,
  },

  /* ------------------------------- Actividades ------------------------------- */
  {
    method: "get",
    path: "/coordinador/actividades",
    description: "Actividades con sus postulados.",
    handler: () => ACTIVIDADES,
  },
  {
    method: "get",
    path: "/coordinador/actividades/agenda",
    description: "Agenda de actividades (tabla) del coordinador.",
    handler: () => ACTIVIDADES_AGENDA,
  },
  {
    method: "get",
    path: "/coordinador/docentes",
    description: "Lista de docentes seleccionables en actividades.",
    handler: () => DOCENTES,
  },

  /* ----------------------------- Planificaciones ----------------------------- */
  {
    method: "get",
    path: "/coordinador/planificaciones",
    description: "Planificaciones entregadas por los docentes.",
    handler: () => PLANIFICACIONES,
  },

  /* -------------------------------- Incidencias ------------------------------ */
  {
    method: "get",
    path: "/coordinador/incidencias",
    description: "Registro de incidencias de docentes y estudiantes.",
    handler: () => INCIDENCIAS,
  },
  {
    method: "get",
    path: "/coordinador/incidencias/formato",
    description: "Campos del formato de registro de incidencias.",
    handler: () => CAMPOS_FORMATO_INCIDENCIAS,
  },

  /* --------------------------- Secciones / Materias -------------------------- */
  {
    method: "get",
    path: "/coordinador/secciones",
    description: "Secciones registradas del plantel.",
    handler: () => SECCIONES,
  },
  {
    method: "get",
    path: "/coordinador/materias",
    description: "Materias del plan de estudios.",
    handler: () => MATERIAS,
  },
  {
    method: "get",
    path: "/coordinador/bloques",
    description: "Bloques horarios del formato de horarios.",
    handler: () => BLOQUES,
  },
  {
    method: "get",
    path: "/coordinador/secciones/docentes",
    description: "Docentes seleccionables en secciones y horarios.",
    handler: () => DOCENTES_SECCIONES,
  },

  /* -------------------------------- Asistencia ------------------------------- */
  {
    method: "get",
    path: "/coordinador/asistencia/estudiantes",
    description: "Control de asistencia mensual de estudiantes.",
    handler: () => ASISTENCIA_ESTUDIANTES,
  },
  {
    method: "get",
    path: "/coordinador/asistencia/docentes",
    description: "Control de asistencia mensual de docentes.",
    handler: () => ASISTENCIA_DOCENTES,
  },

  /* --------------------------------- Personas -------------------------------- */
  {
    method: "get",
    path: "/coordinador/personas/estudiantes",
    description: "Directorio de estudiantes con datos del representante.",
    handler: () => PERSONAS_ESTUDIANTES,
  },
  {
    method: "get",
    path: "/coordinador/personas/docentes",
    description: "Directorio de docentes del plantel.",
    handler: () => PERSONAS_DOCENTES,
  },
  {
    method: "get",
    path: "/coordinador/personas/por-seccion",
    description: "Distribución de estudiantes por sección (donut).",
    handler: () => PERSONAS_POR_SECCION,
  },

  /* ---------------------------------- Cursos --------------------------------- */
  {
    method: "get",
    path: "/coordinador/cursos",
    description: "Cursos extracurriculares del flujo de aprobación del coordinador.",
    handler: () => COORD_CURSOS,
  },
  {
    method: "get",
    path: "/coordinador/cursos/chart",
    description: "Serie de estudiantes por curso a lo largo del período.",
    handler: () => COORD_CURSOS_CHART,
  },
  {
    method: "get",
    path: "/coordinador/cursos/docentes",
    description: "Docentes seleccionables al crear un curso extracurricular.",
    handler: () => CURSOS_DOCENTES_OPCIONES,
  },
]);
