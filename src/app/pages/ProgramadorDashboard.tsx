import {
  Activity,
  Users,
  AlertTriangle,
  DatabaseBackup,
  UserPlus,
  ShieldCheck,
  PlayCircle,
  ScrollText,
  Server,
  Database,
  MessageCircle,
  CreditCard,
  Mail,
  Pencil,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { color, shadow, accent } from "../theme/tokens";

/* ------------------------------------------------------------------ */
/* Datos ficticios                                                    */
/* ------------------------------------------------------------------ */

type AccentKey = keyof typeof accent;

const KPIS: {
  label: string;
  value: string;
  hint: string;
  icon: React.FC<{ style?: React.CSSProperties }>;
  tone: AccentKey;
}[] = [
  { label: "Disponibilidad (uptime)", value: "99,9 %", hint: "Últimos 30 días", icon: Activity, tone: "green" },
  { label: "Usuarios activos", value: "688", hint: "+12 esta semana", icon: Users, tone: "blue" },
  { label: "Errores 24 h", value: "2", hint: "Ambos resueltos", icon: AlertTriangle, tone: "amber" },
  { label: "Último respaldo", value: "hace 3 h", hint: "Automático · 02:00", icon: DatabaseBackup, tone: "purple" },
];

const QUICK_ACTIONS: {
  label: string;
  icon: React.FC<{ style?: React.CSSProperties }>;
  tone: AccentKey;
}[] = [
  { label: "Crear usuario", icon: UserPlus, tone: "blue" },
  { label: "Asignar rol", icon: ShieldCheck, tone: "purple" },
  { label: "Ejecutar respaldo", icon: PlayCircle, tone: "green" },
  { label: "Ver registros", icon: ScrollText, tone: "amber" },
];

type RoleKey =
  | "Estudiante"
  | "Docente"
  | "Coordinador"
  | "Evaluador"
  | "Tesorería"
  | "Director"
  | "Programador";

const ROLE_STYLE: Record<RoleKey, { bg: string; fg: string }> = {
  Estudiante: { bg: color.primary50, fg: color.primary },
  Docente: { bg: color.successBg, fg: color.success },
  Coordinador: { bg: color.purpleBg, fg: color.purple },
  Evaluador: { bg: color.warningBg, fg: color.warning },
  Tesorería: { bg: "#e0f2fe", fg: "#0369a1" },
  Director: { bg: color.dangerBg, fg: color.danger },
  Programador: { bg: "#e2e8f0", fg: color.ink700 },
};

type EstadoUsuario = "Activo" | "Inactivo" | "Bloqueado";

const STATE_STYLE: Record<EstadoUsuario, { bg: string; fg: string }> = {
  Activo: { bg: color.successBg, fg: color.success },
  Inactivo: { bg: color.subtle, fg: color.ink500 },
  Bloqueado: { bg: color.dangerBg, fg: color.danger },
};

const USERS: {
  name: string;
  initials: string;
  email: string;
  role: RoleKey;
  state: EstadoUsuario;
  lastAccess: string;
  avatarTone: AccentKey;
}[] = [
  { name: "María Fernández", initials: "MF", email: "m.fernandez@edugestion.edu", role: "Docente", state: "Activo", lastAccess: "hace 8 min", avatarTone: "green" },
  { name: "Carlos Rivas", initials: "CR", email: "c.rivas@edugestion.edu", role: "Coordinador", state: "Activo", lastAccess: "hace 41 min", avatarTone: "purple" },
  { name: "Ana Belén Soto", initials: "AS", email: "a.soto@edugestion.edu", role: "Tesorería", state: "Activo", lastAccess: "hace 2 h", avatarTone: "blue" },
  { name: "Jorge Medina", initials: "JM", email: "j.medina@edugestion.edu", role: "Evaluador", state: "Inactivo", lastAccess: "hace 6 días", avatarTone: "amber" },
  { name: "Lucía Paredes", initials: "LP", email: "l.paredes@edugestion.edu", role: "Estudiante", state: "Bloqueado", lastAccess: "hace 22 días", avatarTone: "red" },
  { name: "Roberto Salas", initials: "RS", email: "r.salas@edugestion.edu", role: "Director", state: "Activo", lastAccess: "ayer, 18:40", avatarTone: "red" },
  { name: "Diana Ortega", initials: "DO", email: "d.ortega@edugestion.edu", role: "Programador", state: "Activo", lastAccess: "hace 3 min", avatarTone: "purple" },
];

type ServiceState = "Operativo" | "Degradado" | "Caído";

const SERVICE_STATE: Record<ServiceState, { fg: string; label: string }> = {
  Operativo: { fg: color.success, label: "Operativo" },
  Degradado: { fg: color.warningStrong, label: "Degradado" },
  Caído: { fg: color.danger, label: "Caído" },
};

const SERVICES: {
  name: string;
  icon: React.FC<{ style?: React.CSSProperties }>;
  state: ServiceState;
  metric: string;
  detail: string;
  tone: AccentKey;
}[] = [
  { name: "API principal", icon: Server, state: "Operativo", metric: "142 ms", detail: "Uptime 99,98 %", tone: "blue" },
  { name: "Base de datos", icon: Database, state: "Operativo", metric: "23 ms", detail: "Uptime 99,99 %", tone: "green" },
  { name: "Notificaciones WhatsApp", icon: MessageCircle, state: "Degradado", metric: "1,8 s", detail: "Cola con retraso", tone: "green" },
  { name: "Pasarela de pagos", icon: CreditCard, state: "Operativo", metric: "310 ms", detail: "Uptime 99,90 %", tone: "amber" },
  { name: "Servicio de correo", icon: Mail, state: "Caído", metric: "—", detail: "Reintentando envío", tone: "red" },
];

const ROLE_DISTRIBUTION: { role: string; usuarios: number; fill: string }[] = [
  { role: "Estudiante", usuarios: 512, fill: color.primary },
  { role: "Docente", usuarios: 96, fill: color.success },
  { role: "Coordinador", usuarios: 34, fill: color.purple },
  { role: "Evaluador", usuarios: 28, fill: color.warningStrong },
  { role: "Tesorería", usuarios: 9, fill: "#0369a1" },
  { role: "Director", usuarios: 6, fill: color.danger },
  { role: "Programador", usuarios: 3, fill: color.ink700 },
];

type LogLevel = "INFO" | "ADVERTENCIA" | "ERROR";

const LOG_STYLE: Record<LogLevel, { bg: string; fg: string }> = {
  INFO: { bg: color.primary50, fg: color.primary },
  ADVERTENCIA: { bg: color.warningBg, fg: color.warning },
  ERROR: { bg: color.dangerBg, fg: color.danger },
};

const LOGS: { time: string; level: LogLevel; message: string }[] = [
  { time: "09:42:11", level: "INFO", message: "Pago manual confirmado por Tesorería (folio #F-20496)" },
  { time: "09:37:58", level: "ERROR", message: "Servicio de correo sin respuesta tras 3 reintentos" },
  { time: "09:15:02", level: "ADVERTENCIA", message: "Cola de WhatsApp con 128 mensajes pendientes de envío" },
  { time: "08:54:33", level: "INFO", message: "Nuevo usuario creado: d.ortega (rol Programador)" },
  { time: "08:31:19", level: "ADVERTENCIA", message: "Intento de acceso fallido para l.paredes (cuenta bloqueada)" },
  { time: "02:00:04", level: "INFO", message: "Respaldo automático completado (1,8 GB)" },
];

/* ------------------------------------------------------------------ */
/* Subcomponentes                                                     */
/* ------------------------------------------------------------------ */

function SectionHeader({ title, link }: { title: string; link?: string }) {
  return (
    <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
      <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">{title}</h3>
      {link && <span className="text-[0.8rem] text-edu-primary cursor-pointer font-medium">{link} →</span>}
    </div>
  );
}

function Pill({ bg, fg, children }: { bg: string; fg: string; children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit"
      style={{ backgroundColor: bg, color: fg }}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Página                                                             */
/* ------------------------------------------------------------------ */

export function ProgramadorDashboard() {
  const totalUsuarios = ROLE_DISTRIBUTION.reduce((acc, r) => acc + r.usuarios, 0);

  return (
    <div className="flex flex-col gap-5">
      {/* Fila de KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {KPIS.map((kpi) => {
          const Icon = kpi.icon;
          const tone = accent[kpi.tone];
          return (
            <div key={kpi.label} className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                    {kpi.label}
                  </p>
                  <p className="text-edu-ink text-[1.4rem] font-bold mt-[6px] mb-0">{kpi.value}</p>
                </div>
                <div
                  className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0"
                  style={{ backgroundColor: tone.bg }}
                >
                  <Icon style={{ width: "20px", height: "20px", color: tone.fg }} />
                </div>
              </div>
              <p className="text-edu-ink-400 text-xs m-0">{kpi.hint}</p>
            </div>
          );
        })}
      </div>

      {/* Acciones rápidas */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-4">
        <p className="text-edu-ink-500 text-[0.72rem] font-semibold mb-3 uppercase tracking-[0.05em]">
          Acciones rápidas
        </p>
        <div className="grid grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            const tone = accent[action.tone];
            return (
              <button
                key={action.label}
                className="flex items-center gap-2.5 px-3.5 py-3 rounded-edu-control border border-edu-border bg-edu-surface cursor-pointer text-left transition-colors hover:bg-edu-subtle hover:border-edu-ink-300"
              >
                <div
                  className="w-[34px] h-[34px] rounded-edu-chip flex items-center justify-center shrink-0"
                  style={{ backgroundColor: tone.bg }}
                >
                  <Icon style={{ width: "17px", height: "17px", color: tone.fg }} />
                </div>
                <span className="text-sm font-semibold text-edu-ink">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gestión de usuarios y roles */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <SectionHeader title="Gestión de usuarios y roles" link="Ver todos los usuarios" />
        <div className="grid grid-cols-[2fr_1.1fr_1fr_1fr_0.6fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
          {["Usuario", "Rol", "Estado", "Último acceso", ""].map((h, i) => (
            <span key={i} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
          ))}
        </div>
        {USERS.map((u, i) => {
          const avatar = accent[u.avatarTone];
          const roleStyle = ROLE_STYLE[u.role];
          const stateStyle = STATE_STYLE[u.state];
          return (
            <div
              key={u.email}
              className={`grid grid-cols-[2fr_1.1fr_1fr_1fr_0.6fr] px-5 py-3 items-center transition-colors hover:bg-edu-subtle ${i < USERS.length - 1 ? "border-b border-edu-border-soft" : ""}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ backgroundColor: avatar.bg, color: avatar.fg }}
                >
                  {u.initials}
                </div>
                <div className="min-w-0">
                  <div className="text-sm text-edu-ink font-semibold whitespace-nowrap overflow-hidden text-ellipsis">{u.name}</div>
                  <div className="text-xs text-edu-ink-400 whitespace-nowrap overflow-hidden text-ellipsis">{u.email}</div>
                </div>
              </div>
              <div><Pill bg={roleStyle.bg} fg={roleStyle.fg}>{u.role}</Pill></div>
              <div><Pill bg={stateStyle.bg} fg={stateStyle.fg}>{u.state}</Pill></div>
              <span className="text-[0.8125rem] text-edu-ink-500">{u.lastAccess}</span>
              <div className="flex justify-end">
                <button className="inline-flex items-center gap-[5px] px-2.5 py-[5px] rounded-edu-chip border border-edu-border bg-edu-surface text-edu-ink-700 text-[0.775rem] font-medium cursor-pointer hover:bg-edu-subtle">
                  <Pencil style={{ width: "12px", height: "12px" }} />
                  Editar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Estado de servicios / integraciones */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <SectionHeader title="Estado de servicios / integraciones" link="Ver panel de estado" />
        <div
          className="grid gap-3 px-5 py-4"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}
        >
          {SERVICES.map((svc) => {
            const Icon = svc.icon;
            const tone = accent[svc.tone];
            const st = SERVICE_STATE[svc.state];
            return (
              <div key={svc.name} className="border border-edu-border rounded-edu-control p-3.5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div
                    className="w-[34px] h-[34px] rounded-edu-chip flex items-center justify-center"
                    style={{ backgroundColor: tone.bg }}
                  >
                    <Icon style={{ width: "17px", height: "17px", color: tone.fg }} />
                  </div>
                  <span
                    className="inline-flex items-center gap-1.5 text-[0.72rem] font-semibold"
                    style={{ color: st.fg }}
                  >
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ backgroundColor: st.fg }}
                    />
                    {st.label}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-edu-ink">{svc.name}</div>
                  <div className="text-xs text-edu-ink-400 mt-0.5">{svc.detail}</div>
                </div>
                <div className="flex items-baseline gap-1.5 border-t border-edu-border-soft pt-2.5">
                  <span className="text-[1.1rem] font-bold text-edu-ink">{svc.metric}</span>
                  <span className="text-[0.7rem] text-edu-ink-400">latencia</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Distribución de usuarios por rol */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <SectionHeader title="Distribución de usuarios por rol" link={`${totalUsuarios} usuarios en total`} />
        <div className="px-5 py-[18px] h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ROLE_DISTRIBUTION} layout="vertical" margin={{ top: 4, right: 24, bottom: 4, left: 12 }} barCategoryGap="28%">
              <CartesianGrid horizontal={false} stroke={color.borderSoft} />
              <XAxis type="number" tick={{ fontSize: 11, fill: color.ink400 }} axisLine={{ stroke: color.border }} tickLine={false} />
              <YAxis
                type="category"
                dataKey="role"
                width={92}
                tick={{ fontSize: 12, fill: color.ink700 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: color.subtle }}
                contentStyle={{ borderRadius: "var(--radius-control)", border: `1px solid ${color.border}`, boxShadow: shadow.menu, fontSize: "0.8rem" }}
                labelStyle={{ color: color.ink, fontWeight: 600 }}
                formatter={(value: number) => [`${value} usuarios`, "Cantidad"]}
              />
              <Bar dataKey="usuarios" radius={[0, 6, 6, 0]} maxBarSize={22}>
                {ROLE_DISTRIBUTION.map((entry) => (
                  <Cell key={entry.role} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Registros recientes (logs) */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <SectionHeader title="Registros recientes (logs)" link="Ver todos los registros" />
        <div>
          {LOGS.map((log, i) => {
            const lvl = LOG_STYLE[log.level];
            return (
              <div
                key={i}
                className={`flex items-center gap-3.5 px-5 py-[11px] ${i < LOGS.length - 1 ? "border-b border-edu-border-soft" : ""}`}
              >
                <span className="font-mono text-[0.78rem] text-edu-ink-400 shrink-0 w-[68px]">{log.time}</span>
                <span className="shrink-0 w-[104px]">
                  <Pill bg={lvl.bg} fg={lvl.fg}>{log.level}</Pill>
                </span>
                <span className="font-mono text-[0.8rem] text-edu-ink-700 leading-[1.5]">{log.message}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
