import { Pencil } from "lucide-react";
import { accent } from "@themes/tokens";
import type { RoleKey, EstadoUsuario } from "@shared/services/actions/misc";
import { SectionHeader } from "./SectionHeader";
import { Pill } from "./Pill";

type AccentKey = keyof typeof accent;

interface UserItem {
  email: string;
  name: string;
  initials: string;
  avatarTone: AccentKey;
  role: RoleKey;
  state: EstadoUsuario;
  lastAccess: string;
}

interface UsersTableProps {
  users: UserItem[];
  ROLE_STYLE: Record<RoleKey, { bg: string; fg: string }>;
  STATE_STYLE: Record<EstadoUsuario, { bg: string; fg: string }>;
}

export function UsersTable({ users, ROLE_STYLE, STATE_STYLE }: UsersTableProps) {
  return (
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
  );
}
