/**
 * Actions del dominio Evaluador — SDK cliente de los "endpoints" maquetados.
 *
 * Cada función simula una llamada real a un endpoint usando axios (`api.get`),
 * con la sesión adjunta por el interceptor. Devuelven directamente el `data` de
 * la respuesta para que las páginas las consuman con `useFetch`.
 */

import { api } from "@shared/services/client";
import type { EvaluadorDashboard, Revision } from "@shared/services/data/evaluador";

export type {
  EvaluadorDashboard,
  DashboardKpi,
  DashboardKpiKey,
  DashboardActionKey,
  DashboardChartItem,
  Revision,
  RevTipo,
  RevEstado,
} from "@shared/services/data/evaluador";

/** GET /evaluador/dashboard — KPIs + distribución de revisiones del dashboard. */
export async function getDashboard(): Promise<EvaluadorDashboard> {
  const { data } = await api.get<EvaluadorDashboard>("/evaluador/dashboard");
  return data;
}

/** GET /evaluador/revisiones — cola de revisiones enviadas por los docentes. */
export async function getRevisiones(): Promise<Revision[]> {
  const { data } = await api.get<Revision[]>("/evaluador/revisiones");
  return data;
}
