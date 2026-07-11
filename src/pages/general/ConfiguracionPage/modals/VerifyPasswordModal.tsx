import { useState } from "react";
import { X, Mail, CheckCircle } from "lucide-react";

type VerifyStep = "code" | "done";

interface VerifyPasswordModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function VerifyPasswordModal({ onClose, onSuccess }: VerifyPasswordModalProps) {
  const [step, setStep] = useState<VerifyStep>("code");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 6) return;
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

        {step === "code" && (
          <>
            <div className="w-11 h-11 rounded-xl bg-edu-primary/10 flex items-center justify-center mb-4">
              <Mail className="w-5 h-5 text-edu-primary" />
            </div>
            <h2 className="text-edu-ink font-bold text-xl mb-1">Confirma el cambio</h2>
            <p className="text-edu-ink-500 text-sm mb-6">
              Escribe el código de confirmación que enviamos a tu correo electrónico.
            </p>
            <form onSubmit={handleVerify} className="flex flex-col gap-4">
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
              Tu contraseña se cambió correctamente.
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
