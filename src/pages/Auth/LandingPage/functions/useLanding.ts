import { useMemo } from "react";
import { useNavigate } from "react-router";
import { loadPublished } from "./storage";
import { makeDefaultConfig, DEFAULT_TEMPLATE } from "../interfaces/types";

export function useLanding() {
  const navigate = useNavigate();
  const config = useMemo(() => loadPublished() ?? makeDefaultConfig(DEFAULT_TEMPLATE), []);
  const onLogin = () => navigate("/login");
  const onEnroll = () => navigate("/inscripcion");
  return { config, onLogin, onEnroll };
}
