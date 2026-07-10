import {
  Activity,
  Users,
  AlertTriangle,
  DatabaseBackup,
  UserPlus,
  ShieldCheck,
  PlayCircle,
  ScrollText,
} from "lucide-react";
import { color, shadow, accent } from "@themes/tokens";
import { useFetch } from "@shared/services";
import {
  getProgKpis,
  getProgQuickActions,
  getProgUsers,
  getProgLogs,
  getProgSystemMetrics,
  type ProgKpiKey,
  type ProgActionKey,
  type RoleKey,
  type EstadoUsuario,
  type LogLevel,
} from "@shared/services/actions/misc";

type AccentKey = keyof typeof accent;

const KPI_STYLE: Record<ProgKpiKey, { icon: React.FC<{ style?: React.CSSProperties }>; tone: AccentKey }> = {
  uptime:   { icon: Activity,       tone: "green"  },
  usuarios: { icon: Users,          tone: "blue"   },
  errores:  { icon: AlertTriangle,  tone: "amber"  },
  respaldo: { icon: DatabaseBackup, tone: "purple" },
};

const ACTION_STYLE: Record<ProgActionKey, { icon: React.FC<{ style?: React.CSSProperties }>; tone: AccentKey }> = {
  "crear-usuario":     { icon: UserPlus,    tone: "blue"   },
  "asignar-rol":       { icon: ShieldCheck, tone: "purple" },
  "ejecutar-respaldo": { icon: PlayCircle,  tone: "green"  },
  "ver-registros":     { icon: ScrollText,  tone: "amber"  },
};

const ROLE_STYLE: Record<RoleKey, { bg: string; fg: string }> = {
  Estudiante:  { bg: color.primary50, fg: color.primary  },
  Docente:     { bg: color.successBg, fg: color.success  },
  Coordinador: { bg: color.purpleBg,  fg: color.purple   },
  Evaluador:   { bg: color.warningBg, fg: color.warning  },
  "Tesorería": { bg: "#e0f2fe",       fg: "#0369a1"      },
  Director:    { bg: color.dangerBg,  fg: color.danger   },
  Programador: { bg: "#e2e8f0",       fg: color.ink700   },
};

const STATE_STYLE: Record<EstadoUsuario, { bg: string; fg: string }> = {
  Activo:    { bg: color.successBg, fg: color.success },
  Inactivo:  { bg: color.subtle,    fg: color.ink500  },
  Bloqueado: { bg: color.dangerBg,  fg: color.danger  },
};

const LOG_LEVEL_STYLE: Record<LogLevel, { bg: string; fg: string }> = {
  INFO:        { bg: color.primary50, fg: color.primary },
  ADVERTENCIA: { bg: color.warningBg, fg: color.warning },
  ERROR:       { bg: color.dangerBg,  fg: color.danger  },
};

export function useProgramadorDashboard() {
  const { data: kpis, loading: loadingKpis } = useFetch(getProgKpis, []);
  const { data: quickActions } = useFetch(getProgQuickActions, []);
  const { data: allUsers } = useFetch(getProgUsers, []);
  const { data: allLogs } = useFetch(getProgLogs, []);
  const { data: systemMetrics } = useFetch(getProgSystemMetrics, []);

  const previewUsers = allUsers.slice(0, 5);
  const previewLogs = allLogs.slice(0, 5);

  return {
    loadingKpis,
    kpis,
    quickActions,
    systemMetrics,
    previewUsers,
    previewLogs,
    KPI_STYLE,
    ACTION_STYLE,
    ROLE_STYLE,
    STATE_STYLE,
    LOG_LEVEL_STYLE,
  };
}

export { color, shadow, accent };
