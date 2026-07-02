import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { Bell, ChevronDown, LogOut, User, Repeat } from "lucide-react";
import { ROLES, ROLE_ORDER, roleFromPath, type NavItem } from "../roles";

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const roleId = roleFromPath(location.pathname);
  const role = ROLES[roleId];

  const [showRoleSwitch, setShowRoleSwitch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState(3);

  const today = new Date();

  const fullPath = (item: NavItem) => `/${role.id}${item.to ? `/${item.to}` : ""}`;

  const isActive = (item: NavItem) => {
    const path = fullPath(item);
    return item.to === ""
      ? location.pathname === `/${role.id}` || location.pathname === `/${role.id}/`
      : location.pathname.startsWith(path);
  };

  const currentTitle =
    role.nav.find((i) => i.to !== "" && isActive(i))?.label ?? role.homeTitle;

  const RoleIcon = role.icon;

  return (
    <div className="flex min-h-screen bg-edu-bg">
      {/* Barra lateral */}
      <aside className="w-56 min-h-screen bg-edu-surface border-r border-edu-border flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-5 pt-5 pb-4 border-b border-edu-border-soft flex items-center gap-2.5">
          <div className="w-[34px] h-[34px] rounded-edu-control bg-edu-primary flex items-center justify-center shrink-0">
            <RoleIcon className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="text-edu-ink font-semibold text-[0.95rem] leading-[1.1]">
              EduGestión
            </div>
            <div className="text-edu-ink-400 text-[0.68rem] mt-[1px]">
              {role.label}
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-2.5 py-3 flex flex-col gap-0.5">
          {role.nav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            const ready = !!item.ready;
            return (
              <button
                key={item.label}
                onClick={() => ready && navigate(fullPath(item))}
                disabled={!ready}
                title={ready ? item.label : `${item.label} · próximamente`}
                className={`flex items-center gap-2.5 px-3 py-[9px] rounded-edu-chip border-none w-full text-left text-sm transition-colors
                  ${active
                    ? "bg-edu-primary-50 text-edu-primary font-semibold cursor-pointer"
                    : ready
                      ? "bg-transparent text-edu-ink-500 font-normal cursor-pointer hover:bg-edu-subtle hover:text-edu-ink-700"
                      : "bg-transparent text-edu-ink-300 font-normal cursor-default"
                  }`}
              >
                <Icon className="w-[17px] h-[17px] shrink-0" />
                <span className="flex-1">{item.label}</span>
                {!ready && (
                  <span className="text-[0.6rem] text-edu-ink-400 font-medium">
                    Pronto
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Usuario */}
        <div className="px-2.5 py-3 border-t border-edu-border-soft flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-edu-primary-100 flex items-center justify-center shrink-0">
            <User className="w-[15px] h-[15px] text-edu-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-edu-ink text-[0.8rem] font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
              {role.user.name}
            </div>
            <div className="text-edu-ink-400 text-[0.7rem] overflow-hidden text-ellipsis whitespace-nowrap">
              {role.user.roleLabel}
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="bg-transparent border-0 cursor-pointer text-edu-ink-400 p-0.5 flex"
            title="Cerrar sesión"
          >
            <LogOut className="w-[15px] h-[15px]" />
          </button>
        </div>
      </aside>

      {/* Columna principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Encabezado */}
        <header className="h-[60px] bg-edu-surface border-b border-edu-border flex items-center justify-between px-6 gap-4 sticky top-0 z-20">
          <div>
            <h2 className="text-edu-ink font-semibold text-base m-0">{currentTitle}</h2>
            <p className="text-edu-ink-400 text-xs m-0">
              {today.toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Cambiador de rol (para explorar la maqueta) */}
            <div className="relative">
              <button
                onClick={() => { setShowRoleSwitch(!showRoleSwitch); setShowNotifications(false); }}
                className="flex items-center gap-[7px] px-3 py-1.5 rounded-edu-chip border-[1.5px] border-edu-border bg-edu-subtle text-edu-ink-700 text-[0.8125rem] font-medium cursor-pointer"
              >
                <Repeat className="w-3.5 h-3.5 text-edu-primary" />
                {role.label}
                <ChevronDown className="w-[13px] h-[13px] text-edu-ink-400" />
              </button>
              {showRoleSwitch && (
                <div className="absolute top-[calc(100%+4px)] right-0 bg-edu-surface border border-edu-border rounded-edu-control shadow-[0_4px_16px_rgba(0,0,0,0.08)] z-30 overflow-hidden min-w-[190px]">
                  <div className="px-3.5 py-2 text-[0.68rem] text-edu-ink-400 font-semibold uppercase tracking-[0.05em] border-b border-edu-border-soft">
                    Explorar como
                  </div>
                  {ROLE_ORDER.map((rid) => {
                    const r = ROLES[rid];
                    const RIcon = r.icon;
                    const current = rid === role.id;
                    return (
                      <button
                        key={rid}
                        onClick={() => { setShowRoleSwitch(false); navigate(`/${rid}`); }}
                        className={`flex items-center gap-[9px] w-full px-3.5 py-[9px] text-left border-none text-[0.8125rem] cursor-pointer
                          ${current
                            ? "bg-edu-primary-50 text-edu-primary font-semibold"
                            : "bg-transparent text-edu-ink-700 font-normal hover:bg-edu-subtle"
                          }`}
                      >
                        <RIcon className="w-[15px] h-[15px] shrink-0" />
                        {r.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Notificaciones */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowRoleSwitch(false); }}
                className="relative w-9 h-9 rounded-full border-[1.5px] border-edu-border bg-edu-subtle cursor-pointer flex items-center justify-center text-edu-ink-500"
              >
                <Bell className="w-4 h-4" />
                {notifications > 0 && (
                  <span className="absolute -top-[3px] -right-[3px] w-[17px] h-[17px] rounded-full bg-edu-danger-strong text-white text-[0.6rem] font-bold flex items-center justify-center border-2 border-white">
                    {notifications}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute top-[calc(100%+6px)] right-0 bg-edu-surface border border-edu-border rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.1)] z-30 w-[290px] overflow-hidden">
                  <div className="px-4 py-3 border-b border-edu-border-soft flex justify-between items-center">
                    <span className="font-semibold text-sm text-edu-ink">Notificaciones</span>
                    <span className="text-xs text-edu-primary cursor-pointer font-medium">Marcar todas leídas</span>
                  </div>
                  {[
                    { title: "Examen programado", desc: "Parcial de Matemática el 5 de julio", time: "hace 2 h" },
                    { title: "Nota publicada", desc: "Laboratorio de Química: 87/100", time: "ayer" },
                    { title: "Pago por vencer", desc: "Cuota del período vence el 15 de julio", time: "hace 2 d" },
                  ].map((n, i) => (
                    <div
                      key={i}
                      className={`px-4 py-2.5 cursor-pointer hover:bg-edu-subtle${i < 2 ? " border-b border-edu-border-soft" : ""}`}
                    >
                      <div className="text-[0.8125rem] font-medium text-edu-ink">{n.title}</div>
                      <div className="text-xs text-edu-ink-500 mt-0.5">{n.desc}</div>
                      <div className="text-[0.7rem] text-edu-ink-400 mt-0.5">{n.time}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-edu-primary flex items-center justify-center text-white text-[0.8rem] font-bold cursor-pointer shrink-0">
              {role.user.initials}
            </div>
          </div>
        </header>

        {/* Contenido de la página */}
        <main className="flex-1 p-6 flex flex-col gap-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
