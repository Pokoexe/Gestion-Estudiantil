import { useState } from "react";
import { Settings, Mail, Lock, Check } from "lucide-react";

const inputCls =
    "border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary";
const labelCls = "text-edu-ink-700 text-sm font-medium";

export function ConfiguracionPage() {
    const [emailForm, setEmailForm] = useState({ email: "", confirmEmail: "" });
    const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });
    const [emailSaved, setEmailSaved] = useState(false);
    const [passwordSaved, setPasswordSaved] = useState(false);

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setEmailSaved(true);
        setTimeout(() => setEmailSaved(false), 3000);
        setEmailForm({ email: "", confirmEmail: "" });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordSaved(true);
        setTimeout(() => setPasswordSaved(false), 3000);
        setPasswordForm({ current: "", next: "", confirm: "" });
    };

    const emailValid =
        !!emailForm.email &&
        !!emailForm.confirmEmail &&
        emailForm.email === emailForm.confirmEmail;

    const passwordValid =
        !!passwordForm.current &&
        !!passwordForm.next &&
        !!passwordForm.confirm &&
        passwordForm.next === passwordForm.confirm;

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-edu-control bg-edu-primary-50 flex items-center justify-center shrink-0">
                    <Settings className="w-5 h-5 text-edu-primary" />
                </div>
                <div>
                    <h2 className="m-0 text-edu-ink font-bold text-[1.25rem]">Configuración</h2>
                    <p className="text-edu-ink-500 text-sm mt-0.5 m-0">
                        Actualiza tu correo electrónico o contraseña.
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">

                {/* Correo electrónico */}
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

                {/* Contraseña */}
                <form
                    onSubmit={handlePasswordSubmit}
                    className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex flex-col gap-4"
                >
                    <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-edu-ink-500" />
                        <span className="text-edu-ink font-semibold text-[0.9375rem]">Contraseña</span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className={labelCls}>Contraseña actual</label>
                        <input
                            type="password"
                            value={passwordForm.current}
                            onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                            placeholder="Ingresa tu contraseña actual"
                            className={inputCls}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className={labelCls}>Nueva contraseña</label>
                        <input
                            type="password"
                            value={passwordForm.next}
                            onChange={(e) => setPasswordForm({ ...passwordForm, next: e.target.value })}
                            placeholder="Mínimo 8 caracteres"
                            className={inputCls}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className={labelCls}>Confirmar contraseña</label>
                        <input
                            type="password"
                            value={passwordForm.confirm}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                            placeholder="Repite la nueva contraseña"
                            className={inputCls}
                        />
                        {passwordForm.confirm && passwordForm.next !== passwordForm.confirm && (
                            <span className="text-edu-danger text-xs">Las contraseñas no coinciden.</span>
                        )}
                    </div>

                    <div className="flex justify-end border-t border-edu-border-soft -mx-5 px-5 pt-4 mt-1">
                        <button
                            type="submit"
                            disabled={!passwordValid}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control bg-edu-primary text-white text-sm font-semibold border-none cursor-pointer transition-colors hover:bg-edu-primary-hover disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {passwordSaved && <Check className="w-4 h-4" />}
                            {passwordSaved ? "Guardado" : "Guardar contraseña"}
                        </button>
                    </div>
                </form>
            </div>

        </div>
    );
}
