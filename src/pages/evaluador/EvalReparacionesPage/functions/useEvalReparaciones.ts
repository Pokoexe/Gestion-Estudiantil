import { useState } from "react";
import { useFetch } from "@shared/services";
import {
  getEstudiantesReparacion,
  type StudentRow,
  type MatStatus,
} from "@shared/services/actions/evaluador-discusion";

export const TEAL = "#0d9488";
export const TEAL_BG = "#ccfbf1";
export const PER_PAGE = 8;

export const DONUT_COLORS = [
  "#f43f5e", "#f97316", "#eab308", "#22c55e",
  "#06b6d4", "#8b5cf6", "#ec4899", "#64748b",
];

export const COLS = "grid-cols-[1.8fr_0.9fr_1fr_1fr_1.1fr_0.4fr]";
export const HEADERS = [
  "Estudiante",
  "Año / Secc.",
  "Mat. reprobadas",
  "Mat. pendientes",
  "Estado",
  "",
];

export const MAT_STATUS_META: Record<MatStatus, { label: string; cls: string; dot: string }> = {
  reprobada: { label: "Reprobada",  cls: "bg-edu-danger-bg text-edu-danger",   dot: "#ef4444" },
  pendiente: { label: "Pendiente",  cls: "bg-edu-warning-bg text-edu-warning", dot: "#f59e0b" },
  reparando: { label: "Reparando",  cls: "bg-edu-primary-50 text-edu-primary", dot: TEAL },
  aprobada:  { label: "Aprobada",   cls: "bg-edu-success-bg text-edu-success", dot: "#22c55e" },
};

export function buildDonutData(riesgo: StudentRow[]) {
  const map = new Map<string, number>();
  for (const s of riesgo) {
    for (const m of s.materias) {
      if (m.status === "reprobada" || m.status === "pendiente") {
        map.set(m.name, (map.get(m.name) ?? 0) + 1);
      }
    }
  }
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function studentStatus(s: StudentRow): { label: string; cls: string } {
  const rep = s.materias.filter((m) => m.status === "reprobada").length;
  if (rep >= 3) return { label: "Crítico", cls: "bg-edu-danger-bg text-edu-danger" };
  if (rep >= 1) return { label: "En riesgo", cls: "bg-edu-warning-bg text-edu-warning" };
  return { label: "Pendiente", cls: "bg-edu-primary-50 text-edu-primary" };
}

export function useEvalReparaciones() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<StudentRow | null>(null);

  const { data: estudiantes, loading } = useFetch(getEstudiantesReparacion, []);

  const RIESGO_STUDENTS = estudiantes.filter(
    (s) => s.materias.some((m) => m.status === "reprobada" || m.status === "pendiente"),
  );

  const pendienteCount = RIESGO_STUDENTS.filter(
    (s) => s.materias.some((m) => m.status === "pendiente"),
  ).length;

  const totalReprobadas = RIESGO_STUDENTS.reduce(
    (acc, s) => acc + s.materias.filter((m) => m.status === "reprobada").length,
    0,
  );

  const DONUT_DATA = buildDonutData(RIESGO_STUDENTS);

  const rows = RIESGO_STUDENTS.filter(
    (s) =>
      !query.trim() ||
      s.name.toLowerCase().includes(query.trim().toLowerCase()) ||
      s.cedula.includes(query.trim()),
  );

  const totalPages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = rows.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return {
    query,
    setQuery,
    page,
    setPage,
    selected,
    setSelected,
    loading,
    RIESGO_STUDENTS,
    pendienteCount,
    totalReprobadas,
    DONUT_DATA,
    rows,
    totalPages,
    currentPage,
    paged,
  };
}
