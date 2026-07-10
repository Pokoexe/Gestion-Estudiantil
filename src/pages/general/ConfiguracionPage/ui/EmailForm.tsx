import { Mail, Check } from "lucide-react";

const inputCls =
    "border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary";
const labelCls = "text-edu-ink-700 text-sm font-medium";

interface EmailFormProps {
    emailForm: { email: string; confirmEmail: string };
    setEmailForm: React.Dispatch<React.SetStateAction<{ email: string; confirmEmail: string }>>;
    emailSaved: boolean;
    emailValid: boolean;
    handleEmailSubmit: (e: React.FormEvent) => void;
}

export function EmailForm({
    emailForm,
    setEmailForm,
    emailSaved,
    emailValid,
    handleEmailSubmit,
}: EmailFormProps) {
    return (
        <div>
            <form
                onSubmit={handleEmailSubmit}
                className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex flex-col gap-4"
            >
                <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-edu-ink-500" />
                    <span className="text-edu-ink font-semibold text-[0.9375rem]">Correo electrónico</span>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Nuevo correo</label>
                    <input
                        type="email"
                        value={emailForm.email}
                        onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                        placeholder="correo@ejemplo.com"
                        className={inputCls}
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Confirmar correo</label>
                    <input
                        type="email"
                        value={emailForm.confirmEmail}
                        onChange={(e) => setEmailForm({ ...emailForm, confirmEmail: e.target.value })}
                        placeholder="Repite el correo"
                        className={inputCls}
                    />
                    {emailForm.confirmEmail && emailForm.email !== emailForm.confirmEmail && (
                        <span className="text-edu-danger text-xs">Los correos no coinciden.</span>
                    )}
                </div>

                <div className="flex justify-end border-t border-edu-border-soft -mx-5 px-5 pt-4 mt-1">
                    <button
                        type="submit"
                        disabled={!emailValid}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control bg-edu-primary text-white text-sm font-semibold border-none cursor-pointer transition-colors hover:bg-edu-primary-hover disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {emailSaved && <Check className="w-4 h-4" />}
                        {emailSaved ? "Guardado" : "Guardar correo"}
                    </button>
                </div>
            </form>
        </div>
    );
}
