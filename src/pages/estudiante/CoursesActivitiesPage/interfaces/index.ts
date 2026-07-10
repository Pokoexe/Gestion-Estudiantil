import type { ActivityStatus } from "@shared/services/actions/estudiante";

/** Clave de la pestaña activa de la página. */
export type TabKey = "cursos" | "nuevos" | "actividades";

/** Filtro de estado de la tabla de actividades (incluye "todas"). */
export type ActivityStatusFilter = "todas" | ActivityStatus;

/** Filtro de disponibilidad de cupos en el catálogo de nuevos cursos. */
export type SpotsFilter = "todos" | "disponible";
