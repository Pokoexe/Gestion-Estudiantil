import { Link } from "react-router";
import { accent } from "@themes/tokens";
import type { RoleKey, EstadoUsuario } from "@shared/services/actions/misc";
import { Pill } from "./Pill";

type AccentKey = keyof typeof accent;

interface UserPreviewItem {
  name: string;
  initials: string;
  role: RoleKey;
  state: EstadoUsuario;
  lastAccess: string;
  avatarTone: AccentKey;
}

interface UsersPreviewProps {
  users: UserPreviewItem[];
  ROLE_STYLE: Record<RoleKey, { bg: string; fg: string }>;
  STATE_STYLE: Record<EstadoUsuario, { bg: string; fg: string }>;
}

export function UsersPreview({ users, ROLE_STYLE, STATE_STYLE }: UsersPreviewProps) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Usuarios y roles</h3>
        <Link to="/programador/usuarios" className="text-[0.8rem] text-edu-primary font-medium hover:underline">
          Ver todos →
        </Link>
      </div>
      <div>
        {users.map((u, i) => {
          const av = accent[u.avatarTone];
          const roleStyle = ROLE_STYLE[u.role];
          const stateStyle = STATE_STYLE[u.state];
          return (
            <div
              key={u.name}
              className={`flex items-center gap-3 px-5 py-3 transition-colors hover:bg-edu-subtle ${i < users.length - 1 ? "border-b border-edu-border-soft" : ""}`}
            >
              <div
                className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{ backgroundColor: av.bg, color: av.fg }}
              >
                {u.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-edu-ink font-semibold truncate">{u.name}</div>
                <div className="text-xs text-edu-ink-400">{u.lastAccess}</div>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <Pill bg={roleStyle.bg} fg={roleStyle.fg}>{u.role}</Pill>
                <Pill bg={stateStyle.bg} fg={stateStyle.fg}>{u.state}</Pill>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
