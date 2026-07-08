import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Eye, EyeOff, GraduationCap, MessageCircle, X, Mail, Lock, CheckCircle } from "lucide-react";
import { ROLE_ORDER, ROLES } from "../roles";

type ForgotStep = "email" | "code" | "password" | "done";

function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<ForgotStep>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("code"); }, 1000);
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("password"); }, 1000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("done"); }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[420px] p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-edu-ink-400 hover:text-edu-ink transition-colors bg-transparent border-none cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {step === "email" && (
          <>
            <div className="w-11 h-11 rounded-xl bg-edu-primary/10 flex items-center justify-center mb-4">
              <Mail className="w-5 h-5 text-edu-primary" />
            </div>
            <h2 className="text-edu-ink font-bold text-xl mb-1">¿Olvidaste tu contraseña?</h2>
            <p className="text-edu-ink-500 text-sm mb-6">
              Ingresa tu correo y te enviaremos un código de verificación.
            </p>
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="tucorreo@colegio.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                
                className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary"
              />
              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-edu-control py-[11px] text-white text-[0.9375rem] font-semibold border-none transition-colors ${loading ? "bg-edu-primary-loading cursor-not-allowed" : "bg-edu-primary cursor-pointer hover:bg-edu-primary-hover"}`}
              >
                {loading ? "Enviando…" : "Enviar código"}
              </button>
            </form>
          </>
        )}

        {step === "code" && (
          <>
            <div className="w-11 h-11 rounded-xl bg-edu-primary/10 flex items-center justify-center mb-4">
              <Mail className="w-5 h-5 text-edu-primary" />
            </div>
            <h2 className="text-edu-ink font-bold text-xl mb-1">Revisa tu correo</h2>
            <p className="text-edu-ink-500 text-sm mb-6">
              Enviamos un código de 6 dígitos a <span className="font-semibold text-edu-ink">{email}</span>.
            </p>
            <form onSubmit={handleCodeSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Código de 6 dígitos"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                
                maxLength={6}
                className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary tracking-[0.3em] text-center font-semibold"
              />
              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-edu-control py-[11px] text-white text-[0.9375rem] font-semibold border-none transition-colors ${loading ? "bg-edu-primary-loading cursor-not-allowed" : "bg-edu-primary cursor-pointer hover:bg-edu-primary-hover"}`}
              >
                {loading ? "Verificando…" : "Confirmar código"}
              </button>
              <button
                type="button"
                onClick={() => setStep("email")}
                className="text-edu-ink-500 text-sm text-center bg-transparent border-none cursor-pointer hover:text-edu-primary transition-colors"
              >
                Volver a ingresar correo
              </button>
            </form>
          </>
        )}

        {step === "password" && (
          <>
            <div className="w-11 h-11 rounded-xl bg-edu-primary/10 flex items-center justify-center mb-4">
              <Lock className="w-5 h-5 text-edu-primary" />
            </div>
            <h2 className="text-edu-ink font-bold text-xl mb-1">Nueva contraseña</h2>
            <p className="text-edu-ink-500 text-sm mb-6">
              Elige una contraseña segura para tu cuenta.
            </p>
            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="Nueva contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  
                  className="border-[1.5px] border-edu-border rounded-edu-control pr-11 pl-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary"
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-edu-ink-400 p-0 flex items-center">
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirmar contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  
                  className={`border-[1.5px] rounded-edu-control pr-11 pl-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary ${confirmPassword && newPassword !== confirmPassword ? "border-red-400" : "border-edu-border"}`}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-edu-ink-400 p-0 flex items-center">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-red-500 text-xs -mt-2">Las contraseñas no coinciden</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-edu-control py-[11px] text-white text-[0.9375rem] font-semibold border-none transition-colors ${loading ? "bg-edu-primary-loading cursor-not-allowed" : "bg-edu-primary cursor-pointer hover:bg-edu-primary-hover"}`}
              >
                {loading ? "Guardando…" : "Cambiar contraseña"}
              </button>
            </form>
          </>
        )}

        {step === "done" && (
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
            <h2 className="text-edu-ink font-bold text-xl mb-2">¡Contraseña actualizada!</h2>
            <p className="text-edu-ink-500 text-sm mb-6">
              Tu contraseña fue cambiada exitosamente. Ya puedes iniciar sesión.
            </p>
            <button
              onClick={onClose}
              className="w-full rounded-edu-control py-[11px] text-white text-[0.9375rem] font-semibold border-none bg-edu-primary cursor-pointer hover:bg-edu-primary-hover transition-colors"
            >
              Iniciar sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/estudiante");
    }, 1200);
  };

  const BG_IMAGE = "https://images.unsplash.com/photo-1778751225720-ee0f1d2ad14e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBzY2hvb2wlMjJidWlsZGluZyUyMGVkdWNhdGlvbiUyMGNhbXB1c3xlbnwxfHx8fDE3ODI5NTYxNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080";

  return (
    <>
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}

      {/* En móvil/tablet: imagen de fondo. En desktop: layout de dos columnas */}
      <div
        className="min-h-screen w-full flex lg:bg-none relative"
        style={{ backgroundImage: `url(${BG_IMAGE})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        {/* Overlay solo en móvil/tablet */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(26,86,219,0.7)_0%,rgba(17,24,39,0.5)_100%)] lg:hidden" />

        {/* Panel izquierdo — Formulario */}
        <div className="relative z-10 flex flex-1 flex-col justify-center items-center px-8 py-12 lg:bg-white lg:max-w-[540px] w-full">
          {/* Tarjeta con borde visible solo en móvil/tablet */}
          <div className="w-full max-w-[380px] lg:bg-transparent lg:border-none lg:shadow-none bg-white/95 backdrop-blur-sm border-2 border-white/60 shadow-xl rounded-2xl p-7 lg:p-0">
            {/* Volver */}
            <button
              onClick={() => navigate("/")}
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
                    onClick={() => setShowForgot(true)}
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
                    onClick={() => setShowPassword(!showPassword)}
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
                      onClick={() => navigate(`/${rid}`)}
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

        {/* Panel derecho — solo desktop */}
        <div className="hidden lg:flex flex-1 relative overflow-hidden min-h-screen">
          <img
            src={BG_IMAGE}
            alt="Campus escolar moderno"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(26,86,219,0.72)_0%,rgba(17,24,39,0.55)_100%)]" />
          <div className="relative z-10 flex flex-col justify-end p-[48px_52px] h-full">
            <div className="bg-[rgba(255,255,255,0.1)] backdrop-blur-[12px] rounded-2xl border border-[rgba(255,255,255,0.18)] p-[28px_32px] max-w-[440px]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-[rgba(255,255,255,0.2)] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-[rgba(255,255,255,0.9)] text-[0.8rem] font-semibold tracking-[0.08em] uppercase">
                  Sistema de Gestión
                </span>
              </div>
              <p className="text-white text-[1.25rem] font-semibold leading-[1.4] mb-[10px]">
                Todo lo que tu institución necesita, en un solo lugar.
              </p>
              <p className="text-[rgba(255,255,255,0.72)] text-sm leading-[1.6]">
                Gestiona estudiantes, personal, calificaciones, asistencia y pagos — desde un panel unificado, con acceso 24/7.
              </p>
              <div className="flex items-center gap-5 mt-5">
                {[["7", "Roles"], ["24/7", "Acceso"], ["100%", "En la nube"]].map(([stat, label]) => (
                  <div key={label}>
                    <div className="text-white font-bold text-[1.1rem]">{stat}</div>
                    <div className="text-[rgba(255,255,255,0.6)] text-xs">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
