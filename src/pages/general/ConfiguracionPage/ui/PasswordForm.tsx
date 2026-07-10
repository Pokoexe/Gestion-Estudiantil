import { Lock, Check } from "lucide-react";

const inputCls =
    "border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary";
const labelCls = "text-edu-ink-700 text-sm font-medium";

interface PasswordFormProps {
    passwordForm: { current: string; next: string; confirm: string };
    setPasswordForm: React.Dispatch<React.SetStateAction<{ current: string; next: string; confirm: string }>>;
    passwordSaved: boolean;
    passwordValid: boolean;
    handlePasswordSubmit: (e: React.FormEvent) => void;
}

export function PasswordForm({
    passwordForm,
    setPasswordForm,
    passwordSaved,
    passwordValid,
    handlePasswordSubmit,
}: PasswordFormProps) {
    return (
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
    );
}
