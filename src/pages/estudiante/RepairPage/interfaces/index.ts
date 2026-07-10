import type { RepairStatus } from "@shared/services/actions/estudiante";

/** Filtro de estado de la tabla de reparación (incluye "todas"). */
export type StatusFilter = "todas" | RepairStatus;
