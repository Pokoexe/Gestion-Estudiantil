import { useState } from "react";

export function useConfiguracion() {
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

    return {
        emailForm,
        setEmailForm,
        passwordForm,
        setPasswordForm,
        emailSaved,
        passwordSaved,
        handleEmailSubmit,
        handlePasswordSubmit,
        emailValid,
        passwordValid,
    };
}
