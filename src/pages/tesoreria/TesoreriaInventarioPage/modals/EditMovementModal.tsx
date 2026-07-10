import { Pencil, Trash2, X } from "lucide-react";
import type { Movement } from "@shared/services/actions/tesoreria";

type MovForm = { qty: string; note: string };

type Props = {
  movement: Movement;
  movForm: MovForm;
  setMovForm: (f: MovForm) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  onRequestDelete: () => void;
  field: string;
};

export function EditMovementModal({ movement, movForm, setMovForm, onSubmit, onClose, onRequestDelete, field }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-edu-surface rounded-edu-card w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-edu-control bg-edu-warning-bg flex items-center justify-center">
              <Pencil className="w-4 h-4 text-edu-warning" />
            </div>
            <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Editar movimiento</h3>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-5 flex flex-col gap-4">
          <div className="px-4 py-3 rounded-edu-control bg-edu-subtle">
            <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em]">Artículo</div>
            <div className="text-[0.875rem] text-edu-ink font-semibold">{movement.item}</div>
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
            <button
              type="button"
              onClick={onRequestDelete}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-edu-control border-[1.5px] border-edu-danger-bg bg-edu-danger-bg text-edu-danger text-sm font-semibold cursor-pointer transition-colors hover:brightness-95"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </button>
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle">
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
  );
}
