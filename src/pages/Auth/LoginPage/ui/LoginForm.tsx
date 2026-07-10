import { ArrowLeft, Eye, EyeOff, GraduationCap, MessageCircle } from "lucide-react";
import { ROLE_ORDER, ROLES } from "@constants/roles";

interface LoginFormProps {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  showPassword: boolean;
  toggleShowPassword: () => void;
  loading: boolean;
  openForgot: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  goHome: () => void;
  goToRole: (rid: string) => void;
}

export function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  toggleShowPassword,
  loading,
  openForgot,
  handleSubmit,
  goHome,
  goToRole,
}: LoginFormProps) {
  return (
    /* Panel izquierdo — Formulario */
    <div className="relative z-10 flex flex-1 flex-col justify-center items-center px-8 py-12 lg:bg-white lg:max-w-[540px] w-full">
      {/* Tarjeta con borde visible solo en móvil/tablet */}
      <div className="w-full max-w-[380px] lg:bg-transparent lg:border-none lg:shadow-none bg-white/95 backdrop-blur-sm border-2 border-white/60 shadow-xl rounded-2xl p-7 lg:p-0">
        {/* Volver */}
        <button
          onClick={goHome}
          className="inline-flex items-center gap-1.5 mb-6 text-[0.8125rem] font-medium text-edu-ink-500 bg-transparent border-none cursor-pointer hover:text-edu-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-9">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-edu-primary">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="tracking-tight text-edu-ink text-[1.1rem] font-semibold">
            EduGestión
          </span>
        </div>

        {/* Encabezado */}
        <div className="mb-7">
          <h1 className="mb-1 text-edu-ink font-bold text-[1.6rem] leading-[1.3]">
            Bienvenido de nuevo
          </h1>
          <p className="text-edu-ink-500 text-[0.95rem]">
            Ingresa a tu sistema de gestión escolar
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-edu-ink-700 text-sm font-medium">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="tucorreo@colegio.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-edu-ink-700 text-sm font-medium">
                Contraseña
              </label>
              <button
                type="button"
                onClick={openForgot}
                className="text-edu-primary text-[0.8125rem] font-medium bg-transparent border-none cursor-pointer hover:underline p-0"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-[1.5px] border-edu-border rounded-edu-control pr-11 pl-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary"
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-edu-ink-400 p-0 flex items-center"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 rounded-edu-control border-none py-[11px] text-white text-[0.9375rem] font-semibold mt-0.5 transition-colors ${
              loading
                ? "bg-edu-primary-loading cursor-not-allowed"
                : "bg-edu-primary cursor-pointer hover:bg-edu-primary-hover"
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Ingresando…
              </>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>

        {/* Selector de rol */}
        <div className="mt-[26px]">
          <div className="flex items-center gap-3 mb-3.5">
            <div className="h-px flex-1 bg-edu-border-soft" />
            <span className="text-[0.72rem] text-edu-ink-400 font-medium uppercase tracking-[0.05em]">
              O explora la maqueta como
            </span>
            <div className="h-px flex-1 bg-edu-border-soft" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {ROLE_ORDER.map((rid) => {
              const r = ROLES[rid];
              const RIcon = r.icon;
              return (
                <button
                  key={rid}
                  onClick={() => goToRole(rid)}
                  className="flex items-center gap-[9px] px-3 py-[9px] rounded-edu-chip border-[1.5px] border-edu-border bg-edu-surface cursor-pointer text-left transition-colors hover:border-edu-primary-200 hover:bg-edu-primary-50"
                >
                  <span
                    className="w-[26px] h-[26px] rounded-[7px] flex items-center justify-center shrink-0"
                    style={{ backgroundColor: r.accent }}
                  >
                    <RIcon style={{ width: "14px", height: "14px", color: "#fff" }} />
                  </span>
                  <span className="text-[0.8125rem] font-semibold text-edu-ink-700">{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Soporte WhatsApp */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <MessageCircle className="w-4 h-4 flex-shrink-0 text-edu-whatsapp" />
          <span className="text-edu-ink-500 text-[0.8125rem]">
            ¿Necesitas ayuda?{" "}
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-edu-whatsapp font-semibold no-underline hover:underline"
            >
              Escríbenos por WhatsApp
            </a>
          </span>
        </div>
      </div>

      <p className="relative z-10 text-edu-ink-300 lg:text-edu-ink-300 text-white/60 text-xs mt-auto pt-8">
        © 2026 EduGestión. Todos los derechos reservados.
      </p>
    </div>
  );
}
