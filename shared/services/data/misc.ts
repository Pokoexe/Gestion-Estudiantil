/* ------------------------------------------------------------------ */
/* Datos ficticios del dominio MISC (panel del Programador).            */
/*                                                                      */
/* Solo se centralizan aquí los DATOS estáticos que vivían inline en    */
/* el ProgramadorDashboard (KPIs, acciones rápidas, usuarios, estado    */
/* de servicios, distribución por rol y registros/logs). Los mapas      */
/* presentacionales (iconos, colores/tonos, clases) siguen en la        */
/* página y se enlazan con estos datos mediante claves estables.        */
/* ------------------------------------------------------------------ */

/* ---------------------- Métricas del sistema (área) ---------------- */

export interface SystemMetricPoint {
  hora: string;
  usuarios: number;
  uptime: number;
  errores: number;
}

export const PROG_SYSTEM_METRICS: SystemMetricPoint[] = [
  { hora: "00:00", usuarios: 45,  uptime: 100.0, errores: 0 },
  { hora: "02:00", usuarios: 28,  uptime: 99.9,  errores: 0 },
  { hora: "04:00", usuarios: 19,  uptime: 99.8,  errores: 1 },
  { hora: "06:00", usuarios: 68,  uptime: 99.9,  errores: 0 },
  { hora: "08:00", usuarios: 298, uptime: 99.7,  errores: 2 },
  { hora: "09:00", usuarios: 445, uptime: 99.5,  errores: 3 },
  { hora: "10:00", usuarios: 536, uptime: 99.3,  errores: 4 },
  { hora: "11:00", usuarios: 604, uptime: 99.1,  errores: 5 },
  { hora: "12:00", usuarios: 578, uptime: 99.4,  errores: 2 },
  { hora: "13:00", usuarios: 512, uptime: 99.6,  errores: 1 },
  { hora: "14:00", usuarios: 548, uptime: 99.5,  errores: 2 },
  { hora: "15:00", usuarios: 488, uptime: 99.7,  errores: 1 },
  { hora: "16:00", usuarios: 392, uptime: 99.8,  errores: 0 },
  { hora: "17:00", usuarios: 314, uptime: 99.9,  errores: 0 },
  { hora: "18:00", usuarios: 201, uptime: 99.9,  errores: 0 },
  { hora: "20:00", usuarios: 128, uptime: 100.0, errores: 0 },
  { hora: "22:00", usuarios: 78,  uptime: 100.0, errores: 0 },
];

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
  createdAt: string;
}

export const PROG_USERS: ProgUser[] = [
  { name: "Roberto Salas",      initials: "RS", email: "r.salas@edugestion.edu",       role: "Director",     state: "Activo",    lastAccess: "ayer, 18:40",   avatarTone: "red",    createdAt: "2022-07-01" },
  { name: "Fernando López",     initials: "FL", email: "f.lopez@edugestion.edu",        role: "Docente",      state: "Bloqueado", lastAccess: "hace 15 días",  avatarTone: "amber",  createdAt: "2022-11-03" },
  { name: "Ana Belén Soto",     initials: "AS", email: "a.soto@edugestion.edu",         role: "Tesorería",    state: "Activo",    lastAccess: "hace 2 h",      avatarTone: "blue",   createdAt: "2023-09-22" },
  { name: "Valentina Mora",     initials: "VM", email: "v.mora@edugestion.edu",         role: "Coordinador",  state: "Inactivo",  lastAccess: "hace 3 días",   avatarTone: "blue",   createdAt: "2023-08-05" },
  { name: "Jorge Medina",       initials: "JM", email: "j.medina@edugestion.edu",       role: "Evaluador",    state: "Inactivo",  lastAccess: "hace 6 días",   avatarTone: "amber",  createdAt: "2023-11-30" },
  { name: "Sofía Mendoza",      initials: "SM", email: "s.mendoza@edugestion.edu",      role: "Docente",      state: "Activo",    lastAccess: "hace 2 h",      avatarTone: "green",  createdAt: "2023-12-10" },
  { name: "Carmen Villanueva",  initials: "CV", email: "c.villanueva@edugestion.edu",   role: "Tesorería",    state: "Activo",    lastAccess: "hace 1 día",    avatarTone: "purple", createdAt: "2023-10-18" },
  { name: "Carlos Rivas",       initials: "CR", email: "c.rivas@edugestion.edu",        role: "Coordinador",  state: "Activo",    lastAccess: "hace 41 min",   avatarTone: "purple", createdAt: "2024-01-08" },
  { name: "Andrés Gutiérrez",   initials: "AG", email: "a.gutierrez@edugestion.edu",    role: "Evaluador",    state: "Activo",    lastAccess: "hace 30 min",   avatarTone: "amber",  createdAt: "2024-01-25" },
  { name: "Lucía Paredes",      initials: "LP", email: "l.paredes@edugestion.edu",      role: "Estudiante",   state: "Bloqueado", lastAccess: "hace 22 días",  avatarTone: "red",    createdAt: "2024-02-14" },
  { name: "María Fernández",    initials: "MF", email: "m.fernandez@edugestion.edu",    role: "Docente",      state: "Activo",    lastAccess: "hace 8 min",    avatarTone: "green",  createdAt: "2024-03-15" },
  { name: "Pedro Castillo",     initials: "PC", email: "p.castillo@edugestion.edu",     role: "Docente",      state: "Activo",    lastAccess: "hace 1 h",      avatarTone: "green",  createdAt: "2024-04-11" },
  { name: "Diana Ortega",       initials: "DO", email: "d.ortega@edugestion.edu",       role: "Programador",  state: "Activo",    lastAccess: "hace 3 min",    avatarTone: "purple", createdAt: "2024-05-20" },
  { name: "Luis Herrera",       initials: "LH", email: "l.herrera@edugestion.edu",      role: "Estudiante",   state: "Activo",    lastAccess: "hace 4 h",      avatarTone: "blue",   createdAt: "2024-06-01" },
];

/* -------------------- Estado de servicios / integraciones ---------- */

export type ServiceState = "Operativo" | "Degradado" | "Caído";

export type ServiceTipo = "interno" | "externo";

/** Clave estable que enlaza cada servicio con su icono/tono en la página. */
export type ServiceKey = "api" | "db" | "whatsapp" | "pagos" | "correo";

export interface ProgService {
  key: ServiceKey;
  name: string;
  state: ServiceState;
  metric: string;
  detail: string;
  tipo: ServiceTipo;
}

export const PROG_SERVICES: ProgService[] = [
  { key: "api",      name: "API principal",           state: "Operativo", metric: "142 ms", detail: "Uptime 99,98 %",    tipo: "interno" },
  { key: "db",       name: "Base de datos",            state: "Operativo", metric: "23 ms",  detail: "Uptime 99,99 %",    tipo: "interno" },
  { key: "whatsapp", name: "Notificaciones WhatsApp",  state: "Degradado", metric: "1,8 s",  detail: "Cola con retraso",  tipo: "externo" },
  { key: "pagos",    name: "Pasarela de pagos",        state: "Operativo", metric: "310 ms", detail: "Uptime 99,90 %",    tipo: "externo" },
  { key: "correo",   name: "Servicio de correo",       state: "Caído",     metric: "—",      detail: "Reintentando envío", tipo: "externo" },
];

/* ----------------------- Integraciones externas -------------------- */

export type IntegracionTipo = "mensajería" | "pagos" | "correo" | "almacenamiento" | "autenticación";
export type IntegracionEstado = "Activa" | "Inactiva" | "Error";

export interface ProgIntegracion {
  nombre: string;
  proveedor: string;
  tipo: IntegracionTipo;
  estado: IntegracionEstado;
  ultimaSync: string;
  detalles: string;
}

export const PROG_INTEGRACIONES: ProgIntegracion[] = [
  { nombre: "WhatsApp Business",   proveedor: "Meta",          tipo: "mensajería",    estado: "Activa",   ultimaSync: "hace 3 min",   detalles: "Cola con 128 msgs pendientes" },
  { nombre: "Pasarela principal",  proveedor: "Stripe",        tipo: "pagos",         estado: "Activa",   ultimaSync: "hace 12 min",  detalles: "Uptime 99,90 %" },
  { nombre: "Servicio de correo",  proveedor: "SendGrid",      tipo: "correo",        estado: "Error",    ultimaSync: "hace 1 h",     detalles: "Reintentando envío desde 05:55" },
  { nombre: "Almacenamiento",      proveedor: "AWS S3",        tipo: "almacenamiento", estado: "Activa",  ultimaSync: "hace 2 min",   detalles: "32 GB usados · 500 GB disponibles" },
  { nombre: "Autenticación SSO",   proveedor: "Google",        tipo: "autenticación", estado: "Activa",   ultimaSync: "hace 5 min",   detalles: "SSO activo para 688 cuentas" },
  { nombre: "SMS masivos",         proveedor: "Twilio",        tipo: "mensajería",    estado: "Inactiva", ultimaSync: "hace 3 días",  detalles: "Contrato pausado" },
  { nombre: "Pagos locales",       proveedor: "Mercado Pago",  tipo: "pagos",         estado: "Activa",   ultimaSync: "hace 18 min",  detalles: "284 transacciones este mes" },
  { nombre: "Correo alternativo",  proveedor: "Mailgun",       tipo: "correo",        estado: "Inactiva", ultimaSync: "hace 6 días",  detalles: "Fallback desactivado" },
  { nombre: "Respaldo en nube",    proveedor: "Google Drive",  tipo: "almacenamiento", estado: "Activa",  ultimaSync: "hace 2 h",     detalles: "Último respaldo: 1,8 GB" },
  { nombre: "Directorio LDAP",     proveedor: "Microsoft AD",  tipo: "autenticación", estado: "Activa",   ultimaSync: "hace 9 min",   detalles: "512 cuentas sincronizadas" },
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

export type LogTipo = "docente" | "evaluador" | "sistema";

export interface ProgLog {
  time: string;
  level: LogLevel;
  tipo: LogTipo;
  message: string;
}

export const PROG_LOGS: ProgLog[] = [
  { time: "09:42:11", level: "INFO",        tipo: "sistema",   message: "Pago manual confirmado por Tesorería (folio #F-20496)" },
  { time: "09:37:58", level: "ERROR",       tipo: "sistema",   message: "Servicio de correo sin respuesta tras 3 reintentos" },
  { time: "09:15:02", level: "ADVERTENCIA", tipo: "sistema",   message: "Cola de WhatsApp con 128 mensajes pendientes de envío" },
  { time: "08:54:33", level: "INFO",        tipo: "docente",   message: "Nuevo usuario creado: m.fernandez (rol Docente)" },
  { time: "08:31:19", level: "ADVERTENCIA", tipo: "docente",   message: "Intento de acceso fallido para l.paredes (cuenta bloqueada)" },
  { time: "08:22:05", level: "ERROR",       tipo: "evaluador", message: "Fallo al exportar boletín del estudiante ID #1092" },
  { time: "08:10:47", level: "INFO",        tipo: "evaluador", message: "Cronograma de evaluaciones actualizado para 3° año" },
  { time: "07:58:34", level: "INFO",        tipo: "docente",   message: "Plan de clase enviado por m.lozano para revisión" },
  { time: "07:45:20", level: "ADVERTENCIA", tipo: "evaluador", message: "Discusión académica iniciada con quórum mínimo (2/5 miembros)" },
  { time: "07:30:12", level: "INFO",        tipo: "sistema",   message: "Sesión iniciada para c.rivas desde 192.168.1.44" },
  { time: "07:15:00", level: "ERROR",       tipo: "docente",   message: "Error al guardar planificación para sección 5A" },
  { time: "06:50:29", level: "INFO",        tipo: "evaluador", message: "Boleta generada para estudiante ID #2041" },
  { time: "06:33:44", level: "ADVERTENCIA", tipo: "sistema",   message: "Carga del servidor al 82 % — uso elevado de CPU" },
  { time: "06:12:08", level: "INFO",        tipo: "docente",   message: "Calificaciones del lapso III subidas por j.medina" },
  { time: "05:55:19", level: "ERROR",       tipo: "sistema",   message: "Timeout en consulta SQL para reporte de asistencia masiva" },
  { time: "05:40:01", level: "INFO",        tipo: "evaluador", message: "Acta de consejo firmada digitalmente por a.soto" },
  { time: "05:25:37", level: "ADVERTENCIA", tipo: "docente",   message: "Sección 4B sin horario asignado para próxima semana" },
  { time: "05:10:22", level: "INFO",        tipo: "sistema",   message: "Token de sesión renovado para a.soto (2 h de inactividad)" },
  { time: "04:48:55", level: "ERROR",       tipo: "evaluador", message: "Plantilla de boletín no encontrada para nivel Bachillerato" },
  { time: "02:00:04", level: "INFO",        tipo: "sistema",   message: "Respaldo automático completado (1,8 GB)" },
];
