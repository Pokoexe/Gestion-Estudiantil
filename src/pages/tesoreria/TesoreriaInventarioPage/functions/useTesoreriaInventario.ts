import { useState, useEffect } from "react";
import { color } from "@themes/tokens";
import { useFetch } from "@shared/services";
import {
  getInventario,
  getMovimientosInventario,
  getSaldoInventario,
  type Currency,
  type ItemStatus,
  type InvItem,
  type Movement,
} from "@shared/services/actions/tesoreria";

export const CATEGORIES = ["Mobiliario", "Tecnología", "Limpieza", "Aula", "Insumos"];

export const INV_STATUS: Record<ItemStatus, { label: string; bg: string; fg: string }> = {
  ok: { label: "Suficiente", bg: color.successBg, fg: color.success },
  low: { label: "Bajo", bg: color.warningBg, fg: color.warning },
  out: { label: "Agotado", bg: color.dangerBg, fg: color.danger },
};

export function deriveStatus(qty: number): ItemStatus {
  if (qty <= 0) return "out";
  if (qty < 10) return "low";
  return "ok";
}

export const money = (n: number) => n.toLocaleString("es-ES", { maximumFractionDigits: 2 });

export const COLS = "grid-cols-[1.5fr_0.9fr_0.6fr_0.8fr_0.8fr_0.8fr_1fr]";
export const HEADERS = ["Artículo", "Categoría", "Cantidad", "Valor unit.", "Valor total", "Estado", "Acciones"];
export const field = "border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-success";

const PER_PAGE = 6;

export function useTesoreriaInventario() {
  const { data: fetchedItems } = useFetch(getInventario, []);
  const { data: fetchedMovements } = useFetch(getMovimientosInventario, []);
  const { data: fetchedBalance } = useFetch(getSaldoInventario, 0);

  const [items, setItems] = useState<InvItem[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [balance, setBalance] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", category: CATEGORIES[0], qty: "", cost: "", currency: "USD" as Currency });

  const [editItem, setEditItem] = useState<InvItem | null>(null);
  const [editForm, setEditForm] = useState({ name: "", category: CATEGORIES[0], qty: "", unit: "", status: "ok" as ItemStatus });

  const [discountItem, setDiscountItem] = useState<InvItem | null>(null);
  const [discountForm, setDiscountForm] = useState({ qty: "", note: "" });

  const [editMov, setEditMov] = useState<Movement | null>(null);
  const [movForm, setMovForm] = useState({ qty: "", note: "" });
  const [confirmDelMov, setConfirmDelMov] = useState<Movement | null>(null);

  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState("todas");
  const [statusFilter, setStatusFilter] = useState<"todos" | ItemStatus>("todos");
  const [page, setPage] = useState(1);

  useEffect(() => setItems(fetchedItems), [fetchedItems]);
  useEffect(() => setMovements(fetchedMovements), [fetchedMovements]);
  useEffect(() => setBalance(fetchedBalance), [fetchedBalance]);

  const totalValue = items.reduce((acc, it) => acc + it.qty * it.unit, 0);
  const discountedThisMonth = movements.filter((m) => m.date.includes("jul")).reduce((acc, m) => acc + m.qty, 0);

  const filtered = items.filter((it) => {
    if (catFilter !== "todas" && it.category !== catFilter) return false;
    if (statusFilter !== "todos" && it.status !== statusFilter) return false;
    if (query.trim() && !`${it.name} ${it.category}`.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const openAdd = () => {
    setForm({ name: "", category: CATEGORIES[0], qty: "", cost: "", currency: "USD" });
    setShowAdd(true);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(form.qty) || 0;
    const cost = Number(form.cost) || 0;
    const unit = qty > 0 ? cost / qty : 0;
    const nuevo: InvItem = {
      id: Date.now(),
      name: form.name.trim() || "Artículo",
      category: form.category,
      qty,
      unit,
      status: deriveStatus(qty),
    };
    setItems([nuevo, ...items]);
    const remaining = balance - cost;
    setBalance(remaining);
    setShowAdd(false);
    setFeedback(`Se registró «${nuevo.name}» por ${money(cost)} ${form.currency}. Saldo disponible restante: $ ${money(remaining)} USD.`);
  };

  const openEdit = (it: InvItem) => {
    setEditForm({ name: it.name, category: it.category, qty: String(it.qty), unit: String(it.unit), status: it.status });
    setEditItem(it);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;
    const qty = Number(editForm.qty) || 0;
    const unit = Number(editForm.unit) || 0;
    const name = editForm.name.trim() || editItem.name;
    setItems((prev) => prev.map((x) => (x.id === editItem.id ? { ...x, name, category: editForm.category, qty, unit, status: editForm.status } : x)));
    setEditItem(null);
    setFeedback(`Se actualizaron los datos de «${name}».`);
  };

  const openDiscount = (it: InvItem) => {
    setDiscountForm({ qty: "", note: "" });
    setDiscountItem(it);
  };

  const handleDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discountItem) return;
    const dq = Number(discountForm.qty) || 0;
    if (dq <= 0) return;
    const applied = Math.min(dq, discountItem.qty);
    const newQty = discountItem.qty - applied;
    const note = discountForm.note.trim() || "Sin observación";
    setItems((prev) => prev.map((x) => (x.id === discountItem.id ? { ...x, qty: newQty, status: deriveStatus(newQty) } : x)));
    setMovements((prev) => [{ id: Date.now(), itemId: discountItem.id, item: discountItem.name, qty: applied, note, date: "3 jul 2026" }, ...prev]);
    setDiscountItem(null);
    setFeedback(`Se descontaron ${applied} unidad${applied === 1 ? "" : "es"} de «${discountItem.name}». Observación: ${note}`);
  };

  const openEditMov = (m: Movement) => {
    setMovForm({ qty: String(m.qty), note: m.note });
    setEditMov(m);
  };

  const handleEditMov = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editMov) return;
    const newQty = Number(movForm.qty) || 0;
    if (newQty <= 0) return;
    const note = movForm.note.trim() || "Sin observación";
    const delta = newQty - editMov.qty;
    setItems((prev) => prev.map((x) => (x.id === editMov.itemId ? { ...x, qty: Math.max(0, x.qty - delta), status: deriveStatus(Math.max(0, x.qty - delta)) } : x)));
    setMovements((prev) => prev.map((m) => (m.id === editMov.id ? { ...m, qty: newQty, note } : m)));
    setEditMov(null);
    setFeedback(`Se actualizó el movimiento de «${editMov.item}».`);
  };

  const handleDeleteMov = (m: Movement) => {
    setItems((prev) => prev.map((x) => (x.id === m.itemId ? { ...x, qty: x.qty + m.qty, status: deriveStatus(x.qty + m.qty) } : x)));
    setMovements((prev) => prev.filter((mm) => mm.id !== m.id));
    setFeedback(`Se eliminó el movimiento de «${m.item}» y se devolvieron ${m.qty.toLocaleString("es-ES")} unidad${m.qty === 1 ? "" : "es"} al inventario.`);
  };

  return {
    items, movements, balance, feedback, setFeedback,
    showAdd, setShowAdd, form, setForm,
    editItem, setEditItem, editForm, setEditForm,
    discountItem, setDiscountItem, discountForm, setDiscountForm,
    editMov, setEditMov, movForm, setMovForm,
    confirmDelMov, setConfirmDelMov,
    query, setQuery, catFilter, setCatFilter, statusFilter, setStatusFilter, page, setPage,
    totalValue, discountedThisMonth,
    filtered, totalPages, currentPage, paged,
    openAdd, handleAdd,
    openEdit, handleEdit,
    openDiscount, handleDiscount,
    openEditMov, handleEditMov, handleDeleteMov,
    CATEGORIES, INV_STATUS, money, COLS, HEADERS, field,
    fetchedBalance,
  };
}
