import { useState } from "react";
import { useNavigate } from "react-router";

export const BG_IMAGE =
  "https://images.unsplash.com/photo-1778751225720-ee0f1d2ad14e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBzY2hvb2wlMjJidWlsZGluZyUyMGVkdWNhdGlvbiUyMGNhbXB1c3xlbnwxfHx8fDE3ODI5NTYxNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080";

export function useLogin() {
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

  const goHome = () => navigate("/");

  const goToRole = (rid: string) => navigate(`/${rid}`);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const openForgot = () => setShowForgot(true);

  const closeForgot = () => setShowForgot(false);

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    toggleShowPassword,
    loading,
    showForgot,
    openForgot,
    closeForgot,
    handleSubmit,
    goHome,
    goToRole,
    BG_IMAGE,
  };
}
