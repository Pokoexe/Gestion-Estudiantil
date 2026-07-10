/**
 * Actions del dominio MISC (panel del Programador) — SDK cliente de los
 * "endpoints" maquetados.
 *
 * Cada función simula una llamada real a un endpoint usando axios (`api.get`),
 * con la sesión adjunta por el interceptor. Devuelven directamente el `data` de
 * la respuesta para que las páginas las consuman con `useFetch`.
 *
 * Los mapas presentacionales (iconos, tonos/colores, clases) NO se envuelven en
 * endpoint: la página los conserva y los enlaza con estos datos por clave.
 */

import { api } from "@shared/services/client";
import type {
  ProgKpi,
  ProgQuickAction,
  ProgUser,
  ProgService,
  RoleDistributionItem,
  ProgLog,
  ProgIntegracion,
  SystemMetricPoint,
} from "@shared/services/data/misc";

export type {
  SystemMetricPoint,
  ProgKpi,
  ProgKpiKey,
  ProgQuickAction,
  ProgActionKey,
  ProgUser,
  RoleKey,
  EstadoUsuario,
  AvatarTone,
  ProgService,
  ServiceState,
  ServiceTipo,
  ServiceKey,
  RoleDistributionItem,
  ProgLog,
  LogLevel,
  LogTipo,
  ProgIntegracion,
  IntegracionTipo,
  IntegracionEstado,
} from "@shared/services/data/misc";

/** GET /programador/kpis — métricas (KPIs) del panel del programador. */
export async function getProgKpis(): Promise<ProgKpi[]> {
  const { data } = await api.get<ProgKpi[]>("/programador/kpis");
  return data;
}

/** GET /programador/acciones-rapidas — acciones rápidas del panel. */
export async function getProgQuickActions(): Promise<ProgQuickAction[]> {
  const { data } = await api.get<ProgQuickAction[]>("/programador/acciones-rapidas");
  return data;
}

/** GET /programador/usuarios — gestión de usuarios y roles. */
export async function getProgUsers(): Promise<ProgUser[]> {
  const { data } = await api.get<ProgUser[]>("/programador/usuarios");
  return data;
}

/** GET /programador/servicios — estado de servicios / integraciones. */
export async function getProgServices(): Promise<ProgService[]> {
  const { data } = await api.get<ProgService[]>("/programador/servicios");
  return data;
}

/** GET /programador/distribucion-roles — distribución de usuarios por rol. */
export async function getProgRoleDistribution(): Promise<RoleDistributionItem[]> {
  const { data } = await api.get<RoleDistributionItem[]>("/programador/distribucion-roles");
  return data;
}

/** GET /programador/logs — registros (logs) recientes del sistema. */
export async function getProgLogs(): Promise<ProgLog[]> {
  const { data } = await api.get<ProgLog[]>("/programador/logs");
  return data;
}

/** GET /programador/integraciones — integraciones externas del sistema. */
export async function getProgIntegraciones(): Promise<ProgIntegracion[]> {
  const { data } = await api.get<ProgIntegracion[]>("/programador/integraciones");
  return data;
}

/** GET /programador/metricas — métricas de actividad del sistema (área chart). */
export async function getProgSystemMetrics(): Promise<SystemMetricPoint[]> {
  const { data } = await api.get<SystemMetricPoint[]>("/programador/metricas");
  return data;
}
