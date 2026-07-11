import { useState } from "react";
import { Eye, EyeOff, X, Lock, CheckCircle } from "lucide-react";

type VerifyStep = "verify" | "done";

interface VerifyEmailModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function VerifyEmailModal({ onClose, onSuccess }: VerifyEmailModalProps) {
  const [step, setStep] = useState<VerifyStep>("verify");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("done");
      onSuccess();
    }, 1000);
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

        {step === "verify" && (
          <>
            <div className="w-11 h-11 rounded-xl bg-edu-primary/10 flex items-center justify-center mb-4">
              <Lock className="w-5 h-5 text-edu-primary" />
            </div>
            <h2 className="text-edu-ink font-bold text-xl mb-1">Verifica tu identidad</h2>
            <p className="text-edu-ink-500 text-sm mb-6">
              Escribe tu contraseña para confirmar el cambio de correo electrónico.
            </p>
            <form onSubmit={handleVerify} className="flex flex-col gap-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-[1.5px] border-edu-border rounded-edu-control pr-11 pl-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-edu-ink-400 p-0 flex items-center"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-edu-control py-[11px] text-white text-[0.9375rem] font-semibold border-none transition-colors ${loading ? "bg-edu-primary-loading cursor-not-allowed" : "bg-edu-primary cursor-pointer hover:bg-edu-primary-hover"}`}
              >
                {loading ? "Verificando…" : "Verificar"}
              </button>
            </form>
          </>
        )}

        {step === "done" && (
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
            <h2 className="text-edu-ink font-bold text-xl mb-2">¡Correo actualizado!</h2>
            <p className="text-edu-ink-500 text-sm mb-6">
              Tu correo electrónico se cambió correctamente.
            </p>
            <button
              onClick={onClose}
              className="w-full rounded-edu-control py-[11px] text-white text-[0.9375rem] font-semibold border-none bg-edu-primary cursor-pointer hover:bg-edu-primary-hover transition-colors"
            >
              Entendido
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
