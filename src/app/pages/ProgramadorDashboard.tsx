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
import { useFetch } from "../datos_maquetados";
import {
  getProgKpis,
  getProgQuickActions,
  getProgUsers,
  getProgServices,
  getProgRoleDistribution,
  getProgLogs,
  type ProgKpiKey,
  type ProgActionKey,
  type RoleKey,
  type EstadoUsuario,
  type ServiceState,
  type ServiceKey,
  type LogLevel,
} from "../datos_maquetados/actions/misc";

/* ------------------------------------------------------------------ */
/* Mapas presentacionales (iconos, tonos, clases)                     */
/* Los DATOS viven en datos_maquetados/data/misc.ts y llegan por fetch;*/
/* aquí solo se enlazan con su presentación mediante claves estables.  */
/* ------------------------------------------------------------------ */

type AccentKey = keyof typeof accent;

/** Icono + tono de cada KPI, por clave. */
const KPI_STYLE: Record<ProgKpiKey, { icon: React.FC<{ style?: React.CSSProperties }>; tone: AccentKey }> = {
  uptime: { icon: Activity, tone: "green" },
  usuarios: { icon: Users, tone: "blue" },
  errores: { icon: AlertTriangle, tone: "amber" },
  respaldo: { icon: DatabaseBackup, tone: "purple" },
};

/** Icono + tono de cada acción rápida, por clave. */
const ACTION_STYLE: Record<ProgActionKey, { icon: React.FC<{ style?: React.CSSProperties }>; tone: AccentKey }> = {
  "crear-usuario": { icon: UserPlus, tone: "blue" },
  "asignar-rol": { icon: ShieldCheck, tone: "purple" },
  "ejecutar-respaldo": { icon: PlayCircle, tone: "green" },
  "ver-registros": { icon: ScrollText, tone: "amber" },
};

const ROLE_STYLE: Record<RoleKey, { bg: string; fg: string }> = {
  Estudiante: { bg: color.primary50, fg: color.primary },
  Docente: { bg: color.successBg, fg: color.success },
  Coordinador: { bg: color.purpleBg, fg: color.purple },
  Evaluador: { bg: color.warningBg, fg: color.warning },
  Tesorería: { bg: "#e0f2fe", fg: "#0369a1" },
  Director: { bg: color.dangerBg, fg: color.danger },
  Programador: { bg: "#e2e8f0", fg: color.ink700 },
};

const STATE_STYLE: Record<EstadoUsuario, { bg: string; fg: string }> = {
  Activo: { bg: color.successBg, fg: color.success },
  Inactivo: { bg: color.subtle, fg: color.ink500 },
  Bloqueado: { bg: color.dangerBg, fg: color.danger },
};

const SERVICE_STATE: Record<ServiceState, { fg: string; label: string }> = {
  Operativo: { fg: color.success, label: "Operativo" },
  Degradado: { fg: color.warningStrong, label: "Degradado" },
  Caído: { fg: color.danger, label: "Caído" },
};

/** Icono + tono de cada servicio, por clave. */
const SERVICE_STYLE: Record<ServiceKey, { icon: React.FC<{ style?: React.CSSProperties }>; tone: AccentKey }> = {
  api: { icon: Server, tone: "blue" },
  db: { icon: Database, tone: "green" },
  whatsapp: { icon: MessageCircle, tone: "green" },
  pagos: { icon: CreditCard, tone: "amber" },
  correo: { icon: Mail, tone: "red" },
};

const LOG_STYLE: Record<LogLevel, { bg: string; fg: string }> = {
  INFO: { bg: color.primary50, fg: color.primary },
  ADVERTENCIA: { bg: color.warningBg, fg: color.warning },
  ERROR: { bg: color.dangerBg, fg: color.danger },
};

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
  const { data: kpis, loading: loadingKpis } = useFetch(getProgKpis, []);
  const { data: quickActions } = useFetch(getProgQuickActions, []);
  const { data: users } = useFetch(getProgUsers, []);
  const { data: services } = useFetch(getProgServices, []);
  const { data: roleDistribution } = useFetch(getProgRoleDistribution, []);
  const { data: logs } = useFetch(getProgLogs, []);

  const totalUsuarios = roleDistribution.reduce((acc, r) => acc + r.usuarios, 0);

  if (loadingKpis) {
    return (
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">
        Cargando…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Fila de KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const style = KPI_STYLE[kpi.key];
          const Icon = style.icon;
          const tone = accent[style.tone];
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const style = ACTION_STYLE[action.key];
            const Icon = style.icon;
            const tone = accent[style.tone];
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
        <div className="overflow-x-auto">
        <div className="min-w-[680px]">
        <div className="grid grid-cols-[2fr_1.1fr_1fr_1fr_0.6fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
          {["Usuario", "Rol", "Estado", "Último acceso", ""].map((h, i) => (
            <span key={i} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
          ))}
        </div>
        {users.map((u, i) => {
          const avatar = accent[u.avatarTone];
          const roleStyle = ROLE_STYLE[u.role];
          const stateStyle = STATE_STYLE[u.state];
          return (
            <div
              key={u.email}
              className={`grid grid-cols-[2fr_1.1fr_1fr_1fr_0.6fr] px-5 py-3 items-center transition-colors hover:bg-edu-subtle ${i < users.length - 1 ? "border-b border-edu-border-soft" : ""}`}
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
        </div>
      </div>

      {/* Estado de servicios / integraciones */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <SectionHeader title="Estado de servicios / integraciones" link="Ver panel de estado" />
        <div
          className="grid gap-3 px-5 py-4"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}
        >
          {services.map((svc) => {
            const style = SERVICE_STYLE[svc.key];
            const Icon = style.icon;
            const tone = accent[style.tone];
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
            <BarChart data={roleDistribution} layout="vertical" margin={{ top: 4, right: 24, bottom: 4, left: 12 }} barCategoryGap="28%">
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
                {roleDistribution.map((entry) => (
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
          {logs.map((log, i) => {
            const lvl = LOG_STYLE[log.level];
            return (
              <div
                key={i}
                className={`flex items-center gap-3.5 px-5 py-[11px] ${i < logs.length - 1 ? "border-b border-edu-border-soft" : ""}`}
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
