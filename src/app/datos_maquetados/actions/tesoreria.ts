/**
 * Actions del rol Tesorería — SDK cliente de los "endpoints" maquetados.
 *
 * Solo lecturas (`api.get`): devuelven directamente el `data` de la respuesta
 * para que las páginas las consuman con `useFetch`. Las colecciones editables
 * (pagos, comprobantes, inventario, reportes) se usan como semilla del estado
 * local de cada página; las mutaciones se hacen en sitio, como en la maqueta.
 */

import { api } from "../client";
import type {
  CollectionPoint,
  DashboardPendingPay,
  Debtor,
  Payment,
  WeeklyCollectionPoint,
  Representative,
  PendingPay,
  InvItem,
  Movement,
  Report,
} from "../data/tesoreria";

export type {
  Currency,
  CollectionPoint,
  DashboardPendingPay,
  Debtor,
  Method,
  PayStatus,
  Payment,
  WeeklyCollectionPoint,
  Representative,
  PendingPay,
  ItemStatus,
  InvItem,
  Movement,
  ReportType,
  ReportStatus,
  Report,
} from "../data/tesoreria";

/* ---------- Dashboard ---------- */

/** GET /tesoreria/recaudo-mensual — serie de recaudo mensual en USD. */
export async function getRecaudoMensual(): Promise<CollectionPoint[]> {
  const { data } = await api.get<CollectionPoint[]>("/tesoreria/recaudo-mensual");
  return data;
}

/** GET /tesoreria/pagos-por-confirmar-resumen — pagos por confirmar (dashboard). */
export async function getPagosPorConfirmarResumen(): Promise<DashboardPendingPay[]> {
  const { data } = await api.get<DashboardPendingPay[]>("/tesoreria/pagos-por-confirmar-resumen");
  return data;
}

/** GET /tesoreria/morosos — representantes sin solvencia (dashboard). */
export async function getMorosos(): Promise<Debtor[]> {
  const { data } = await api.get<Debtor[]>("/tesoreria/morosos");
  return data;
}

/* ---------- Pagos ---------- */

/** GET /tesoreria/pagos — historial de pagos. */
export async function getPagos(): Promise<Payment[]> {
  const { data } = await api.get<Payment[]>("/tesoreria/pagos");
  return data;
}

/** GET /tesoreria/recaudo-semanal — serie de recaudo semanal en USD. */
export async function getRecaudoSemanal(): Promise<WeeklyCollectionPoint[]> {
  const { data } = await api.get<WeeklyCollectionPoint[]>("/tesoreria/recaudo-semanal");
  return data;
}

/* ---------- Solvencia ---------- */

/** GET /tesoreria/representantes — solvencia de representantes (colección completa). */
export async function getRepresentantes(): Promise<Representative[]> {
  const { data } = await api.get<Representative[]>("/tesoreria/representantes");
  return data;
}

/* ---------- Confirmar pagos ---------- */

/** GET /tesoreria/pagos-por-confirmar — comprobantes en espera de validación. */
export async function getPagosPorConfirmar(): Promise<PendingPay[]> {
  const { data } = await api.get<PendingPay[]>("/tesoreria/pagos-por-confirmar");
  return data;
}

/* ---------- Inventario ---------- */

/** GET /tesoreria/inventario — inventario de la institución. */
export async function getInventario(): Promise<InvItem[]> {
  const { data } = await api.get<InvItem[]>("/tesoreria/inventario");
  return data;
}

/** GET /tesoreria/inventario/movimientos — registro de descuentos del inventario. */
export async function getMovimientosInventario(): Promise<Movement[]> {
  const { data } = await api.get<Movement[]>("/tesoreria/inventario/movimientos");
  return data;
}

/** GET /tesoreria/inventario/saldo — saldo disponible inicial en USD. */
export async function getSaldoInventario(): Promise<number> {
  const { data } = await api.get<number>("/tesoreria/inventario/saldo");
  return data;
}

/* ---------- Reportes ---------- */

/** GET /tesoreria/reportes — reportes ante eventualidades. */
export async function getReportes(): Promise<Report[]> {
  const { data } = await api.get<Report[]>("/tesoreria/reportes");
  return data;
}
