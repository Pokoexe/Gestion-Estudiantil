import { useNavigate } from "react-router";
import {
  Layers,
  BookOpen,
  Users,
  GraduationCap,
  ClipboardCheck,
  AlertTriangle,
  UserX,
  CalendarCheck,
} from "lucide-react";
import { accent } from "@themes/tokens";
import { useLapso } from "@shared/context/LapsoContext";
import { useFetch } from "@shared/services";
import {
  getSecciones,
  getRendimiento,
  getRendimientoLapso,
  getAsistenciaMes,
  getAcademicoAjustes,
  type AcademicoLapsoAjustes,
} from "@shared/services/actions/director";
import type { Kpi, AttStat } from "../interfaces";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export const round1 = (n: number) => Math.round(n * 10) / 10;
export const clampPct = (n: number) => Math.max(0, Math.min(100, n));

/* ------------------------------------------------------------------ */
/* Constantes                                                          */
/* ------------------------------------------------------------------ */

const KPIS: Kpi[] = [
  { label: "Secciones", value: "24", icon: Layers, ac: accent.blue, hint: "7 años · 3 secciones c/u" },
  { label: "Materias", value: "32", icon: BookOpen, ac: accent.purple, hint: "Plan de estudios completo" },
  { label: "Estudiantes", value: "612", icon: Users, ac: accent.green, hint: "Matrícula activa 2026-I" },
  { label: "Promedio general", value: "15,8", icon: GraduationCap, ac: accent.amber, hint: "Escala 0 – 20" },
  { label: "Asistencia global", value: "91 %", icon: ClipboardCheck, ac: accent.red, hint: "Promedio del lapso" },
];

export const ATT_STATS: AttStat[] = [
  { label: "Asistencia hoy", value: "93 %", ac: accent.green, icon: CalendarCheck },
  { label: "Inasistencias del día", value: "43", ac: accent.amber, icon: UserX },
  { label: "Retardos del día", value: "17", ac: accent.blue, icon: AlertTriangle },
];

/* ------------------------------------------------------------------ */
/* Hook                                                                */
/* ------------------------------------------------------------------ */

export function useDirAcademico() {
  const navigate = useNavigate();
  const { selected, selectedId } = useLapso();

  const { data: SECTIONS, loading: loadingSecciones } = useFetch(getSecciones, []);
  const { data: PERFORMANCE, loading: loadingRendimiento } = useFetch(getRendimiento, []);
  const { data: RENDIMIENTO_LAPSO, loading: loadingRendLapso } = useFetch(getRendimientoLapso, []);
  const { data: ASISTENCIA_MES, loading: loadingAsistencia } = useFetch(getAsistenciaMes, []);
  const ajustesEmpty: AcademicoLapsoAjustes = {
    promedioPorLapso: { 1: 0, 2: 0, 3: 0 },
    deltaPromedio: { 1: 0, 2: 0, 3: 0 },
    deltaAsistencia: { 1: 0, 2: 0, 3: 0 },
  };
  const { data: ajustes, loading: loadingAjustes } = useFetch(getAcademicoAjustes, ajustesEmpty);

  const loading =
    loadingSecciones || loadingRendimiento || loadingRendLapso || loadingAsistencia || loadingAjustes;

  const kpis = KPIS.map((k) => {
    if (k.label === "Promedio general")
      return { ...k, value: (ajustes.promedioPorLapso[selectedId] ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 1 }), hint: `Escala 0 – 20 · ${selected.label}` };
    if (k.label === "Asistencia global")
      return { ...k, value: `${clampPct(91 + (ajustes.deltaAsistencia[selectedId] ?? 0))} %`, hint: `Promedio del ${selected.label.toLowerCase()}` };
    return k;
  });

  const sections = SECTIONS.map((s) => ({
    ...s,
    average: round1(s.average + (ajustes.deltaPromedio[selectedId] ?? 0)),
    attendance: clampPct(s.attendance + (ajustes.deltaAsistencia[selectedId] ?? 0)),
  }));

  const performance = PERFORMANCE.map((p) => ({
    ...p,
    promedio: round1(p.promedio + (ajustes.deltaPromedio[selectedId] ?? 0)),
  }));

  return {
    navigate,
    selected,
    selectedId,
    loading,
    kpis,
    sections,
    performance,
    RENDIMIENTO_LAPSO,
    ASISTENCIA_MES,
    ATT_STATS,
    round1,
    clampPct,
  };
}
