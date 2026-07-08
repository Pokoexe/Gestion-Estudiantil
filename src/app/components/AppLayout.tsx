import { useState, useRef, useLayoutEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { Bell, ChevronDown, LogOut, User, Repeat, X, ArrowLeft, CalendarRange, Menu } from "lucide-react";
import { ROLES, ROLE_ORDER, roleFromPath, type NavItem, type RoleConfig } from "../roles";
import { SOLVENT, DEBT_LEVEL, DEBT_MESSAGE, DEBT_STYLES } from "../datos_maquetados/data/solvency";
import { CONVERSATIONS } from "../datos_maquetados/data/chats";
import { CURRENT_LAPSO } from "../datos_maquetados/data/lapsos";
import { FloatingChat } from "./FloatingChat";

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const roleId = roleFromPath(location.pathname);
  const role = ROLES[roleId];
  const onMessagesPage = location.pathname.includes("/mensajes");
  const onPresentacionPage = location.pathname.includes("/presentacion");
  // Vistas "a pantalla completa": ocultan la barra lateral y el chat flotante.
  const chromeless = onMessagesPage || onPresentacionPage;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showRoleSwitch, setShowRoleSwitch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  // Se reinicia en cada recarga: si el estudiante es moroso, el banner reaparece.
  const [showDebtBanner, setShowDebtBanner] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatConvId, setChatConvId] = useState<number | null>(null);

  const unreadCount = CONVERSATIONS.reduce((sum, c) => sum + c.unread, 0);
  const openChatTo = (id: number) => {
    setChatConvId(id);
    setChatOpen(true);
    setShowNotifications(false);
  };

  const showDebt = roleId === "estudiante" && !SOLVENT && showDebtBanner;
  const DebtIcon = DEBT_STYLES[DEBT_LEVEL].icon;

  const today = new Date();

  const fullPath = (item: NavItem) => `/${role.id}${item.to ? `/${item.to}` : ""}`;

  const isActive = (item: NavItem) => {
    const path = fullPath(item);
    return item.to === ""
      ? location.pathname === `/${role.id}` || location.pathname === `/${role.id}/`
      : location.pathname.startsWith(path);
  };

  const navItems = role.nav.flatMap((section) => section.items);
  const currentTitle =
    navItems.find((i) => i.to !== "" && isActive(i))?.label ?? role.homeTitle;

  const RoleIcon = role.icon;

  return (
    <div className="flex min-h-screen bg-edu-bg">
      {/* Barra lateral — oculta en las vistas a pantalla completa (Mensajes, Presentación) */}
      {!chromeless && (
        <>
          {/* Backdrop para cerrar el menú en móvil */}
          <div
            className={`fixed inset-0 bg-black/40 z-30 md:hidden transition-opacity duration-300 ${sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            onClick={() => setSidebarOpen(false)}
          />
        <aside className={`fixed top-0 left-0 h-screen z-40 w-56 bg-edu-surface border-r border-edu-border flex flex-col shrink-0 overflow-hidden transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:sticky md:top-0 md:translate-x-0`}>
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

          {/* Navegación — se re-monta al cambiar de rol (key) para reiniciar el acordeón */}
          <SidebarNav key={role.id} role={role} isActive={isActive} fullPath={fullPath} onNavigate={() => setSidebarOpen(false)} />

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
        </>
      )}

      {/* Columna principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Encabezado */}
        <header className="h-[60px] bg-edu-surface border-b border-edu-border flex items-center justify-between px-6 gap-4 sticky top-0 z-[50]">
          <div className="flex items-center gap-3 min-w-0">
            {!chromeless && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Menú"
                className="md:hidden w-9 h-9 rounded-full border-[1.5px] border-edu-border bg-edu-subtle cursor-pointer flex items-center justify-center text-edu-ink-500 shrink-0"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            {chromeless && (
              <button
                onClick={() => navigate(-1)}
                aria-label="Volver"
                className="w-9 h-9 rounded-full border-[1.5px] border-edu-border bg-edu-subtle cursor-pointer flex items-center justify-center text-edu-ink-500 hover:text-edu-primary hover:border-edu-primary-200 transition-colors shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="min-w-0">
              <h2 className="text-edu-ink font-semibold text-base m-0 truncate">{currentTitle}</h2>
              <p className="text-edu-ink-400 text-xs m-0 hidden sm:block truncate">
                {today.toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            {/* Indicador de lapso académico en curso — fijo, igual en todos los roles */}
            <div className="hidden md:flex items-center gap-2 pl-3.5 border-l border-edu-border-soft shrink-0">
              <CalendarRange className="w-4 h-4 text-edu-primary shrink-0" />
              <div className="leading-tight">
                <div className="text-[0.8rem] font-semibold text-edu-ink whitespace-nowrap">
                  {CURRENT_LAPSO.fullLabel}
                </div>
                <div className="flex items-center gap-1 text-[0.68rem] font-medium text-edu-success">
                  <span className="w-1.5 h-1.5 rounded-full bg-edu-success" />
                  En curso
                </div>
              </div>
            </div>
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
                {unreadCount > 0 && (
                  <span className="absolute -top-[3px] -right-[3px] w-[17px] h-[17px] rounded-full bg-edu-danger-strong text-white text-[0.6rem] font-bold flex items-center justify-center border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute top-[calc(100%+6px)] right-0 bg-edu-surface border border-edu-border rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.1)] z-30 w-[300px] overflow-hidden">
                  <div className="px-4 py-3 border-b border-edu-border-soft flex justify-between items-center">
                    <span className="font-semibold text-sm text-edu-ink">Mensajes</span>
                    <span className="text-xs text-edu-primary cursor-pointer font-medium">Marcar todos leídos</span>
                  </div>
                  {CONVERSATIONS.slice(0, 4).map((c, i, arr) => {
                    const last = c.messages[c.messages.length - 1];
                    return (
                      <button
                        key={c.id}
                        onClick={() => openChatTo(c.id)}
                        className={`w-full text-left flex items-center gap-2.5 px-4 py-2.5 bg-transparent border-none cursor-pointer hover:bg-edu-subtle transition-colors${i < arr.length - 1 ? " border-b border-edu-border-soft" : ""}`}
                      >
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[0.7rem] font-bold shrink-0"
                          style={{ backgroundColor: c.color }}
                        >
                          {c.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[0.8125rem] font-semibold text-edu-ink truncate">{c.name}</span>
                            <span className="text-[0.68rem] text-edu-ink-400 shrink-0">{c.lastTime}</span>
                          </div>
                          <div className="text-xs text-edu-ink-500 truncate mt-0.5">
                            {last?.fromMe ? "Tú: " : ""}{last?.text}
                          </div>
                        </div>
                        {c.unread > 0 && (
                          <span className="shrink-0 w-2 h-2 rounded-full bg-edu-primary" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-edu-primary flex items-center justify-center text-white text-[0.8rem] font-bold cursor-pointer shrink-0">
              {role.user.initials}
            </div>
          </div>
        </header>

        {/* Aviso de morosidad — pegado al header, visible en todas las páginas */}
        {showDebt && (
          <div className={`sticky top-[60px] z-[45] flex items-center gap-2.5 px-6 py-2.5 text-sm font-medium border-b border-edu-border-soft ${DEBT_STYLES[DEBT_LEVEL].banner}`}>
            <DebtIcon className="w-4 h-4 shrink-0" />
            <span className="flex-1">{DEBT_MESSAGE}</span>
            <button
              onClick={() => setShowDebtBanner(false)}
              aria-label="Cerrar aviso"
              className="bg-transparent border-none cursor-pointer p-0 flex items-center opacity-70 hover:opacity-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Contenido de la página */}
        <main className={chromeless ? "flex-1 flex flex-col min-h-0" : "flex-1 p-3 sm:p-6 flex flex-col gap-5"}>
          <Outlet />
        </main>
      </div>

      {/* Chat flotante global (estilo Messenger) — visible en todas las páginas
          excepto en las vistas a pantalla completa (Mensajes, Presentación). */}
      {!chromeless && (
        <FloatingChat
          open={chatOpen}
          onOpenChange={(o) => { setChatOpen(o); if (!o) setChatConvId(null); }}
          openConversationId={chatConvId}
        />
      )}
    </div>
  );
}

/**
 * Navegación lateral con subgrupos plegables (acordeón).
 * - Las secciones sin título (Inicio, Mensajes) se muestran siempre.
 * - Al montar (y al redimensionar) se abren, de arriba hacia abajo, tantos
 *   subgrupos como quepan SIN provocar scroll: si todos caben, todos quedan
 *   abiertos; si no, se dejan cerrados los que harían aparecer la barra de
 *   desplazamiento. Así el usuario siempre ve todos los encabezados sin hacer
 *   scroll.
 * - Cuando el usuario pliega/despliega algo a mano, se respeta su elección y
 *   se deja de recalcular automáticamente al redimensionar.
 * Se re-monta al cambiar de rol (via `key`), así el acordeón se recalcula para
 * el nuevo menú.
 */
function SidebarNav({
  role,
  isActive,
  fullPath,
  onNavigate,
}: {
  role: RoleConfig;
  isActive: (item: NavItem) => boolean;
  fullPath: (item: NavItem) => string;
  onNavigate?: () => void;
}) {
  const navigate = useNavigate();

  // Referencias para medir cuánto espacio hay y cuánto ocupa cada subgrupo.
  const navRef = useRef<HTMLElement>(null);
  // Envoltorio recortado de cada subgrupo: su scrollHeight da el alto real de
  // sus ítems aunque el subgrupo esté plegado.
  const contentRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  // Alto de los ítems de cada subgrupo (medido una vez, con todo cerrado).
  const heightsRef = useRef<Map<string, number>>(new Map());
  // Alto del menú con TODOS los subgrupos cerrados (encabezados + ítems sueltos).
  const collapsedTotalRef = useRef(0);
  // Una vez el usuario interactúa a mano, no volvemos a recalcular al redimensionar.
  const userTouchedRef = useRef(false);

  // Etiquetas de los subgrupos con título, en orden de aparición.
  const labeledLabels = role.nav
    .filter((s) => s.label)
    .map((s) => s.label as string);

  // Arranca todo cerrado; el efecto de medición abre lo que quepa antes de pintar.
  const [open, setOpen] = useState<Set<string>>(() => new Set());

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    // Alto natural de los ítems de cada subgrupo (el envoltorio recortado
    // reporta scrollHeight aunque esté plegado).
    for (const label of labeledLabels) {
      const el = contentRefs.current.get(label);
      heightsRef.current.set(label, el ? el.scrollHeight : 0);
    }

    // Alto del menú con todo cerrado. Se mide ahora, que el primer render lo
    // está: cada hijo colapsado aporta solo su encabezado / ítems sueltos.
    const kids = Array.from(nav.children) as HTMLElement[];
    const cs = getComputedStyle(nav);
    const rowGap = parseFloat(cs.rowGap) || 0;
    const pad = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
    collapsedTotalRef.current =
      pad +
      rowGap * Math.max(0, kids.length - 1) +
      kids.reduce((sum, k) => sum + k.offsetHeight, 0);

    // Abre, de arriba hacia abajo, tantos subgrupos como quepan sin scroll.
    const applyFit = () => {
      const available = nav.clientHeight;
      const SAFETY = 4; // margen para redondeos sub-píxel: mejor cerrar que provocar scroll
      let used = collapsedTotalRef.current;
      const next = new Set<string>();
      for (const label of labeledLabels) {
        const h = heightsRef.current.get(label) ?? 0;
        if (used + h <= available - SAFETY) {
          next.add(label);
          used += h;
        } else {
          break; // si el siguiente ya no cabe, no seguimos abriendo.
        }
      }
      setOpen(next);
    };

    applyFit();

    // Recalcula si cambia el alto disponible (p. ej. al redimensionar la
    // ventana), salvo que el usuario ya haya plegado/desplegado algo.
    const ro = new ResizeObserver(() => {
      if (!userTouchedRef.current) applyFit();
    });
    ro.observe(nav);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (label: string) => {
    userTouchedRef.current = true;
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const renderItem = (item: NavItem) => {
    const Icon = item.icon;
    const active = isActive(item);
    const ready = !!item.ready;
    return (
      <button
        key={item.label}
        onClick={() => { if (ready) { navigate(fullPath(item)); onNavigate?.(); } }}
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
  };

  return (
    <nav ref={navRef} className="flex-1 min-h-0 overflow-y-auto px-2.5 py-3 flex flex-col gap-1.5">
      {role.nav.map((section, si) => {
        // Secciones sin título: siempre visibles, sin acordeón.
        if (!section.label) {
          return (
            <div key={`section-${si}`} className="flex flex-col gap-0.5">
              {section.items.map(renderItem)}
            </div>
          );
        }

        const isOpen = open.has(section.label);
        return (
          <div key={section.label} className="flex flex-col">
            <button
              onClick={() => toggle(section.label!)}
              aria-expanded={isOpen}
              className="flex items-center gap-1.5 w-full px-3 py-1.5 bg-transparent border-none cursor-pointer text-[0.62rem] text-edu-ink-400 font-semibold uppercase tracking-[0.06em] hover:text-edu-ink-600 transition-colors"
            >
              <span className="flex-1 text-left">{section.label}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 shrink-0 transition-transform duration-300 ${isOpen ? "" : "-rotate-90"}`}
              />
            </button>
            {/* Contenedor plegable: se anima grid-template-rows de 0fr a 1fr */}
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div
                className="overflow-hidden min-h-0"
                ref={(el) => {
                  if (el) contentRefs.current.set(section.label as string, el);
                }}
              >
                <div className="flex flex-col gap-0.5 pt-0.5 pb-1">
                  {section.items.map(renderItem)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
