import { useState } from "react";
import { CalendarDays, Clock, CheckCircle2 } from "lucide-react";
import { useFetch } from "@shared/services";
import { getPlanes, type PlanEstado } from "@shared/services/actions/cronograma";
import { fmtFechaLarga } from "@shared/services/data/cronograma";

export const TEAL = "#0d9488";
export const TEAL_BG = "#ccfbf1";
export const TEAL_50 = "#f0fdfa";

export const ESTADO_PLAN: Record<PlanEstado, string> = {
  "en revisión": "bg-edu-warning-bg text-edu-warning",
  activo: "bg-edu-success-bg text-edu-success",
};

export const COLS = "grid-cols-[1.2fr_0.9fr_1.3fr_2.2fr_1fr]";
export const HEADERS = ["Materia", "Sección", "Docente", "Fechas de evaluación", "Estado"];
export const PER_PAGE = 6;
export const TODAY = "2026-07-20";

export type LapsoState = {
  nombre: string;
  inicio: string;
  cierre: string;
  min: number;
  max: number;
};

export function diasEntre(a: string, b: string): number {
  const da = new Date(a + "T00:00:00").getTime();
  const db = new Date(b + "T00:00:00").getTime();
  return Math.round((db - da) / 86400000);
}

export function useEvalCronograma() {
  const { data: PLANES } = useFetch(getPlanes, []);

  const [lapso, setLapso] = useState<LapsoState>({
    nombre: "Lapso II · 2026-I",
    inicio: "2026-07-01",
    cierre: "2026-07-31",
    min: 5,
    max: 15,
  });
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState<LapsoState>(lapso);
  const [query, setQuery] = useState("");
  const [estadoFilter, setEstadoFilter] = useState<"todos" | PlanEstado>("todos");
  const [page, setPage] = useState(1);

  const totalEvals = PLANES.reduce((a, p) => a + p.evaluaciones.length, 0);
  const realizadas = PLANES.reduce(
    (a, p) => a + p.evaluaciones.filter((e) => e.fecha <= TODAY).length,
    0,
  );

  const diasTotal = Math.max(1, diasEntre(lapso.inicio, lapso.cierre));
  const diasTrans = Math.min(diasTotal, Math.max(0, diasEntre(lapso.inicio, TODAY)));
  const progreso = Math.round((diasTrans / diasTotal) * 100);

  const KPIS = [
    { label: "Fecha de hoy", value: fmtFechaLarga(TODAY), icon: CalendarDays, foot: lapso.nombre },
    {
      label: "Tiempo transcurrido del lapso",
      value: `${progreso} %`,
      icon: Clock,
      foot: `Cierra el ${fmtFechaLarga(lapso.cierre)}`,
    },
    {
      label: "Evaluaciones realizadas",
      value: String(realizadas),
      icon: CheckCircle2,
      foot: `de ${totalEvals} programadas`,
    },
  ];

  const filtradas = PLANES.filter((p) => {
    if (estadoFilter !== "todos" && p.estado !== estadoFilter) return false;
    if (
      query.trim() &&
      !`${p.materia} ${p.seccion} ${p.docente}`
        .toLowerCase()
        .includes(query.trim().toLowerCase())
    )
      return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtradas.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtradas.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const openEdit = () => {
    setForm(lapso);
    setShowEdit(true);
  };

  const guardar = (e: React.FormEvent) => {
    e.preventDefault();
    setLapso({ ...form, min: Number(form.min) || 0, max: Number(form.max) || 0 });
    setShowEdit(false);
  };

  return {
    PLANES,
    lapso,
    showEdit,
    setShowEdit,
    form,
    setForm,
    query,
    setQuery,
    estadoFilter,
    setEstadoFilter,
    page,
    setPage,
    progreso,
    KPIS,
    filtradas,
    totalPages,
    currentPage,
    paged,
    openEdit,
    guardar,
  };
}
