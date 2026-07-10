import { useState, useEffect } from "react";
import { Wallet, Coins, Banknote } from "lucide-react";
import { accent } from "@themes/tokens";
import { useFetch } from "@shared/services";
import {
  getPagos,
  getRecaudoSemanal,
  type Currency,
  type Method,
  type PayStatus,
  type Payment,
} from "@shared/services/actions/tesoreria";

export const money = (n: number) => n.toLocaleString("es-ES", { maximumFractionDigits: 2 });

const CURRENCIES: Currency[] = ["USD", "Bs.", "COP"];

const AVAILABLE: {
  currency: Currency;
  value: number;
  icon: React.FC<{ style?: React.CSSProperties }>;
  ac: { bg: string; fg: string };
  hint: string;
}[] = [
  { currency: "USD", value: 8450, icon: Wallet, ac: accent.green, hint: "Dólares en caja" },
  { currency: "Bs.", value: 312500, icon: Coins, ac: accent.blue, hint: "Bolívares · Tasa BCV 36,80" },
  { currency: "COP", value: 1240000, icon: Banknote, ac: accent.purple, hint: "Pesos · frontera Táchira" },
];

const STATUS_META: Record<PayStatus, { label: string; cls: string }> = {
  confirmed: { label: "Confirmado", cls: "bg-edu-success-bg text-edu-success" },
  review: { label: "En revisión", cls: "bg-edu-warning-bg text-edu-warning" },
};

const COLS = "grid-cols-[1.3fr_1.3fr_0.9fr_0.6fr_0.9fr_1fr_0.9fr]";
const HEADERS = ["Representante", "Estudiante", "Monto", "Moneda", "Fecha", "Método", "Estado"];
const PER_PAGE = 6;

export function useTesoreriaPagos() {
  const { data: fetchedPayments } = useFetch(getPagos, []);
  const { data: MONTHLY } = useFetch(getRecaudoSemanal, []);

  const [payments, setPayments] = useState<Payment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ rep: "", amount: "", currency: "USD" as Currency, concepto: "Mensualidad" });
  const [query, setQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState<"todos" | Method>("todos");
  const [statusFilter, setStatusFilter] = useState<"todos" | PayStatus>("todos");
  const [page, setPage] = useState(1);

  useEffect(() => setPayments(fetchedPayments), [fetchedPayments]);

  const filtered = payments.filter((p) => {
    if (methodFilter !== "todos" && p.method !== methodFilter) return false;
    if (statusFilter !== "todos" && p.status !== statusFilter) return false;
    if (query.trim() && !`${p.rep} ${p.student}`.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const openModal = () => {
    setForm({ rep: "", amount: "", currency: "USD", concepto: "Mensualidad" });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevo: Payment = {
      id: Date.now(),
      rep: form.rep.trim() || "Representante",
      student: form.concepto.trim() || "Mensualidad",
      amount: Number(form.amount) || 0,
      currency: form.currency,
      date: "3 jul 2026",
      method: "Efectivo",
      status: "confirmed",
    };
    setPayments([nuevo, ...payments]);
    setShowModal(false);
  };

  return {
    MONTHLY,
    payments,
    showModal, setShowModal,
    form, setForm,
    query, setQuery,
    methodFilter, setMethodFilter,
    statusFilter, setStatusFilter,
    page, setPage,
    safePage, totalPages,
    filtered, pageItems,
    openModal, handleSubmit,
    AVAILABLE, STATUS_META, CURRENCIES,
    COLS, HEADERS,
  };
}
