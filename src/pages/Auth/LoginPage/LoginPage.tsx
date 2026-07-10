import { useLogin } from "./functions/useLogin";
import { ForgotPasswordModal } from "./modals/ForgotPasswordModal";
import { LoginForm } from "./ui/LoginForm";
import { LoginBrand } from "./ui/LoginBrand";

export function LoginPage() {
  const {
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
  } = useLogin();

  return (
    <>
      {showForgot && <ForgotPasswordModal onClose={closeForgot} />}

      {/* En móvil/tablet: imagen de fondo. En desktop: layout de dos columnas */}
      <div
        className="min-h-screen w-full flex lg:bg-none relative"
        style={{ backgroundImage: `url(${BG_IMAGE})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        {/* Overlay solo en móvil/tablet */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(26,86,219,0.7)_0%,rgba(17,24,39,0.5)_100%)] lg:hidden" />

        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          toggleShowPassword={toggleShowPassword}
          loading={loading}
          openForgot={openForgot}
          handleSubmit={handleSubmit}
          goHome={goHome}
          goToRole={goToRole}
        />

        <LoginBrand BG_IMAGE={BG_IMAGE} />
      </div>
    </>
  );
}
