/**
 * Actions del dominio Docente-Eval — SDK cliente de los "endpoints" maquetados.
 *
 * Cada función simula una llamada real a un endpoint usando axios (`api.get`),
 * con la sesión adjunta por el interceptor. Devuelven directamente el `data` de
 * la respuesta para que las páginas las consuman con `useFetch`.
 *
 * Los mapas presentacionales (metadatos de estado/tipo, opciones de <select>)
 * NO se envuelven en endpoints: las páginas los siguen definiendo localmente.
 */

import { api } from "@shared/services/client";
import type {
  Actividad,
  EstudianteDisponible,
  CalificacionesData,
  DocenteCurso,
  CursoChartPoint,
  DocenteActual,
} from "@shared/services/data/docente-eval";

export type {
  Actividad,
  Postulado,
  TipoActividad,
  EstadoPostulado,
  EstudianteDisponible,
  CalificacionesData,
  LapsoData,
  Estudiante,
  EvaluacionPlan,
  EvalTipo,
  DocenteCurso,
  CursoStatus,
  CursoChartPoint,
  DocenteActual,
} from "@shared/services/data/docente-eval";

/** GET /docente/postulaciones — actividades del docente con sus postulados. */
export async function getPostulacionesActividades(): Promise<Actividad[]> {
  const { data } = await api.get<Actividad[]>("/docente/postulaciones");
  return data;
}

/** GET /docente/postulaciones-estudiantes — estudiantes disponibles para postular. */
export async function getEstudiantesDisponibles(): Promise<EstudianteDisponible[]> {
  const { data } = await api.get<EstudianteDisponible[]>("/docente/postulaciones-estudiantes");
  return data;
}

/** GET /docente/calificaciones-seccion — calificaciones por lapso del docente. */
export async function getCalificaciones(): Promise<CalificacionesData | null> {
  const { data } = await api.get<CalificacionesData>("/docente/calificaciones-seccion");
  return data;
}

/** GET /docente/cursos — cursos extracurriculares del docente. */
export async function getDocenteCursos(): Promise<DocenteCurso[]> {
  const { data } = await api.get<DocenteCurso[]>("/docente/cursos");
  return data;
}

/** GET /docente/cursos-inscripciones — serie mensual de inscripciones por curso. */
export async function getCursosInscripciones(): Promise<CursoChartPoint[]> {
  const { data } = await api.get<CursoChartPoint[]>("/docente/cursos-inscripciones");
  return data;
}

/** GET /docente/cursos-docente-actual — datos del docente a cargo. */
export async function getDocenteActual(): Promise<DocenteActual | null> {
  const { data } = await api.get<DocenteActual>("/docente/cursos-docente-actual");
  return data;
}
