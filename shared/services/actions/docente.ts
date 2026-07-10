/**
 * Actions del dominio Docente — SDK cliente de los "endpoints" maquetados.
 *
 * Solo lecturas (`api.get`) del contenido estático de las páginas del rol
 * DOCENTE (dashboard, secciones y horario). Devuelven directamente el `data` de
 * la respuesta para consumirse con `useFetch`.
 */

import { api } from "@shared/services/client";
import type {
  TodayClass,
  ScheduleDay,
  Seccion,
  Estudiante,
  EvaluacionPlan,
  Pendiente,
  Clase,
} from "@shared/services/data/docente";

export type {
  TodayClass,
  ScheduleDay,
  Seccion,
  Estudiante,
  EvalEstado,
  EvalTipo,
  EvaluacionPlan,
  Pendiente,
  Clase,
} from "@shared/services/data/docente";

/** GET /docente/clases-hoy — clases del día del docente. */
export async function getClasesHoy(): Promise<TodayClass[]> {
  const { data } = await api.get<TodayClass[]>("/docente/clases-hoy");
  return data;
}

/** GET /docente/horario-semanal — horario semanal resumido (dashboard). */
export async function getHorarioSemanal(): Promise<ScheduleDay[]> {
  const { data } = await api.get<ScheduleDay[]>("/docente/horario-semanal");
  return data;
}

/** GET /docente/secciones — secciones asignadas al docente. */
export async function getSecciones(): Promise<Seccion[]> {
  const { data } = await api.get<Seccion[]>("/docente/secciones");
  return data;
}

/** GET /docente/estudiantes — estudiantes de una sección del docente. */
export async function getEstudiantes(): Promise<Estudiante[]> {
  const { data } = await api.get<Estudiante[]>("/docente/estudiantes");
  return data;
}

/** GET /docente/plan-seccion — plan de evaluación de una sección. */
export async function getPlanSeccion(): Promise<EvaluacionPlan[]> {
  const { data } = await api.get<EvaluacionPlan[]>("/docente/plan-seccion");
  return data;
}

/** GET /docente/pendientes — entregas pendientes por estudiante. */
export async function getPendientes(): Promise<Pendiente[]> {
  const { data } = await api.get<Pendiente[]>("/docente/pendientes");
  return data;
}

/** GET /docente/horario — matriz completa del horario semanal. */
export async function getHorario(): Promise<(Clase | null)[][]> {
  const { data } = await api.get<(Clase | null)[][]>("/docente/horario");
  return data;
}

/** GET /docente/materia-seccion — mapa de materia del horario → id de sección. */
export async function getMateriaSeccion(): Promise<Record<string, number>> {
  const { data } = await api.get<Record<string, number>>("/docente/materia-seccion");
  return data;
}
