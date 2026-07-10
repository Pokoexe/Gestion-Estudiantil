import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@shared/ui/ConfirmDialog";
import { useTesoreriaInventario, money } from "./functions/useTesoreriaInventario";
import { FeedbackBanner } from "./ui/FeedbackBanner";
import { InventoryKpis } from "./ui/InventoryKpis";
import { InventoryTable } from "./ui/InventoryTable";
import { AddInventoryAction } from "./ui/AddInventoryAction";
import { MovementsLog } from "./ui/MovementsLog";
import { AddInventoryModal } from "./modals/AddInventoryModal";
import { EditItemModal } from "./modals/EditItemModal";
import { DiscountItemModal } from "./modals/DiscountItemModal";
import { EditMovementModal } from "./modals/EditMovementModal";

export { money };

export function TesoreriaInventarioPage() {
  const {
    items, movements, balance, feedback, setFeedback,
    showAdd, setShowAdd, form, setForm,
    editItem, setEditItem, editForm, setEditForm,
    discountItem, setDiscountItem, discountForm, setDiscountForm,
    editMov, setEditMov, movForm, setMovForm,
    confirmDelMov, setConfirmDelMov,
    query, setQuery, catFilter, setCatFilter, statusFilter, setStatusFilter, setPage,
    totalValue, discountedThisMonth,
    filtered, totalPages, currentPage, paged,
    openAdd, handleAdd,
    openEdit, handleEdit,
    openDiscount, handleDiscount,
    openEditMov, handleEditMov, handleDeleteMov,
    CATEGORIES, INV_STATUS, COLS, HEADERS, field,
    fetchedBalance,
  } = useTesoreriaInventario();

  return (
    <div className="flex flex-col gap-5">
      {feedback && <FeedbackBanner feedback={feedback} onClose={() => setFeedback(null)} />}

      <InventoryKpis
        totalValue={totalValue}
        itemsCount={items.length}
        balance={balance}
        fetchedBalance={fetchedBalance}
        discountedThisMonth={discountedThisMonth}
        money={money}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        <InventoryTable
          query={query} setQuery={setQuery}
          catFilter={catFilter} setCatFilter={setCatFilter}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          setPage={setPage}
          filtered={filtered} paged={paged}
          currentPage={currentPage} totalPages={totalPages}
          categories={CATEGORIES} invStatus={INV_STATUS}
          onEdit={openEdit} onDiscount={openDiscount}
          money={money} cols={COLS} headers={HEADERS}
        />

        <div className="lg:col-span-1 space-y-4">
          <AddInventoryAction onClick={openAdd} />
          <MovementsLog movements={movements} onEdit={openEditMov} />
        </div>
      </div>

      {showAdd && (
        <AddInventoryModal
          form={form} setForm={setForm}
          categories={CATEGORIES}
          onSubmit={handleAdd}
          onClose={() => setShowAdd(false)}
          field={field}
        />
      )}

      {editItem && (
        <EditItemModal
          editForm={editForm} setEditForm={setEditForm}
          categories={CATEGORIES} invStatus={INV_STATUS}
          onSubmit={handleEdit}
          onClose={() => setEditItem(null)}
          field={field}
        />
      )}

      {discountItem && (
        <DiscountItemModal
          item={discountItem}
          discountForm={discountForm} setDiscountForm={setDiscountForm}
          onSubmit={handleDiscount}
          onClose={() => setDiscountItem(null)}
          field={field}
        />
      )}

      {editMov && (
        <EditMovementModal
          movement={editMov}
          movForm={movForm} setMovForm={setMovForm}
          onSubmit={handleEditMov}
          onClose={() => setEditMov(null)}
          onRequestDelete={() => setConfirmDelMov(editMov)}
          field={field}
        />
      )}

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
