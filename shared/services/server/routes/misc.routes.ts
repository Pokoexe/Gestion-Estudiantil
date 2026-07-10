/**
 * Rutas maquetadas del dominio MISC (panel del Programador).
 * Se auto-registran en el router mediante `import.meta.glob` (ver ../router.ts).
 *
 * Solo lectura: KPIs, acciones rápidas, usuarios, estado de servicios,
 * distribución de usuarios por rol y registros/logs recientes.
 */

import { defineRoutes } from "../types";
import {
  PROG_KPIS,
  PROG_QUICK_ACTIONS,
  PROG_USERS,
  PROG_SERVICES,
  PROG_ROLE_DISTRIBUTION,
  PROG_LOGS,
  PROG_INTEGRACIONES,
  PROG_SYSTEM_METRICS,
} from "../../data/misc";

export const routes = defineRoutes([
  {
    method: "get",
    path: "/programador/kpis",
    description: "Métricas (KPIs) del panel del programador (uptime, usuarios, errores, respaldo).",
    handler: () => PROG_KPIS,
  },
  {
    method: "get",
    path: "/programador/acciones-rapidas",
    description: "Acciones rápidas del panel del programador (crear usuario, asignar rol, etc.).",
    handler: () => PROG_QUICK_ACTIONS,
  },
  {
    method: "get",
    path: "/programador/usuarios",
    description: "Gestión de usuarios y roles del panel del programador.",
    handler: () => PROG_USERS,
  },
  {
    method: "get",
    path: "/programador/servicios",
    description: "Estado de servicios / integraciones (API, base de datos, WhatsApp, pagos, correo).",
    handler: () => PROG_SERVICES,
  },
  {
    method: "get",
    path: "/programador/distribucion-roles",
    description: "Distribución de usuarios por rol (gráfico de barras).",
    handler: () => PROG_ROLE_DISTRIBUTION,
  },
  {
    method: "get",
    path: "/programador/logs",
    description: "Registros (logs) recientes del sistema.",
    handler: () => PROG_LOGS,
  },
  {
    method: "get",
    path: "/programador/integraciones",
    description: "Integraciones externas del sistema (WhatsApp, pagos, correo, almacenamiento, autenticación).",
    handler: () => PROG_INTEGRACIONES,
  },
  {
    method: "get",
    path: "/programador/metricas",
    description: "Métricas de actividad del sistema para gráfica de área (usuarios, uptime, errores por hora).",
    handler: () => PROG_SYSTEM_METRICS,
  },
]);
