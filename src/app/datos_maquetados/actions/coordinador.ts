/**
 * Actions del rol Coordinador — SDK cliente de los "endpoints" maquetados.
 *
 * Cada función simula una llamada real a un endpoint usando axios (`api.get`),
 * con la sesión adjunta por el interceptor. Devuelven directamente el `data` de
 * la respuesta para que las páginas las consuman con `useFetch`.
 */

import { api } from "../client";
import type {
  DashMeeting,
  DashPlan,
  DashActivity,
  DashIncident,
  DashIncidentsByMonth,
  Reunion,
  Actividad,
  ActividadTabla,
  Planificacion,
  Incidencia,
  Seccion,
  Materia,
  Bloque,
  AsistenciaPersona,
  Estudiante,
  Docente,
  SeccionDistribucion,
  CoordCurso,
  CursosChartPoint,
} from "../data/coordinador";

export type {
  DashMeeting,
  DashMeetingStatus,
  DashPlan,
  DashPlanStatus,
  DashActivity,
  DashActivityType,
  DashIncident,
  DashPersonRole,
  DashSeverity,
  DashIncidentsByMonth,
  Reunion,
  ReunionEstado,
  ReunionConvocados,
  Actividad,
  ActividadTabla,
  Postulado,
  TipoActividad,
  EstadoPostulado,
  Planificacion,
  EstadoPlan,
  Incidencia,
  TipoPersona,
  Gravedad,
  Seccion,
  Materia,
  Bloque,
  Nivel,
  AsistenciaPersona,
  Estudiante,
  Docente,
  EstadoDocente,
  RepRelacion,
  SeccionDistribucion,
  CoordCurso,
  CursoStatus,
  CursosChartPoint,
} from "../data/coordinador";

/* -------------------------------- Dashboard -------------------------------- */

/** GET /coordinador/dashboard/reuniones */
export async function getDashboardReuniones(): Promise<DashMeeting[]> {
  const { data } = await api.get<DashMeeting[]>("/coordinador/dashboard/reuniones");
  return data;
}

/** GET /coordinador/dashboard/planificaciones */
export async function getDashboardPlanificaciones(): Promise<DashPlan[]> {
  const { data } = await api.get<DashPlan[]>("/coordinador/dashboard/planificaciones");
  return data;
}

/** GET /coordinador/dashboard/actividades */
export async function getDashboardActividades(): Promise<DashActivity[]> {
  const { data } = await api.get<DashActivity[]>("/coordinador/dashboard/actividades");
  return data;
}

/** GET /coordinador/dashboard/incidencias */
export async function getDashboardIncidencias(): Promise<DashIncident[]> {
  const { data } = await api.get<DashIncident[]>("/coordinador/dashboard/incidencias");
  return data;
}

/** GET /coordinador/dashboard/incidencias-por-mes */
export async function getDashboardIncidenciasPorMes(): Promise<DashIncidentsByMonth[]> {
  const { data } = await api.get<DashIncidentsByMonth[]>("/coordinador/dashboard/incidencias-por-mes");
  return data;
}

/* -------------------------------- Reuniones -------------------------------- */

/** GET /coordinador/reuniones — agenda de reuniones. */
export async function getReuniones(): Promise<Reunion[]> {
  const { data } = await api.get<Reunion[]>("/coordinador/reuniones");
  return data;
}

/* ------------------------------- Actividades ------------------------------- */

/** GET /coordinador/actividades — actividades con postulados. */
export async function getActividades(): Promise<Actividad[]> {
  const { data } = await api.get<Actividad[]>("/coordinador/actividades");
  return data;
}

/** GET /coordinador/actividades/agenda — agenda de actividades (tabla). */
export async function getActividadesAgenda(): Promise<ActividadTabla[]> {
  const { data } = await api.get<ActividadTabla[]>("/coordinador/actividades/agenda");
  return data;
}

/** GET /coordinador/docentes — docentes seleccionables en actividades. */
export async function getDocentes(): Promise<string[]> {
  const { data } = await api.get<string[]>("/coordinador/docentes");
  return data;
}

/* ----------------------------- Planificaciones ----------------------------- */

/** GET /coordinador/planificaciones — planificaciones entregadas. */
export async function getPlanificacionesCoord(): Promise<Planificacion[]> {
  const { data } = await api.get<Planificacion[]>("/coordinador/planificaciones");
  return data;
}

/* -------------------------------- Incidencias ------------------------------ */

/** GET /coordinador/incidencias — registro de incidencias. */
export async function getIncidencias(): Promise<Incidencia[]> {
  const { data } = await api.get<Incidencia[]>("/coordinador/incidencias");
  return data;
}

/** GET /coordinador/incidencias/formato — campos del formato. */
export async function getFormatoIncidencias(): Promise<string[]> {
  const { data } = await api.get<string[]>("/coordinador/incidencias/formato");
  return data;
}

/* --------------------------- Secciones / Materias -------------------------- */

/** GET /coordinador/secciones — secciones registradas. */
export async function getSecciones(): Promise<Seccion[]> {
  const { data } = await api.get<Seccion[]>("/coordinador/secciones");
  return data;
}

/** GET /coordinador/materias — materias del plan de estudios. */
export async function getMateriasCoord(): Promise<Materia[]> {
  const { data } = await api.get<Materia[]>("/coordinador/materias");
  return data;
}

/** GET /coordinador/bloques — bloques horarios. */
export async function getBloques(): Promise<Bloque[]> {
  const { data } = await api.get<Bloque[]>("/coordinador/bloques");
  return data;
}

/** GET /coordinador/secciones/docentes — docentes seleccionables en secciones. */
export async function getDocentesSecciones(): Promise<string[]> {
  const { data } = await api.get<string[]>("/coordinador/secciones/docentes");
  return data;
}

/* -------------------------------- Asistencia ------------------------------- */

/** GET /coordinador/asistencia/estudiantes */
export async function getAsistenciaEstudiantes(): Promise<AsistenciaPersona[]> {
  const { data } = await api.get<AsistenciaPersona[]>("/coordinador/asistencia/estudiantes");
  return data;
}

/** GET /coordinador/asistencia/docentes */
export async function getAsistenciaDocentes(): Promise<AsistenciaPersona[]> {
  const { data } = await api.get<AsistenciaPersona[]>("/coordinador/asistencia/docentes");
  return data;
}

/* --------------------------------- Personas -------------------------------- */

/** GET /coordinador/personas/estudiantes — directorio de estudiantes. */
export async function getPersonasEstudiantes(): Promise<Estudiante[]> {
  const { data } = await api.get<Estudiante[]>("/coordinador/personas/estudiantes");
  return data;
}

/** GET /coordinador/personas/docentes — directorio de docentes. */
export async function getPersonasDocentes(): Promise<Docente[]> {
  const { data } = await api.get<Docente[]>("/coordinador/personas/docentes");
  return data;
}

/** GET /coordinador/personas/por-seccion — distribución por sección (donut). */
export async function getPersonasPorSeccion(): Promise<SeccionDistribucion[]> {
  const { data } = await api.get<SeccionDistribucion[]>("/coordinador/personas/por-seccion");
  return data;
}

/* ---------------------------------- Cursos --------------------------------- */

/** GET /coordinador/cursos — cursos extracurriculares (flujo de aprobación). */
export async function getCoordCursos(): Promise<CoordCurso[]> {
  const { data } = await api.get<CoordCurso[]>("/coordinador/cursos");
  return data;
}

/** GET /coordinador/cursos/chart — serie de estudiantes por curso. */
export async function getCoordCursosChart(): Promise<CursosChartPoint[]> {
  const { data } = await api.get<CursosChartPoint[]>("/coordinador/cursos/chart");
  return data;
}

/** GET /coordinador/cursos/docentes — docentes seleccionables al crear curso. */
export async function getCursosDocentesOpciones(): Promise<string[]> {
  const { data } = await api.get<string[]>("/coordinador/cursos/docentes");
  return data;
}
