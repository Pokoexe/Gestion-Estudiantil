import { Settings } from "lucide-react";
import { useConfiguracion } from "./functions/useConfiguracion";
import { EmailForm } from "./ui/EmailForm";
import { PasswordForm } from "./ui/PasswordForm";
import { VerifyEmailModal } from "./modals/VerifyEmailModal";
import { VerifyPasswordModal } from "./modals/VerifyPasswordModal";

export function ConfiguracionPage() {
    const {
        emailForm,
        setEmailForm,
        passwordForm,
        setPasswordForm,
        emailSaved,
        passwordSaved,
        showEmailVerify,
        showPasswordVerify,
        closeEmailVerify,
        closePasswordVerify,
        confirmEmailChange,
        confirmPasswordChange,
        handleEmailSubmit,
        handlePasswordSubmit,
        emailValid,
        passwordValid,
    } = useConfiguracion();

    return (
        <div className="flex flex-col gap-5">
            {showEmailVerify && (
                <VerifyEmailModal onClose={closeEmailVerify} onSuccess={confirmEmailChange} />
            )}
            {showPasswordVerify && (
                <VerifyPasswordModal onClose={closePasswordVerify} onSuccess={confirmPasswordChange} />
            )}

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
                <EmailForm
                    emailForm={emailForm}
                    setEmailForm={setEmailForm}
                    emailSaved={emailSaved}
                    emailValid={emailValid}
                    handleEmailSubmit={handleEmailSubmit}
                />
                <PasswordForm
                    passwordForm={passwordForm}
                    setPasswordForm={setPasswordForm}
                    passwordSaved={passwordSaved}
                    passwordValid={passwordValid}
                    handlePasswordSubmit={handlePasswordSubmit}
                />
            </div>
        </div>
    );
}
