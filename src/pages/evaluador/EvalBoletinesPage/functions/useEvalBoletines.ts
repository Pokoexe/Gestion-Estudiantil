import { useState } from "react";
import { FileText, Gauge, Clock, CheckCircle2 } from "lucide-react";
import { useFetch } from "@shared/services";
import {
  getBoletines,
  getAnios,
  getSecciones,
  getMaterias,
  type Boletin,
} from "@shared/services/actions/boletines";
import { promedio, notasDe } from "@shared/services/data/boletines";
import { useLapso } from "@shared/context/LapsoContext";
import type { Grupo } from "../interfaces";

export const TEAL = "#0d9488";
export const TEAL_BG = "#ccfbf1";
export const TEAL_50 = "#f0fdfa";

export const COLS = "grid-cols-[1.7fr_0.9fr_0.7fr_0.8fr_0.9fr_1.5fr]";
export const HEADERS = ["Estudiante", "Año", "Sección", "Promedio", "Estado", "Acciones"];
export const GRUPO_COLS = "grid-cols-[2fr_1fr_1fr_1.1fr_1fr]";
export const PER_PAGE = 8;

function buildGrupos(boletines: Boletin[], lapsoId: ReturnType<typeof useLapso>["selectedId"]): Grupo[] {
  const map = new Map<string, Boletin[]>();
  for (const b of boletines) {
    const key = `${b.anio} ${b.seccion}`;
    const arr = map.get(key);
    if (arr) arr.push(b);
    else map.set(key, [b]);
  }
  return Array.from(map.entries()).map(([label, items]) => ({
    label,
    estudiantes: items.length,
    promedio: items.reduce((a, b) => a + promedio(notasDe(b, lapsoId)), 0) / items.length,
    recibidos: items.filter((b) => b.retirado).length,
  }));
}

export function useEvalBoletines() {
  const [query, setQuery] = useState("");
  const [selAnio, setSelAnio] = useState("todos");
  const [selSeccion, setSelSeccion] = useState("todas");
  const [selMateria, setSelMateria] = useState("todas");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Boletin | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [vista, setVista] = useState<"estudiante" | "seccion">("estudiante");

  const { data: BOLETINES } = useFetch(getBoletines, []);
  const { data: ANIOS } = useFetch(getAnios, []);
  const { data: SECCIONES } = useFetch(getSecciones, []);
  const { data: MATERIAS } = useFetch(getMaterias, []);

  const { selectedId } = useLapso();
  const GRUPOS = buildGrupos(BOLETINES, selectedId);

  const recibidosGlobal = BOLETINES.filter((b) => b.retirado).length;
  const promGlobal = BOLETINES.length
    ? (BOLETINES.reduce((a, b) => a + promedio(notasDe(b, selectedId)), 0) / BOLETINES.length).toFixed(2)
    : "—";

  const porSelects = BOLETINES.filter((b) => {
    if (selAnio !== "todos" && b.anio !== selAnio) return false;
    if (selSeccion !== "todas" && b.seccion !== selSeccion) return false;
    if (selMateria !== "todas" && !MATERIAS.includes(selMateria)) return false;
    return true;
  });

  const filtradas = porSelects.filter(
    (b) =>
      !query.trim() ||
      `${b.student} ${b.representante}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtradas.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtradas.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const total = porSelects.length;
  const prom = total
    ? (porSelects.reduce((a, b) => a + promedio(notasDe(b, selectedId)), 0) / total).toFixed(2)
    : "—";
  const recibidos = porSelects.filter((b) => b.retirado).length;
  const porEntregar = total - recibidos;

  const KPIS = [
    { label: "Boletines", value: String(total), icon: FileText, foot: "en el filtro actual" },
    { label: "Promedio", value: prom, icon: Gauge, foot: "general del grupo" },
    { label: "Por entregar", value: String(porEntregar), icon: Clock, foot: "aún no retirados" },
    { label: "Recibidos", value: String(recibidos), icon: CheckCircle2, foot: "ya retirados" },
  ];

  const scopeLabel = () => {
    const parts = [
      selAnio !== "todos" ? selAnio : null,
      selSeccion !== "todas" ? `Sección ${selSeccion}` : null,
    ].filter(Boolean);
    return parts.length ? parts.join(" · ") : "todas las secciones";
  };

  const descargar = (b: Boletin) =>
    setFeedback(`Descargando el boletín de ${b.student} (${b.anio} ${b.seccion}) en PDF…`);

  const descargarTodos = () =>
    setFeedback(
      `Se generaron ${porSelects.length} boletín(es) de ${scopeLabel()} en un solo archivo PDF.`,
    );

  const descargarGrupo = (g: Grupo) =>
    setFeedback(
      `Se generaron ${g.estudiantes} boletines de ${g.label} en un solo archivo PDF.`,
    );

  return {
    query,
    setQuery,
    selAnio,
    setSelAnio,
    selSeccion,
    setSelSeccion,
    selMateria,
    setSelMateria,
    page,
    setPage,
    selected,
    setSelected,
    feedback,
    setFeedback,
    vista,
    setVista,
    BOLETINES,
    ANIOS,
    SECCIONES,
    MATERIAS,
    GRUPOS,
    recibidosGlobal,
    promGlobal,
    porSelects,
    filtradas,
    totalPages,
    currentPage,
    paged,
    KPIS,
    selectedId,
    descargar,
    descargarTodos,
    descargarGrupo,
  };
}
