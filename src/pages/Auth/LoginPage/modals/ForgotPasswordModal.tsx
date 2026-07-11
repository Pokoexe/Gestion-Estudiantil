import { useState } from "react";
import { Eye, EyeOff, X, Mail, Lock, CheckCircle } from "lucide-react";

type ForgotStep = "email" | "code" | "password" | "done";

export function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
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
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
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
