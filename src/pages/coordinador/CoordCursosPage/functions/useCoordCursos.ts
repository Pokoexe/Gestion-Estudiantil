import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BookOpen, ClipboardList, Clock, Users } from "lucide-react";
import { color, accent } from "@themes/tokens";
import { useFetch } from "@shared/services";
import {
  getCoordCursos,
  getCoordCursosChart,
  type CoordCurso,
  type CursoStatus,
} from "@shared/services/actions/coordinador";
import type { PendingAction } from "../interfaces";

const PER_PAGE = 6;

const AREAS = [
  { dataKey: "rob", name: "Robótica", color: color.primary },
  { dataKey: "web", name: "Prog. web", color: color.success },
  { dataKey: "ing", name: "Inglés", color: color.purple },
  { dataKey: "mus", name: "Guitarra", color: color.warning },
];

const STATUS_META: Record<CursoStatus, { label: string; bg: string; fg: string }> = {
  creado: { label: "Creado", bg: color.borderSoft, fg: color.ink500 },
  solicitado: { label: "Solicitado", bg: color.primary100, fg: color.primary },
  en_espera: { label: "En espera", bg: color.warningBg, fg: color.warning },
  en_proceso: { label: "En proceso", bg: "#fef3c7", fg: "#d97706" },
  aceptado: { label: "Aceptado", bg: color.successBg, fg: color.success },
  rechazado: { label: "Rechazado", bg: color.dangerBg, fg: color.danger },
};

export function useCoordCursos() {
  const navigate = useNavigate();
  const { data: cursosFetched } = useFetch(getCoordCursos, []);
  const { data: CHART_DATA } = useFetch(getCoordCursosChart, []);

  const [cursos, setCursos] = useState<CoordCurso[]>([]);
  useEffect(() => setCursos(cursosFetched), [cursosFetched]);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"todos" | CursoStatus>("todos");
  const [page, setPage] = useState(1);
  const [selectedCurso, setSelectedCurso] = useState<CoordCurso | null>(null);
  const [pending, setPending] = useState<PendingAction>(null);

  const cursosActivos = cursos.filter((c) => c.status === "aceptado");
  const cursosCreados = cursos.filter((c) => c.status === "creado").length;
  const cursosSolicitud = cursos.filter((c) => c.status === "solicitado").length;
  const cursosEspera = cursos.filter((c) => c.status === "en_espera").length;
  const estudiantesActivos = cursosActivos.reduce((s, c) => s + c.enrolledCount, 0);

  const KPIS = [
    { label: "Cursos creados", value: String(cursosCreados), icon: BookOpen, ac: accent.blue },
    { label: "Cursos solicitados", value: String(cursosSolicitud), icon: ClipboardList, ac: accent.purple },
    { label: "En espera confirmar", value: String(cursosEspera), icon: Clock, ac: { bg: "#fef3c7", fg: "#d97706" } },
    { label: "Estudiantes activos", value: String(estudiantesActivos), icon: Users, ac: accent.green },
  ];

  const filtered = cursos
    .filter((c) => statusFilter === "todos" || c.status === statusFilter)
    .filter((c) => !query.trim() || c.title.toLowerCase().includes(query.trim().toLowerCase()) || c.code.toLowerCase().includes(query.trim().toLowerCase()) || c.profesor.toLowerCase().includes(query.trim().toLowerCase()));

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const applyAction = (id: number, action: "aceptar" | "rechazar") => {
    setCursos((prev) =>
      prev.map((c) => c.id === id ? { ...c, status: action === "aceptar" ? "aceptado" : "rechazado" } : c)
    );
    if (selectedCurso?.id === id)
      setSelectedCurso((prev) => prev ? { ...prev, status: action === "aceptar" ? "aceptado" : "rechazado" } : null);
    setPending(null);
  };

  const triggerAction = (id: number, action: "aceptar" | "rechazar", e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPending({ id, action });
  };

  return {
    navigate,
    CHART_DATA,
    cursos,
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    selectedCurso,
    setSelectedCurso,
    pending,
    setPending,
    KPIS,
    filtered,
    totalPages,
    currentPage,
    paged,
    applyAction,
    triggerAction,
    AREAS,
    STATUS_META,
  };
}
