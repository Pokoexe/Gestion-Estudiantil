import { Pencil, X } from "lucide-react";
import type { ItemStatus } from "@shared/services/actions/tesoreria";

type EditForm = { name: string; category: string; qty: string; unit: string; status: ItemStatus };

type Props = {
  editForm: EditForm;
  setEditForm: (f: EditForm) => void;
  categories: string[];
  invStatus: Record<ItemStatus, { label: string; bg: string; fg: string }>;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  field: string;
};

export function EditItemModal({ editForm, setEditForm, categories, invStatus, onSubmit, onClose, field }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-edu-surface rounded-edu-card w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-edu-control bg-edu-primary-50 flex items-center justify-center">
              <Pencil className="w-4 h-4 text-edu-primary" />
            </div>
            <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Modificar artículo</h3>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-edu-ink-700 text-sm font-medium">Artículo</label>
            <input type="text" required value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className={field} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-edu-ink-700 text-sm font-medium">Categoría</label>
            <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className={`${field} cursor-pointer`}>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                {(Object.keys(invStatus) as ItemStatus[]).map((s) => (
                  <option key={s} value={s}>{invStatus[s].label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle">
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
  );
}
