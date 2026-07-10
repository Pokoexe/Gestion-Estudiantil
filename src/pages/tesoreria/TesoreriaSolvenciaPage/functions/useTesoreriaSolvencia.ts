import { useState } from "react";
import { AlertTriangle, UserCheck, Wallet, TrendingDown } from "lucide-react";
import { color, accent } from "@themes/tokens";
import { useFetch } from "@shared/services";
import { getRepresentantes, type Representative } from "@shared/services/actions/tesoreria";

export const money = (n: number) => n.toLocaleString("es-ES", { maximumFractionDigits: 2 });

export function monthsBadge(m: number): { bg: string; fg: string } {
  if (m >= 4) return { bg: color.dangerBg, fg: color.danger };
  if (m >= 2) return { bg: color.warningBg, fg: color.warning };
  return { bg: color.primary50, fg: color.primary };
}

export const initials = (name: string) => name.split(" ").map((n) => n[0]).slice(0, 2).join("");

export function studentYears(students: string): string {
  return students
    .split(",")
    .map((s) => s.split("·")[1]?.trim())
    .filter(Boolean)
    .join(", ");
}

export function payPattern(r: Representative): string {
  if (r.months === 0) return "Paga puntualmente todos los meses.";
  if (r.months >= 4) return "Suele acumular y pagar el total cada 4–5 meses.";
  if (r.months >= 2) return "Normalmente paga el total cada 2–3 meses.";
  return "Suele ponerse al día al mes siguiente.";
}

const COLS = "grid-cols-[1.3fr_1.6fr_0.9fr_1fr_1fr_1.1fr]";
const HEADERS = ["Representante", "Estudiante(s)", "Meses", "Adeudado", "Teléfono", "Acción"];
const PER_PAGE = 7;

export function useTesoreriaSolvencia() {
  const { data: REPRESENTATIVES, loading } = useFetch(getRepresentantes, []);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"todos" | "solvente" | "mora">("todos");
  const [page, setPage] = useState(1);
  const [notified, setNotified] = useState<Record<number, boolean>>({});
  const [selected, setSelected] = useState<Representative | null>(null);
  const [confirmNotify, setConfirmNotify] = useState<Representative | null>(null);

  const morososCount = REPRESENTATIVES.filter((r) => r.months > 0).length;
  const solventesCount = REPRESENTATIVES.filter((r) => r.months === 0).length;
  const payRate = REPRESENTATIVES.length
    ? Math.round((solventesCount / REPRESENTATIVES.length) * 100)
    : 0;

  const SUMMARY: {
    label: string;
    value: string;
    icon: React.FC<{ style?: React.CSSProperties }>;
    ac: { bg: string; fg: string };
    hint: string;
    trend?: string;
  }[] = [
    { label: "Representantes en mora", value: String(morososCount), icon: AlertTriangle, ac: accent.red, hint: "Con una o más mensualidades" },
    { label: "Representantes solventes", value: String(solventesCount), icon: UserCheck, ac: accent.green, hint: "Al día con sus pagos" },
    { label: "Por cobrar (USD)", value: "$ 650", icon: Wallet, ac: accent.amber, hint: "Equivalente aproximado total" },
    { label: "Representantes que pagan", value: `${payRate} %`, icon: TrendingDown, ac: accent.blue, hint: "Promedio mensual de pago" },
  ];

  const filtered = REPRESENTATIVES.filter((r) => {
    const solvent = r.months === 0;
    if (statusFilter === "solvente" && !solvent) return false;
    if (statusFilter === "mora" && solvent) return false;
    if (query.trim() && !`${r.rep} ${r.students}`.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const notify = (id: number) => setNotified((prev) => ({ ...prev, [id]: true }));

  return {
    REPRESENTATIVES, loading,
    query, setQuery,
    statusFilter, setStatusFilter,
    page, setPage,
    notified,
    selected, setSelected,
    confirmNotify, setConfirmNotify,
    SUMMARY, filtered, totalPages, currentPage, paged,
    notify,
    money, monthsBadge, initials, studentYears, payPattern,
    COLS, HEADERS,
  };
}
