import { useNavigate, useParams } from "react-router";
import { useFetch } from "@shared/services";
import { getBoletines, getMaterias } from "@shared/services/actions/boletines";
import { promedio, notasDe } from "@shared/services/data/boletines";
import { useLapso } from "@shared/context/LapsoContext";

export const TEAL = "#0d9488";
export const TEAL_BG = "#ccfbf1";
export const TEAL_50 = "#f0fdfa";

export const EVAL_COLS = "grid-cols-[2fr_1fr_0.7fr_0.7fr]";

export function useEvalSabanaEstudiante() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedId } = useLapso();
  const { data: boletines, loading } = useFetch(getBoletines, []);
  const { data: MATERIAS } = useFetch(getMaterias, []);
  const b = boletines.find((x) => String(x.id) === id);

  const notas = b ? notasDe(b, selectedId) : [];
  const prom = b ? promedio(notas) : 0;

  return {
    id,
    navigate,
    loading,
    b,
    MATERIAS,
    notas,
    prom,
  };
}
