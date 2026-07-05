/**
 * Página pública en la raíz "/".
 *
 * Lee la configuración PUBLICADA desde la cookie. Si no existe, muestra una de
 * las 2 plantillas por defecto. El botón "Iniciar sesión" lleva a /login.
 */

import { useMemo } from "react";
import { useNavigate } from "react-router";
import { LandingView } from "../landing/LandingView";
import { loadPublished } from "../landing/storage";
import { makeDefaultConfig, DEFAULT_TEMPLATE } from "../landing/types";

export function LandingPage() {
  const navigate = useNavigate();
  const config = useMemo(() => loadPublished() ?? makeDefaultConfig(DEFAULT_TEMPLATE), []);

  return (
    <div className="min-h-screen w-full">
      <LandingView config={config} onLogin={() => navigate("/login")} />
    </div>
  );
}
