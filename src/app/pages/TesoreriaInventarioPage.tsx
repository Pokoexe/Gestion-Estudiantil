import { useState } from "react";
import {
  PackagePlus,
  Package,
  Wallet,
  X,
  ArrowDownRight,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { color } from "../theme/tokens";
import { Pagination } from "../components/Pagination";
import { ConfirmDialog } from "../components/ConfirmDialog";

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */

type Currency = "USD" | "Bs." | "COP";
type ItemStatus = "ok" | "low" | "out";

interface InvItem {
  id: number;
  name: string;
  category: string;
  qty: number;
  unit: number; // valor unitario en USD
  status: ItemStatus;
}

interface Movement {
  id: number;
  itemId: number;
  item: string;
  qty: number;
  note: string;
  date: string;
}

/* ------------------------------------------------------------------ */
/* Datos ficticios                                                     */
/* ------------------------------------------------------------------ */

const INITIAL: InvItem[] = [
  { id: 1, name: "Sillas de aula", category: "Mobiliario", qty: 340, unit: 12, status: "ok" },
  { id: 2, name: "Mesas de trabajo", category: "Mobiliario", qty: 172, unit: 28, status: "ok" },
  { id: 3, name: "Computadoras de escritorio", category: "Tecnología", qty: 24, unit: 320, status: "low" },
  { id: 4, name: "Tabletas educativas", category: "Tecnología", qty: 6, unit: 150, status: "low" },
  { id: 5, name: "Escobas y coletos", category: "Limpieza", qty: 3, unit: 4, status: "out" },
  { id: 6, name: "Líquidos de limpieza", category: "Limpieza", qty: 42, unit: 3, status: "ok" },
  { id: 7, name: "Pizarras acrílicas", category: "Aula", qty: 28, unit: 22, status: "ok" },
  { id: 8, name: "Resmas de papel bond", category: "Insumos", qty: 90, unit: 5, status: "ok" },
  { id: 9, name: "Globos decorativos", category: "Insumos", qty: 200, unit: 0.3, status: "ok" },
];

const INITIAL_MOVEMENTS: Movement[] = [
  { id: 1, itemId: 6, item: "Líquidos de limpieza", qty: 4, note: "Limpieza general de aulas tras la jornada.", date: "1 jul 2026" },
  { id: 2, itemId: 8, item: "Resmas de papel bond", qty: 3, note: "Impresión de boletines del 3.º lapso.", date: "30 jun 2026" },
];

const CATEGORIES = ["Mobiliario", "Tecnología", "Limpieza", "Aula", "Insumos"];

const INV_STATUS: Record<ItemStatus, { label: string; bg: string; fg: string }> = {
  ok: { label: "Suficiente", bg: color.successBg, fg: color.success },
  low: { label: "Bajo", bg: color.warningBg, fg: color.warning },
  out: { label: "Agotado", bg: color.dangerBg, fg: color.danger },
};

function deriveStatus(qty: number): ItemStatus {
  if (qty <= 0) return "out";
  if (qty < 10) return "low";
  return "ok";
}

const money = (n: number) => n.toLocaleString("es-ES", { maximumFractionDigits: 2 });

const COLS = "grid-cols-[1.5fr_0.9fr_0.6fr_0.8fr_0.8fr_0.8fr_1fr]";
const HEADERS = ["Artículo", "Categoría", "Cantidad", "Valor unit.", "Valor total", "Estado", "Acciones"];

const INITIAL_BALANCE = 8450; // saldo disponible en USD
const PER_PAGE = 6;

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function TesoreriaInventarioPage() {
  const [items, setItems] = useState<InvItem[]>(INITIAL);
  const [movements, setMovements] = useState<Movement[]>(INITIAL_MOVEMENTS);
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Alta de inventario
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", category: CATEGORIES[0], qty: "", cost: "", currency: "USD" as Currency });

  // Modificar inventario
  const [editItem, setEditItem] = useState<InvItem | null>(null);
  const [editForm, setEditForm] = useState({ name: "", category: CATEGORIES[0], qty: "", unit: "", status: "ok" as ItemStatus });

  // Descontar inventario
  const [discountItem, setDiscountItem] = useState<InvItem | null>(null);
  const [discountForm, setDiscountForm] = useState({ qty: "", note: "" });

  // Editar / eliminar movimiento del registro
  const [editMov, setEditMov] = useState<Movement | null>(null);
  const [movForm, setMovForm] = useState({ qty: "", note: "" });
  const [confirmDelMov, setConfirmDelMov] = useState<Movement | null>(null);

  // Buscador, filtros y paginación
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState("todas");
  const [statusFilter, setStatusFilter] = useState<"todos" | ItemStatus>("todos");
  const [page, setPage] = useState(1);

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

  /* ---- Alta ---- */
  const openAdd = () => {
    setForm({ name: "", category: CATEGORIES[0], qty: "", cost: "", currency: "USD" });
    setShowAdd(true);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(form.qty) || 0;
    const cost = Number(form.cost) || 0; // costo total en USD equivalente
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

  /* ---- Modificar ---- */
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

  /* ---- Descontar ---- */
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

  /* ---- Editar / eliminar movimiento ---- */
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
    const delta = newQty - editMov.qty; // >0 se descuenta más, <0 se devuelve al stock
    setItems((prev) => prev.map((x) => (x.id === editMov.itemId ? { ...x, qty: Math.max(0, x.qty - delta), status: deriveStatus(Math.max(0, x.qty - delta)) } : x)));
    setMovements((prev) => prev.map((m) => (m.id === editMov.id ? { ...m, qty: newQty, note } : m)));
    setEditMov(null);
    setFeedback(`Se actualizó el movimiento de «${editMov.item}».`);
  };

  const handleDeleteMov = (m: Movement) => {
    // Al eliminar el movimiento, las unidades vuelven al inventario (se revierte el descuento).
    setItems((prev) => prev.map((x) => (x.id === m.itemId ? { ...x, qty: x.qty + m.qty, status: deriveStatus(x.qty + m.qty) } : x)));
    setMovements((prev) => prev.filter((mm) => mm.id !== m.id));
    setFeedback(`Se eliminó el movimiento de «${m.item}» y se devolvieron ${m.qty.toLocaleString("es-ES")} unidad${m.qty === 1 ? "" : "es"} al inventario.`);
  };

  /* ---- Estilos de campos de formulario ---- */
  const field = "border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-success";

  return (
    <div className="flex flex-col gap-5">
      {/* Aviso */}
      {feedback && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-edu-control text-sm font-medium bg-edu-primary-50 text-edu-primary">
          <ArrowDownRight className="w-4 h-4 shrink-0" />
          <span className="flex-1">{feedback}</span>
          <button onClick={() => setFeedback(null)} aria-label="Cerrar" className="bg-transparent border-none cursor-pointer p-0 flex items-center opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">Valor total del inventario</p>
              <p className="text-edu-ink text-[1.6rem] font-bold mt-1 m-0">$ {money(totalValue)}</p>
            </div>
            <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: color.successBg }}>
              <Package style={{ width: "20px", height: "20px", color: color.success }} />
            </div>
          </div>
          <p className="text-edu-ink-400 text-xs m-0">{items.length} artículos registrados · USD equivalente</p>
        </div>

        <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">Saldo disponible</p>
              <p className={`text-[1.6rem] font-bold mt-1 m-0 ${balance < INITIAL_BALANCE ? "text-edu-warning" : "text-edu-ink"}`}>$ {money(balance)}</p>
            </div>
            <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: color.primary50 }}>
              <Wallet style={{ width: "20px", height: "20px", color: color.primary }} />
            </div>
          </div>
          <p className="text-edu-ink-400 text-xs m-0">Caja en USD · cada compra lo descuenta</p>
        </div>

        <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">Descontados este mes</p>
              <p className="text-edu-ink text-[1.6rem] font-bold mt-1 m-0">{discountedThisMonth.toLocaleString("es-ES")}</p>
            </div>
            <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: color.warningBg }}>
              <ArrowDownRight style={{ width: "20px", height: "20px", color: color.warning }} />
            </div>
          </div>
          <p className="text-edu-ink-400 text-xs m-0">Unidades retiradas en julio 2026</p>
        </div>
      </div>

      {/* Inventario + registro de descuentos, lado a lado */}
      <div className="grid grid-cols-3 gap-5 items-start">
        {/* Tabla de inventario (col-span-2) */}
        <div className="col-span-2 bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
            <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Inventario de la institución</h3>
            <span className="text-[0.8rem] text-edu-ink-400 font-medium">{filtered.length} artículo{filtered.length === 1 ? "" : "s"}</span>
          </div>

          {/* Buscador y filtros */}
          <div className="px-5 py-3 flex gap-2 items-center flex-wrap border-b border-edu-border-soft">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Buscar artículo o categoría…"
                className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
              />
            </div>
            <select
              value={catFilter}
              onChange={(e) => { setCatFilter(e.target.value); setPage(1); }}
              className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
            >
              <option value="todas">Todas las categorías</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as "todos" | ItemStatus); setPage(1); }}
              className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
            >
              <option value="todos">Todos los estados</option>
              <option value="ok">Suficiente</option>
              <option value="low">Bajo</option>
              <option value="out">Agotado</option>
            </select>
          </div>

          <div className={`grid ${COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
            {HEADERS.map((h) => (
              <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
            ))}
          </div>

          {paged.length === 0 && (
            <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">No hay artículos que coincidan con el filtro.</div>
          )}

          {paged.map((it, i) => {
            const st = INV_STATUS[it.status];
            return (
              <div key={it.id} className={`grid ${COLS} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
                <span className="text-sm text-edu-ink font-medium">{it.name}</span>
                <span className="text-[0.8125rem] text-edu-ink-700">{it.category}</span>
                <span className="text-sm text-edu-ink-700 font-semibold">{it.qty.toLocaleString("es-ES")}</span>
                <span className="text-[0.8125rem] text-edu-ink-500">$ {money(it.unit)}</span>
                <span className="text-sm text-edu-ink font-bold">$ {money(it.qty * it.unit)}</span>
                <span className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit" style={{ backgroundColor: st.bg, color: st.fg }}>
                  {st.label}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEdit(it)}
                    aria-label="Modificar"
                    title="Modificar"
                    className="w-8 h-8 rounded-edu-chip border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-500 flex items-center justify-center cursor-pointer transition-colors hover:border-edu-primary-200 hover:text-edu-primary"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => openDiscount(it)}
                    disabled={it.qty <= 0}
                    aria-label="Descontar"
                    title="Descontar"
                    className="w-8 h-8 rounded-edu-chip border-none bg-edu-warning-bg text-edu-warning flex items-center justify-center cursor-pointer transition-colors hover:brightness-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {totalPages > 1 && (
            <div className="px-5 py-4 border-t border-edu-border-soft">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </div>



        <div className="col-span-1 space-y-4">

          {/* Acción */}
          <div className="flex gap-3 w-full flex-wrap">
            <button
              onClick={openAdd}
              className="w-full inline-flex justify-center items-center gap-[9px] px-5 py-[11px] rounded-edu-control text-sm font-semibold cursor-pointer transition-colors border-none bg-edu-success text-white hover:brightness-95"
            >
              <PackagePlus style={{ width: "16px", height: "16px" }} />
              Agregar inventario
            </button>
          </div>
          {/* Registro de descuentos (col-span-1) */}
          <div className=" bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
              <div>
                <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Registro de descuentos</h3>
                <p className="mt-0.5 text-edu-ink-400 text-[0.78rem]">Constancia de cada salida de inventario y su observación</p>
              </div>
              <span className="text-[0.8rem] text-edu-ink-400 font-medium">{movements.length} movimiento{movements.length === 1 ? "" : "s"}</span>
            </div>
            {movements.length === 0 ? (
              <div className="px-5 py-8 text-center text-edu-ink-400 text-sm">Aún no se han registrado descuentos.</div>
            ) : (
              movements.map((m, i) => (
                <div
                  key={m.id}
                  onClick={() => openEditMov(m)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openEditMov(m)}
                  className={`px-5 py-3 flex items-start gap-3 cursor-pointer transition-colors hover:bg-edu-subtle focus:outline-none focus-visible:bg-edu-subtle ${i < movements.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                >
                  <div className="w-8 h-8 rounded-edu-control bg-edu-warning-bg flex items-center justify-center shrink-0">
                    <ArrowDownRight className="w-4 h-4 text-edu-warning" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[0.875rem] text-edu-ink font-medium">−{m.qty.toLocaleString("es-ES")} · {m.item}</div>
                    <div className="text-[0.8rem] text-edu-ink-500 break-words">{m.note}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[0.72rem] text-edu-ink-400">{m.date}</span>
                    <Pencil className="w-3.5 h-3.5 text-edu-ink-300" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal: agregar inventario */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-edu-surface rounded-edu-card w-full max-w-md shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-edu-control bg-edu-success-bg flex items-center justify-center">
                  <PackagePlus className="w-4 h-4 text-edu-success" />
                </div>
                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Agregar inventario</h3>
              </div>
              <button onClick={() => setShowAdd(false)} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-edu-ink-700 text-sm font-medium">Artículo</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej. Ventiladores de pared" className={field} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-edu-ink-700 text-sm font-medium">Categoría</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={`${field} cursor-pointer`}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-edu-ink-700 text-sm font-medium">Cantidad</label>
                  <input type="number" required min="0" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} placeholder="0" className={field} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-edu-ink-700 text-sm font-medium">Costo total</label>
                  <input type="number" required min="0" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} placeholder="0" className={field} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-edu-ink-700 text-sm font-medium">Moneda</label>
                  <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value as Currency })} className={`${field} cursor-pointer`}>
                    {(["USD", "Bs.", "COP"] as Currency[]).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-3 rounded-edu-control bg-edu-warning-bg text-edu-warning text-[0.8125rem]">
                <ArrowDownRight className="w-4 h-4 shrink-0" />
                <span>El costo se descontará del saldo disponible al guardar.</span>
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle">
                  Cancelar
                </button>
                <button type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control bg-edu-success text-white text-sm font-semibold border-none cursor-pointer transition-colors hover:brightness-95">
                  <PackagePlus className="w-4 h-4" />
                  Guardar y descontar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: modificar inventario */}
      {editItem && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setEditItem(null)}>
          <div className="bg-edu-surface rounded-edu-card w-full max-w-md shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-edu-control bg-edu-primary-50 flex items-center justify-center">
                  <Pencil className="w-4 h-4 text-edu-primary" />
                </div>
                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Modificar artículo</h3>
              </div>
              <button onClick={() => setEditItem(null)} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleEdit} className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-edu-ink-700 text-sm font-medium">Artículo</label>
                <input type="text" required value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className={field} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-edu-ink-700 text-sm font-medium">Categoría</label>
                <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className={`${field} cursor-pointer`}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-edu-ink-700 text-sm font-medium">Cantidad</label>
                  <input type="number" required min="0" value={editForm.qty} onChange={(e) => setEditForm({ ...editForm, qty: e.target.value })} className={field} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-edu-ink-700 text-sm font-medium">Valor unit. (USD)</label>
                  <input type="number" required min="0" step="0.01" value={editForm.unit} onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })} className={field} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-edu-ink-700 text-sm font-medium">Estado</label>
                  <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value as ItemStatus })} className={`${field} cursor-pointer`}>
                    {(Object.keys(INV_STATUS) as ItemStatus[]).map((s) => (
                      <option key={s} value={s}>{INV_STATUS[s].label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <button type="button" onClick={() => setEditItem(null)} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle">
                  Cancelar
                </button>
                <button type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control bg-edu-primary text-white text-sm font-semibold border-none cursor-pointer transition-colors hover:bg-edu-primary-hover">
                  <Pencil className="w-4 h-4" />
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: descontar inventario */}
      {discountItem && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setDiscountItem(null)}>
          <div className="bg-edu-surface rounded-edu-card w-full max-w-md shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-edu-control bg-edu-warning-bg flex items-center justify-center">
                  <ArrowDownRight className="w-4 h-4 text-edu-warning" />
                </div>
                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Descontar del inventario</h3>
              </div>
              <button onClick={() => setDiscountItem(null)} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleDiscount} className="p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between px-4 py-3 rounded-edu-control bg-edu-subtle">
                <div>
                  <div className="text-[0.875rem] text-edu-ink font-semibold">{discountItem.name}</div>
                  <div className="text-[0.72rem] text-edu-ink-400">{discountItem.category}</div>
                </div>
                <div className="text-right">
                  <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em]">En stock</div>
                  <div className="text-[1.1rem] text-edu-ink font-bold">{discountItem.qty.toLocaleString("es-ES")}</div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-edu-ink-700 text-sm font-medium">Cantidad a descontar</label>
                <input
                  type="number"
                  required
                  min="1"
                  max={discountItem.qty}
                  value={discountForm.qty}
                  onChange={(e) => setDiscountForm({ ...discountForm, qty: e.target.value })}
                  placeholder="Ej. 5"
                  className={field}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-edu-ink-700 text-sm font-medium">Observación</label>
                <textarea
                  required
                  rows={3}
                  value={discountForm.note}
                  onChange={(e) => setDiscountForm({ ...discountForm, note: e.target.value })}
                  placeholder="Ej. Se usaron 5 globos para el acto cultural del viernes."
                  className={`${field} resize-none`}
                />
                <span className="text-[0.72rem] text-edu-ink-400">Queda registrado como constancia del uso.</span>
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <button type="button" onClick={() => setDiscountItem(null)} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle">
                  Cancelar
                </button>
                <button type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold border-none cursor-pointer transition-colors hover:brightness-95" style={{ backgroundColor: color.warning }}>
                  <ArrowDownRight className="w-4 h-4" />
                  Descontar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: editar / eliminar movimiento */}
      {editMov && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setEditMov(null)}>
          <div className="bg-edu-surface rounded-edu-card w-full max-w-md shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-edu-control bg-edu-warning-bg flex items-center justify-center">
                  <Pencil className="w-4 h-4 text-edu-warning" />
                </div>
                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Editar movimiento</h3>
              </div>
              <button onClick={() => setEditMov(null)} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleEditMov} className="p-5 flex flex-col gap-4">
              <div className="px-4 py-3 rounded-edu-control bg-edu-subtle">
                <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em]">Artículo</div>
                <div className="text-[0.875rem] text-edu-ink font-semibold">{editMov.item}</div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-edu-ink-700 text-sm font-medium">Cantidad descontada</label>
                <input type="number" required min="1" value={movForm.qty} onChange={(e) => setMovForm({ ...movForm, qty: e.target.value })} className={field} />
                <span className="text-[0.72rem] text-edu-ink-400">Al cambiarla, se ajusta el stock del artículo.</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-edu-ink-700 text-sm font-medium">Observación</label>
                <textarea required rows={3} value={movForm.note} onChange={(e) => setMovForm({ ...movForm, note: e.target.value })} className={`${field} resize-none`} />
              </div>
              <div className="flex items-center justify-between gap-2 pt-1">
                <button type="button" onClick={() => setConfirmDelMov(editMov)} className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-edu-control border-[1.5px] border-edu-danger-bg bg-edu-danger-bg text-edu-danger text-sm font-semibold cursor-pointer transition-colors hover:brightness-95">
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setEditMov(null)} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle">
                    Cancelar
                  </button>
                  <button type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control bg-edu-primary text-white text-sm font-semibold border-none cursor-pointer transition-colors hover:bg-edu-primary-hover">
                    <Pencil className="w-4 h-4" />
                    Guardar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmación de eliminar movimiento */}
      {confirmDelMov && (
        <ConfirmDialog
          title="Eliminar movimiento"
          message={<>Se eliminará el descuento de <span className="font-semibold text-edu-ink">{confirmDelMov.qty} · {confirmDelMov.item}</span> y esas unidades volverán al inventario. ¿Está seguro que desea continuar?</>}
          confirmLabel="Sí, eliminar"
          icon={Trash2}
          tone="danger"
          onConfirm={() => { handleDeleteMov(confirmDelMov); setConfirmDelMov(null); setEditMov(null); }}
          onCancel={() => setConfirmDelMov(null)}
        />
      )}
    </div>
  );
}
