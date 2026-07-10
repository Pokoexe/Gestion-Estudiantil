import { useLocation, useNavigate } from "react-router";
import { useFetch } from "@shared/services";
import { getCampos, type Campo } from "@shared/services/actions/plantilla";

export const TEAL = "#0d9488";
export const TEAL_50 = "#f0fdfa";

export function useEvalPlantillaPreview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: camposDefault } = useFetch(getCampos, []);
  const campos: Campo[] =
    (location.state as { campos?: Campo[] } | null)?.campos ?? camposDefault;

  return { navigate, campos };
}
