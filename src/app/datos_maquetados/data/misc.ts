/* ------------------------------------------------------------------ */
/* Datos ficticios del dominio MISC (panel del Programador).            */
/*                                                                      */
/* Solo se centralizan aquí los DATOS estáticos que vivían inline en    */
/* el ProgramadorDashboard (KPIs, acciones rápidas, usuarios, estado    */
/* de servicios, distribución por rol y registros/logs). Los mapas      */
/* presentacionales (iconos, colores/tonos, clases) siguen en la        */
/* página y se enlazan con estos datos mediante claves estables.        */
/* ------------------------------------------------------------------ */

/* ------------------------------- KPIs ------------------------------ */

/** Clave estable que enlaza cada KPI con su icono/tono en la página. */
export type ProgKpiKey = "uptime" | "usuarios" | "errores" | "respaldo";

export interface ProgKpi {
  key: ProgKpiKey;
  label: string;
  value: string;
  hint: string;
}

export const PROG_KPIS: ProgKpi[] = [
  { key: "uptime", label: "Disponibilidad (uptime)", value: "99,9 %", hint: "Últimos 30 días" },
  { key: "usuarios", label: "Usuarios activos", value: "688", hint: "+12 esta semana" },
  { key: "errores", label: "Errores 24 h", value: "2", hint: "Ambos resueltos" },
  { key: "respaldo", label: "Último respaldo", value: "hace 3 h", hint: "Automático · 02:00" },
];

/* -------------------------- Acciones rápidas ----------------------- */

/** Clave estable que enlaza cada acción con su icono/tono en la página. */
export type ProgActionKey = "crear-usuario" | "asignar-rol" | "ejecutar-respaldo" | "ver-registros";

export interface ProgQuickAction {
  key: ProgActionKey;
  label: string;
}

export const PROG_QUICK_ACTIONS: ProgQuickAction[] = [
  { key: "crear-usuario", label: "Crear usuario" },
  { key: "asignar-rol", label: "Asignar rol" },
  { key: "ejecutar-respaldo", label: "Ejecutar respaldo" },
  { key: "ver-registros", label: "Ver registros" },
];

/* ---------------------------- Usuarios ----------------------------- */

export type RoleKey =
  | "Estudiante"
  | "Docente"
  | "Coordinador"
  | "Evaluador"
  | "Tesorería"
  | "Director"
  | "Programador";

export type EstadoUsuario = "Activo" | "Inactivo" | "Bloqueado";

/** Tono del avatar (enlaza con la paleta `accent` en la página). */
export type AvatarTone = "blue" | "green" | "amber" | "red" | "purple";

export interface ProgUser {
  name: string;
  initials: string;
  email: string;
  role: RoleKey;
  state: EstadoUsuario;
  lastAccess: string;
  avatarTone: AvatarTone;
}

export const PROG_USERS: ProgUser[] = [
  { name: "María Fernández", initials: "MF", email: "m.fernandez@edugestion.edu", role: "Docente", state: "Activo", lastAccess: "hace 8 min", avatarTone: "green" },
  { name: "Carlos Rivas", initials: "CR", email: "c.rivas@edugestion.edu", role: "Coordinador", state: "Activo", lastAccess: "hace 41 min", avatarTone: "purple" },
  { name: "Ana Belén Soto", initials: "AS", email: "a.soto@edugestion.edu", role: "Tesorería", state: "Activo", lastAccess: "hace 2 h", avatarTone: "blue" },
  { name: "Jorge Medina", initials: "JM", email: "j.medina@edugestion.edu", role: "Evaluador", state: "Inactivo", lastAccess: "hace 6 días", avatarTone: "amber" },
  { name: "Lucía Paredes", initials: "LP", email: "l.paredes@edugestion.edu", role: "Estudiante", state: "Bloqueado", lastAccess: "hace 22 días", avatarTone: "red" },
  { name: "Roberto Salas", initials: "RS", email: "r.salas@edugestion.edu", role: "Director", state: "Activo", lastAccess: "ayer, 18:40", avatarTone: "red" },
  { name: "Diana Ortega", initials: "DO", email: "d.ortega@edugestion.edu", role: "Programador", state: "Activo", lastAccess: "hace 3 min", avatarTone: "purple" },
];

/* -------------------- Estado de servicios / integraciones ---------- */

export type ServiceState = "Operativo" | "Degradado" | "Caído";

/** Clave estable que enlaza cada servicio con su icono/tono en la página. */
export type ServiceKey = "api" | "db" | "whatsapp" | "pagos" | "correo";

export interface ProgService {
  key: ServiceKey;
  name: string;
  state: ServiceState;
  metric: string;
  detail: string;
}

export const PROG_SERVICES: ProgService[] = [
  { key: "api", name: "API principal", state: "Operativo", metric: "142 ms", detail: "Uptime 99,98 %" },
  { key: "db", name: "Base de datos", state: "Operativo", metric: "23 ms", detail: "Uptime 99,99 %" },
  { key: "whatsapp", name: "Notificaciones WhatsApp", state: "Degradado", metric: "1,8 s", detail: "Cola con retraso" },
  { key: "pagos", name: "Pasarela de pagos", state: "Operativo", metric: "310 ms", detail: "Uptime 99,90 %" },
  { key: "correo", name: "Servicio de correo", state: "Caído", metric: "—", detail: "Reintentando envío" },
];

/* ------------------ Distribución de usuarios por rol --------------- */

export interface RoleDistributionItem {
  role: string;
  usuarios: number;
  fill: string;
}

export const PROG_ROLE_DISTRIBUTION: RoleDistributionItem[] = [
  { role: "Estudiante", usuarios: 512, fill: "#1a56db" },
  { role: "Docente", usuarios: 96, fill: "#16a34a" },
  { role: "Coordinador", usuarios: 34, fill: "#7c3aed" },
  { role: "Evaluador", usuarios: 28, fill: "#ca8a04" },
  { role: "Tesorería", usuarios: 9, fill: "#0369a1" },
  { role: "Director", usuarios: 6, fill: "#dc2626" },
  { role: "Programador", usuarios: 3, fill: "#374151" },
];

/* ------------------------- Registros (logs) ------------------------ */

export type LogLevel = "INFO" | "ADVERTENCIA" | "ERROR";

export interface ProgLog {
  time: string;
  level: LogLevel;
  message: string;
}

export const PROG_LOGS: ProgLog[] = [
  { time: "09:42:11", level: "INFO", message: "Pago manual confirmado por Tesorería (folio #F-20496)" },
  { time: "09:37:58", level: "ERROR", message: "Servicio de correo sin respuesta tras 3 reintentos" },
  { time: "09:15:02", level: "ADVERTENCIA", message: "Cola de WhatsApp con 128 mensajes pendientes de envío" },
  { time: "08:54:33", level: "INFO", message: "Nuevo usuario creado: d.ortega (rol Programador)" },
  { time: "08:31:19", level: "ADVERTENCIA", message: "Intento de acceso fallido para l.paredes (cuenta bloqueada)" },
  { time: "02:00:04", level: "INFO", message: "Respaldo automático completado (1,8 GB)" },
];
