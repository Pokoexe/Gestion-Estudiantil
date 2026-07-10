import type { PendingStatus } from "@shared/services/actions/estudiante";

/** Filtro de estado de la tabla de materias pendientes (incluye "todas"). */
export type StatusFilter = "todas" | PendingStatus;
