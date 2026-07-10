import { useState } from "react";
import { useNavigate } from "react-router";
import { useFetch } from "@shared/services";
import { getPostulaciones, type PostEstado } from "@shared/services/actions/discusiones";
import { useLapso } from "@shared/context/LapsoContext";
import { CURRENT_LAPSO_ID } from "@shared/services/data/lapsos";

export const TEAL = "#0d9488";
export const TEAL_BG = "#ccfbf1";

export const ESTADO_META: Record<PostEstado, string> = {
  Pendiente: "bg-edu-warning-bg text-edu-warning",
  Aceptada: "bg-edu-success-bg text-edu-success",
  Rechazada: "bg-edu-danger-bg text-edu-danger",
};

export const COLS = "grid-cols-[1.6fr_1.2fr_1fr_0.7fr_0.9fr]";
export const HEADERS = ["Estudiante", "Materia", "Año", "Nota", "Estado"];
export const PER_PAGE = 8;

export function useEvalDiscusion() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data: POSTULACIONES } = useFetch(getPostulaciones, []);
  const { selectedId } = useLapso();
  const enLapso = POSTULACIONES.filter(
    (p) => (p.lapso ?? CURRENT_LAPSO_ID) === selectedId,
  );

  const q = query.trim().toLowerCase();
  const filtrado = enLapso.filter(
    (p) => !q || `${p.estudiante} ${p.materia} ${p.anio}`.toLowerCase().includes(q),
  );

  const totalPages = Math.max(1, Math.ceil(filtrado.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtrado.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return {
    navigate,
    query,
    setQuery,
    page,
    setPage,
    enLapso,
    filtrado,
    totalPages,
    currentPage,
    paged,
  };
}
