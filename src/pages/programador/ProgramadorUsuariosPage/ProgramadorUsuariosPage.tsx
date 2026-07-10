import { Pencil, Search } from "lucide-react";
import { color, accent } from "@themes/tokens";
import { Pagination } from "@shared/ui/Pagination";
import { RoleDistributionChart } from "@/pages/programador/ProgramadorDashboard/ui/RoleDistributionChart";
import { useUsuariosPage } from "./functions/useUsuariosPage";
import type { RoleKey, EstadoUsuario } from "@shared/services/actions/misc";

const USER_COLS = "grid-cols-[2fr_1.1fr_1fr_1fr_0.6fr]";

const ROLE_STYLE: Record<RoleKey, { bg: string; fg: string }> = {
  Estudiante:  { bg: color.primary50,  fg: color.primary   },
  Docente:     { bg: color.successBg,  fg: color.success   },
  Coordinador: { bg: color.purpleBg,   fg: color.purple    },
  Evaluador:   { bg: color.warningBg,  fg: color.warning   },
  "Tesorería": { bg: "#e0f2fe",        fg: "#0369a1"       },
  Director:    { bg: color.dangerBg,   fg: color.danger    },
  Programador: { bg: "#e2e8f0",        fg: color.ink700    },
};

const STATE_STYLE: Record<EstadoUsuario, { bg: string; fg: string }> = {
  Activo:    { bg: color.successBg, fg: color.success },
  Inactivo:  { bg: color.subtle,    fg: color.ink500  },
  Bloqueado: { bg: color.dangerBg,  fg: color.danger  },
};

const ROLE_OPTIONS: RoleKey[] = [
  "Docente", "Coordinador", "Evaluador", "Tesorería", "Director", "Programador", "Estudiante",
];

export function ProgramadorUsuariosPage() {
  const {
    loading,
    query,
    setQuery,
    roleFilter,
    setRoleFilter,
    sortOrder,
    setSortOrder,
    currentPage,
    totalPages,
    paged,
    setPage,
    roleDistribution,
    totalUsuarios,
  } = useUsuariosPage();

  if (loading) {
    return (
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">
        Cargando…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
    <RoleDistributionChart roleDistribution={roleDistribution} totalUsuarios={totalUsuarios} />
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-edu-border-soft">
        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Gestión de usuarios y roles</h3>
        <p className="mt-0.5 text-edu-ink-400 text-[0.78rem]">Administra cuentas, roles y permisos del sistema</p>
      </div>

      <div className="px-5 py-3 border-b border-edu-border-soft flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[160px]">
          <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o correo…"
            className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as RoleKey | "")}
          className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary cursor-pointer"
        >
          <option value="">Tipo: todos</option>
          {ROLE_OPTIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary cursor-pointer"
        >
          <option value="desc">Creación: recientes primero</option>
          <option value="asc">Creación: antiguos primero</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[680px]">
          <div className={`grid ${USER_COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
            {["Usuario", "Rol", "Estado", "Último acceso", ""].map((h, i) => (
              <span key={i} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
            ))}
          </div>

          {paged.length === 0 ? (
            <p className="text-[0.8125rem] text-edu-ink-400 m-0 px-5 py-10 text-center">
              No hay usuarios que coincidan con los filtros.
            </p>
          ) : (
            paged.map((u, i) => {
              const avatar = accent[u.avatarTone];
              const roleStyle = ROLE_STYLE[u.role];
              const stateStyle = STATE_STYLE[u.state];
              return (
                <div
                  key={u.email}
                  className={`grid ${USER_COLS} px-5 py-3 items-center transition-colors hover:bg-edu-subtle ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
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
                  <div>
                    <span
                      className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit"
                      style={{ backgroundColor: roleStyle.bg, color: roleStyle.fg }}
                    >
                      {u.role}
                    </span>
                  </div>
                  <div>
                    <span
                      className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit"
                      style={{ backgroundColor: stateStyle.bg, color: stateStyle.fg }}
                    >
                      {u.state}
                    </span>
                  </div>
                  <span className="text-[0.8125rem] text-edu-ink-500">{u.lastAccess}</span>
                  <div className="flex justify-end">
                    <button className="inline-flex items-center gap-[5px] px-2.5 py-[5px] rounded-edu-chip border border-edu-border bg-edu-surface text-edu-ink-700 text-[0.775rem] font-medium cursor-pointer hover:bg-edu-subtle">
                      <Pencil style={{ width: "12px", height: "12px" }} />
                      Editar
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="px-5 py-4 border-t border-edu-border-soft">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
    </div>
  );
}
