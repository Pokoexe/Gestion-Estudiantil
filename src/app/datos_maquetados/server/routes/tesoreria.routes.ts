/**
 * Rutas maquetadas del rol Tesorería.
 * Se auto-registran en el router mediante `import.meta.glob` (ver ../router.ts).
 *
 * Solo lecturas: cada endpoint devuelve una de las colecciones inline del rol
 * (dashboard, pagos, solvencia, confirmar, inventario, reportes). Los mapas
 * presentacionales y las listas de opciones de <select> siguen en las páginas.
 * Las mutaciones (confirmar/rechazar, alta, descuento, edición) las hacen las
 * páginas en sitio sobre el estado local, tal como en la maqueta.
 */

import { defineRoutes } from "../types";
import {
  MONTHLY_COLLECTION,
  PENDING_PAYMENTS,
  DEBTORS,
  PAYMENTS,
  WEEKLY_COLLECTION,
  REPRESENTATIVES,
  PENDING,
  INVENTORY,
  INVENTORY_MOVEMENTS,
  INVENTORY_BALANCE,
  REPORTS,
} from "../../data/tesoreria";

export const routes = defineRoutes([
  // ---- Dashboard ----
  {
    method: "get",
    path: "/tesoreria/recaudo-mensual",
    description: "Serie de recaudo mensual en USD (gráfico del dashboard de Tesorería).",
    handler: () => MONTHLY_COLLECTION,
  },
  {
    method: "get",
    path: "/tesoreria/pagos-por-confirmar-resumen",
    description: "Pagos manuales por confirmar mostrados en el dashboard de Tesorería.",
    handler: () => PENDING_PAYMENTS,
  },
  {
    method: "get",
    path: "/tesoreria/morosos",
    description: "Representantes sin solvencia mostrados en el dashboard de Tesorería.",
    handler: () => DEBTORS,
  },

  // ---- Pagos ----
  {
    method: "get",
    path: "/tesoreria/pagos",
    description: "Historial de pagos del rol Tesorería.",
    handler: () => PAYMENTS,
  },
  {
    method: "get",
    path: "/tesoreria/recaudo-semanal",
    description: "Serie de recaudo semanal en USD (gráfico de la página de pagos).",
    handler: () => WEEKLY_COLLECTION,
  },

  // ---- Solvencia ----
  {
    method: "get",
    path: "/tesoreria/representantes",
    description: "Solvencia de representantes (colección completa: en mora y solventes).",
    handler: () => REPRESENTATIVES,
  },

  // ---- Confirmar pagos ----
  {
    method: "get",
    path: "/tesoreria/pagos-por-confirmar",
    description: "Comprobantes (bauches) de transferencias en espera de validación.",
    handler: () => PENDING,
  },

  // ---- Inventario ----
  {
    method: "get",
    path: "/tesoreria/inventario",
    description: "Inventario de la institución.",
    handler: () => INVENTORY,
  },
  {
    method: "get",
    path: "/tesoreria/inventario/movimientos",
    description: "Registro de descuentos (salidas) del inventario.",
    handler: () => INVENTORY_MOVEMENTS,
  },
  {
    method: "get",
    path: "/tesoreria/inventario/saldo",
    description: "Saldo disponible inicial en USD de la caja de Administración.",
    handler: () => INVENTORY_BALANCE,
  },

  // ---- Reportes ----
  {
    method: "get",
    path: "/tesoreria/reportes",
    description: "Reportes ante eventualidades del rol Tesorería.",
    handler: () => REPORTS,
  },
]);
