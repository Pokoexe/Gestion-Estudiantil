import { useState } from "react";

export function useConfiguracion() {
    const [emailForm, setEmailForm] = useState({ email: "", confirmEmail: "" });
    const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });
    const [emailSaved, setEmailSaved] = useState(false);
    const [passwordSaved, setPasswordSaved] = useState(false);
    const [showEmailVerify, setShowEmailVerify] = useState(false);
    const [showPasswordVerify, setShowPasswordVerify] = useState(false);

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowEmailVerify(true);
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowPasswordVerify(true);
    };

    const closeEmailVerify = () => setShowEmailVerify(false);
    const closePasswordVerify = () => setShowPasswordVerify(false);

    const confirmEmailChange = () => {
        setEmailSaved(true);
        setTimeout(() => setEmailSaved(false), 3000);
        setEmailForm({ email: "", confirmEmail: "" });
    };

    const confirmPasswordChange = () => {
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
    };
}
