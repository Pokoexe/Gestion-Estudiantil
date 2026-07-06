/**
 * Actions del rol Estudiante — SDK cliente de los "endpoints" maquetados.
 *
 * Cada función simula una llamada real a un endpoint usando axios (`api.get`),
 * con la sesión adjunta por el interceptor. Devuelven directamente el `data` de
 * la respuesta para que las páginas las consuman con `useFetch`.
 */

import { api } from "../client";
import type {
  Subject,
  ScheduleDay,
  DashboardScheduleDay,
  PendingEval,
  StudentProfile,
  ProximaEval,
  MateriaRepro,
  Incidencia,
  Actividad,
  CourseInfo,
  CourseTeacher,
  Assignment,
  PendingSubject,
  Grade,
  Evaluation,
  Payment,
  Activity,
  RepairSubjectRow,
  RepairSubjectDetail,
} from "../data/estudiante";

export type { Subject, SubjectStatus, ScheduleDay, ScheduleClass } from "../data/estudiante";
export type {
  DashboardScheduleDay,
  DashboardClass,
  PendingEval,
  StudentProfile,
  ProximaEval,
  ReproStatus,
  MateriaRepro,
  Severity,
  Incidencia,
  Actividad,
  CourseInfo,
  CourseTeacher,
  Assignment,
  AssignmentTopic,
  PendingStatus,
  PendingSubject,
  EvalType,
  GradeAttachment,
  Grade,
  EvaluationTopic,
  Evaluation,
  PayType,
  PayStatus,
  Payment,
  ActivityStatus,
  Activity,
  RepairStatus,
  RepairSubjectRow,
  EtapaStatus,
  Etapa,
  RepairSubjectDetail,
} from "../data/estudiante";

/** GET /estudiante/materias — materias del estudiante. */
export async function getMaterias(): Promise<Subject[]> {
  const { data } = await api.get<Subject[]>("/estudiante/materias");
  return data;
}

/** GET /estudiante/horario — horario semanal del estudiante. */
export async function getHorarioEstudiante(): Promise<ScheduleDay[]> {
  const { data } = await api.get<ScheduleDay[]>("/estudiante/horario");
  return data;
}

/** GET /estudiante/dashboard/horario — horario del dashboard (con id de materia). */
export async function getHorarioDashboard(): Promise<DashboardScheduleDay[]> {
  const { data } = await api.get<DashboardScheduleDay[]>("/estudiante/dashboard/horario");
  return data;
}

/** GET /estudiante/dashboard/evaluaciones-pendientes — evaluaciones pendientes de la semana. */
export async function getEvaluacionesPendientesDashboard(): Promise<PendingEval[]> {
  const { data } = await api.get<PendingEval[]>("/estudiante/dashboard/evaluaciones-pendientes");
  return data;
}

/** GET /estudiante/perfil — datos de perfil del estudiante. */
export async function getPerfilEstudiante(): Promise<StudentProfile> {
  const { data } = await api.get<StudentProfile>("/estudiante/perfil");
  return data;
}

/** GET /estudiante/proximas-evaluaciones — próximas evaluaciones (perfil). */
export async function getProximasEvaluaciones(): Promise<ProximaEval[]> {
  const { data } = await api.get<ProximaEval[]>("/estudiante/proximas-evaluaciones");
  return data;
}

/** GET /estudiante/materias-reprobadas — materias reprobadas o en riesgo (perfil). */
export async function getMateriasReprobadas(): Promise<MateriaRepro[]> {
  const { data } = await api.get<MateriaRepro[]>("/estudiante/materias-reprobadas");
  return data;
}

/** GET /estudiante/incidencias — incidencias del estudiante (perfil). */
export async function getIncidencias(): Promise<Incidencia[]> {
  const { data } = await api.get<Incidencia[]>("/estudiante/incidencias");
  return data;
}

/** GET /estudiante/actividades-perfil — participaciones del estudiante (perfil). */
export async function getActividadesPerfil(): Promise<Actividad[]> {
  const { data } = await api.get<Actividad[]>("/estudiante/actividades-perfil");
  return data;
}

/** GET /estudiante/materia-actual — datos de la materia actual (CoursesPage). */
export async function getMateriaActual(): Promise<CourseInfo> {
  const { data } = await api.get<CourseInfo>("/estudiante/materia-actual");
  return data;
}

/** GET /estudiante/materia-actual/docente — docente de la materia actual. */
export async function getMateriaActualDocente(): Promise<CourseTeacher> {
  const { data } = await api.get<CourseTeacher>("/estudiante/materia-actual/docente");
  return data;
}

/** GET /estudiante/materia-actual/evaluaciones — plan de evaluación de la materia actual. */
export async function getMateriaActualEvaluaciones(): Promise<Assignment[]> {
  const { data } = await api.get<Assignment[]>("/estudiante/materia-actual/evaluaciones");
  return data;
}

/** GET /estudiante/materias-pendientes — materias pendientes de años anteriores. */
export async function getMateriasPendientes(): Promise<PendingSubject[]> {
  const { data } = await api.get<PendingSubject[]>("/estudiante/materias-pendientes");
  return data;
}

/** GET /estudiante/calificaciones — evaluaciones realizadas (calificaciones). */
export async function getCalificaciones(): Promise<Grade[]> {
  const { data } = await api.get<Grade[]>("/estudiante/calificaciones");
  return data;
}

/** GET /estudiante/evaluaciones — evaluaciones por hacer. */
export async function getEvaluaciones(): Promise<Evaluation[]> {
  const { data } = await api.get<Evaluation[]>("/estudiante/evaluaciones");
  return data;
}

/** GET /estudiante/pagos — historial de pagos. */
export async function getPagos(): Promise<Payment[]> {
  const { data } = await api.get<Payment[]>("/estudiante/pagos");
  return data;
}

/** GET /estudiante/actividades — actividades extracurriculares. */
export async function getActividades(): Promise<Activity[]> {
  const { data } = await api.get<Activity[]>("/estudiante/actividades");
  return data;
}

/** GET /estudiante/reparacion-materias — listado de materias en reparación. */
export async function getReparacionMaterias(): Promise<RepairSubjectRow[]> {
  const { data } = await api.get<RepairSubjectRow[]>("/estudiante/reparacion-materias");
  return data;
}

/** GET /estudiante/reparacion/:id — detalle de una materia en reparación por id. */
export async function getReparacionMateria(
  id: string | number,
): Promise<RepairSubjectDetail | undefined> {
  const { data } = await api.get<RepairSubjectDetail | undefined>(`/estudiante/reparacion/${id}`);
  return data;
}
