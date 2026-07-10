import {
  Users,
  GraduationCap,
  ShieldCheck,
  DollarSign,
  BookOpen,
  Layers,
  AlertTriangle,
  Trophy,
  Palette,
  FlaskConical,
} from "lucide-react";
import { color, accent } from "@themes/tokens";
import { useFetch } from "@shared/services";
import { getFinanzasDashboard, getDashboardActividades } from "@shared/services/actions/director";

/* ------------------------------------------------------------------ */
/* Datos ficticios                                                     */
/* ------------------------------------------------------------------ */

export const FINANCE_SERIES = [
  { key: "usd", name: "USD", stroke: color.success },
  { key: "cop", name: "COP", stroke: color.primary },
  { key: "bs", name: "Bs", stroke: color.purple },
  { key: "sinPagar", name: "Sin pagar", stroke: color.danger },
] as const;

export const STAFF = [
  { label: "Docentes activos", value: "38", icon: GraduationCap, tone: accent.blue },
  { label: "Secciones", value: "24", icon: Layers, tone: accent.purple },
  { label: "Materias", value: "32", icon: BookOpen, tone: accent.green },
  { label: "Incidencias del mes", value: "9", icon: AlertTriangle, tone: accent.amber },
];

export const ACTIVITY_META: Record<
  "Deportiva" | "Cultural" | "Académica",
  { bg: string; fg: string; icon: React.FC<{ style?: React.CSSProperties }> }
> = {
  Deportiva: { bg: accent.green.bg, fg: accent.green.fg, icon: Trophy },
  Cultural: { bg: accent.purple.bg, fg: accent.purple.fg, icon: Palette },
  Académica: { bg: accent.blue.bg, fg: accent.blue.fg, icon: FlaskConical },
};

export const KPIS: {
  label: string;
  value: string;
  icon: React.FC<{ style?: React.CSSProperties }>;
  tone: { bg: string; fg: string };
  trend: string;
  up: boolean;
}[] = [
  { label: "Estudiantes", value: "612", icon: Users, tone: accent.blue, trend: "3 % vs. año anterior", up: true },
  { label: "Docentes", value: "38", icon: GraduationCap, tone: accent.purple, trend: "2 nuevos este período", up: true },
  { label: "Solvencia institucional", value: "78 %", icon: ShieldCheck, tone: accent.amber, trend: "5 % vs. mes anterior", up: true },
  { label: "Ingresos del mes", value: "$ 8.450 USD", icon: DollarSign, tone: accent.green, trend: "4 % vs. mes anterior", up: false },
];

/* ------------------------------------------------------------------ */
/* Hook                                                                */
/* ------------------------------------------------------------------ */

export function useDirectorDashboard() {
  const { data: FINANCE, loading: loadingFinance } = useFetch(getFinanzasDashboard, []);
  const { data: ACTIVITIES, loading: loadingActividades } = useFetch(getDashboardActividades, []);

  const loading = loadingFinance || loadingActividades;

  return { FINANCE, ACTIVITIES, loading, FINANCE_SERIES, ACTIVITY_META, KPIS, STAFF };
}
