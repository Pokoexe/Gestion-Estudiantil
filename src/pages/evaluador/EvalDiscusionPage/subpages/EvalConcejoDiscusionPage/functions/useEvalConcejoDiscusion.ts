import { useState } from "react";
import { useNavigate } from "react-router";
import { useFetch } from "@shared/services";
import { getPostulaciones } from "@shared/services/actions/discusiones";
import { getBoletines, getAnios, type Boletin } from "@shared/services/actions/boletines";
import { promedio } from "@shared/services/data/boletines";

export const TEAL = "#0d9488";
export const TEAL_BG = "#ccfbf1";
export const TEAL_50 = "#f0fdfa";

export const COLS = "grid-cols-[1.8fr_0.8fr_0.8fr_1fr_0.5fr]";
export const HEADERS = ["Estudiante", "Sección", "Promedio", "Estado", ""];
export const PER_PAGE = 8;

export function useEvalConcejoDiscusion() {
  const navigate = useNavigate();
  const [selAnio, setSelAnio] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data: POSTULACIONES } = useFetch(getPostulaciones, []);
  const { data: BOLETINES } = useFetch(getBoletines, []);
  const { data: ANIOS } = useFetch(getAnios, []);

  const listo = selAnio !== "";

  const estudiantes = listo ? BOLETINES.filter((b) => b.anio === selAnio) : [];
  const filtrados = estudiantes.filter(
    (b) => !query.trim() || b.student.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtrados.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtrados.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const estaPostulado = (b: Boletin) =>
    POSTULACIONES.some(
      (p) => p.estudiante === b.student && p.anio === `${b.anio} ${b.seccion}`,
    );

  const abrirEstudiante = (b: Boletin) =>
    navigate(`/evaluador/discusion/concejo/${b.id}`);

  return {
    navigate,
    selAnio,
    setSelAnio,
    query,
    setQuery,
    page,
    setPage,
    ANIOS,
    listo,
    filtrados,
    totalPages,
    currentPage,
    paged,
    estaPostulado,
    abrirEstudiante,
    promedio,
  };
}
