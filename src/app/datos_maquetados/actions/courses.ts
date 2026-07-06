/**
 * Actions del dominio Courses — SDK cliente de los "endpoints" maquetados.
 *
 * Solo lecturas (`api.get`): el catálogo de cursos extracurriculares y el
 * detalle por id. Devuelven directamente el `data` de la respuesta para que las
 * páginas las consuman con `useFetch`.
 */

import { api } from "../client";
import type { ExtraCourse } from "../data/courses";

export type {
  ExtraCourse,
  CourseEvaluation,
  EvaluationType,
  EvaluationStatus,
  EnrollmentStatus,
} from "../data/courses";

/** GET /cursos-extra — catálogo de cursos extracurriculares. */
export async function getCursosExtra(): Promise<ExtraCourse[]> {
  const { data } = await api.get<ExtraCourse[]>("/cursos-extra");
  return data;
}

/** GET /cursos-extra/:id — detalle de un curso extracurricular por id. */
export async function getCursoExtraById(
  id: string | number,
): Promise<ExtraCourse | undefined> {
  const { data } = await api.get<ExtraCourse | undefined>(`/cursos-extra/${id}`);
  return data;
}
